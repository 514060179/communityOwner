<template>
  <view class="my-system">
    <view class="cu-list menu margin-top-sm">
      <view class="cu-item arrow" @click="mySettings()">
        <view class="content">
          <image :src="`${imgUrl}/h5/images/serve/setting1.png`" />
          <text class="text-black">{{ $t('设置-LXV') }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <image :src="`${imgUrl}/h5/images/serve/setting1.png`" />
          <text class="text-black">{{ $t('切换语言-OBZ') }}</text>
        </view>
        <view>
          <switch color="#c21da0" :checked="isHantLang" @change="changeLang" />
        </view>
      </view>
      <view class="cu-item arrow" @click="_toAuthOwner()">
        <view class="content">
          <image :src="`${imgUrl}/h5/images/serve/setting2.png`" />
          <text class="text-black">{{ $t('房屋认证-3rd') }}</text>
        </view>
      </view>
      <view class="cu-item arrow" @tap="_logout()" v-if="login">
        <view class="content">
          <image :src="`${imgUrl}/h5/images/serve/setting1.png`" />
          <text class="text-black">{{ $t('退出登录-95P') }}</text>
        </view>
      </view>
    </view>

    <!-- 切换语言弹窗 -->
    <view class="cu-modal" :class="{ 'show': langModal }">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{ $t('切换语言-OBZ') }}</view>
        </view>
        <view class="padding-xl">
          {{ $t('切换语言需重启app才能生效-1WL') }}
          <view> {{ $t('从-Q9u') }}{{ lang === 'zh-Hans' ? $t('繁体-hTi') : $t('简体-7NJ') }} {{ $t('切换到-I5Z') }} {{ lang === 'zh-Hans' ? $t('简体-7NJ') :$t('繁体-hTi') }} </view>
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action margin-0 flex-sub text-green solid-left" @tap="outApp">{{ $t('确定-vdT') }}</view>
        </view>
      </view>
    </view>

    <!-- 退出登录弹窗 -->
    <view class="cu-modal" :class="logoutUser == true ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{ $t('退出系统-j2p') }}</view>
          <view class="action" @tap="_cancleLogout()">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl">
          {{ $t('您确认退出系统吗？-3LK') }}
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action margin-0 flex-sub solid-left" @tap="_cancleLogout()">{{ $t('取消-KvD') }}</view>
          <view class="action margin-0 flex-sub text-green solid-left" @tap="_doLogoutUser()">{{ $t('确定-vdT') }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import context from '@/lib/proprietor/proprietorContext.js'
  import { hasLogin } from '../../api/user/sessionApi.js'
  // #ifdef APP
  import jPush from '@/common/utils/jpush.js'
  // #endif
  // const factory = context.factory //获取app实例
  const constant = context.constant
  export default {
    name: 'MySystem',
    data() {
      return {
        logoutUser: false,
        login: true,
        // 是否是繁体
        isHantLang: false,
        // 语言
        lang: 'zh-Hant',
        // 切换语言弹窗
        langModal: false
      }
    },
    created() {
      this._judgeHasLogin()
      const appLanguage = uni.getStorageSync('lang')
      this.lang = appLanguage
      this.isHantLang = appLanguage === 'zh-Hant'
    },
    methods: {
      // 设置语言，退出app
      outApp() {
        uni.setLocale(this.lang)
        plus.runtime.quit()
      },
      // 切换语言
      changeLang(e) {
        const locale = e.target.value ? 'zh-Hant' : 'zh-Hans'
        this.lang = locale
        this.$i18n.locale = locale
        uni.setStorageSync('lang', locale)
        // 安卓要退出app才能生效
        if (uni.getSystemInfoSync().platform === 'android') {
          this.langModal = true
        } else {
          uni.setLocale(locale)
        }
      },
      _judgeHasLogin: function() {
        const _that = this //查询用户信息
        if (!_that.ckeckUserInfo()) {
          _that.login = false
          return
        }
        _that.login = true
      },
      ckeckUserInfo: function() {
        return context.checkLoginStatus()
      },
      // 设置
      mySettings: function() {
        if (!this.ckeckUserInfo()) {
          this.vc.navigateTo({
              url: '/pages/login/showlogin'
            },
            () => {
              this.refreshPageLoginInfo()
            }
          )
          return
        }
        this.vc.navigateTo({
          url: '/pages/settings/settings'
        })
      },
      //退出系统
      _logout: function() {
        this.logoutUser = true
      },
      _cancleLogout: function() {
        this.logoutUser = false
      },
      _doLogoutUser: function() {
        const _data = {
          token: wx.getStorageSync('token')
        }
        const that = this
        that.logoutUser = false
        uni.showLoading({
          title: that.$t('正在退出-Mdd')
        })
        context.request({
          url: constant.url.userLogout,
          header: context.getHeaders(),
          method: 'POST',
          data: _data,
          success: function(res) {
            if (res.statusCode != 200) {
              uni.showToast({
                icon: 'none',
                title: res.data
              })
              return
            }
            const wAppId = uni.getStorageSync(constant.mapping.W_APP_ID)
            // 清除所有缓存
            context.clearStorage()
            if (wAppId != null && wAppId != undefined && wAppId != '') {
              uni.setStorageSync(constant.mapping.W_APP_ID, wAppId)
            }

            // #ifdef APP
            jPush.deleteAlias({ sequence: 1 })
            // #endif
            uni.hideLoading()
            that.vc.navigateTo({
              url: '/pages/login/login'
            })
          },
          fail: function(error) {
            uni.hideLoading()
            // 调用服务端登录接口失败
            uni.showToast({
              title: this.$t('调用接口失败-L5P')
            })
            console.log(error)
          }
        })
      },
      _toAuthOwner: function() {
        if (!hasLogin()) {
          this.vc.navigateTo({
            url: '/pages/login/showlogin'
          })
          return
        }
        uni.navigateTo({
          url: '/pages/index/authOwnerLog'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .my-system {
    border-radius: 20rpx;
    box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.1);
  }
  
  ::v-deep uni-switch .wx-switch-input:not([class*="bg-"]),
  ::v-deep uni-switch .uni-switch-input:not([class*="bg-"]) {
    background-color: #c21da0 !important;
  }

  ::v-deep uni-switch::before {
    content: '简';
  }

  ::v-deep uni-switch::after {
    content: '繁';
    transform: scale(1, 1);
  }
</style>
