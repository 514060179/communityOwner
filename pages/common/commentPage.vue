<template>
  <view>
    <template name="commentPage">
      <view class="commentPage-header">
        <view class="commentPage-score">
          <view class="overall">{{ $t('综合评分-rmT') }}</view
          >4.3<view class="rate">{{ $t('商家综合好评率为-NDx') }}76%</view>
        </view>
        <view class="commentPage-rating">
          <view class="restaurant">{{ $t('商家评分-YUk') }}<view class="stars">★★★★★ 4</view> </view>
          <view class="distribute">{{ $t('配送评分-Ny4') }}<view class="stars">★★★★★ 4.6</view> </view>
        </view>
      </view>
      <view class="commentPage-category">
        <block v-for="(item, index) in categoryList" :key="index">
          <view class="category-item">{{ item.text }}({{ item.numb }})</view>
        </block>
      </view>
    </template>
  </view>
</template>

<script>
export default {
  props: []
}
</script>
