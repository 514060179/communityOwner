<template>
  <view>
    <view class="block__title">{{ $t('我的停车劵-vnt') }}</view>
    <!-- 费用项 -->
    <uni-collapse @change="change" class="margin-top fee-content">
      <uni-tr v-show="false">
        <uni-th align="center" :with="50"> </uni-th>
      </uni-tr>
      <!-- 多个复选框，带全选-->
      <view class="tl-section">
        <checkbox-group class="block" @change="checkboxChange">
          <view class="cu-form-group" v-for="(coupon, index) in coupons" :key="index">
            <view class="title">
              <text class="ellip">{{ coupon.couponName }}-</text>
              <text v-if="coupon.typeCd == '1001'">{{ coupon.value }}{{ $t('分钟-EaL') }}</text>
              <text v-if="coupon.typeCd == '2002'">{{ coupon.value }}{{ $t('元-ZIk') }}</text>
              <text v-if="coupon.typeCd == '3003'">{{ coupon.value }}{{ $t('折-j1j') }}</text>
              <text v-if="coupon.typeCd == '4004'">{{ $t('全免-Z5g') }}</text>
            </view>
            <checkbox class="round" :class="coupons[index].checked ? 'checked' : ''" :checked="coupons[index].checked ? true : false" :value="coupon.pccId"></checkbox>
          </view>
        </checkbox-group>
      </view>
    </uni-collapse>

    <view class="bg-white border flex justify-end" style="position: fixed; width: 100%; bottom: 0">
      <view class="action text-orange margin-right line-height"> {{ $t('共-ysv') }}：{{ selectCoupons.length }}{{ $t('张-Cp7') }} </view>
      <view class="btn-group">
        <button class="cu-btn bg-red shadow-blur lgplus sharp" @click="_selectCouponBack()">{{ $t('确定-vdT') }}</button>
      </view>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'

// import { addMonth, formatDate, date2String, dateSubOneDay } from '../../lib/proprietor/utils/DateUtil.js'
import { getParkingCarCoupon } from '../../api/fee/feeApi.js'
const constant = context.constant

export default {
  data() {
    return {
      coupons: [],
      selectCoupons: [],
      couponAmount: 0.0,
      carNum: '',
      paId: ''
    }
  },
  onLoad: function (options) {
    this.carNum = options.carNum
    this.paId = options.paId
    this._loadCarCoupons(options)
  },
  methods: {
    checkboxChange(e) {
      const items = this.coupons
      const values = e.detail.value
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        items[i].checked = false
        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (items[i].pccId == values[j]) {
            items[i].checked = true
            break
          }
        }
      }
      this.selectCoupons = values
    },
    _loadCarCoupons: function () {
      const _that = this
      const _objData = {
        page: 1,
        row: 30,
        carNum: this.carNum,
        paId: this.paId,
        state: '1001'
      }
      _that.coupons = []
      getParkingCarCoupon(_objData).then(
        _data => {
          _that.coupons = _data
        },
        _err => {
          uni.showToast({
            icon: 'none',
            title: _err
          })
        }
      )
    },
    _selectCouponBack: function () {
      const _that = this
      uni.setStorageSync(constant.mapping.COUPON_USER_TEMP_CAR_KEY, this.selectCoupons)
      uni.navigateBack()
    }
  }
}
</script>

<style>
/* 	@import "./roomFee.css";
 */
.block__title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 40rpx 30rpx 20rpx;
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
