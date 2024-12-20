<template>
  <view>
    <view class="block__title">{{ $t('保养记录-FZ8') }}</view>
    <view v-if="details.length > 0">
      <view v-for="(item, index) in details" :key="index" class="bg-white margin-bottom margin-right-xs radius margin-left-xs padding">
        <view class="flex padding-bottom-xs solid-bottom justify-between">
          <view>{{ $t('设备名称-1sg') }}</view>
          <view class="text-gray">{{ item.machineName }}</view>
        </view>
        <view class="flex margin-top justify-between">
          <view class="text-gray">{{ $t('计划名称-m4f') }}</view>
          <view class="text-gray">{{ item.planName }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('保养标准-Qj7') }}</view>
          <view class="text-gray">{{ item.standardName }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('保养时间-5zN') }}</view>
          <view class="text-gray">{{ item.inspectionTime }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('保养人-6O2') }}</view>
          <view class="text-gray">{{ item.actUserName }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('保养说明-nNE') }}</view>
          <view class="text-gray">{{ item.description }}</view>
        </view>
      </view>
    </view>
    <view v-else>
      <no-data-page></no-data-page>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
// import { formatDate } from '../../lib/proprietor/utils/DateUtil.js'
import noDataPage from '@/components/no-data-page/no-data-page.vue'

import { getMachineMaintainances } from '@/api/machine/machineApi.js'

const constant = context.constant

const util = context.util
export default {
  data() {
    return {
      details: [],
      machineId: '',
      communityId: '',
      noData: false,
      page: 1
    }
  },
  components: {
    noDataPage
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.machineId = options.machineId
    this.communityId = options.communityId
    this._loadDetail()
  },
  onReachBottom: function () {
    if (this.loadingStatus == 'noMore') {
      return
    }
  },
  methods: {
    _loadDetail: function () {
      this.loadingStatus = 'more'
      const _that = this
      const _objData = getMachineMaintainances({
        page: 1,
        row: 30,
        machineId: this.machineId,
        communityId: this.communityId,
        state: '20200407'
      }).then(_data => {
        _that.details = _data.data
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
