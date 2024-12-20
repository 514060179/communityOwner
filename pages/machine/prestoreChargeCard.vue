<template>
  <view>
    <view class="block__title">{{ $t('购买月卡-Rqp') }}</view>
    <view class="cu-list menu">
      <view class="cu-item">
        <view class="content">
          <text class="text-grey">{{ $t('充电月卡-7da') }}</text>
        </view>
        <view class="action">
          <picker :value="cardIndex" :range="cards" :range-key="'cardName'" @change="cardChange">
            <view class="picker">
              {{ cards[cardIndex].cardName }}
            </view>
          </picker>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="text-grey">{{ $t('充值月-fEW') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ cardMonth }}{{ $t('个月-6bu') }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="text-grey">{{ $t('每日充电-COj') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ dayHours }}{{ $t('小时-DBA') }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="text-grey">{{ $t('充值金额-WpG') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ cardPrice }}</text>
        </view>
      </view>
    </view>

    <view class="bg-white border flex justify-end" style="position: fixed; width: 100%; bottom: 0">
      <view class="action text-orange margin-right line-height"> {{ $t('合计-87u') }}：MOP{{ cardPrice }} </view>
      <view class="btn-group">
        <!-- #ifdef H5 || MP-WEIXIN -->
        <button class="cu-btn bg-red shadow-blur lgplus sharp" @click="onPayFee()">{{ $t('提交订单-sDX') }}</button>
        <!-- #endif -->
        <!-- #ifdef APP-PLUS -->
        <button class="cu-btn bg-red shadow-blur lgplus sharp" @click="_payWxApp()">{{ $t('提交订单-sDX') }}</button>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<script>
// pages/account/myAccount.js
import context from '../../lib/proprietor/proprietorContext.js'
import { getChargeMonthCard } from '../../api/machine/machineApi.js'
import { getCommunityId } from '@/api/community/communityApi.js'
import { getWAppId } from '../../lib/proprietor/utils/StorageUtil.js'

import { payFeeApp, payFeeWechat } from '@/api/fee/feeApi.js'
export default {
  data() {
    return {
      account: {},
      appId: '',
      communityId: '',
      cards: [],
      cardIndex: 0,
      personTel: '',
      cardId: '',
      cardPrice: '',
      cardMonth: '',
      dayHours: ''
    }
  },
  onLoad(options) {
    this.communityId = options.communityId
    this.personTel = options.personTel
    this.loadChargeCards()
    // #ifdef MP-WEIXIN
    const accountInfo = uni.getAccountInfoSync()
    this.appId = accountInfo.miniProgram.appId
    // #endif
    // #ifdef H5
    this.appId = getWAppId()
    // #endif
  },
  methods: {
    loadChargeCards: function () {
      const _that = this
      getChargeMonthCard({
        page: 1,
        row: 100,
        communityId: this.communityId
      }).then(_data => {
        _that.cards = _data
        const selected = this.cards[0] //获取选中的数组
        this.cardId = selected.cardId
        this.cardMonth = selected.cardMonth
        this.cardName = selected.cardName
        this.cardPrice = selected.cardPrice
        this.dayHours = selected.dayHours
      })
    },
    cardChange: function (e) {
      this.cardIndex = e.target.value //取其下标
      const selected = this.cards[this.cardIndex] //获取选中的数组
      this.cardMonth = selected.cardMonth
      this.cardName = selected.cardName
      this.cardPrice = selected.cardPrice
      this.dayHours = selected.dayHours
      this.cardId = selected.cardId
    },
    _payWxApp: function (_data) {
      const _receivedAmount = this.cardPrice
      const _tradeType = 'APP'
      payFeeApp(this, {
        communityId: this.communityId,
        personTel: this.personTel,
        feeName: '月卡充值',
        receivedAmount: _receivedAmount,
        cardId: this.cardId,
        tradeType: _tradeType,
        appId: this.appId
      })
    },
    onPayFee: function () {
      const _receivedAmount = this.cardPrice
      const _tradeType = 'JSAPI'

      payFeeWechat(this, {
        business: 'preStoreChargeCard',
        communityId: this.communityId,
        personTel: this.personTel,
        feeName: '月卡充值',
        receivedAmount: _receivedAmount,
        cardId: this.cardId,
        tradeType: _tradeType,
        appId: this.appId
      })
    }
  }
}
</script>

<style lang="scss">
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
