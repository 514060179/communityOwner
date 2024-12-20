<template>
  <view>
    <view class="box">
      <view class="title text-df text-grey">{{ $t('优惠及违约说明-OpG') }}</view>
      <view class="sub-title text-df">·{{ $t('优惠-4jq') }}</view>
      <view class="con text-sm">
        1.{{ $t('折扣-wUG') }}： <text class="detail text-grey">{{ $t('优惠费用-RFb') }} = {{ $t('金额-LrA') }} * {{ $t('周期-FZx') }} * {{ $t('折扣率-HGm') }}。 </text></view
      >
      <view class="con text-sm">
        2.{{ $t('减免-Fpj') }}： <text class="detail text-grey">{{ $t('优惠费用按照减免规则计算-xLi') }}。</text>
      </view>
      <view class="sub-title text-df">·{{ $t('违约-ksK') }}</view>
      <view class="con text-sm">
        1.{{ $t('按日收取滞纳金-YdA') }}： <text class="detail text-grey">{{ $t('需支付滞纳金额-3Jw') }} = {{ $t('每日金额-2sG') }} * {{ $t('违约天数-cYG') }} * {{ $t('滞纳金收取费率-NDl') }}。</text>
      </view>
      <view class="con text-sm">
        2.{{ $t('按月收取滞纳金-PPd') }}： <text class="detail text-grey">{{ $t('需支付滞纳金额-3Jw') }} = {{ $t('每月金额-7Ao') }} * {{ $t('违约月数-cbJ') }} * {{ $t('滞纳金收取费率-NDl') }}。</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style>
.box {
  margin: 20upx;
}
.title {
}
.sub-title {
}
.con {
  text-indent: 2rem;
}
.detail {
}
</style>
