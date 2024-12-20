<template>
  <view> </view>
</template>

<script>
// import { isNotNull } from '../../lib/proprietor/utils/StringUtil.js'
import { refreshUserOpenId, getWechatMiniOpenId, getCommunityWechatAppId, refreshAppUserBindingOwnerOpenId } from '../../api/user/userApi.js'
import { isWxOrAli } from '../../lib/proprietor/utils/EnvUtil.js'
export default {
  data() {
    return {
      communityId: '',
      appId: '',
      openId: ''
    }
  },
  onLoad(options) {
    this.communityId = options.communityId
    this.openId = options.openId
    const _that = this
    if (this.openId) {
      this.saveOpenIdToOwner()
      return
    }
    this._loadAppId(function () {
      if (!_that.appId || _that.appId.indexOf('wx') < 0) {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
      //todo 查询openId
      _that._generatorOpenId()
    })
  },
  methods: {
    _loadAppId: function (_call) {
      let _objType = '1100' // todo public
      // #ifdef MP-WEIXIN
      _objType = '1000'
      // #endif
      const _that = this
      getCommunityWechatAppId({
        communityId: this.communityId,
        objType: _objType
      }).then(_data => {
        _that.appId = _data.data
        _call()
      })
    },
    _generatorOpenId: function () {
      // #ifdef H5
      //todo h5 情况
      this._refreshWechatOpenId()
      return
      // #endif

      // #ifdef MP-WEIXIN
      this._refreshWechatMiniOpenId()
      // #endif
    },
    _refreshWechatOpenId: function () {
      //todo 不是微信环境 直接进入
      if (isWxOrAli() != 'WECHAT') {
        wx.switchTab({
          url: '/pages/index/index'
        })
        return
      }
      const _redirectUrl = window.location.href
      refreshUserOpenId({
        redirectUrl: _redirectUrl,
        wAppId: this.appId
      }).then(_data => {
        console.log(_data, 123)
        if (_data.code == 0) {
          window.location.href = _data.data.openUrl
          return
        }
      })
    },
    _refreshWechatMiniOpenId: function () {
      const _that = this
      wx.login({
        success: function (loginRes) {
          if (!loginRes.code) {
            return
          }
          const accountInfo = uni.getAccountInfoSync()
          const appId = accountInfo.miniProgram.appId
          getWechatMiniOpenId({
            code: loginRes.code,
            appId: appId
          }).then(_data => {
            if (_data.code != 0) {
              uni.showToast({
                icon: 'none',
                title: _data.msg
              })
              return
            }
            _that.openId = _data.data
            _that.saveOpenIdToOwner()
          })
        },
        fail: function (error) {
          // 调用 wx.login 接口失败
          console.log('调用wx.login获取code失败')
          console.log(error)
        }
      })
    },
    saveOpenIdToOwner: function () {
      refreshAppUserBindingOwnerOpenId(this, {
        openId: this.openId,
        communityId: this.communityId
      }).then(
        _data => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        },
        err => {
          uni.showToast({
            icon: 'none',
            title: err
          })
        }
      )
    }
  }
}
</script>

<style></style>
