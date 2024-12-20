<template>
  <view>
    <view class="cu-list menu-avatar" v-for="(item, index) in coupons" :key="index">
      <view class="cu-item arrow">
        <view class="content content-left">
          <view class="text-grey">
            <text class="cuIcon-notification text-cut text-green margin-right-xs"></text>
            <text class="ellip">{{ item.repairObjName }}-{{ item.stateName }}({{ item.repairSettingTypeName }})</text>
          </view>
          <view class="text-gray text-sm flex">
            <view class="text-cut"> {{ $t('报修人-1iu') }}：{{ item.repairName }}-{{ item.tel }} </view>
          </view>
        </view>
        <view class="rob-order text-df text-white bg-green text-center" @tap.stop="dealRepair(item, 'DISPATCH')">
          {{ $t('二维码-6ZX') }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
	name:'QrCodeReceive',
	data() {
		return {
			coupons:[]
		};
	},
	created() {
		this._loadShopCoupons();
	}
}
</script>

<style></style>
