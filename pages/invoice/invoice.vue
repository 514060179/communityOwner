<template>
  <view>
    <view class="cu-list menu">
      <view class="cu-item arrow" @click="_toPage('/pages/invoice/setting')">
        <view class="content">
          <text class="cuIcon-mobilefill text-cyan"></text>
          <text class="text-grey">{{ $t('发票设置-vKA') }}</text>
        </view>
        <view class="action"> </view>
      </view>
      <view class="cu-item arrow" @click="_toPage('/pages/invoice/invoiceApply')">
        <view class="content">
          <text class="cuIcon-warnfill text-cyan"></text>
          <text class="text-grey">{{ $t('开票记录-DzQ') }}</text>
        </view>
        <view class="action"> </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    _toPage: function (_url) {
      this.vc.navigateTo({
        url: _url
      })
    }
  }
}
</script>

<style></style>
