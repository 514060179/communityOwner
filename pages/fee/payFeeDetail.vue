<template>
  <view>
    <view class="block__title">{{ $t('缴费历史-6CU') }}</view>
    <view v-if="noData == false">
      <view v-for="(item, index) in feeDetails" :key="index" class="bg-white margin-bottom margin-right-xs radius margin-left-xs padding">
        <view class="flex padding-bottom-xs solid-bottom justify-between">
          <view>{{ $t('缴费金额-QOt') }}</view>
          <view class="text-gray">MOP {{ item.receivedAmount }}</view>
        </view>
        <view class="flex margin-top justify-between">
          <view class="text-gray">{{ $t('费用名称-v4e') }}</view>
          <view class="text-gray">{{ item.feeName }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('缴费编码-2Bm') }}</view>
          <view class="text-gray">{{ item.detailId }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('缴费周期-lKg') }}</view>
          <view class="text-gray">{{ item.cycles }}{{ $t('个月-6bu') }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('起始时间-wKY') }}</view>
          <view class="text-gray">{{ item.startTime }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('结束时间-3Q1') }}</view>
          <view class="text-gray">{{ item.endTime }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('缴费时间-DPI') }}</view>
          <view class="text-gray">{{ item.createTime }}</view>
        </view>
        <view class="flex margin-top-xs justify-between" v-if="item.preDegrees">
          <view class="text-gray">{{ $t('上期度数-gBe') }}</view>
          <view class="text-gray">{{ item.preDegrees }}</view>
        </view>
        <view class="flex margin-top-xs justify-between" v-if="item.curDegrees">
          <view class="text-gray">{{ $t('本期度数-iMK') }}</view>
          <view class="text-gray">{{ item.curDegrees }}</view>
        </view>
        <view class="flex margin-top-xs justify-between" v-if="item.preDegrees">
          <view class="text-gray">{{ $t('使用量-yit') }}</view>
          <view class="text-gray">{{ item.curDegrees - item.preDegrees }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('备注-8l8') }}</view>
          <view class="text-gray">{{ item.remark }}</view>
        </view>
        <view class="flex margin-top-xs justify-between" v-if="item.openInvoice == 'D'">
          <view class="text-gray"></view>
          <view
class="text-gray"
            ><button class="cu-btn sm line-blue" @click="_applyInvoice(item)">{{ $t('申请开票-yeq') }}</button></view
          >
        </view>
      </view>
      <uni-load-more
        :status="loadingStatus"
        :content-text="{
          contentdown: $t('上拉加载更多-sqA'),
          contentrefresh: $t('加载中-BUD'),
          contentnomore: $t('没有更多-iHG')
        }"
      />
    </view>
    <view v-else>
      <no-data-page></no-data-page>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
import { formatDate } from '../../lib/proprietor/utils/DateUtil.js'
import noDataPage from '@/components/no-data-page/no-data-page.vue'
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'

const constant = context.constant

const util = context.util
export default {
  data() {
    return {
      feeDetails: [],
      ownerId: '',
      communityId: '',
      noData: false,
      page: 1,
      loadingStatus: 'loading'
    }
  },
  components: {
    noDataPage,
    uniLoadMore
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    context.onLoad(options)
    const _that = this
    context.getOwner(function (_owner) {
      _that.ownerId = _owner.memberId
      _that.communityId = _owner.communityId
      _that._loadFeeDetail()
    })
  },
  onReachBottom: function () {
    if (this.loadingStatus == 'noMore') {
      return
    }
    this._loadFeeDetail()
  },
  methods: {
    _loadFeeDetail: function () {
      this.loadingStatus = 'more'
      const _that = this
      const _objData = {
        page: _that.page,
        row: 10,
        ownerId: this.ownerId,
        communityId: this.communityId
      }
      context.request({
        url: constant.url.queryFeeDetail,
        header: context.getHeaders(),
        method: 'GET',
        data: _objData, //动态数据
        success: function (res) {
          if (res.statusCode == 200) {
            //成功情况下跳转
            let _feeDetails = res.data.feeDetails
            if (_feeDetails == null || _feeDetails == undefined) {
              _feeDetails = []
            } else {
              _feeDetails.forEach(function (_feeDetail) {
                const _tmpCreateTime = _feeDetail.createTime.replace(/\-/g, '/')
                const _createTime = new Date(_tmpCreateTime)
                _feeDetail.createTime = formatDate(_createTime)
                if (_feeDetail.hasOwnProperty('startTime')) {
                  const _tmpStartTime = _feeDetail.startTime.replace(/\-/g, '/')
                  const _startTime = new Date(_tmpStartTime)
                  _feeDetail.startTime = formatDate(_startTime)
                }

                if (_feeDetail.hasOwnProperty('endTime')) {
                  const _tmpEndTime = _feeDetail.endTime.replace(/\-/g, '/')
                  const _endTime = new Date(_tmpEndTime)
                  _feeDetail.endTime = formatDate(_endTime)
                }
              })
            }
            _that.feeDetails = _that.feeDetails.concat(_feeDetails)
            _that.page++

            if (_that.feeDetails.length < 1) {
              _that.noData = true
            }
            if (_that.feeDetails.length == res.data.total) {
              _that.loadingStatus = 'noMore'
              return
            }
          }
        },
        fail: function (e) {
          wx.showToast({
            title: this.$t('服务器异常了-eja'),
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    _applyInvoice: function (_feeDetail) {
      uni.navigateTo({
        url: '/pages/invoice/addInvoiceApply?detailId=' + _feeDetail.detailId + '&feeId=' + _feeDetail.feeId
      })
    }
  }
}
</script>

<style>
.solid-bottom::after {
  border-bottom: 2upx solid rgba(0, 0, 0, 0.1);
}

.ppf_item {
  padding: 0rpx 0rpx 0rpx 0rpx;
}

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
</style>
