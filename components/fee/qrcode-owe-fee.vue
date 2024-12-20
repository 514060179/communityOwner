<template>
  <view>
    <scroll-view scroll-y style="padding-bottom: 200rpx" v-if="customFee == 'ON'">
      <checkbox-group class="block" @change="checkboxChange($event)">
        <block v-if="item.payOnline == 'Y'">
          <view class="cu-list menu" v-for="(item, index) in fees" :key="index" :data-item="item">
            <view class="cu-item">
              <view class="content padding-tb-sm flex justify-start">
                <view>
                  <checkbox :class="item.selected == '1' ? 'checked' : ''" :checked="item.selected == '1' ? true : false" :value="item.feeId"> </checkbox>
                </view>
                <view class="margin-left-sm" @click="_showDetailFee(item)">
                  <view class="flex justify-start">
                    <view class="text-cut" style="width: 150px">
                      {{ item.feeName }}
                      <text v-if="item.payerObjName">({{ item.payerObjName }})</text>
                    </view>
                  </view>
                  <view class="text-gray text-sm">
                    <text class="margin-right-xs">{{ item.endTime }}至{{ _getDeadlineTime(item) }}</text>
                  </view>
                </view>
              </view>
              <view class="action" @click="_showDetailFee(item)">
                <text class="text-grey text-sm">{{ $t('应缴-Fz5') }}: MOP{{ item.feeTotalPrice }}</text>
              </view>
            </view>
            <view class="sub-info flex justify-start flex-wrap" v-if="item.showDetail">
              <view class="sub-info-item text-gray text-sm" v-if="item.preDegrees">
                <text class="margin-right-xs">{{ $t('上期读数-1R3') }}:{{ item.preDegrees }}</text>
              </view>
              <view class="sub-info-item text-gray text-sm" v-if="item.preDegrees">
                <text class="margin-right-xs">{{ $t('上期读表时间-a7W') }}:{{ _getReadTime(item.preReadingTime) }}</text>
              </view>
              <view class="sub-info-item text-gray text-sm" v-if="item.curDegrees">
                <text class="margin-right-xs">{{ $t('本期读数-Exk') }}:{{ item.curDegrees }}</text>
              </view>
              <view class="sub-info-item text-gray text-sm" v-if="item.preDegrees">
                <text class="margin-right-xs">{{ $t('本期读表时间-4Gl') }}:{{ _getReadTime(item.curReadingTime) }}</text>
              </view>
              <view class="sub-info-item text-gray text-sm" v-if="item.curDegrees">
                <text class="margin-right-xs">{{ $t('使用量-yit') }}:{{ item.curDegrees - item.preDegrees }}</text>
              </view>
              <view class="sub-info-item text-gray text-sm" v-if="item.ownerName">
                <text class="margin-right-xs">{{ $t('业主-FFN') }}:{{ item.ownerName }}</text>
              </view>
              <view class="sub-info-item text-gray text-sm">
                <text class="margin-right-xs">{{ $t('单价-V1f') }}:{{ item.mwPrice && item.mwPrice > 0 ? item.mwPrice : item.squarePrice }}/{{ item.additionalAmount }}</text>
              </view>
              <view class="sub-info-item text-gray text-sm" v-if="item.payerObjName">
                <text class="margin-right-xs">{{ $t('房号-FWp') }}:{{ item.payerObjName }}</text>
              </view>
            </view>
          </view>
        </block>
      </checkbox-group>
    </scroll-view>
    <scroll-view scroll-y style="padding-bottom: 200rpx" v-else>
      <block v-if="item.payOnline == 'Y'">
        <view class="cu-list menu" v-for="(item, index) in fees" :key="index" :data-item="item">
          <view class="cu-item" @click="_showDetailFee(item)">
            <view class="content padding-tb-sm">
              <view class="flex justify-start">
                <view class="text-cut" style="width: 150px">
                  {{ item.feeName }}<text v-if="item.payerObjName">({{ item.payerObjName }})</text>
                </view>
              </view>
              <view class="text-gray text-sm">
                <text class="margin-right-xs">{{ item.endTime }}{{ $t('至-hYF') }}{{ _getDeadlineTime(item) }}</text>
              </view>
            </view>
            <view class="action">
              <text class="text-grey text-sm">{{ $t('应缴-Fz5') }}: MOP{{ item.feeTotalPrice }}</text>
            </view>
          </view>
          <view class="sub-info flex justify-start flex-wrap" v-if="item.showDetail">
            <view class="sub-info-item text-gray text-sm" v-if="item.preDegrees">
              <text class="margin-right-xs">{{ $t('上期读数-1R3') }}:{{ item.preDegrees }}</text>
            </view>
            <view class="sub-info-item text-gray text-sm" v-if="item.preDegrees">
              <text class="margin-right-xs">{{ $t('上期读表时间-a7W') }}:{{ _getReadTime(item.preReadingTime) }}</text>
            </view>
            <view class="sub-info-item text-gray text-sm" v-if="item.curDegrees">
              <text class="margin-right-xs">{{ $t('本期读数-Exk') }}:{{ item.curDegrees }}</text>
            </view>
            <view class="sub-info-item text-gray text-sm" v-if="item.preDegrees">
              <text class="margin-right-xs">{{ $t('本期读表时间-4Gl') }}:{{ _getReadTime(item.curReadingTime) }}</text>
            </view>
            <view class="sub-info-item text-gray text-sm" v-if="item.curDegrees">
              <text class="margin-right-xs">{{ $t('使用量-yit') }}:{{ item.curDegrees - item.preDegrees }}</text>
            </view>
            <view class="sub-info-item text-gray text-sm" v-if="item.payerObjName">
              <text class="margin-right-xs">{{ $t('房号-FWp') }}:{{ item.payerObjName }}</text>
            </view>
            <view class="sub-info-item text-gray text-sm" v-if="item.ownerName">
              <text class="margin-right-xs">{{ $t('业主-FFN') }}:{{ item.ownerName }}</text>
            </view>
            <view class="sub-info-item text-gray text-sm">
              <text class="margin-right-xs">{{ $t('单价-V1f') }}:{{ item.mwPrice && item.mwPrice > 0 ? item.mwPrice : item.squarePrice }}/{{ item.additionalAmount }}</text>
            </view>
          </view>
        </view>
      </block>
    </scroll-view>
    <view v-if="fees.length > 0" class="bg-white border flex justify-end" style="position: fixed; width: 100%; bottom: 0">
      <view class="action text-orange margin-right line-height"> {{ $t('合计-87u') }}: MOP{{ receivableAmount }} </view>
      <view class="btn-group">
        <button class="cu-btn bg-red shadow-blur lgplus sharp" @click="onPayFee()">{{ $t('缴费-OKv') }}</button>
      </view>
    </view>

    <view v-if="!fees || fees.length < 1">
      <no-data-page></no-data-page>
    </view>
  </view>
</template>

<script>
import { getQrcodeOweFees } from '@/api/fee/qrCodePayFee.js'
import { dateSubOneDay, getDate, formatDate } from '../../lib/proprietor/utils/DateUtil.js'
import noDataPage from '@/components/no-data-page/no-data-page.vue'
export default {
  name: 'QrcodeOweFee',
  components: { noDataPage },
  data() {
    return {
      fees: [],
      ownerId: '',
      roomId: '',
      communityId: '',
      storeId: '',
      receivableAmount: 0,
      customFee: 'OFF',
      createStaffId: '',
      feeType: 'OWNER',
      feeIds: []
    }
  },
  methods: {
    _loadFees(_param) {
      this.ownerId = _param.ownerId
      this.communityId = _param.communityId
      this.customFee = _param.customFee
      this.createStaffId = _param.createStaffId
      this.roomId = _param.roomId
      this.feeType = _param.feeType
      const _that = this
      _that.feeIds = []
      getQrcodeOweFees(this, {
        ownerId: this.ownerId,
        communityId: this.communityId
      })
        .then(_data => {
          let _fees = []
          if (_that.feeType == 'ROOM' && _that.roomId) {
            _data.data.forEach(item => {
              if (item.payerObjId == _that.roomId) {
                _fees.push(item)
              }
            })
          } else {
            _fees = _data.data
          }
          _that.fees = _fees
          if (_data.data && _data.data.length > 0) {
            _that.storeId = _data.data[0].incomeObjId
          }
          return _fees
        })
        .then(function (_fees) {
          _fees.forEach(function (_item) {
            if (_item.payOnline == 'Y') {
              _item.selected = '1'
              _that.feeIds.push(_item.feeId)
            }
          })
          _that.computeAmount()
        })
    },
    onPayFee: function () {
      if (!this.feeIds || this.feeIds.length < 1) {
        uni.showToast({
          icon: 'none',
          title: this.$t('未选择费用-P7G')
        })
        return
      }
      const _objData = {
        business: 'oweFee',
        communityId: this.communityId,
        ownerId: this.ownerId,
        feeName: '物业费',
        receivedAmount: this.receivableAmount,
        storeId: this.storeId,
        feeIds: this.feeIds
      }

      uni.setStorageSync('doing_cashier', _objData)
      uni.navigateTo({
        url: '/pages/fee/cashier?money=' + this.receivableAmount + '&business=oweFee&communityId=' + this.communityId + '&cashierUserId=' + this.createStaffId
      })
    },
    computeAmount: function () {
      const _that = this
      const _fees = this.fees
      const _feeIds = this.feeIds
      let _receivableAmount = 0.0
      _fees.forEach(_item => {
        _feeIds.forEach(_feeId => {
          if (_item.feeId == _feeId) {
            _receivableAmount += parseFloat(_item.feeTotalPrice)
          }
        })
      })
      _that.receivableAmount = _receivableAmount.toFixed(2)
    },

    checkboxChange: function (e) {
      const _that = this
      this.feeIds = e.detail.value
      _that.fees.forEach(function (_item) {
        _item.selected = '0'
        _that.feeIds.forEach(_feeId => {
          if (_item.feeId == _feeId) {
            _item.selected = '1'
          }
        })
      })
      this.computeAmount()
    },
    _getDeadlineTime: function (_fee) {
      //todo 处理周期性费用和间接费用的结束时间
      return dateSubOneDay(_fee.startTime, _fee.deadlineTime, _fee.feeFlag)
    },
    _getReadTime: function (_value) {
      const _date = getDate(_value)
      return formatDate(_date)
    },
    _showDetailFee: function (_fee) {
      const _fees = this.fees

      _fees.forEach(item => {
        //item.showDetail = false;
        if (_fee.feeId == item.feeId) {
          item.showDetail = !item.showDetail
        }
      })
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss">
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

.fee-last {
  margin-bottom: 200upx;
}

.cu-btn.lgplus {
  padding: 0 20px;
  font-size: 18px;
  height: 100upx;
}

.cu-btn.sharp {
  border-radius: 0upx;
}

.line-height {
  line-height: 100upx;
}

.uni-checkbox-input {
}
.sub-info {
  background-color: #fff;
  //margin-top: 0.5upx;
  padding: 15upx;
  .sub-info-item {
    width: 45%;
    margin: 10upx 15upx 0upx 15upx;
  }
}
</style>
