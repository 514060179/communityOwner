<template>
  <view>
    <template name="sort_list">
      <view class="sort-list">
        <view class="sort" @tap="onOverallTag">{{ sortSelected }}<image src="../../static/images/down.png" style="width: 20rpx; height: 20rpx" /></view>
        <view data-index="0" @tap="onTapTag" :class="'sort ' + (selected == 0 ? 'sort-active' : '')">{{ $t('销量最高-NOd') }}</view>
        <view data-index="1" @tap="onTapTag" :class="'sort ' + (selected == 1 ? 'sort-active' : '')">{{ $t('距离最近-8IF') }}</view>
        <view class="sort" @tap="onFilter">{{ $t('筛选-LRi') }}<image src="../../static/images/screen.png" style="width: 22rpx; height: 22rpx" /></view>
      </view>
    </template>
  </view>
</template>

<script>
export default {
  props: []
}
</script>
