<template>
  <view>
    <text>{{ msg || $t('正在处理，请稍等！-n42') }}</text>
  </view>
</template>

<script>
import { getQrCodeData } from '@/api/fee/feeApi.js'
export default {
  data() {
    return {
      msg: '',
      qrToken: ''
    }
  },
  onLoad(options) {
    this.qrToken = options.qrToken
    if (!this.qrToken) {
      this.msg = this.$t('二维码错误-Ku7')
      return
    }
    this._loadQrcodeData()
  },
  methods: {
    _loadQrcodeData: function () {
      const _that = this
      getQrCodeData({
        qrToken: this.qrToken
      }).then(_data => {
        if (_data.code != 0) {
          uni.showToast({
            icon: 'none',
            title: _data.msg
          })
          _that.msg = _data.msg
          return
        }

        const _tradeType = 'JSAPI'
        const _objData = _data.data
        _objData.tradeType = _tradeType

        uni.setStorageSync('doing_cashier', _objData)
        uni.navigateTo({
          url: '/pages/fee/cashier?money=' + _objData.money + '&business=' + _objData.business + '&communityId=' + _objData.communityId + '&cashierUserId=' + _objData.createUserId
        })
      })
    }
  }
}
</script>

<style></style>
