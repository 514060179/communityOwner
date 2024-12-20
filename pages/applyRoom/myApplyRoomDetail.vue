<template>
  <view>
    <view class="cu-form-group" @click="showRecord()">
      <view class="title">{{ $t('跟踪记录-URo') }}</view>
      {{ $t('点击查看-OYN') }}>
    </view>
    <view class="block__title">{{ $t('用户信息-iSa') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('名称-fNz') }}</view>
      {{ applyDetail.createUserName }}
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('联系方式-k8c') }}</view>
      {{ applyDetail.createUserTel }}
    </view>

    <view class="block__title">{{ $t('房屋信息-lT7') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('房屋号-tJ5') }}</view>
      {{ applyDetail.roomName }}
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('开始时间-Uv9') }}</view>
      {{ applyDetail.startTime }}
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('结束时间-3Q1') }}</view>
      {{ applyDetail.endTime }}
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('当前进度-MD3') }}</view>
      {{ applyDetail.stateName }}
    </view>
    <uploadImageAsync v-if="applyDetail.urls.length > 0" ref="vcUploadRef" :maxPhotoNum="maxPhotoNum" :sendImgList="sendImgList" :canEdit="canEdit" :title="$t('图片材料-HZy')" />

    <view class="button_up_blank"></view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
import { queryApplyRoomDiscount } from '../../api/applyRoom/applyRoomApi.js'
import uploadImageAsync from '../../components/vc-upload-async/vc-upload-async.vue'
const factory = context.factory
export default {
  data() {
    return {
      applyDetail: {},
      maxPhotoNum: 4,
      sendImgList: [],
      canEdit: false
    }
  },

  components: {
    uploadImageAsync
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _that = this
    context.onLoad(options)

    const params = {
      communityId: options.communityId,
      page: 1,
      row: 1,
      ardId: options.ardId
    }
    queryApplyRoomDiscount(params).then(function (_res) {
      _that.applyDetail = _res.data[0]
      _that.sendImgList = _res.data[0].urls
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    /**
     * 查看跟踪记录
     */
    showRecord: function () {
      const apply = {
        communityId: this.applyDetail.communityId,
        roomName: this.applyDetail.roomName,
        roomId: this.applyDetail.roomId,
        ardId: this.applyDetail.ardId
      }
      uni.navigateTo({
        url: '/pages/applyRoom/myApplyRoomRecord?apply=' + JSON.stringify(apply)
      })
    }
  }
}
</script>

<style>
.block__title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 40rpx 30rpx 20rpx;
}

.button_up_blank {
  height: 40rpx;
}

.block__bottom {
  height: 180rpx;
}

.btn-box {
  padding: 30rpx 0;
}
.btn-sub {
  width: 80%;
  margin: 0 auto;
  background-color: #1f8dee !important;
  color: #fff !important;
}
</style>
