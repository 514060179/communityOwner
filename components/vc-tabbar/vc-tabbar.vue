<template>
  <view>
    <!-- #ifdef H5 -->
    <view style="height: 90rpx" v-if="isFixed"></view>
    <view class="tabbar-container h5-container" :class="{ 'h5-tabbar-fixed': isFixed }" :style="{
        background,
        height: heightData.height,
      }">
      <view class="tabbar-content">
        <image v-if="isBack" src="../../static/images/icons/back-icon.png" @tap="pageBack" />
        <slot name="tabbar-left" />
        <view class="tabbar-title" :style="{ color: titleColor }" @tap="clickTitle">{{ title }}</view>
        <slot name="tabbar-right" />
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifdef APP -->
    <view :style="{ height: heightData.height }" v-if="isFixed"></view>
    <view class="tabbar-container" :class="{ 'tabbar-fixed': isFixed }" :style="{
        background,
        height: heightData.height,
        paddingTop: heightData.statusBarHeight
      }">
      <view class="tabbar-content">
        <image v-if="isBack" src="../../static/images/icons/back-icon.png" @tap="pageBack" />
        <slot name="tabbar-left" />
        <view class="tabbar-title" :style="{ color: titleColor }" @tap="clickTitle">{{ title }}</view>
        <slot name="tabbar-right" />
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
  export default {
    name: "VcTabbar",
    props: {
      isBack: {
        type: Boolean,
        default: false
      },
      background: {
        type: String,
        default: 'transparent'
      },
      title: {
        type: String
      },
      titleColor: {
        type: String,
        default: '#ffffff'
      },
      isFixed: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      // tab高度
      heightData() {
        const { screenWidth, statusBarHeight } = uni.getSystemInfoSync()
        let height = 0
        //#ifdef H5
        height = screenWidth * Number.parseInt(90) / 750
        //#endif
        // #ifdef APP
        height = (screenWidth * Number.parseInt(90) / 750) + statusBarHeight
        // #endif
        return {
          height: height + 'px',
          statusBarHeight: statusBarHeight + 'px'
        }
      }
    },
    methods: {
      clickTitle() {
        this.$emit('clickTitle')
      },
      pageBack() {
        let pages = getCurrentPages();
        if (pages.length > 1) {
          uni.navigateBack({ delta: 1 })
        } else {
          uni.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  
  .tabbar-container {
    width: 100%;
    z-index: 999;
    padding-bottom: 60rpx;
  }

  .tabbar-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90rpx;
    padding: 0 30rpx;

    .tabbar-title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: Source Han Sans;
      font-size: 30rpx;
      font-weight: 500;
      color: #fff;
    }

    image {
      width: 48rpx;
      height: 48rpx;
    }
  }

  .tabbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }
  
  .h5-container {
    padding-bottom: 0;
    
    .tabbar-content {
      height: 90rpx;
    }
  }
  
  .h5-tabbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }
</style>