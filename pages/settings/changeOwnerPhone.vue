<template>
  <view>
    <form>
      <view class="cu-form-group margin-top">
        <view class="title">{{ $t('手机号-9dl') }}</view>
        <input :placeholder="$t('请输入手机号-Cdr')" type="number" v-model="phone" />
        <!-- #ifdef MP-WEIXIN -->
        <!-- <button  class="cu-btn bg-green" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">获取手机号</button> -->
        <!-- #endif -->
      </view>
    </form>

    <view class="padding flex flex-direction">
      <button class="cu-btn bg-green lg" @tap="_doChangePhoto()">{{ $t('提交-4TX') }}</button>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
const constant = context.constant
const factory = context.factory
export default {
  data() {
    return {
      phone: ''
    }
  },
  onLoad() {
    const _that = this
    uni.login({
      success: res => {
        console.log('login', res)
        _that.wxLogin(res.code)
      }
    })
  },
  methods: {
    wxLogin: function (_code) {
      const _that = this
      let _appId = ''
      // #ifdef MP-WEIXIN
      const accountInfo = uni.getAccountInfoSync()
      _appId = accountInfo.miniProgram.appId
      // #endif
      wx.request({
        url: constant.url.loginUrl,
        method: 'post',
        header: context.getHeaders(),
        data: {
          code: _code,
          // 用户非敏感信息
          signature: '',
          // 签名
          encryptedData: '',
          // 用户敏感信息
          iv: '', // 解密算法的向量
          appId: _appId,
          userInfo: {}
        },
        success: function (res) {
          const sessionKey = res.data.sessionKey
          _that.sessionKey = sessionKey
          _that.openId = res.data.openId
        },
        fail: function (error) {
          // 调用服务端登录接口失败
          const sessionKey = res.data.sessionKey
          _that.sessionKey = sessionKey
          _that.openId = res.data.openId
        }
      })
    },
    onGetPhoneNumber(e) {
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
        wx.showToast({
          title: this.$t('手机号码未授权，请授权后再使用-3Vo'),
          icon: 'none'
        })
        return
      }
      const _that = this
      wx.request({
        url: constant.url.getWxPhoto,
        method: 'post',
        header: context.getHeaders(),
        data: {
          iv: e.detail.iv,
          // 用户非敏感信息
          key: _that.sessionKey,
          // 签名
          decryptData: e.detail.encryptedData
        },
        success: function (res) {
          const _json = res.data
          console.log('日志', _json)
          if (_json.code == 0) {
            _that.phone = _json.data.phoneNumber
          }
        },
        fail: function (error) {}
      })
    },
    _doChangePhoto: function () {
      if (this.phone == '') {
        uni.showToast({
          icon: 'none',
          title: this.$t('手机号不能为空-lEt')
        })
        return
      }

      const userInfo = uni.getStorageSync(constant.mapping.OWNER_INFO)
      const _userInfo = {
        memberId: userInfo.memberId,
        link: this.phone,
        communityId: userInfo.communityId,
        userId: userInfo.userId
      }
      context.request({
        url: constant.url.changeOwnerPhone,
        header: context.getHeaders(),
        method: 'POST',
        data: _userInfo,
        success: function (res) {
          const _json = res.data
          if (_json.code != 0) {
            uni.showToast({
              icon: 'none',
              title: _json.msg
            })
            return
          }
          uni.navigateBack({
            delta: 1
          })
        },
        fail: function (error) {
          // 调用服务端登录接口失败
          uni.showToast({
            title: this.$t('调用接口失败-L5P')
          })
          console.log(error)
        }
      })
    }
  }
}
</script>

<style></style>
