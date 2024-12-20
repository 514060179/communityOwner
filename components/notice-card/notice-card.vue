<template>
  <view class="card-content" @tap="emitClick">
    <view class="card-image">
      <image :src="`${imgUrl}/hc/${noticeData.headerImg}`" />
    </view>
    <view class="right-container">
      <view class="title">{{ noticeData.title }}</view>
      <view class="desc">
        <text>{{ noticeData.userName }}</text>
        <text>{{ noticeData.startTime }}</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "NoticeCard",
    props: {
      noticeData: {
        type: Object,
        default: () => {}
      }
    },
    methods: {
      emitClick() {
        this.$emit('emitClick', this.noticeData)
      }
    }
  }
</script>

<style lang="less" scoped>
  .card-content {
    width: 100%;
    height: 216rpx;
    border-radius: 20rpx;
    padding: 33rpx 25rpx;
    background-color: #fff;
    box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.1);
    display: flex;
    margin-bottom: 20rpx;
  }

  .card-image {
    margin-right: 48rpx;

    image {
      width: 170rpx;
      height: 150rpx;
      border-radius: 20rpx;
    }
  }

  .right-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .title {
      font-size: 30rpx;
      font-weight: 500;
      color: #000;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

    }

    .desc {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 22rpx;
      color: rgba(0, 0, 0, 0.5);
    }
  }
</style>