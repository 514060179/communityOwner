<template>
  <uni-popup ref="popup" type="bottom" style="z-index: 999" :is-mask-click="false">
    <view class="popup-container">
      <view class="popup-header">{{ $t('APP升级提醒-vbo') }}</view>
      <view class="popup-content">{{ updateData.desc }}</view>
      <view class="popup-btns">
        <button class="cancel-btn" v-if="updateData.isForceUpdate === 0" @tap="closePopup">{{ $t('取消-KvD') }}</button>
        <button class="confirm-btn" @tap="updateApp">{{ $t('一键升级-KTt') }}</button>
      </view>
    </view>
  </uni-popup>
</template>

<script>
  export default {
    name: 'AppUpdatePopup',
    data() {
      return {
        updateData: {},
      }
    },
    methods: {
      // 打开弹窗
      openPopup() {
        this.$refs.popup.open()
      },
      // 关闭弹窗
      closePopup() {
        uni.showTabBar()
        this.$refs.popup.close()
        this.$emit('close')
      },
      // 去升级
      updateApp() {
        if (this.updateData.platform == '0') {
          plus.runtime.openURL(this.updateData.url)
        } else {
          this.androidUpdate()
        }
      },
      // 安卓在线下载
      androidUpdate() {
        // 构建了下载任务，但此时并未开始下载
        var dtask = plus.downloader.createDownload(this.updateData.url, {}, function(d, status) { // 新建下载任务
          if (status == 200) { // 当下载完成
            plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {}, () => { // 安装应用
              uni.showToast({
                title: '安装失败',
                duration: 1500,
                icon: 'none'
              });
            })
          } else {
            uni.showToast({
              title: '更新失败',
              duration: 1500,
              icon: 'none'
            });
          }
        })
        dtask.start();
        var prg = 0;
        var showLoading = plus.nativeUI.showWaiting("正在下载");
        dtask.addEventListener('statechanged', (task) => { // 添加下载任务事件监听器
          // 给下载任务设置一个监听 并根据状态 做操作
          switch (task.state) {
            case 1:
              showLoading.setTitle("正在下载");
              break;
            case 2:
              showLoading.setTitle("已连接到服务器");
              break;
            case 3:
              prg = parseInt( // 下载的进度
                (parseFloat(task.downloadedSize) / parseFloat(task.totalSize)) * 100
              );
              showLoading.setTitle(
                `版本更新,正在下载${(task.downloadedSize / (1024 * 1024)).toFixed(2)}M / ${(task.totalSize / (1024 * 1024)).toFixed(2)}M,进度${prg}%`
              );
              break;
            case 4:
              plus.nativeUI.closeWaiting(); //关闭系统提示框
              //下载完成
              break;
          }
        });
      }
    },
    mounted() {
      this.updateData = uni.getStorageSync('appUpdate') || {}
      // isOpenTip： 1弹窗  0:不弹
      if (this.updateData.isOpenTip === 1) {
        this.openPopup()
        uni.hideTabBar()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .popup-container {
    width: 100%;
    min-height: 560rpx;
    max-height: 80vh;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    padding: 54rpx 100rpx 100rpx;
    display: flex;
    flex-direction: column;

    .popup-header {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      font-weight: 500;
      margin-bottom: 100rpx;
    }

    .popup-content {
      flex: 1;
      font-size: 24rpx;
      font-weight: 500;
    }

    .popup-btns {
      display: flex;
      align-items: center;
      margin-top: 60rpx;

      uni-button {
        flex: 1;
        height: 60rpx;
        border-radius: 60rpx;
        margin-right: 50rpx;
        line-height: 60rpx;
        font-size: 24rpx;
        color: #fff;

        &:last-child {
          margin-right: 0;
        }
      }

      .cancel-btn {
        background-color: #606EF0;
      }

      .confirm-btn {
        background-color: #C21DA0;
      }
    }
  }
</style>
