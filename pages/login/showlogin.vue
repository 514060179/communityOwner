<template>
  <view class="">
    <view class="user-container">
      <view class="userinfo">
        <block>
          <view>
            <image class="cu-avatar xl round" :src="img" style="width: 148rpx; height: 148rpx;" />
          </view>
          <view class="userinfo-nickname text-center margin-top">
            <text>{{ $t('非常抱歉此功能需登录后才能体验-pik') }}</text>
          </view>
        </block>
      </view>
    </view>

    <view class="cu-bar btn-group" style="margin-top: 30px">
      <button @click="navToLogin" class="cu-btn bg-green shadow-blur round lg">{{ $t('我要登录-EGm') }}</button>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
const constant = context.constant
export default {
  data() {
    return {
      img: '',
      code: ''
    }
  },
  onLoad: function (options) {
    const userImg = uni.getStorageSync('userHeaderImg') || `${this.imgUrl}/h5/images/logo.jpg`
    this.img = userImg
    // #ifdef H5
    if (options.code) {
      this.code = options.code
    }
    // #endif
  },
  methods: {
    navigateBack: function () {
      uni.navigateBack()
    },
    navToLogin: function () {
      let _url = '/pages/login/login'
      if (this.code != '' && this.code != undefined) {
        _url += '?code=' + this.code
      }
      this.vc.navigateTo({
        url: _url
      })
    }
  }
}
</script>

<style>
/**index.wxss**/
.user-container {
  padding: 50rpx 0;
  padding-top: 30%;
  /*border: 1px solid black;*/
}

.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  display: block;
  overflow: hidden;
  border-radius: 50%;
  width: 200rpx;
  height: 200rpx;
}

.userinfo-nickname {
  color: #aaa;
  margin-top: 50px;
}
</style>
