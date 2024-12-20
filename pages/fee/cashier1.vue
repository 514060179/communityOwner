<template>
  <view>
    <view class="bg-white money-info text-center">
      <view class="money-black"></view>
      <view class="money-title">{{ $t('订单金额-Cbl') }}</view>
      <view class="money-value">MOP {{ money }}</view>
    </view>

    <view class="cu-bar btn-group" style="margin-top: 30px" v-if="!appId">
      <button disabled="disabled" class="cu-btn bg-primary shadow-blur round lg">{{ $t('确认支付-Zci') }}</button>
    </view>
    <view class="cu-bar btn-group" style="margin-top: 30px" v-else>
      <button @click="_submit" class="cu-btn bg-primary shadow-blur round lg" :disabled="banButton">{{ $t('确认支付-Zci') }}</button>
    </view>
  </view>
</template>

<script>
import { isNotNull } from '../../lib/proprietor/utils/StringUtil.js'
import { refreshUserOpenId, getWechatMiniOpenId, getCommunityWechatAppId } from '../../api/user/userApi.js'
import { isWxOrAli } from '../../lib/proprietor/utils/EnvUtil.js'

import { cashierPayFee } from '../../api/fee/feeApi.js'

export default {
  data() {
    return {
      communityId: '',
      money: 0.0,
      business: '',
      openId: '',
      appId: '',
      data: {},
      cashierUserId: '',
      banButton: false // 禁用支付按钮
    }
  },
  mounted() {
    if (isWxOrAli() == 'ALIPAY') {
      const oScript = document.createElement('script')
      oScript.type = 'text/javascript'
      oScript.src = 'https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min.js'
      document.body.appendChild(oScript)
    }
  },
  onLoad(options) {
    this.openId = options.openId
    this.communityId = options.communityId
    this.cashierUserId = options.cashierUserId
    const _that = this
    this._loadAppId(function () {
      if (!isNotNull(_that.openId)) {
        //刷新 openId
        if (isWxOrAli() == 'ALIPAY') {
          _that._refreshAliPayOpenId()
          return
        }
        //todo h5 情况
        _that._refreshWechatOpenId()
        return

        // 微信小程序
        // _that._refreshWechatMiniOpenId();
      }
    })

    this.money = options.money
    this.business = options.business
    this.data = uni.getStorageSync('doing_cashier')
  },
  methods: {
    _loadAppId: function (_call) {
      const _objType = '1100' // todo public
      // 微信小程序
      // _objType = "1000";

      const _that = this
      getCommunityWechatAppId({
        communityId: this.communityId,
        objType: _objType
      }).then(_data => {
        _that.appId = _data.data
        _call()
      })
    },
    _refreshWechatOpenId: function () {
      const _redirectUrl = window.location.href
      refreshUserOpenId({
        redirectUrl: _redirectUrl,
        wAppId: this.appId
      }).then(_data => {
        console.log(_data, 123)
        if (_data.code == 0) {
          // window.location.href = _data.data.openUrl;
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
          })
        },
        fail: function (error) {
          // 调用 wx.login 接口失败
          console.log('调用wx.login获取code失败')
          console.log(error)
        }
      })
    },
    _submit: function () {
      if (!this.appId) {
        uni.showToast({
          icon: 'none',
          title: this.$t('小区未配置支付信息-7WP')
        })
        return
      }
      this.banButton = true
      const _data = this.data
      _data.business = this.business
      _data.tradeType = 'app'
      _data.appId = this.appId
      _data.cashierUserId = this.cashierUserId
      _data.openId = this.openId
      cashierPayFee(this, _data)
    }
  }
}
</script>

<style lang="scss">
.money-info {
  height: 400upx;
  margin: 20upx;

  .money-black {
    height: 120upx;
  }

  .money-title {
    font-size: 32upx;
  }

  .money-value {
    color: #e54d42;
    margin-top: 20upx;
    font-size: 64upx;
  }
}
</style>
