<template>
  <view>
    <scroll-view scroll-y>
      <view class="block__title">{{ $t('报修信息-1sT') }}</view>
      <view class="cu-list menu">
        <view class="cu-item">
          <view class="content">
            <text class="text-grey">{{ $t('工单号-NtO') }}</text>
          </view>
          <view class="action">
            <text class="text-grey text-sm">{{ repairId }}</text>
          </view>
        </view>
        <view class="cu-item">
          <view class="content">
            <text class="text-grey">{{ $t('报修类型-qnU') }}</text>
          </view>
          <view class="action">
            <text class="text-grey text-sm">{{ repairTypeName }}</text>
          </view>
        </view>
        <view class="cu-item">
          <view class="content">
            <text class="text-grey">{{ $t('报修位置-GL7') }}</text>
          </view>
          <view class="action">
            <text class="text-grey text-sm">{{ repairObjName }}</text>
          </view>
        </view>
        <view class="cu-item">
          <view class="content">
            <text class="text-grey">{{ $t('报修人-1iu') }}</text>
          </view>
          <view class="action">
            <text class="text-grey text-sm">{{ repairName }}</text>
          </view>
        </view>
        <view class="cu-item">
          <view class="content">
            <text class="text-grey">{{ $t('报修内容-Jl2') }}</text>
          </view>
          <view class="action">
            <text class="text-grey text-sm">{{ remark }}</text>
          </view>
        </view>
      </view>
      <view class="block__title">{{ $t('费用信息-3Hv') }}</view>
      <view class="cu-list menu fee-last">
        <view class="cu-item">
          <view class="content">
            <text class="text-grey">{{ $t('费用编号-y7z') }}</text>
          </view>
          <view class="action">
            <text class="text-grey text-sm">{{ feeInfo.feeId }}</text>
          </view>
        </view>
        <view class="cu-item">
          <view class="content">
            <text class="text-grey">{{ $t('金额-LrA') }}</text>
          </view>
          <view class="action">
            <text class="text-grey text-sm">MOP{{ feeInfo.amount }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="bg-white border flex justify-end" style="position: fixed; width: 100%; bottom: 0">
      <view class="action text-orange margin-right line-height"> {{ $t('合计-87u') }}：MOP{{ feeInfo.amount }} </view>
      <view class="btn-group">
        <button class="cu-btn bg-red shadow-blur lgplus sharp" @click="onPayFee()">{{ $t('提交订单-sDX') }}</button>
      </view>
    </view>
  </view>
</template>

<script>
import { date2String } from '../../lib/proprietor/utils/DateUtil.js'
import context from '../../lib/proprietor/proprietorContext.js'
import { getUserId } from '../../api/user/userApi.js'

// import { payFeeApp, payFeeWechat, computeObjFee } from '@/api/fee/feeApi.js'
const constant = context.constant
const util = context.util

export default {
  data() {
    return {
      communityId: '',
      communityName: '',
      repairId: '',
      appId: '',
      repairInfo: {},
      feeInfo: {},
      userId: '',
      payerObjId: '',
      payerObjType: '3333',
      endTime: '',
      repairTypeName: '',
      repairObjName: '',
      repairName: '',
      remark: ''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    context.onLoad(options)
    // #ifdef MP-WEIXIN
    const accountInfo = uni.getAccountInfoSync()
    this.appId = accountInfo.miniProgram.appId
    // #endif

    // #ifdef H5
    this.appId = uni.getStorageSync(constant.mapping.W_APP_ID)
    // #endif
    this.communityId = options.communityId
    this.repairId = options.repairId
    this.userId = options.userId
    this.payerObjId = options.repairObjId
    this.endTime = date2String(new Date(options.appointmentTime.replace(/-/g, '/')))
    this.repairTypeName = options.repairTypeName
    this.repairObjName = options.repairObjName
    this.repairName = options.repairName
    this.remark = options.context

    this._loadRepair()
    this._listFee()
  },

  methods: {
    /**
     * 加载我的报修
     *
     */
    _listFee: function () {
      const that = this
      let _url = ''
      _url = constant.url.listFeeByAttr
      const _paramIn = {
        communityId: that.communityId,
        page: 1,
        row: 1,
        specCd: '390001',
        value: that.repairId
      }
      context.request({
        url: _url,
        header: context.getHeaders(),
        method: 'GET',
        data: _paramIn,
        success: function (res) {
          const _json = res.data
          if (_json.code == 0) {
            that.feeInfo = _json.data[0]
            return
          }
          wx.showToast({
            title: this.$t('查询费用失败-zf9'),
            icon: 'none',
            duration: 2000
          })
        },
        fail: function (e) {
          wx.showToast({
            title: this.$t('服务器异常了-eja'),
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    _loadRepair: function () {
      const that = this
      let _url = ''
      _url = constant.url.listStaffFinishRepairs
      const _paramIn = {
        communityId: that.communityId,
        page: 1,
        row: 1,
        userId: that.userId,
        repairId: that.repairId
      }
      context.request({
        url: _url,
        header: context.getHeaders(),
        method: 'GET',
        data: _paramIn,
        success: function (res) {
          const _json = res.data
          if (_json.code == 0) {
            that.repairInfo = _json.data[0]
            return
          }
          wx.showToast({
            title: this.$t('查询报修单失败-7BN'),
            icon: 'none',
            duration: 2000
          })
        },
        fail: function (e) {
          wx.showToast({
            title: this.$t('服务器异常了-eja'),
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    onPayFee: function () {
      wx.showLoading({
        title: this.$t('支付中-WHp')
      })
      const _tradeType = 'JSAPI'
      const _receivedAmount = this.feeInfo.feePrice
      const _objData = {
        business: 'payFee',
        cycles: '1',
        communityId: this.communityId,
        feeId: this.feeInfo.feeId,
        feeName: '报修费',
        receivedAmount: _receivedAmount,
        tradeType: _tradeType,
        appId: this.appId,
        endTime: this.endTime,
        payerObjId: this.payerObjId,
        payerObjType: this.payerObjType
      }
      uni.setStorageSync('doing_cashier', _objData)
      uni.navigateTo({
        url: '/pages/fee/cashier?money=' + _receivedAmount + '&business=payFee&communityId=' + this.communityId + '&cashierUserId=' + getUserId()
      })
    }
  }
}
</script>
<style>
.ppf_item {
  padding: 0rpx 0rpx 0rpx 0rpx;
}

.block__title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 40rpx 30rpx 20rpx;
}

.button_up_blank {
  height: 40rpx;
}

.block__bottom {
  height: 180rpx;
}

.fee-last {
  margin-bottom: 200upx;
}

.cu-btn.lgplus {
  padding: 0 20px;
  font-size: 18px;
  height: 100upx;
}

.cu-btn.sharp {
  border-radius: 0upx;
}

.line-height {
  line-height: 100upx;
}
</style>
