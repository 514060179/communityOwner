<template>
  <view>
    <view class="cu-list menu">
      <view class="cu-item arrow" @click="_toPrestoreAccount()">
        <view class="content padding-tb-sm">
          <view> <text class="cuIcon-rechargefill text-green margin-right-xs"></text> {{ $t('充电月卡-7da') }} </view>
          <view class="text-gray text-sm"> <text class="cuIcon-right margin-right-xs"></text> {{ chargeOrders.length }} {{ $t('张-Cp7') }} </view>
        </view>
        <view class="action">
          {{ $t('去购买-ahI') }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
import { getChargeMonthOrder } from '@/api/machine/machineApi.js'
import { formatDate } from '../../lib/proprietor/utils/DateUtil.js'
export default {
  name: 'Charge',
  data() {
    return {
      chargeOrders: [],
      communityId: ''
    }
  },
  created() {
    //this.loadOwnerAccount();
  },
  methods: {
    loadChargeMonthOrder: function (_communityId) {
      this.communityId = _communityId
      const _that = this
      context.getOwner(function (_ownerInfo) {
        if (_ownerInfo) {
          if (!_that.communityId) {
            _that.communityId = _ownerInfo.communityId
          }

          getChargeMonthOrder({
            page: 1,
            row: 20,
            personTel: _ownerInfo.link,
            communityId: _communityId,
            queryTime: formatDate(new Date())
          }).then(data => {
            if (!data) {
              _that.chargeOrders = []
              return
            }
            _that.chargeOrders = data
          })
        }
      })
    },
    _toPrestoreAccount: function () {
      uni.navigateTo({
        url: '/pages/machine/chargeCard?communityId=' + this.communityId
      })
    }
  }
}
</script>

<style></style>
