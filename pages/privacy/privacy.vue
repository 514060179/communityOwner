<template>
  <view class="privacy-container">
    <view class="dialog">
      <view class="title">{{ $t('服务协议和隐私政策-cr1') }}</view>
      <view class="content">
        {{ $t('请你务必审慎阅读、充分理解“服务协议”和“隐私政策”各条款，包括但不限于：为了更好的向你提供服务，我们需要收集你的设备标识、操作日志等信息用于分析、优化应用性能。你可阅读-SVR') }}
        <text class="link" @tap="linkClick('agreement')">{{ $t('《服务协议》-vNO') }}</text>{{ $t('和-xGZ') }}
        <text class="link" @tap="linkClick('privacy')">{{ $t('《隐私政策》-tzI') }}</text>
        {{ $t('了解详细信息。如果你同意，请点击下面按钮开始接受我们的服务。-KqQ') }}
      </view>
      <view class="btn">
        <button @tap="disagree">{{ $t('不同意并退出-R6j') }}</button>
        <button @tap="agree">{{ $t('同意-49l') }}</button>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {

      };
    },
    methods: {
      linkClick(type) {
        if (type === 'agreement') {
          // 用户协议
          // #ifdef H5
          window.open("https://proprietor.newlandgo.com/agreement.html", '_blank')
          // #endif
          // #ifdef APP
          plus.runtime.openWeb('https://proprietor.newlandgo.com/agreement.html')
          // #endif
        } else if (type === 'privacy') {
          // #ifdef H5
          window.open("https://proprietor.newlandgo.com/privacy.html", '_blank')
          // #endif
          // 隐私政策
          // #ifdef APP
          plus.runtime.openWeb('https://proprietor.newlandgo.com/privacy.html')
          // #endif
        }
      },
      disagree() {
        // #ifdef APP-PLUS
        let platform = uni.getSystemInfoSync().platform
        if (platform == 'ios') {
          plus.ios.import("UIApplication").sharedApplication().performSelector("exit")
        } else if (platform == 'android') {
          plus.runtime.quit();
        }
        // #endif
      },
      agree() {
        uni.setStorageSync('agree', 1) // 设置缓存，下次进入应用不再弹出
        if (getCurrentPages().length > 1) {
          uni.navigateBack()
        } else {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .privacy-container {
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.2); // 设置与启动页面相同的背景色，并设置一定透明度
    overflow: hidden;
    position: relative;
  }

  // 弹窗样式
  .dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600rpx;
    border-radius: 16rpx;
    background-color: #fff;
    box-shadow: 0 0 40rpx 4rpx rgba(255, 255, 255, 0.2);

    .title {
      text-align: center;
      line-height: 100rpx;
      font-size: 32rpx;
      font-weight: 600;
    }

    .content {
      padding: 0 32rpx;
      text-indent: 1em;

      .link {
        color: blue;
      }
    }

    .btn {
      display: flex;
      flex: 1;

      uni-button {
        margin: 0;
        flex: 1;
        background-color: #fff;
      }

      uni-button::after {
        border: none;
      }
    }
  }
</style>
