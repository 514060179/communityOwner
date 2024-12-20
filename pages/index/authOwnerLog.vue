<template>
  <view>
    <view class="block__title">{{ $t('房屋认证-3rd') }}</view>
    <view v-if="appUsers && appUsers.length > 0">
      <view v-for="(item, index) in appUsers" :key="index" class="bg-white margin-bottom margin-right-xs radius margin-left-xs padding padding-bottom-xs">
        <view class="flex padding-bottom-xs solid-bottom justify-between">
          <view>{{ item.roomName || '-' }}</view>
          <view class="text-red" v-if="item.state == '10000'">{{ $t('审核中-6wR') }}</view>
          <view class="text-red" v-else-if="item.state == '12000'">{{ $t('认证完成-D1G') }}</view>
          <view class="text-red" v-else-if="item.state == '13000'">{{ $t('认证失败-NR6') }}</view>
          <view class="text-red" v-else>{{ $t('未知状态-llZ') }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('审核说明-nuJ') }}</view>
          <view class="text-gray">{{ item.remark || $t('无-SU3') }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('人员名称-cEO') }}</view>
          <view class="text-gray">{{ item.appUserName }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('人员类型-A9o') }}</view>
          <view class="text-gray" v-if="item.ownerTypeCd == '1001'">{{ $t('业主-FFN') }}</view>
          <view class="text-gray" v-else-if="item.ownerTypeCd == '1002'">{{ $t('家庭成员-gHw') }}</view>
          <view class="text-gray" v-else-if="item.ownerTypeCd == '1003'">{{ $t('租客-w3O') }}</view>
          <view class="text-gray" v-else>{{ $t('其他-IFU') }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('手机号-9dl') }}</view>
          <view class="text-gray">{{ item.link }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('申请时间-gCI') }}</view>
          <view class="text-gray">{{ item.createTime }}</view>
        </view>
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('小区-Gal') }}</view>
          <view class="text-gray">{{ item.communityName }}</view>
        </view>
        <view class="flex margin-top-xs justify-between" v-if="item.state == '10000'">
          <view class="text-gray"></view>
          <view class="text-gray">
            <button class="cu-btn bg-red margin-tb-sm sm" @click="_deleteAuthOwner(item)">{{ $t('删除认证-j6P') }}</button>
          </view>
        </view>
      </view>
    </view>
    <view class="text-center to-auth">
      <button class="cu-btn bg-primary margin-tb-sm lg" @click="_toAuthOwner()">{{ $t('去认证-A1u') }}</button>
    </view>
  </view>
</template>

<script>
import { queryAuthOwnerLog, deleteAuthOwner } from '../../api/owner/ownerApi.js'
export default {
  data() {
    return {
      appUsers: [{}]
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadAppUser()
  },
  methods: {
    _loadAppUser: function () {
      const _that = this
      queryAuthOwnerLog({
        page: 1,
        row: 30
      }).then(_data => {
        _that.appUsers = _data.data
      })
    },
    _toAuthOwner: function () {
      uni.navigateTo({
        url: '/pages/index/authOwner'
      })
    },
    _deleteAuthOwner: function (_app) {
      const _that = this
      deleteAuthOwner({
        appUserId: _app.appUserId
      }).then(_data => {
        _that._loadAppUser()
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
.to-auth {
  margin-top: 20upx;
}
</style>
