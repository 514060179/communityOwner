<template>
  <view>
    <view class="padding margin-top">
      <text>{{ $t('订单信息-43M') }}</text>
    </view>
    <view class="cu-list menu">
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-edit text-green"></text>
          <text class="text-grey">{{ $t('投诉编码-HGS') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ complaint.complaintId }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-ticket text-green"></text>
          <text class="text-grey">{{ $t('房屋编码-I8a') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ complaint.roomName }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-footprint text-green"></text>
          <text class="text-grey">{{ $t('类型-pGB') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ complaint.typeName }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-profile text-green"></text>
          <text class="text-grey">{{ $t('投诉人-iAs') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ complaint.complaintName }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-phone text-green"></text>
          <text class="text-grey">{{ $t('投诉电话-Y5O') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ complaint.tel }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-time text-green"></text>
          <text class="text-grey">{{ $t('投诉时间-k39') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ complaint.createTime }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content padding-tb-sm">
          <view> <text class="cuIcon-comment text-blue margin-right-xs"></text>{{ $t('投诉内容-O2S') }}</view>
          <view class="text-gray text-sm margin-top-sm"> <text class="cuIcon-infofill margin-right-xs"></text>{{ complaint.context }}</view>
        </view>
      </view>

      <view class="cu-item" v-if="complaint.photos && complaint.photos.length > 0">
        <view class="margin-top grid text-center col-3 grid-square">
          <view class="" v-for="(_item, index) in complaint.photos" :key="index">
            <image mode="scaleToFill" :src="`${imgUrl}/hc/${_item.url}`" :data-url="`${imgUrl}/hc/${_item.url}`" @tap="preview(index)"></image>
          </view>
        </view>
      </view>
    </view>

    <view class="cu-timeline margin-top">
      <view class="cu-time">{{ $t('工单-JjJ') }}</view>
      <view class="cu-item" v-for="(item, index) in audits" :key="index">
        <view class="bg-cyan content" v-if="item.eventType == '1000'">
          <text>{{ item.createUserName }} {{ $t('于-2ze') }}</text> {{ item.createTime }} {{ $t('投诉-iDl') }}
        </view>
        <view class="bg-cyan content" v-if="item.eventType == '1001'">
          <text>{{ item.createUserName }} {{ $t('于-2ze') }}</text> {{ item.createTime }}{{ $t('处理-XbG') }}
        </view>
        <view class="bg-cyan content" v-if="item.eventType == '1001'">
          <text>{{ $t('处理意见-TrE') }}：</text> {{ item.remark }}
        </view>
        <view class="bg-cyan content" v-if="item.eventType == '2002'">
          <text>{{ item.createUserName }} {{ $t('于-2ze') }}</text> {{ item.createTime }}{{ $t('评价-ldp') }}
        </view>
        <view class="bg-cyan content" v-if="item.eventType == '2002'">
          <text>{{ $t('评价内容-63K') }}：</text> {{ item.remark }}
        </view>
        <view class="bg-cyan content" v-if="item.eventType == '3003'">
          <text>{{ item.createUserName }} {{ $t('于-2ze') }}</text> {{ item.createTime }}{{ $t('回复-11D') }}
        </view>
        <view class="bg-cyan content" v-if="item.eventType == '3003'">
          <text>{{ $t('回复内容-vJ8') }}：</text> {{ item.remark }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
import config from '../../conf/config.js'
import { getComplaints, getComplaintEvent } from '@/api/community/complaintApi.js'
const constant = context.constant
export default {
  data() {
    return {
      complaintId: '',
      communityId: '',
      complaint: {},
      audits: [],
      photoUrl: config.commonBaseUrl + '/callComponent/download/getFile/file'
    }
  },
  onLoad(options) {
    const _complaintId = options.complaintId
    this.complaintId = _complaintId
    this.communityId = options.communityId
    this._loadCompaint()
    this._listWorkflowAuditInfo()
  },
  methods: {
    /**
     * 加载我的报修
     */
    _loadCompaint: function (_active) {
      const that = this
      getComplaints({
        complaintId: that.complaintId,
        page: 1,
        row: 1,
        communityId: that.communityId
      }).then(_data => {
        const _ownerComplaints = _data.data
        that.complaint = _ownerComplaints[0]
      })
    },
    _listWorkflowAuditInfo: function (_active) {
      const _that = this
      getComplaintEvent({
        complaintId: _that.complaintId,
        page: 1,
        row: 100,
        communityId: _that.communityId
      }).then(_data => {
        _that.audits = _data.data
      })
    },
    preview: function (index) {
      const urls = []
      this.complaint.photos.forEach(item => {
        urls.push(`${this.imgUrl}/hc/${item.url}`)
      })
      uni.previewImage({
        current: index,
        urls: urls
      })
    }
  }
}
</script>

<style></style>
