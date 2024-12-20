<template>
  <view>
    <view class="cu-timeline">
      <view class="cu-time">{{ $t('工单-JjJ') }}</view>
      <view class="cu-item" v-for="(item, index) in staffs" :key="index">
        <view class="content primary-color">
          <text>{{ item.startTime }} </text> {{ $t('到达-8xK') }} {{ item.staffName }} {{ $t('工位-iQq') }}
        </view>
        <view class="content primary-color" v-if="item.endTime != undefined">
          <text>{{ item.endTime }} </text> {{ $t('处理完成-IIv') }}
        </view>
        <view class="content primary-color" v-if="item.endTime != undefined">
          <text>{{ $t('处理意见-TrE') }}：</text> {{ item.context }}
          <block v-if="item.state == '12000' && item.payTypeName != undefined"> ({{ item.payTypeName }}) </block>
        </view>
        <!-- 待支付状态 - 详情描述 -->
        <view class="content primary-color" v-if="item.state == '10009'">
          <text>{{ $t('处理意见-TrE') }}：</text> {{ item.context }}
          <block v-if="item.payTypeName != undefined">({{ item.payTypeName }})</block>
        </view>
        <view class="content primary-color" v-if="item.photoVos.length > 0 && item.state == 10005">
          <view class="repair-img-item" v-for="(pic, index2) in item.photoVos" :key="index2">
            <image :src="pic.url" @tap="preview(index, index2)" mode="widthFix" />
          </view>
        </view>
      </view>
    </view>
    <!-- <viewImage ref="viewImageRef"></viewImage> -->
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
import conf from '../../conf/config.js'
import { listRepairStaffs } from '@/api/repair/repairApi.js'
// const constant = context.constant
// const factory = context.factory

export default {
  data() {
    return {
      viewImage: false,
      viewImageSrc: '',
      staffs: [],
      repairId: '',
      communityId: '',
      imgUrlPre: '',
      photoUrl: conf.commonBaseUrl + '/hc/'
    }
  },
  components: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    context.onLoad(options)
    this.repairId = options.repairId
    this.communityId = context.getCurrentCommunity().communityId
    this.imgUrlPre = conf.commonBaseUrl

    //加载报修类型
    this._loadRepairStaffs()
  },
  methods: {
    _loadRepairStaffs: function () {
      const _communityInfo = context.getCurrentCommunity()
      const _that = this
      const dataObj = {
        page: 1,
        row: 50,
        communityId: _communityInfo.communityId,
        repairId: this.repairId
      }

      listRepairStaffs(dataObj).then(_json => {
        if (_json.code == 0) {
          _that.staffs = _json.data
          _that.staffs.forEach(item => {
            if (item.photoVos.length > 0 && item.state == 10005) {
              item.photoVos.forEach(img => {
                img.url = this.photoUrl + img.url
              })
            }
          })
        }
      })
    },
    preview: function (recordIndex, imgIndex) {
      const urls = []
      this.staffs[recordIndex].photoVos.forEach(item => {
        urls.push(item.url)
      })
      uni.previewImage({
        current: imgIndex,
        urls: urls
      })
    }
  }
}
</script>
<style scoped>
.repair-img-item {
  display: inline-block;
  margin: 0 20upx;
}
.repair-img-item image {
  width: 200upx;
  border-radius: 15upx;
}
.primary-color {
  color: #c21da0 !important;
}
</style>
