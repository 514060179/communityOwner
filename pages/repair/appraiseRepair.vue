<template>
  <view>
    <view class="content bg-white margin-top">
      <view class="flex solid-bottom justify-start">
        <view class="item-title padding-sm radius">{{ $t('综合评分-rmT') }}</view>
        <view class="item-star padding-sm radius">
          <sx-rate :value="4" :fontSize="fontSize" :value.sync="rateSync1" @change="appraiseScoreChange" />
        </view>
      </view>
      <view class="flex solid-bottom justify-start">
        <view class="item-title padding-sm radius">{{ $t('维修速度-62F') }}</view>
        <view class="item-star padding-sm radius">
          <sx-rate :value="4" :fontSize="fontSize" :value.sync="rateSync2" @change="doorSpeedScoreChange" />
        </view>
      </view>
      <view class="flex solid-bottom justify-start">
        <view class="item-title padding-sm radius">{{ $t('维修员服务-TsJ') }}</view>
        <view class="item-star padding-sm radius">
          <sx-rate :value="4" :fontSize="fontSize" :value.sync="rateSync3" @change="repairmanServiceScoreChange" />
        </view>
      </view>
      <view class="cu-form-group padding align-start">
        <view class="title padding-left-sm">{{ $t('服务评价-cUC') }}</view>
        <textarea maxlength="200" v-model="context" :placeholder="$t('请您填写本次服务感受和评价，以便给大家提供更好的服务品质哦！-T4b')"></textarea>
      </view>

      <view class="flex flex-direction margin">
        <button class="cu-btn bg-green margin-tb-sm lg" @click="submitAppraiseRepair()">{{ $t('评价-ldp') }}</button>
      </view>
    </view>
  </view>
</template>

<script>
import SxRate from '@/components/sx-rate'

import { appraiseRepair } from '../../api/repair/repairApi.js'
// import { getCurOwner } from '../../api/owner/ownerApi.js'
import { getUserId, getUserName } from '../../api/user/userApi.js'
export default {
  data() {
    return {
      fontSize: '60upx',
      rateSync1: 2,
      rateSync2: 2,
      rateSync3: 2,
      animation: true,
      curAppraise: 2,
      curDoorSpeed: 2,
      curRepairmanService: 2,
      context: '',
      repairId: '',
      userId: '',
      userName: ''
    }
  },
  components: {
    SxRate
  },
  onLoad(options) {
    // const _that = this
    const _repairId = options.repairId
    this.repairId = _repairId
    this.userId = getUserId()
    this.userName = getUserName()
    // getCurOwner()
    // .then(function(_owner) {
    // 	_that.userId = _owner.userId;
    // 	_that.userName = _owner.userName;
    // });
  },
  methods: {
    appraiseScoreChange(e) {
      this.curAppraise = e
    },
    doorSpeedScoreChange(e) {
      this.curDoorSpeed = e
    },
    repairmanServiceScoreChange(e) {
      this.curRepairmanService = e
    },
    submitAppraiseRepair: function () {
      if (this.context == '') {
        uni.showToast({
          title: '请填写评价内容',
          icon: 'none'
        })
        return
      }
      if (this.repairId == '') {
        uni.showToast({
          title: '未包含报修信息',
          icon: 'none'
        })
        return
      }

      const _data = {
        appraiseScore: this.curAppraise,
        doorSpeedScore: this.curDoorSpeed,
        repairmanServiceScore: this.curRepairmanService,
        appraiseType: '10001',
        context: this.context,
        appraiseUserId: this.userId,
        appraiseUserName: this.userName,
        objType: '10001',
        objId: this.repairId
      }

      appraiseRepair(_data).then(
        _data => {
          wx.showToast({
            title: this.$t('成功-9ET'),
            icon: 'none',
            duration: 2000
          })
          wx.hideLoading()
          uni.navigateBack({
            delta: 1
          })
        },
        error => {
          wx.showToast({
            title: error,
            icon: 'none',
            duration: 2000
          })
        }
      )
    }
  }
}
</script>

<style>
.content {
  height: 100%;
}
.item-title {
  width: 200rpx;
}
.item-star,
.item-title {
  vertical-align: middle;
  line-height: 100rpx;
}
</style>
