<script>
  //app.js
  import context from './lib/proprietor/proprietorContext.js'
  const loginFactory = context.factory.login;
  const userFactory = context.factory.user;
  import { reciveMessage } from './api/webView/webViewApi.js';
  import { requestNoAuth } from './lib/proprietor/proprietorRequest.js';
  import { getAppVersion } from '@/api/index/indexApi.js'
  import url from './constant/url.js'

  // #ifdef APP
  import jPush from '@/common/utils/jpush.js'
  import jResult from '@/common/utils/jResult.js'
  // #endif

  export default {
    onShow() {
      // #ifdef APP
      jPush.setBadge({ badge: 0 })
      // #endif
    },
    // 小程序启动生命周期
    async onLaunch() {
      // #ifdef APP-PLUS
      // 判断是不是第一次进app,并且是否同意了隐私政策
      // 隐私政策
      let agree = uni.getStorageSync('agree')
      if (agree) {
        // #ifdef APP-PLUS
        plus.navigator.closeSplashscreen() // 关闭启动页
        // #endif
      } else {
        uni.navigateTo({
          url: "/pages/privacy/privacy",
          success() {
            // #ifdef APP-PLUS
            plus.navigator.closeSplashscreen() // 关闭启动页，解决先跳转首页再显示隐私政策的问题
            // #endif
          }
        })
      }
      // #endif

      let that = this; // 检查登录状态
      //loginFactory.checkLoginStatus(); // 获取用户地理位置
      userFactory.getUserLocation();

      // #ifdef H5
      window.addEventListener("message", reciveMessage);
      // #endif

      uni.onTabBarMidButtonTap(() => {
        uni.navigateTo({
          url: "/pages/machine/openDoorByQrCode",
          animationType: 'slide-in-bottom'
        })
      })

      requestNoAuth({
        url: url.listSystemInfo,
        method: "GET",
        data: {
          page: 1,
          row: 1
        },
        success: function(res) {
          if (res.data.data && res.data.data.length > 0) {
            uni.setStorageSync('proprietorSystemConfig', res.data.data[0])
          }
          //reslove(res);
        },
        fail: function(e) {}

      });
      // #ifdef APP

      // 极光-init
      jPush.initJPushService()
      // 极光推送-打开debug
      jPush.openDebug(true)
      jPush.setBadge({ badge: 0 })
      // 极光推送-通知事件回调
      jPush.addNotificationListener(result => jResult.notificationResult(result))
      // 极光推送-标签别名事件回调
      jPush.addTagAliasListener(result => jResult.tagAliasResult(result))
      // #endif
      
      // #ifdef APP
      await getAppVersion()
      // #endif
      this.$isResolve()
    },
    // app全局数据
    globalData: {
      userInfo: null
    },
    methods: {}
  };
</script>
<style>
  @import "./app.css";

  /* #ifdef H5 */
  uni-page-head {
    /* display: none; */
  }

  /* #endif */
</style>