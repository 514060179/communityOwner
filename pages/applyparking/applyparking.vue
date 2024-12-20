<template>
  <view>
    <view class="cu-form-group">
      <view class="title">{{ $t('车牌号-c9W') }}</view>
      <input v-model="carNum" style="text-align: right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('品牌-emU') }}</view>
      <input v-model="carBrand" style="text-align: right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('颜色-NwI') }}</view>
      <input v-model="carColor" style="text-align: right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('车辆类型-JAd') }}</view>
      <picker bindchange="PickerChange" :value="0" :range="carTypes" @change="chooseCarTypes">
        <view class="picker">
          {{ carTypeName ? carTypeName : $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('起租日期-yrZ') }}</view>
      <picker mode="date" :value="startDate" @change="startDateChange">
        <view class="picker">
          {{ startDate || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('结组日期-YwC') }}</view>
      <picker mode="date" :value="endDate" @change="endDateChange">
        <view class="picker">
          {{ endDate || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group align-start">
      <view class="title">{{ $t('备注信息-Xfk') }}</view>
      <textarea maxlength="-1" v-model="remark" :placeholder="$t('请输入备注信息-xFr')"></textarea>
    </view>
    <view class="button_up_blank"></view>
    <view class="flex flex-direction">
      <button @click="submitApply()" class="cu-btn bg-green margin-tb-sm lg">{{ $t('提交-4TX') }}</button>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
const constant = context.constant
// import {getCurCommunity} from '../../api/community/communityApi.js'

// import {getProperty} from '../../api/property/propertyApi.js';

export default {
  data() {
    return {
      carNum: '',
      carBrand: '',
      carColor: '',
      remark: '',
      psId: '',
      startDate: '',
      endDate: '',
      ownerId: '',
      storeId: '',
      userId: '',
      applyPersonName: '',
      applyPersonLink: '',
      applyPersonId: '',
      parkingSpaces: [],
      parkingSpaceIds: [],
      parkingSpacesName: '',
      carTypeCodes: ['9901', '9902', '9903'],
      carTypeCode: '',
      carTypeName: '',

      page: 1,
      row: 20
    }
  },
  onLoad: function (options) {
    const _this = this
    context.getOwner(function (_owner) {
      console.log('_owner', _owner)
      _this.communityId = _owner.communityId
      _this.ownerId = _owner.memberId
      _this.userId = _owner.ownerId
      _this.applyPersonName = _owner.ownerName
      _this.applyPersonLink = _owner.ownerTel
      _this.applyPersonId = _owner.memberId
      _this.listParkingSpace()
    })
  },
  computed: {
    //车辆类型
    carTypes() {
      return [this.$t('家用小汽车-48O'), this.$t('客车-ha7'), this.$t('货车-FRY')]
    }
  },
  methods: {
    listParkingSpace: function () {
      context.request({
        url: constant.url.queryParkingSpaces,
        header: context.getHeaders(),
        method: 'GET',
        data: {
          page: this.page,
          row: this.row,
          communityId: this.communityId,
          state: 'F'
        },
        success: res => {
          const arr = res.data.parkingSpaces
          arr && arr.map(item => {
            this.parkingSpaces.push(item.areaNum + '停车场  ' + item.num + '车位')
            this.parkingSpaceIds.push(item.psId)
          })
        },
        fail(res) {
          wx.showToast({
            title: this.$t('服务器异常了-eja'),
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    choosePickerSpace: function (e) {
      const checkInIndex = e.target.value
      this.psId = this.parkingSpaceIds[checkInIndex]
      this.parkingSpacesName = this.parkingSpaces[checkInIndex]
    },
    endDateChange: function (e) {
      this.endDate = e.detail.value
    },
    //车辆类型
    chooseCarTypes: function (e) {
      const index = e.target.value
      this.carTypeCode = this.carTypeCodes[index]
      this.carTypeName = this.carTypes[index]
    },

    startDateChange: function (e) {
      this.startDate = e.detail.value
    },
    submitApply: function () {
      const obj = {
        carNum: this.carNum,
        carBrand: this.carBrand,
        carColor: this.carColor,
        remark: this.remark,
        startTime: this.startDate,
        endTime: this.endDate,
        carType: this.carTypeCode,
        communityId: this.communityId,
        ownerId: this.ownerId,
        state: '1001',
        applyPersonName: this.applyPersonName,
        applyPersonLink: this.applyPersonLink,
        applyPersonId: this.applyPersonId,
        userId: this.userId
      }
      console.log(obj)
      let msg = ''

      if (obj.carNum == '') {
        msg = this.$t('请填写车牌号-OHk')
      } else if (obj.carBrand == '') {
        msg = this.$t('请填写车辆品牌-EdP')
      } else if (obj.carColor == '') {
        msg = this.$t('请填写车辆颜色-WaM')
      } else if (obj.carType == '') {
        msg = this.$t('请选择车辆类型-8mR')
      }
      if (obj.startTime == '2020-01-01') {
        msg = this.$t('请选择起租日期-dDA')
      }
      if (obj.endTime == '2020-01-01') {
        msg = this.$t('请选择结租日期-TW1')
      }
      if (msg != '') {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
        return
      }
      context.request({
        url: constant.url.saveOwnerCar,
        header: context.getHeaders(),
        method: 'POST',
        data: obj,
        success: function (res) {
          const _json = res.data
          if (_json.code == 0) {
            wx.redirectTo({
              url: '/pages/applyparking/parkingInfo'
            })
            return
          }
          wx.showToast({
            title: this.$t('服务器异常了-eja'),
            icon: 'none',
            duration: 2000
          })
        },
        fail: function (e) {
          wx.showToast({
            title: this.$t('服务器异常了-eja'),
            icon: 'none',
            duration: 2000
          })
        }
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
