<template>
  <view class="other-card-container" @tap="clickItem">
    <view class="other-left">
      <image :src="`${imgUrl}/hc/${cardData.img}`" />
    </view>
    <view class="other-right">
      <view class="title">{{ cardData.name }}</view>
      <view class="right-arrow"></view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "OhterCard",
    props: {
      cardData: {
        type: Object,
        default: () => {}
      }
    },
    methods: {
      clickItem() {
        this.$emit('openPdf', this.cardData)
      }
    }
  }
</script>

<style lang="less" scoped>
  .other-card-container {
    width: 100%;
    height: 140rpx;
    padding: 20rpx 16rpx 20rpx 30rpx;
    background-color: #fff;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    box-shadow: 0 8rpx 20rpx 0px rgba(0, 0, 0, 0.1);
  }

  .other-left {
    margin-right: 34rpx;

    image {
      width: 100rpx;
      height: 100rpx;
      border-radius: 20rpx;
    }
  }
  
  .other-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    padding-right: 10rpx;
    
    .title {
      flex: 1;
      font-size: 30rpx;
      color: rgba(0, 0, 0, 0.8);
      font-weight: 500;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 10rpx;
    }
  }
  .right-arrow {
    display: inline-block;
    width: 20rpx;
    height: 20rpx;
    border-color: #B8B8B8;
    border-width: 0 0 4rpx 4rpx;
    border-style: solid;
    transform: rotateZ(-135deg);
  }
</style>