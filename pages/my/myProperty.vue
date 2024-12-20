<template>
  <view>
    <view class="block__title">{{ $t('物业信息-MRd') }}</view>
    <view class="cu-list menu">
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-home text-green"></text>
          <text class="text-grey">{{ $t('小区名称-Z2i') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ communityName }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-service text-green"></text>
          <text class="text-grey">{{ $t('物业名称-biJ') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ property.storeName }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-info text-green"></text>
          <text class="text-grey">{{ $t('物业编号-pPf') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ property.storeId }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-location text-green"></text>
          <text class="text-grey">{{ $t('公司地址-W9R') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ property.address }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-phone text-green"></text>
          <text class="text-grey">{{ $t('联系电话-Gao') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ property.tel }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
import { getCommunityName } from '@/api/community/communityApi.js'
const constant = context.constant
export default {
  data() {
    return {
      property: {},
      communityId: '',
      communityName: ''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _that = this
    context.onLoad(options)
    context.getOwner(function (_ownerInfo) {
      if (_ownerInfo) {
        const _active = _ownerInfo.state == '10000' ? 1 : 2

        _that.communityId = _ownerInfo.communityId
        _that.communityName = getCommunityName()
        _that._loadProperty()
      }
    })
  },
  methods: {
    _loadProperty: function () {
      const _that = this
      context.getProperty().then(function (_property) {
        _that.property = _property
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
  padding: 60rpx 30rpx 20rpx;
}

.button_up_blank {
  height: 40rpx;
}
</style>
