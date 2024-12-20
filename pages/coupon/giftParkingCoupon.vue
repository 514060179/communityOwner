<template>
  <view>
    <view class="cu-form-group margin-top-sm">
      <view class="title">{{ $t('车牌号-c9W') }}</view>
      <input :placeholder="$t('请输入车牌号-4qv')" class="text-right" v-model="carNum" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('停车场-oDB') }}</view>
      <picker @change="parkingAreaChange" :value="paIdIndex" :range="parkingAreas" :range-key="'num'">
        <view class="picker">
          {{ paIdIndex > -1 ? paNum : $t('请选择停车场-B4d') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group margin-top-sm">
      <view class="title">{{ $t('优惠券-XUV') }}</view>
      <input :placeholder="$t('请输入优惠券-ww5')" class="text-right" disabled="disabled" v-model="couponName" />
    </view>
    <view class="cu-form-group margin-top-sm">
      <view class="title">{{ $t('赠送数量-gVy') }}</view>
      <input :placeholder="$t('请输入赠送数量-uHh')" class="text-right" type="number" v-model="giftCount" />
    </view>
    <view class="padding">
      <button class="cu-btn block bg-primary margin-tb-sm lg" @click="_saveCustomCoupon()" type="">{{ $t('赠送-eGD') }}</button>
    </view>
  </view>
</template>

<script>
import { getCommunityId, listParkingAreas } from '@/api/community/communityApi.js'
import { couponPropertyUserGiftCar } from '@/api/fee/feeApi.js'
export default {
  data() {
    return {
      carNum: '',
      couponName: '',
      couponId: '',
      giftCount: 1,
      paId: '',
      parkingAreas: [],
      paIdIndex: '-1',
      paNum: ''
    }
  },
  onLoad(options) {
    this.couponName = options.couponName
    this.couponId = options.couponId
    this._loadParkingArea()
  },
  methods: {
    _loadParkingArea: function () {
      const _that = this
      listParkingAreas({
        page: 1,
        row: 100,
        communityId: getCommunityId()
      }).then(_data => {
        _that.parkingAreas = _data
      })
    },
    parkingAreaChange(e) {
      this.paIdIndex = e.detail.value
      this.paNum = this.parkingAreas[this.paIdIndex].num
      this.paId = this.parkingAreas[this.paIdIndex].paId
    },
    _saveCustomCoupon: function () {
      if (!this.carNum) {
        uni.showToast({
          icon: 'none',
          title: this.$t('未填写车牌-sCT')
        })
        return
      }

      if (!this.couponId) {
        uni.showToast({
          icon: 'none',
          title: this.$t('未选择停车劵-8N6')
        })
        return
      }

      const _data = {
        communityId: getCommunityId(),
        carNum: this.carNum,
        couponId: this.couponId,
        giftCount: this.giftCount,
        paId: this.paId
      }

      couponPropertyUserGiftCar(_data).then(
        _msg => {
          uni.showToast({
            icon: 'none',
            title: this.$t('赠送成功-8kn')
          })
          uni.navigateBack({
            delta: 1
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
