<template>
  <view>
    <scroll-view scroll-y>
      <view class="block__title">{{ $t('订单信息-43M') }}</view>
      <form>
        <view class="cu-list menu">
          <view class="cu-form-group">
            <view class="title">{{ $t('预约人-J7K') }}</view>
            <input v-model="personName" :placeholder="$t('请输入预约人-XqC')" class="text-right" />
          </view>
          <view class="cu-form-group">
            <view class="title">{{ $t('预约电话-fmV') }}</view>
            <input v-model="personTel" :placeholder="$t('请输入预约电话-x83')" class="text-right" />
          </view>
          <view class="cu-form-group arrow">
            <view class="title">{{ $t('预约日期-SSV') }}</view>
            <picker mode="date" :value="appointmentTime" :start="todayDate" :end="endDate" @change="dateChange">
              <view class="picker">
                {{ appointmentTime || $t('请选择-Ah3') }}
              </view>
            </picker>
          </view>
        </view>

        <view class="block__title" v-if="from == 'service'">{{ $t('服务预约-wPN') }}</view>
        <view class="block__title" v-else>{{ $t('预约商品-Wwm') }}</view>
        <view class="cu-list menu" v-for="(items, index) in selectdGoods" :key="index">
          <view class="cu-item">
            <view class="">
              <view class="text-grey">
                <text class="text-abc">{{ items.goodsName }}({{ items.quantity }}{{ $t('次-TUc') }}) </text></view
              >
              <view class="text-gray text-sm flex justify-start">
                <view v-for="(item, index) in items.hours" :key="index">
                  <view>{{ item }}{{ $t('时-ExD') }};</view>
                </view>
              </view>
            </view>
            <view class="action">
              <text class="text-red">MOP {{ items.money }}</text>
            </view>
          </view>
        </view>
      </form>
    </scroll-view>
    <view class="bg-white border flex cu-form-group" style="position: fixed; width: 100%; bottom: 0">
      <view class="title">
        {{ $t('总计-Jlq') }}:
        <text class="solid-bottom text-xxl text-price text-red">{{ totalMoney }}</text>
      </view>
      <view class="btn-group">
        <button @click="onPayFee()" class="cu-btn round bg-primary" style="background-color: #1cbbb4">{{ $t('支付-lt5') }}</button>
      </view>
    </view>
  </view>
</template>

<script>
// pages/fee/payParkingFee.js
import context from '../../lib/proprietor/proprietorContext.js'
// import url from '@/constant/url.js'



// #ifdef APP-PLUS
// import { getPayInfo } from '../../factory/WexinAppPayFactory.js'
// #endif

import { formatDate } from '../../lib/proprietor/utils/DateUtil.js'

import { getCurOwner } from '@/api/owner/ownerApi.js'

// import { payFeeWechat } from '../../api/fee/feeApi.js'
import { getUserId, getUserName, getUserTel } from '../../api/user/userApi.js'
// const constant = context.constant

// #ifdef H5

// const WexinPayFactory = require('../../factory/WexinPayFactory.js')
// #endif

export default {
  data() {
    return {
      selectdGoods: [], // 订场信息
      appointmentTime: '', // 订场列表
      totalMoney: 0, //
      personName: '',
      personTel: '', //
      communityId: '', // 注册者电话
      type: '1001', // 注册者名称
      todayDate: '',
      from: 'dining',
      endDate: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    context.onLoad(options)
    this.from = options.from
    
    if (options.from === 'service') {
      this.endDate = formatDate(new Date(options.endDate), '-')
    }

    const _selectdGoods = uni.getStorageSync('/pages/reserve/reserveOrder')
    this.selectdGoods = _selectdGoods
    const _that = this
    _that.personName = getUserName()
    _that.personTel = getUserTel()
    getCurOwner().then(_ownerInfo => {
      //_that.personName = _ownerInfo.appUserName;
      // _that.personTel = _ownerInfo.link;
      _that.communityId = _ownerInfo.communityId
    })
    this.todayDate = formatDate(new Date(), '-')
    this.totalMoney = 0
    if (this.selectdGoods.length < 1) {
      return
    }
    this.selectdGoods.forEach(_goods => {
      this.totalMoney = this.totalMoney + parseFloat(_goods.money) //.toFixed(2);
    })
  },
  methods: {
    dateChange: function (e) {
      this.appointmentTime = e.detail.value
    },
    onPayFee: function () {
      if (!this.appointmentTime) {
        uni.showToast({
          icon: 'none',
          title: this.$t('请选择预约日期-ZK6')
        })
        return 
      }
      // debugger
      const _that = this

      const _receivedAmount = this.totalMoney
      const _tradeType = 'JSAPI'
      const _objData = {
        business: 'reserveGoods',
        appointmentTime: this.appointmentTime,
        communityId: this.communityId,
        personName: this.personName,
        personTel: this.personTel,
        receivedAmount: _receivedAmount,
        tradeType: _tradeType,
        payWay: '2', //微信支付
        appId: this.appId,
        type: this.type,
        goodss: this.selectdGoods
      }
      uni.setStorageSync('doing_cashier', _objData)
      uni.navigateTo({
        url: '/pages/fee/cashier?money=' + _receivedAmount + '&business=reserveGoods&communityId=' + this.communityId + '&cashierUserId=' + getUserId()
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
