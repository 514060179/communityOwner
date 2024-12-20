<template>
  <view>
    <view class="cu-list menu margin-top">
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-time text-green"></text>
          <text class="text-grey">{{ $t('申请房间-JVZ') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ recordInfo.roomName }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-footprint text-green"></text>
          <text class="text-grey">{{ $t('跟踪备注-mdP') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ recordList.length > 0 ? recordList[0].remark : '' }}</text>
        </view>
      </view>
      <view v-if="imgRecordList.length > 0">
        <view class="block__title">{{ $t('图片-jg9') }}</view>
        <view class="record-img-item" v-for="(item, index) in imgRecordList" :key="index">
          <image :src="item.url" :data-url="item.url" :data-index="index" @tap="preview" mode="widthFix"></image>
        </view>
      </view>
      <view v-if="videoRecordList.length > 0">
        <view class="block__title">{{ $t('视频-mOu') }}</view>
        <view v-for="(item, index) in videoRecordList" :key="index">
          <video class="record-video" object-fit="contain" :src="item.url" controls></video>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { queryRoomRenovationRecordDetail } from '../../api/roomRenovation/roomRenovationApi.js'
import conf from '../../conf/config.js'
export default {
  data() {
    return {
      recordInfo: {},
      recordList: [],
      commonBaseUrl: '',
      imgRecordList: [],
      videoRecordList: []
    }
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _that = this
    _that.recordInfo = JSON.parse(options.apply)
    _that.commonBaseUrl = conf.commonBaseUrl
    this.loadRecordDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  methods: {
    /**
     * 加载数据
     */
    loadRecordDetail: function () {
      const _that = this
      const _objData = {
        page: 1,
        row: 10,
        communityId: this.recordInfo.communityId,
        recordId: this.recordInfo.recordId,
        roomName: this.recordInfo.roomName,
        roomId: this.recordInfo.roomId
      }
      queryRoomRenovationRecordDetail(_objData).then(function (res) {
        _that.recordList = res
        res.forEach(item => {
          if (item.relTypeCd == 19000) {
            _that.imgRecordList.push(item)
          } else if (item.relTypeCd == 21000) {
            _that.videoRecordList.push(item)
          }
        })
      })
    },
    preview: function (e) {
      const index = e.target.dataset.index
      const urls = []
      this.imgRecordList.forEach(item => {
        urls.push(item.url)
      })
      uni.previewImage({
        current: index,
        urls: urls
      })
    }
  }
}
</script>

<style>
uni-video,
.record-video {
  width: 100%;
}
.block__title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 40rpx 30rpx 20rpx;
}
.record-img-item {
  display: inline-block;
  margin: 0 20upx;
}
.record-img-item image {
  width: 200upx;
  border-radius: 15upx;
}
</style>
