<template>
  <view class="">
    <view class="flex justify-between mtc-machine">
      <view>{{ machineName }}({{ machineCode }})</view>
      <view>{{ $t('插槽数-dhZ') }}:{{ portCount }}</view>
    </view>
    <view class="flex justify-start mtc-machine-port">
      <view v-for="(item, index) in ports" :key="index" class="port-item">
        <view class="item-1" :class="{ 'item-1-active': curPort.portId == item.portId || item.state == 'WORKING' }" @click="_switchPort(item)">
          <view class="port-name">
            {{ item.portName }}
          </view>
          <view class="port-state">({{ item.stateName }})</view>
        </view>
      </view>
    </view>
    <view class="mtc-hours-title">
      <view>{{ $t('充电时长-3NJ') }}</view>
    </view>
    <view class="flex justify-start mtc-machine-hours">
      <view v-for="(item, index) in hours" :key="index" class="hours-item">
        <view class="item-1" :class="{ 'item-1-active': curHours.duration == item.duration }" @click="_switchHours(item)">
          <view class="port-name">
            {{ item.name }}
          </view>
        </view>
      </view>
    </view>

    <view class="cu-list menu margin-sm" @click="_selectCoupons" v-if="curHours.duration && curPort.portId">
      <view class="cu-item arrow">
        <view class="content padding-tb-sm">
          <view>
            <view class="text-cut" style="width: 220px">{{ $t('使用充电劵抵扣-Fy8') }}</view>
          </view>
        </view>
        <view v-if="couponCount == 0">{{ $t('请选择-Ah3') }}</view>
        <view v-else>{{ couponCount }}{{ $t('张-Cp7') }}</view>
      </view>
    </view>
    <view class="margin-sm" v-show="login">
      <account ref="accRef"></account>
    </view>
    <view class="margin-sm" v-show="login">
      <charge ref="chargeRef"></charge>
    </view>

    <view class="plat-btn-black"></view>
    <view class="cu-bar btn-group" style="margin-top: 30px" v-if="login">
      <button @click="_toCharge" :disabled="!curHours.duration || !curPort.portId" class="cu-btn bg-green shadow-blur round lg">{{ $t('去充电-gdZ') }}</button>
    </view>
    <view class="cu-bar btn-group" style="margin-top: 30px" v-else>
      <button @click="_toLogin" class="cu-btn bg-green shadow-blur round lg">{{ $t('请先登录-SCz') }}</button>
    </view>
  </view>
</template>

<script>
import { getChargeMachines, getChargeMachinePort } from '../../api/machine/machineApi.js'
import context from '../../lib/proprietor/proprietorContext.js'
import account from '@/components/account/account.vue'
import charge from '@/components/charge/charge.vue'
import { autoLogin } from '@/api/user/sessionApi.js'
export default {
  data() {
    return {
      machineId: '',
      communityId: '',
      machineCode: '',
      machineName: '',
      portCount: '',
      durationPrice: '',
      ports: [],
      curPort: {},
      curHours: {},
      couponList: [],
      couponCount: 0,
      login: false
    }
  },
  components: {
    charge,
    account
  },
  onLoad(options) {
    context.onLoad(options)
    autoLogin(options)
    this.machineId = options.machineId
    this.communityId = options.communityId

    this._loadChargeMachines()
    this._loadChargeMachinePorts()
    const _that = this
    setTimeout(function () {
      _that.login = context.checkLoginStatus()
      _that.$refs.accRef.loadOwnerAccount(_that.communityId)
      _that.$refs.chargeRef.loadChargeMonthOrder(_that.communityId)
    }, 1000)
  },
  onShow: function (options) {
    this._dealChargeCoupons()

    if (this.$refs.accRef) {
      this.$refs.accRef.loadOwnerAccount(this.communityId)
    }
    if (this.$refs.chargeRef) {
      this.$refs.chargeRef.loadChargeMonthOrder(this.communityId)
    }
  },
  computed: {
    hours() {
      return [
        {
          name: this.$t('充满自停-RNt'),
          duration: 999
        },
        {
          name: '2' + this.$t('小时-DBA'),
          duration: 2
        },
        {
          name: '4' + this.$t('小时-DBA'),
          duration: 4
        },
        {
          name: '6' + this.$t('小时-DBA'),
          duration: 6
        },
        {
          name: '8' + this.$t('小时-DBA'),
          duration: 8
        },
        {
          name: '10' + this.$t('小时-DBA'),
          duration: 10
        }
      ]
    }
  },
  methods: {
    _loadChargeMachines: function () {
      const _that = this
      getChargeMachines({
        page: 1,
        row: 1,
        machineId: this.machineId,
        communityId: this.communityId
      }).then(_data => {
        //_that.machines = _data.data;
        _that.machineCode = _data.data[0].machineCode
        _that.machineName = _data.data[0].machineName
        _that.portCount = _data.data[0].portCount
        _that.durationPrice = _data.data[0].durationPrice
      })
    },
    _loadChargeMachinePorts: function () {
      const _that = this
      getChargeMachinePort({
        page: 1,
        row: 100,
        machineId: this.machineId,
        communityId: this.communityId
      }).then(_data => {
        _that.ports = _data.data
      })
    },
    _toCharge: function () {
      uni.navigateTo({
        url:
          '/pages/machine/chargeConfirm?machineId=' +
          this.machineId +
          '&communityId=' +
          this.communityId +
          '&portId=' +
          this.curPort.portId +
          '&duration=' +
          this.curHours.duration +
          '&couponIds=' +
          this.couponList.join(',')
      })
    },

    _switchPort: function (_port) {
      if (_port.state != 'FREE') {
        return
      }
      this.curPort = _port
    },
    _switchHours: function (_hours) {
      this.curHours = _hours
    },
    _selectCoupons: function (_item) {
      const _that = this
      uni.navigateTo({
        url: '/pages/coupon/chargeCoupon'
      })
    },

    _dealChargeCoupons: function () {
      const chargeCoupons = uni.getStorageSync('COUPON_USER_CHARGE')
      if (!chargeCoupons) {
        return
      }
      uni.removeStorageSync('COUPON_USER_CHARGE')
      this.couponList = chargeCoupons
      this.couponCount = chargeCoupons.length
    },
    _toLogin: function () {
      if (this.communityId) {
        uni.setStorageSync('DEFAULT_COMMUNITY_ID', this.communityId)
      }
      uni.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
}
</script>

<style lang="scss">
.mtc-machine {
  background-color: #fff;
  font-size: 28upx;
  color: #000;
  padding-left: 20upx;
  padding-right: 20upx;
  margin: 20upx 20upx 0upx 20upx;
  border-top-left-radius: 20upx;
  border-top-right-radius: 20upx;
  height: 60upx;
  line-height: 60upx;
  border-bottom: 2upx;
}
.mtc-machine-port {
  background-color: #fff;
  padding-left: 20upx;
  padding-right: 20upx;
  padding-bottom: 20upx;
  margin: 2upx 20upx 0upx 20upx;

  flex-wrap: wrap;
  .port-item {
    width: 33.33%;
    text-align: center;
    .item-1 {
      background-color: #b1e8da;
      width: 90%;
      margin: 0upx auto;
      margin-top: 20upx;
      border-radius: 10upx;
      color: #fff;
      .port-name {
        font-size: 28upx;
      }
      .port-state {
        font-size: 24upx;
      }
    }
    .item-1-active {
      background-color: #0fba82;
    }
  }
}

.mtc-hours-title {
  background-color: #fff;
  font-size: 28upx;
  color: #000;
  padding-left: 20upx;
  padding-right: 20upx;
  margin: 20upx 20upx 0upx 20upx;
  border-top-left-radius: 20upx;
  border-top-right-radius: 20upx;
  height: 60upx;
  line-height: 60upx;
  border-bottom: 2upx;
}
.mtc-machine-hours {
  background-color: #fff;
  padding-left: 20upx;
  padding-right: 20upx;
  padding-bottom: 20upx;
  margin: 2upx 20upx 0upx 20upx;

  flex-wrap: wrap;

  .hours-item {
    width: 33.33%;
    text-align: center;
    .item-1 {
      border: 1px solid #000;
      width: 90%;
      margin: 0upx auto;
      margin-top: 20upx;
      border-radius: 10upx;
      color: #000;
      .port-name {
        font-size: 28upx;
      }
    }
    .item-1-active {
      border: 1px solid #0fba82;
      background-color: #0fba82;
      color: #fff;
    }
  }
}
</style>
