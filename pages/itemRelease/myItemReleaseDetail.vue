<template>
  <view>
    <view class="block__title">{{ $t('基础信息-qXj') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('放行类型-RcZ') }}</view>
      <view>{{ order.typeName }}</view>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('申请单位-dX8') }}</view>
      <view>{{ order.applyCompany }}</view>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('申请人-QPH') }}</view>
      <view>{{ order.applyPerson }}</view>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('手机号-9dl') }}</view>
      <view>{{ order.applyTel }}</view>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('身份证-4Dk') }}</view>
      <view>{{ order.idCard }}</view>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('车牌号-c9W') }}</view>
      <view>{{ order.carNum }}</view>
    </view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('通行时间-1Lj') }}</view>
      <view>{{ order.passTime }}</view>
    </view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('备注-8l8') }}</view>
      <view>{{ order.remark }}</view>
    </view>

    <view class="block__title">{{ $t('物品信息-aCn') }}</view>
    <view class="cu-form-group arrow" v-for="(item, index) in resNames" :key="index">
      <view class="title">{{ item.resName }}</view>
      <view class="">{{ item.amount }}</view>
    </view>

    <view class="block__title">{{ $t('审批流程-h3b') }}</view>
    <view class="cu-form-group arrow" v-for="(item, index) in comments" :key="index">
      <view class="title">{{ item.staffName }}</view>
      <view class="">
        <text v-if="item.endTime">{{ $t('处理完成-IIv') }}</text>
        <text v-else>{{ $t('正在处理-HJF') }}</text>
        <text v-if="item.context">({{ item.context }})</text>
      </view>
    </view>

    <view class="button_up_blank"></view>
  </view>
</template>

<script>
import { getMyItemRelease, getItemReleaseRes, queryOaWorkflowUser } from '../../api/itemRelease/itemReleaseApi.js'
import { getCommunityId } from '@/api/community/communityApi.js'
export default {
  data() {
    return {
      order: {},
      resNames: [],
      irId: '',
      comments: []
    }
  },
  onLoad(options) {
    this.irId = options.irId
    this._loadDetail()
    this._loadDetailResNames()
  },
  methods: {
    _loadDetail: function () {
      const _that = this
      getMyItemRelease({
        page: 1,
        row: 1,
        irId: this.irId,
        communityId: getCommunityId()
      }).then(_data => {
        _that.order = _data[0]
        _that._loadComment()
      })
    },
    _loadDetailResNames: function () {
      const _that = this
      getItemReleaseRes({
        page: 1,
        row: 100,
        irId: this.irId,
        communityId: getCommunityId()
      }).then(_data => {
        _that.resNames = _data
      })
    },
    _loadComment: function () {
      const _that = this
      queryOaWorkflowUser({
        page: 1,
        row: 100,
        id: this.irId,
        communityId: getCommunityId(),
        flowId: this.order.flowId
      }).then(_data => {
        _that.comments = _data
      })
    }
  }
}
</script>

<style lang="scss">
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
</style>
