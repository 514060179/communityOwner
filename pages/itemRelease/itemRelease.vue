<template>
  <view>
    <view class="block__title">{{ $t('基础信息-qXj') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('放行类型-RcZ') }}</view>
      <picker id="complaintType" bindchange="PickerChange" :value="typeId" :range-key="'typeName'" :range="itemReleaseTypes" v-if="itemReleaseTypes.length > 0" @change="itemReleaseTypeChange">
        <view class="picker">
          {{ typeIndex == -1 ? $t('请选择-Ah3') : itemReleaseTypes[typeIndex].typeName }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('申请单位-dX8') }}</view>
      <input v-model="applyCompany" :placeholder="$t('请输入申请单位-EBo')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('申请人-QPH') }}</view>
      <input v-model="applyPerson" :placeholder="$t('请输入申请人-K6Z')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('手机号-9dl') }}</view>
      <input v-model="applyTel" :placeholder="$t('请输入手机号-Cdr')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('身份证-4Dk') }}</view>
      <input v-model="idCard" :placeholder="$t('请输入身份证-bqg')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('车牌号-c9W') }}</view>
      <input v-model="carNum" :placeholder="$t('请输入车牌号-4qv')" class="text-right" />
    </view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('通行日期-u2O') }}</view>
      <picker mode="date" :value="bindDate" :start="todayDate" end="2050-09-01" @change="dateChange">
        <view class="picker">
          {{ bindDate || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('通行时间-1Lj') }}</view>
      <picker mode="time" :value="bindTime" :start="todayDateTime" end="22:00" @change="timeChange">
        <view class="picker">
          {{ bindTime || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group margin-top arrow" @tap="_addRes">
      <view class="title">{{ $t('放行物品-Lly') }}</view>
      <view class="arrow" v-if="!resNames || resNames.length < 1">{{ $t('请添加-Wui') }}</view>
      <view class="arrow" v-else>{{ _computeResAmount() }}</view>
    </view>

    <view class="cu-form-group margin-top">
      <textarea v-model="remark" :placeholder="$t('选填,请填写备注-vcp')"></textarea>
    </view>
    <view class="button_up_blank"></view>

    <view class="flex flex-direction">
      <button class="cu-btn bg-green margin-tb-sm lg" @click="submitItemRelease()">{{ $t('提交-4TX') }}</button>
    </view>
  </view>
</template>

<script>
// pages/enterCommunity/enterCommunity.js
// import { checkPhoneNumber, checkStrLength } from '../../lib/proprietor/utils/StringUtil.js'

import { getItemReleaseType, getFirstAuditStaff, saveItemRelease } from '../../api/itemRelease/itemReleaseApi.js'
import { getCurOwner } from '../../api/owner/ownerApi.js'
import context from '../../lib/proprietor/proprietorContext.js'
import { formatDate, formatHourAndMin } from '@/lib/proprietor/utils/DateUtil.js'
const constant = context.constant
const factory = context.factory

export default {
  data() {
    return {
      bindDate: '',
      bindTime: '',
      typeId: '',
      applyCompany: '',
      applyPerson: '',
      idCard: '',
      applyTel: '',
      passTime: '',
      resNames: [],
      state: '',
      carNum: '',
      remark: '',
      itemReleaseTypes: [],
      typeIndex: -1,
      communityId: '',
      todayDate: '',
      todayDateTime: '',
      audit: {
        assignee: '',
        staffId: '',
        staffName: '',
        taskId: ''
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    context.onLoad(options)
    getCurOwner()
      .then(_data => {
        that.userId = _data.userId
        that.applyCompany = _data.appUserName
        that.applyPerson = _data.appUserName
        that.applyTel = _data.link
        that.communityId = _data.communityId
      })
      .then(() => {
        //加载报修类型
        that._loadTypes()
      })
    this.todayDate = formatDate(new Date())
    this.todayDateTime = formatHourAndMin(new Date())
  },
  onShow() {
    const _res = uni.getStorageSync('_tempItemReleaseResource')
    if (_res) {
      this.resNames = _res
    }
  },
  methods: {
    formatter(type, value) {
      if (type === 'year') {
        return `${value}${this.$t('年-DUH')}`
      } else if (type === 'month') {
        return `${value}${this.$t('月-jmQ')}`
      } else if (type === 'day') {
        return `${value}${this.$t('日-74A')}`
      }
      return value
    },
    _computeResAmount: function () {
      let _amount = 0
      this.resNames.forEach(item => {
        _amount += parseInt(item.amount)
      })
      return _amount
    },
    submitItemRelease: function (e) {
      if (!this.audit.assignee || this.audit.assignee == '-2') {
        uni.showToast({
          icon: 'none',
          title: this.$t('审批流程设置错误，手机端提交，第一个审核人必须指定相应的员工-5UN')
        })
        return
      }

      saveItemRelease({
        typeId: this.typeId,
        applyCompany: this.applyCompany,
        applyPerson: this.applyPerson,
        idCard: this.idCard,
        applyTel: this.applyTel,
        resNames: this.resNames,
        carNum: this.carNum,
        remark: this.remark,
        communityId: this.communityId,
        passTime: this.todayDate + ' ' + this.todayDateTime + ':00',
        audit: {
          staffId: this.audit.assignee
        }
      }).then(
        () => {
          uni.removeStorageSync('_tempItemReleaseResource')
          uni.navigateBack()
          // uni.navigateTo({
          // 	url:'/pages/my/my'
          // })
        },
        _err => {
          uni.showToast({
            icon: 'none',
            title: _err
          })
        }
      )
    },
    itemReleaseTypeChange: function (e) {
      const _that = this
      this.typeIndex = e.target.value //取其下标
      const selected = this.itemReleaseTypes[this.typeIndex] //获取选中的数组
      if (selected == undefined) {
        return
      }
      this.typeId = selected.typeId //选中的id
      getFirstAuditStaff({
        communityId: this.communityId,
        flowId: selected.flowId
      }).then(_data => {
        _that.audit.assignee = _data[0].assignee
      })
    },
    dateChange: function (e) {
      this.bindDate = e.detail.value
      if (this.bindDate == formatDate(new Date()).replaceAll('/', '-')) {
        this.todayDateTime = formatHourAndMin(new Date())
      } else {
        this.todayDateTime = '8:30'
      }
    },
    timeChange: function (e) {
      this.bindTime = e.detail.value
    },
    _loadTypes: function () {
      const _that = this
      getItemReleaseType({
        page: 1,
        row: 100,
        communityId: this.communityId
      }).then(_data => {
        _that.itemReleaseTypes = _data
      })
    },
    _addRes: function () {
      uni.navigateTo({
        url: '/pages/itemRelease/addItemReleaseResource'
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
  padding: 40rpx 30rpx 20rpx;
}

.button_up_blank {
  height: 40rpx;
}
</style>
