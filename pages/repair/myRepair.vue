<template>
  <view>
    <scroll-view scroll-x class="bg-white nav">
      <view class="flex text-center">
        <view class="cu-item flex-sub" :class="active == 0 ? 'text-green cur' : ''" @tap="tabSelect(0)"> {{ $t('待处理-rWT') }} </view>
        <view class="cu-item flex-sub" :class="active == 1 ? 'text-green cur' : ''" @tap="tabSelect(1)"> {{ $t('处理中-KF1') }} </view>
        <view class="cu-item flex-sub" :class="active == 2 ? 'text-green cur' : ''" @tap="tabSelect(2)"> {{ $t('完成-64y') }} </view>
      </view>
    </scroll-view>

    <view v-if="active == 0" class="ppfl_c">
      <view v-if="noData == false">
        <view v-for="(item, index) in waitRepair" :key="index" class="bg-white margin-top margin-right-xs radius margin-left-xs padding">
          <view class="flex padding-bottom-xs solid-bottom justify-between">
            <view>{{ item.repairId }}</view>
            <view class="text-gray">{{ item.tel }}</view>
          </view>
          <view class="flex margin-top justify-between">
            <view class="text-gray">{{ $t('报修类型-qnU') }}</view>
            <view class="text-gray">{{ item.repairTypeName }}</view>
          </view>
          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('报修人-1iu') }}</view>
            <view class="text-gray">{{ item.repairName }}</view>
          </view>
          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('位置-J8c') }}</view>
            <view class="text-gray">{{ item.repairObjName }}</view>
          </view>
          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('预约时间-FzQ') }}</view>
            <view class="text-gray">{{ item.appointmentTime }}</view>
          </view>
          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('状态-NXA') }}</view>
            <view class="text-gray">{{ item.stateName }}</view>
          </view>
          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('报修内容-Jl2') }}</view>
            <view class="text-gray">{{ item.context }}</view>
          </view>
          <view class="solid-top flex justify-end margin-top padding-top-sm">
            <button class="cu-btn sm line-gray" @click="repairDetail(item)">{{ $t('详情-6NZ') }}</button>
            <button class="cu-btn sm bg-red margin-left" @click="deleteRepair(item)">{{ $t('删除-ILp') }}</button>
          </view>
        </view>
      </view>
      <view v-else>
        <no-data-page></no-data-page>
      </view>
    </view>

    <view v-if="active == 1" class="ppfl_c">
      <view v-if="noData == false">
        <view v-for="(item, index) in doingRepair" :key="index" class="bg-white margin-top margin-right-xs radius margin-left-xs padding">
          <view class="flex padding-bottom-xs solid-bottom justify-between">
            <view>{{ item.repairId }}</view>
            <view class="text-gray">{{ item.tel }}</view>
          </view>
          <view class="flex margin-top justify-between">
            <view class="text-gray">{{ $t('报修类型-qnU') }}</view>
            <view class="text-gray">{{ item.repairTypeName }}</view>
          </view>
          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('报修人-1iu') }}</view>
            <view class="text-gray">{{ item.repairName }}</view>
          </view>
          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('位置-J8c') }}</view>
            <view class="text-gray">{{ item.repairObjName }}</view>
          </view>
          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('预约时间-FzQ') }}</view>
            <view class="text-gray">{{ item.appointmentTime }}</view>
          </view>
          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('状态-NXA') }}</view>
            <view class="text-gray">{{ item.stateName }}</view>
          </view>
          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('报修内容-Jl2') }}</view>
            <view class="text-gray">{{ item.context }}</view>
          </view>
          <view class="solid-top flex justify-end margin-top padding-top-sm">
            <button class="cu-btn sm line-gray" @click="repairDetail(item)">{{ $t('详情-6NZ') }}</button>
          </view>
        </view>
      </view>
      <view v-else>
        <no-data-page></no-data-page>
      </view>
    </view>

    <view v-if="active == 2" class="ppfl_c">
      <view v-if="noData == false">
        <view v-for="(item, index) in repaired" :key="index" class="bg-white margin-top margin-right-xs radius margin-left-xs padding">
          <view class="flex padding-bottom-xs solid-bottom justify-between">
            <view>{{ item.repairId }}</view>
            <view class="text-gray">{{ item.tel }}</view>
          </view>
          <view class="flex margin-top justify-between">
            <view class="text-gray">{{ $t('报修类型-qnU') }}</view>
            <view class="text-gray">{{ item.repairTypeName }}</view>
          </view>
          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('报修人-1iu') }}</view>
            <view class="text-gray">{{ item.repairName }}</view>
          </view>
          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('位置-J8c') }}</view>
            <view class="text-gray">{{ item.repairObjName }}</view>
          </view>
          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('预约时间-FzQ') }}</view>
            <view class="text-gray">{{ item.appointmentTime }}</view>
          </view>
          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('状态-NXA') }}</view>
            <view class="text-gray">{{ item.stateName }}</view>
          </view>

          <view class="flex margin-top-xs justify-between">
            <view class="text-gray">{{ $t('报修内容-Jl2') }}</view>
            <view class="text-gray">{{ item.context }}</view>
          </view>
          <view class="solid-top flex justify-end margin-top padding-top-sm">
            <button class="cu-btn sm line-gray" @click="repairDetail(item)">{{ $t('详情-6NZ') }}</button>
            <button v-if="item.state == '1400'" class="cu-btn sm bg-green margin-left" @click="_toPay(item)">{{ $t('支付-lt5') }}</button>
            <button v-if="item.state == '1700'" class="cu-btn sm bg-green margin-left" @click="_appraiseRepair(item)">{{ $t('评价-ldp') }}</button>
            <button v-if="item.state == '1700' || item.state == '1400'" class="cu-btn sm bg-red margin-left" @click="_backRepair(item)">{{ $t('退回-mCq') }}</button>
          </view>
        </view>
      </view>
      <view v-else>
        <no-data-page></no-data-page>
      </view>
    </view>

    <view class="cu-modal" :class="deleteRepairModal == true ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{ $t('温馨提示-Tfh') }}</view>
          <view class="action" @tap="_cancleDeleteRepair()">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl"> {{ $t('您确认删除当前订单-j4b') }} </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action margin-0 flex-sub solid-left" @tap="_cancleDeleteRepair()">{{ $t('取消-KvD') }}</view>
          <view class="action margin-0 flex-sub text-green solid-left" @tap="_doDeleteRepair()">{{ $t('删除-ILp') }}</view>
        </view>
      </view>
    </view>

    <view class="cu-modal" :class="backRepairModal == true ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{ $t('退单原因-C7z') }}</view>
          <view class="action" @tap="_cancleBackRepair()">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="cu-form-group">
          <textarea v-model="context" maxlength="50" :placeholder="$t('请输入退单原因-vTw')" />
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action margin-0 flex-sub solid-left" @tap="_cancleBackRepair()">{{ $t('取消-KvD') }}</view>
          <view class="action margin-0 flex-sub text-green solid-left" @tap="_doBackRepair()">{{ $t('确认-Hp3') }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import noDataPage from '@/components/no-data-page/no-data-page.vue'
import context from '../../lib/proprietor/proprietorContext.js'
import { listRepairStaffs } from '@/api/repair/repairApi.js'
import { getUserId } from '../../api/user/userApi.js'
// const factory = context.factory
const constant = context.constant
export default {
  data() {
    return {
      active: 0,
      userId: '',
      roomId: '',
      communityId: '',
      waitRepair: [],
      doingRepair: [],
      repaired: [],
      deleteRepairModal: false,
      backRepairModal: false,
      curRepair: {},
      noData: false,
      preStaffId: '',
      preStaffName: '',
      context: ''
    }
  },
  components: {
    noDataPage
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    context.onLoad(options)
    this.userId = getUserId()
    if (options.activeTab) that.active = options.activeTab
    context.getOwner(res => {
      that.communityId = res.communityId
      that._loadRepair(that.active)
    })
  },

  onShow: function () {
    if (this.userId && this.communityId) {
      this._loadRepair(this.active)
    }
  },
  methods: {
    /**
     * 加载我的报修
     */
    _loadRepair: function (_active) {
      const that = this

      let _url = ''
      let _states = ''
      _url = constant.url.listStaffFinishRepairs
      if (_active == 0) {
        _states = '1000'
      } else if (_active == 1) {
        _url = constant.url.listStaffFinishRepairs
        _states = '1100,1200,1300'
      } else {
        _url = constant.url.listStaffFinishRepairs
        _states = '1400,1500,1700,1800,1900,2000'
      }

      const _paramIn = {
        communityId: that.communityId,
        page: 1,
        row: 10,
        userId: that.userId,
        repairStates: _states
      }
      context.request({
        url: _url,
        header: context.getHeaders(),
        method: 'GET',
        data: _paramIn,
        success: function (res) {
          const _json = res.data
          if (_json.code == 0) {
            const _ownerRepairs = _json.data
            console.log('_ownerRepairs', _ownerRepairs)
            if (_ownerRepairs.length < 1) {
              that.noData = true
            } else {
              that.noData = false
            }
            if (_active == 0) {
              that.waitRepair = _ownerRepairs
            } else if (_active == 1) {
              that.doingRepair = _ownerRepairs
            } else {
              that.repaired = _ownerRepairs
            }
            return
          }

          wx.showToast({
            title: this.$t('查询报修单失败-7BN'),
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
    },
    onChange: function (e) {
      console.log(e)

      this._loadRepair(e.detail.index)
    },
    tabSelect: function (_active) {
      this.active = _active
      this._loadRepair(_active)
    },
    repairDetail: function (_repair) {
      context.navigateTo({
        url: '/pages/repair/repairDetail?repairId=' + _repair.repairId
      })
    },
    deleteRepair: function (_repair) {
      this.curRepair = _repair
      this.deleteRepairModal = true
    },
    _cancleDeleteRepair: function () {
      this.deleteRepairModal = false
    },
    _doDeleteRepair: function () {
      const that = this
      context.request({
        url: constant.url.deleteOwnerRepair,
        header: context.getHeaders(),
        method: 'POST',
        data: this.curRepair,
        //动态数据
        success: function (res) {
          console.log(res) //成功情况下跳转
          if (res.data.code != 0) {
            uni.showToast({
              icon: 'none',
              title: res.data.msg,
              duration: 2000
            })
            return
          }
          uni.showToast({
            icon: 'none',
            title: this.$t('处理成功-VfN'),
            duration: 2000
          })
          that._cancleDeleteRepair()
          that._loadRepair(0)
        },
        fail: function (e) {
          console.log(e)
          wx.showToast({
            title: this.$t('服务器异常了-eja'),
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    _backRepair: function (_repair) {
      //查询 上一任处理人
      const _communityInfo = context.getCurrentCommunity()
      const _that = this
      const dataObj = {
        page: 1,
        row: 1,
        communityId: _communityInfo.communityId,
        repairId: _repair.repairId,
        staffId: this.userId
        //state: '10001'
      }
      listRepairStaffs(dataObj).then(_json => {
        if (_json.code == 0) {
          const _data = _json.data

          if (_data.length < 1) {
            uni.showToast({
              title: this.$t('当前不能退单-6xr')
            })
            return
          }
          _that.preStaffId = _data[0].preStaffId
          _that.preStaffName = _data[0].preStaffName
          _that.curRepair = _repair
          _that.backRepairModal = true
        }
      })
    },
    _cancleBackRepair: function () {
      this.backRepairModal = false
    },
    _doBackRepair: function () {
      const that = this
      if (this.context == '') {
        uni.showToast({
          title: this.$t('退单内容不能为空-EKJ'),
          icon: 'none'
        })
        return
      }
      const _communityInfo = context.getCurrentCommunity()
      const _data = {
        staffId: this.userId,
        staffName: this.preStaffName,
        context: this.context,
        action: 'BACK',
        repairId: this.curRepair.repairId,
        communityId: _communityInfo.communityId
      }
      context.request({
        url: constant.url.repairDispatch,
        header: context.getHeaders(),
        method: 'POST',
        data: _data,
        //动态数据
        success: function (res) {
          console.log(res) //成功情况下跳转
          if (res.data.code != 0) {
            uni.showToast({
              icon: 'none',
              title: res.data.msg,
              duration: 2000
            })
            return
          }
          uni.showToast({
            icon: 'none',
            title: this.$t('处理成功-VfN'),
            duration: 2000
          })
          that._cancleBackRepair()
          that._loadRepair(0)
        },
        fail: function (e) {
          console.log(e)
          wx.showToast({
            title: this.$t('服务器异常了-eja'),
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    _appraiseRepair: function (_repair) {
      context.navigateTo({
        url: '/pages/repair/appraiseRepair?repairId=' + _repair.repairId
      })
    },
    _toPay: function (_item) {
      console.log(_item)
      context.navigateTo({
        url:
          '/pages/fee/repairPay?repairId=' +
          _item.repairId +
          '&communityId=' +
          _item.communityId +
          '&userId=' +
          this.userId +
          '&repairObjId=' +
          _item.repairObjId +
          '&appointmentTime=' +
          _item.appointmentTime +
          '&repairTypeName=' +
          _item.repairTypeName +
          '&repairObjName=' +
          _item.repairObjName +
          '&repairName=' +
          _item.repairName +
          '&context=' +
          _item.context
      })
    }
  }
}
</script>

<style>
.solid-bottom::after {
  border-bottom: 2upx solid rgba(0, 0, 0, 0.1);
}
</style>
