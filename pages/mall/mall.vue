<template>
  <view class="mall">
    <view :class="{ 'mall-done': !loading }">
      <!-- #ifdef H5 -->
      <web-view :src="webViewUrl" v-if="webViewUrl"></web-view>
      <!-- #endif -->
      <view class="loading" v-if="loading">正在跳转至商城...</view>
    </view>
  </view>
</template>

<script>
import { getHcCode } from "@/api/webView/webViewApi.js";
import { hasLogin } from "@/api/user/sessionApi.js";
import { getCommunityId } from "@/api/community/communityApi.js";
import { getUserId } from "@/api/user/userApi";
import bocPayMixin from "@/common/mixin/bocPayMixin.js";
// #ifdef APP
const bocPayPlugin = uni.requireNativePlugin("NL-BocPayUniPlugin");
// #endif
import config from "@/conf/config.js"

export default {
  mixins: [bocPayMixin],
  data() {
    return {
      codeExpireTime: new Date().getTime() + 5 * 60 * 1000,
      // 页面loading
      loading: true,
      // 创建的退出按钮
      outBtn: null,
      // 动态创建的webview对象
      webViewContext: null,
      // 系统配置参数
      systemInfo: {},
      // 苹果底部安全区域高度
      safeAreaInsetsBottom: 0,
      // webview url
      webViewUrl: "",
      // 小区ID
      communityId: "",
      // 用户ID
      userId: '',
      // 是否正在跳转支付
      isJumpPay: false,
    };
  },
  onShow() {
    
    // 未登录提示
    if (!hasLogin()) {
      uni.showToast({
        icon: "none",
        title: "未登录，请先登录",
      });
      return;
    }
    
    // 获取userId
    const userId = getUserId()
    // 获取小区ID
    const communityId = getCommunityId()
    // 获取设备信息
    this.systemInfo = uni.getSystemInfoSync();
    // 隐藏tabbar
    uni.hideTabBar();
    
    // #ifdef H5
    this.communityId = communityId
    this.getLoginCode();
    // #endif
    
    // #ifdef APP
    // 判断 未创建webview || code有效时常超过5分钟 || 重新进入的用户ID不一致 || 小区ID不一致 则重新获取code
    if (!this.webViewContext || new Date().getTime() >= this.codeExpireTime || this.userId !== userId || communityId !== this.communityId) {
      // 重新赋值userId
      this.userId = userId
      // 重新赋值小区ID
      this.communityId = communityId
      // 重新获取code
      this.getLoginCode();
    } else {
      this.openWebView();
    }
    // #endif
  },
  onHide() {
    // #ifdef APP
    if (this.webViewContext) {
      const value = `webViewMsg(${JSON.stringify({
        fnName: "showApp",
        arg: false,
      })})`;
      // 隐藏窗口给(商场)发送消息
      this.webViewContext.evalJS(value);
    }
    // #endif
    uni.showTabBar();
  },
  // 监听返回键
  onBackPress() {
    if (this.webViewContext) {
      this.webViewContext.canBack((e) => {
        // 判断是否能返回
        if (e.canBack) {
          this.webViewContext.back();
        } else {
          // 不能返回则关闭 商城
          this.closeMall();
        }
      });
    }
    // 防止双击返回键退出app
    return true;
  },
  methods: {
    // 获取商城Code
    async getLoginCode() {
      try {
        this.loading = true;
        const { hcCode } = await getHcCode();
        this.webViewUrl = `${config.mallUrl}/#/?hcCode=${hcCode}&hcCommunityId=${this.communityId}`;
        this.codeExpireTime = new Date().getTime() + 5 * 60 * 1000;
        // #ifdef APP
        if (hcCode) {
          // 判断是否已经创建过webview
          if (this.webViewContext) {
            this.openWebView(hcCode);
          } else {
            // 创建并打开webview
            this.createWebView(hcCode);
          }
        }
        // #endif
      } catch (e) {
        uni.showToast({
          icon: "none",
        });
        console.log(e, "getHcCode");
      }
    },
    // 打开webview
    openWebView(hcCode) {
      // #ifdef APP
      let mallWebView = plus.webview.getWebviewById("mall-webview");
      // 判断有hcCode则重新加载url
      if (hcCode) {
        mallWebView.loadURL(`${config.mallUrl}/#/?hcCode=${hcCode}&hcCommunityId=${this.communityId}`);
      }
      // 打开weiview
      setTimeout(
        () => {
          plus.webview.show("mall-webview", "auto", 400, () => {
            this.loading = false;
            this.outBtn.show();
            const value = `webViewMsg(${JSON.stringify({
              fnName: "showApp",
              arg: true,
            })})`;
            this.webViewContext.evalJS(value);
          });
        },
        hcCode ? 100 : 0
      );
      // #endif
    },
    // 创建并打开webview
    createWebView(hcCode) {
      // #ifdef APP-PLUS
      // 创建关闭按钮
      this.createBtn();
      const { statusBarHeight, screenHeight, safeAreaInsets } = uni.getSystemInfoSync();
      this.safeAreaInsetsBottom = safeAreaInsets.bottom;
      // 动态创建webview
      plus.webview.open(
        `${config.mallUrl}/#/?hcCode=${hcCode}&hcCommunityId=${this.communityId}`,
        "mall-webview",
        {
          "uni-app": "none",
          // webview距离顶部高度
          top: statusBarHeight,
          // webview高度
          height: screenHeight - statusBarHeight - safeAreaInsets.bottom,
        },
        "slide-in-bottom",
        400,
        () => {
          this.loading = false;
        }
      );

      this.webViewContext = plus.webview.getWebviewById("mall-webview");

      // app端 - 监听(商城)H5端发送来的消息
      plus.globalEvent.addEventListener("plusMessage", (e) => {
        if (e.data?.args?.data?.arg) {
          this.getMessage(e.data?.args?.data?.arg);
        }
      });
      // #endif

      // #ifdef H5
      // H5端 - 监听(商城)H5端发送来的消息(h5端的webview底层采用的是iframe形式)
      window.addEventListener("message", (event) => {
        if (event.data?.data?.arg) {
          this.getMessage(event.data?.data?.arg);
        }
      });
      // #endif
    },
    // 接收商城的消息(H5)
    getMessage(e) {
      const { type, arg } = e
      if (type === "pay") {
        // #ifdef APP
        this.bocPayMixin(arg, (res) => {
          const value = `webViewMsg(${JSON.stringify({
            fnName: "payResult",
            arg: res,
          })})`;
          this.webViewContext.evalJS(value);
        });
        // #endif
      } else if (type === "close") {
        // #ifdef APP
        plus.webview.hide("mall-webview", "auto", 400, "auto");
        // #endif
        uni.switchTab({
          url: "/pages/index/index",
        });
      } else if (type === "openImmersive") {
        this.openImmersive();
      } else if (type === "closeImmersive") {
        this.closeImmersive();
      } else if (type === "getSystemInfo") {
        this.getSystemInfo();
      }
    },
    getSystemInfo() {
      // #ifdef APP
      const systemData = uni.getSystemInfoSync();
      const value = `webViewMsg(${JSON.stringify({
        fnName: "getSystemInfo",
        arg: JSON.stringify(systemData),
      })})`;
      // 隐藏窗口给(商场)发送消息
      this.webViewContext.evalJS(value);
      // #endif
    },
    // 开启沉浸式
    openImmersive() {
      // #ifdef APP
      const { screenHeight } = this.systemInfo;
      this.webViewContext.setStyle({
        top: 0,
        height: screenHeight,
      });
      // #endif
    },
    // 关闭沉浸式
    closeImmersive() {
      // #ifdef APP
      const { statusBarHeight, screenHeight } = this.systemInfo;
      this.webViewContext.setStyle({
        // webview距离顶部高度
        top: statusBarHeight,
        // webview高度
        height: screenHeight - statusBarHeight - this.safeAreaInsetsBottom,
      });
      // #endif
    },
    // 创建退出按钮
    createBtn() {
      const { statusBarHeight, screenWidth } = uni.getSystemInfoSync();

      this.outBtn = new plus.nativeObj.View("robotView", {
        top: statusBarHeight + 8 + "px",
        left: screenWidth - 80 - 10 + "px",
        height: "28px",
        width: "80px",
      });

      this.outBtn.draw([
        {
          tag: "rect",
          rectStyles: {
            color: "#ffffff",
            radius: "34px",
            borderColor: "#a9a9a9",
            borderWidth: "1px",
          },
          position: {
            left: "0px",
            top: "0px",
            width: "80px",
            height: "28px",
          },
        },
        {
          tag: "font",
          text: "退出商城",
          textStyles: {
            color: "#000000",
            size: "15px",
          },
        },
      ]);

      this.outBtn.show();

      // 监听退出
      this.outBtn.addEventListener(
        "click",
        (e) => {
          this.closeMall();
        },
        false
      );
    },
    // 关闭商城
    closeMall() {
      // 隐藏webview
      plus.webview.hide("mall-webview", "auto", 400, "auto");
      this.outBtn.hide();
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.mall {
  min-height: 100vh;
  background-color: #fff;
}

.mall-done {
  height: 100vh;
  background: linear-gradient(to bottom, #c21da0 50%, #ffffff 50%);
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
