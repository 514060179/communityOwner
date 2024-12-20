<template>
  <view>
    <view class="text-center margin-top-100">
      <view class="">
        <image class="empty-img" :src="imgUrl || require('@/static/images/empty/data-empty.png')" mode="aspectFill" />
      </view>
      <view class="">
        <text class="text-gray">{{ $t('当前没有数据-fwm') }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import conf from '../../conf/config.js'
export default {
  name: 'NoDataPage',
  props: {
    imgUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      conf
    }
  },
  methods: {}
}
</script>

<style scoped>
.no-data-icon {
  font-size: 200upx;
}
.empty-img {
	width: 400rpx;
	height: 400rpx;
}
.margin-top-100 {
  margin-top: 200upx;
}
</style>
