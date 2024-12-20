<template>
  <view class="page-container pages-tabbar">
    <view class="header-bg" :style="{ height: bgHeight }"></view>
    <view class="position-relative">
      <vc-tabbar :title="$t('my.my')" @clickTitle="clickTitle">
        <!-- <template slot="tabbar-right" v-if="isLogin">
          <view class="tabbar-right" @tap="goToMessage">
            <image src="@/static/images/icons/message-icon.png" />
          </view>
        </template> -->
      </vc-tabbar>
      <my-person ref="myPersonRef" />
      <my-menu />
      <my-system ref="mySystem" />
    </view>
  </view>
</template>

<script>
  /** index.js **/
  import context from '../../lib/proprietor/proprietorContext.js'
  import conf from '../../conf/config.js'
  // import { getHcCode } from '../../api/webView/webViewApi.js'
  // import { encodeUrl } from '../../lib/proprietor/utils/UrlUtil.js'
  // import { getCurCommunity } from '../../api/community/communityApi.js'
  // import { setStorageSync } from '../../lib/proprietor/utils/StorageUtil.js'
  // import mapping from '../../constant/MappingConstant.js'

  // import { hasLogin } from '../../lib/proprietor/page/Page.js'
  // import { hasOwner } from '../../api/owner/ownerApi.js'
  // import { queryOwnerAccount } from '../../api/user/userApi.js'

  import myPerson from '@/components/my/my-person.vue'
  import myMenu from '@/components/my/my-menu.vue'
  import mySystem from '@/components/my/my-system.vue'
  const factory = context.factory //获取app实例
  const constant = context.constant
  //获取app实例
  const app = getApp().globalData
  export default {
    data() {
      return {
        isLogin: false,
        // 用户信息
        property: {},
        timer: null,
        clickNum: 0
      }
    },
    components: {
      myPerson,
      myMenu,
      mySystem
    },
    props: {},
    onLoad: function(options) {
      this.vc.onLoad(options, () => {
        this.loadOwnerAccount()
      })
    },
    onShow: function() {
      this.isLogin = context.checkLoginStatus()
      const _that = this //查询用户信息
      if (this.$refs.myPersonRef) {
        this.$refs.myPersonRef.refreshPageLoginInfo()
      }
      if (this.$refs.mySystem) {
        this.$refs.mySystem._judgeHasLogin()
      }
    },
    computed: {
      //状态栏高度
      bgHeight() {
        const { screenWidth, statusBarHeight } = uni.getSystemInfoSync()
        let height = 0
        //#ifdef H5
        height = screenWidth * Number.parseInt(500) / 750
        //#endif
        // #ifdef APP
        height = (screenWidth * Number.parseInt(500) / 750) + statusBarHeight
        // #endif
        return height + 'px'
      }
    },
    methods: {
      // 点击标题切换环境  连续点击六次
      clickTitle() {
        // #ifdef APP-PLUS
        if (!conf.isSwitch) return
        
        clearTimeout(this.timer)

        this.clickNum = this.clickNum + 1

        this.timer = setTimeout(() => {
          this.clickNum = 0
          clearTimeout(this.timer)
        }, 500)

        if (this.clickNum >= 6) {
          this.clickNum = 0
          uni.showModal({
            title: '切换环境',
            content: `当前环境是 ${conf.isPro ? '生产' : '测试'}, 切换到的环境是 ${conf.isPro ? '测试' : '生产'} , 确定切换吗？`,
            success: (res) => {
              if (res.confirm) {
                uni.setStorageSync('evn', !conf.isPro)
                context.clearStorage()
                this.disagree()
              }
            }
          })
        }
        // #endif
      },
      disagree() {
        // #ifdef APP-PLUS
        let platform = uni.getSystemInfoSync().platform
        if (platform == 'ios') {
          plus.ios.import("UIApplication").sharedApplication().performSelector("exit")
        } else if (platform == 'android') {
          plus.runtime.quit();
        }
        // #endif
      },
      // 原onShow方法
      // 自动登录后 刷新页面登录信息
      onGotUserInfo: function(e) {
        console.log('nickname=' + JSON.stringify(e.detail.userInfo))
      },
      // 我的服务跳转
      to_serve(v) {
        this.vc.navigateTo({
          url: v.href
        })
      },
      goToMessage() {
        uni.navigateTo({
          url: '/pages/messageList/messageList'
        })
      }
    }
  }
</script>
<style lang="scss" scope>
  @import './my.css';

  .page-container {
    padding: 0rpx 40rpx 40rpx;

    ::v-deep .header-bg {
      height: 600rpx;
    }

    .tabbar-right {
      width: 48rpx;
      height: 48rpx;
      position: absolute;
      top: 50%;
      right: -10rpx;
      transform: translateY(-50%);
      display: flex;
      align-items: center;

      image {
        width: 48rpx;
        height: 48rpx;
      }
    }
  }
</style>