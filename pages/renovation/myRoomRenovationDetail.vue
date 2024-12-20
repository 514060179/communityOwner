<template>
  <view>
    <view class="cu-form-group" @click="showRenovationRecord()">
      <view class="title">{{ $t('装修跟踪记录-LN8') }}</view>
      {{ $t('点击查看-OYN') }}>
    </view>
    <view class="block__title">{{ $t('用户信息-iSa') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('名称-fNz') }}</view>
      {{ renovationDetail.personName }}
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('联系方式-k8c') }}</view>
      {{ renovationDetail.personTel }}
    </view>

    <view class="block__title">{{ $t('房屋信息-lT7') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('房屋号-tJ5') }}</view>
      {{ renovationDetail.roomName }}
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('开始时间-Uv9') }}</view>
      {{ renovationDetail.startTime }}
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('结束时间-3Q1') }}</view>
      {{ renovationDetail.endTime }}
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('当前进度-MD3') }}</view>
      {{ renovationDetail.stateName }}
    </view>
    <view class="btn-box" v-if="renovationDetail.state == 3000">
      <button type="default" class="btn-sub" @click="renovationComplete()">{{ $t('装修完成-WCh') }}</button>
    </view>

    <view class="button_up_blank"></view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
// import {compareDate} from '../../lib/proprietor/utils/DateUtil.js'
import { updateRoomRenovationState } from '../../api/roomRenovation/roomRenovationApi.js'
const factory = context.factory
export default {
  data() {
    return {
      renovationDetail: {}
    }
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _that = this
    context.onLoad(options)
    _that.renovationDetail = JSON.parse(options.room)
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
    // 装修完成
    renovationComplete: function () {
      const _that = this
      uni.showModal({
        title: this.$t('提示-zJS'),
        content: this.$t('确定完成房屋装修-ZjL'),
        success: function (res) {
          if (res.confirm) {
            const params = _that.renovationDetail
            updateRoomRenovationState(params).then(function (_res) {
              uni.showToast({
                title: this.$t('操作成功-Fwp')
              })
              setTimeout(function () {
                uni.navigateBack({})
              }, 1000)
            })
          } else if (res.cancel) {
            // do nothing
          }
        }
      })
    },

    /**
     * 查看跟踪记录
     */
    showRenovationRecord: function () {
      uni.navigateTo({
        url: '/pages/renovation/myRoomRenovationRecord?apply=' + JSON.stringify(this.renovationDetail)
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
