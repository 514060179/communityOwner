<template>
  <view class="site-card-container" @tap="clickCard">
    <view class="left">
      <image :src="`${imgUrl}/hc/${site.img}`" />
    </view>
    <view class="right">
      <view class="title-content">
        <view class="title-value">{{ isOrder ? site.spaceName : site.name }}</view>
        <!-- <view class="title-tag">24h</view> -->
      </view>
      <view class="desc">{{ site.remark }}</view>
      <view class="right-bottom-content">
        <view class="price-box" v-if="isOrder">
          <view>{{ site.appointmentTime }}</view>
          <view>{{ site.hours }}:00-{{ Number(site.hours) + 1 }}:00</view>
        </view>
        <view class="price-box" v-else>
          <block v-if="site.feeMoney > 0">
            <text>MOP {{ site.feeMoney }}</text>
            <text class="price-hour">/{{ $t('小时-DBA') }}</text>
          </block>
          <view v-else>{{ $t('免费开放-Nxq') }}</view>
        </view>
        <view class="buy-button" :class="{ 'order-button': isOrder }">{{ isOrder ?  $t('已预约-Wyz') : $t('预约-JJk') }}</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "SiteCard",
    props: {
      // 场馆信息
      site: {
        type: Object,
        default: () => {}
      },
      // 是否是已预约订单
      isOrder: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      clickCard() {
        this.$emit('clickCard', this.site)
      }
    },
  }
</script>

<style lang="less" scoped>
  .site-card-container {
    width: 100%;
    min-height: 260rpx;
    padding: 32rpx 30rpx 32rpx 24rpx;
    background-color: #fff;
    border-radius: 20rpx;
    box-shadow: 0 8rpx 20rpx 0px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
  }

  .left {
    margin-right: 50rpx;
    
    image {
      width: 170rpx;
      height: 196rpx;
      border-radius: 20rpx;
    }
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;

    .title-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 30rpx;
      color: #000;
      font-weight: 500;

      .title-value {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .title-tag {
        width: 100rpx;
        height: 40rpx;
        border-radius: 40rpx;
        background-color: #606EF0;
        color: #fff;
        font-size: 22rpx;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 20rpx;
      }
    }

    .desc {
      font-size: 22rpx;
      font-weight: normal;
      color: rgba(0, 0, 0, 0.5);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .right-bottom-content {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }

    .price-box {
      font-family: Source Han Sans;
      font-size: 30rpx;
      font-weight: bold;
      color: #C21DA0;
      
      .price-hour {
        font-size: 22rpx;
        font-weight: normal;
        color: rgba(0, 0, 0, 0.5);
      }
    }

    .buy-button {
      width: 120rpx;
      height: 60rpx;
      font-size: 24rpx;
      color: #fff;
      border-radius: 60rpx;
      background-color: #C21DA0;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border: 2rpx solid transparent;
    }
    
    .order-button {
      color: #C21DA0;
      background-color: transparent;
      border: 2rpx solid #C21DA0;
    }
  }
</style>
