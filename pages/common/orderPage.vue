<template>
  <view>
    <template name="orderPage">
      <scroll-view class="orderPage-sideBar" @scrolltolower="lower" scroll-y="true">
        <block v-for="(item, index) in menu" :key="index">
          <view class="menuList">
            <view :class="'menu ' + (index == selected ? 'selected' : '')" :data-index="index" @tap.native.stop="turnMenu">{{ item.typeName }}</view>
          </view>
        </block>
      </scroll-view>
      <scroll-view class="foodList" scroll-y="true">
        <view class="title">{{ menu[selected].typeName }}</view>
        <block v-for="(item, index) in menu[selected].menuContent" :key="index">
          <view class="food">
            <image class="img" :src="item.src"></image>
            <view class="food-info">
              <view class="name">{{ item.name }}</view>
              <view class="sales">{{ $t('月售-icm') }} {{ item.sales }} {{ $t('赞-uJp') }} {{ item.rating }}</view>
              <view class="price">MOP {{ item.price }}</view>
            </view>
            <view class="food-numb">
              <view class="remove" @tap="removeFromTrolley" :hidden="item.numb == 0" :data-index="index">-</view>
              <text class="text" :hidden="item.numb == 0">{{ item.numb }}</text>
              <view class="add" @tap="addToTrolley" :data-index="index">+</view>
            </view>
          </view>
        </block>
      </scroll-view>
      <view :class="'footer ' + (cost != 0 ? 'active' : '')">
        <view class="howMuch">
          <view class="img" :style="'background:' + (cost != 0 ? '#FFD161' : '#E7E7E7') + ';'">
            <image src="../../static/images/trolley.png" style="width: 60rpx; height: 60rpx"></image>
          </view>
          <view class="cost" :hidden="cost == 0">￥{{ cost }}</view>
          <view class="free">{{ $t('免配送费-SqN') }}</view>
        </view>
        <view class="pay">{{ cost != 0 ? $t('去结算-esl') : $t('15元起送-YAt') }}</view>
      </view>
    </template>
  </view>
</template>

<script>
export default {
  props: []
}
</script>
