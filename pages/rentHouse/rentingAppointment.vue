<template>
  <view>
    <view class="block__title">{{ $t('预约信息-2Rb') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('名称-fNz') }}</view>
      <input v-model="userName" :placeholder="$t('必填,请填写名称-B2O')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('性别-psV') }}</view>
      <picker bindchange="PickerChange" :value="index" :range="sexCloums" @change="sexChange">
        <view class="picker">
          {{ sexName || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('电话-gWJ') }}</view>
      <input v-model="tel" style="text-align: right" :placeholder="$t('必填,请填写手机号-VI8')" />
    </view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('预约日期-SSV') }}</view>
      <picker mode="date" :value="bindDate" start="2020-09-01" end="2050-09-01" @change="dateChange">
        <view class="picker">
          {{ bindDate || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('预约时间-FzQ') }}</view>
      <picker mode="time" :value="bindTime" start="08:30" end="22:00" @change="timeChange">
        <view class="picker">
          {{ bindTime || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>

    <view class="button_up_blank"></view>

    <view class="flex flex-direction">
      <button class="cu-btn bg-green margin-tb-sm lg" @click="submitAppointment()">{{ $t('提交-4TX') }}</button>
    </view>
  </view>
</template>

<script>
// import context from '../../lib/proprietor/proprietorContext.js'

import { appointmentRoom } from '../../api/room/roomApi.js'

export default {
  data() {
    return {
      roomId: '',
      userName: '',
      sexCloums: ['男', '女'],
      sexIds: ['0', '1'],
      sex: '',
      tel: '',
      sexName: '',
      bindDate: '',
      bindTime: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    this.vc.onLoad(options)
    this.roomId = options.roomId
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    submitAppointment: function () {
      const _that = this
      //{"appointmentId":"","tenantName":"张默默","tenantSex":"0","tenantTel":"18909711234",
      //"appointmentTime":"2020-09-30 01:05:00","appointmentRoomId":"752020080500600202","remark":""}
      const obj = {
        appointmentId: '',
        appointmentRoomId: this.roomId,
        tenantName: this.userName,
        tenantSex: this.sex,
        tenantTel: this.tel,
        appointmentTime: this.bindDate + ' ' + this.bindTime + ':00'
      }

      appointmentRoom(obj).then(
        res => {
          uni.showToast({
            icon: 'none',
            title: this.$t('预约成功-frr')
          })
          //跳转页面
          _that.vc.navigateBack()
        },
        error => {
          uni.showToast({
            icon: 'none',
            title: error
          })
        }
      )
    },
    sexChange: function (e) {
      const _that = this
      this.sex = this.sexIds[e.detail.value]
      this.sexName = this.sexCloums[e.detail.value]
    },
    dateChange: function (e) {
      this.bindDate = e.detail.value
    },
    timeChange: function (e) {
      this.bindTime = e.detail.value
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
</style>
