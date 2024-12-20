<template>
  <view>
    <view class="cu-list menu margin-top">
      <block v-if="pageSign == 'myAssets'">
        <view class="cu-item arrow" @click="viewOwner()">
          <view class="content">
            <text class="cuIcon-profile text-pink"></text>
            <text class="text-grey">{{ $t('业主信息-PQ8') }}</text>
          </view>
        </view>
        <view class="cu-item arrow" @click="myHouse()">
          <view class="content">
            <text class="cuIcon-home text-blue"></text>
            <text class="text-grey">{{ $t('我的房屋-hAO') }}</text>
          </view>
        </view>
        <view class="cu-item arrow" @click="myProperty()">
          <view class="content">
            <text class="cuIcon-service text-red"></text>
            <text class="text-grey">{{ $t('我的物业-sLp') }}</text>
          </view>
        </view>
      </block>
      <block v-if="pageSign == 'myServices'">
        <view class="cu-item arrow" @click="feeDetail()">
          <view class="content">
            <text class="cuIcon-card text-pink"></text>
            <text class="text-grey">{{ $t('缴费历史-6CU') }}</text>
          </view>
        </view>
        <view class="cu-item arrow" @click="applyRoomDetail()">
          <view class="content">
            <text class="cuIcon-square text-pink"></text>
            <text class="text-grey">{{ $t('空置房申请历史-oTF') }}</text>
          </view>
        </view>
        <view class="cu-item arrow" @click="myComplaint()">
          <view class="content">
            <text class="cuIcon-form text-green"></text>
            <text class="text-grey">{{ $t('我的投诉单-o2a') }}</text>
          </view>
        </view>
        <view class="cu-item arrow" @click="myRepair()">
          <view class="content">
            <text class="cuIcon-repairfill text-orange"></text>
            <text class="text-grey">{{ $t('我的报修单-MVe') }}</text>
          </view>
        </view>
        <view class="cu-item arrow" @click="_machineTranslate()">
          <view class="content">
            <text class="cuIcon-formfill text-orange"></text>
            <text class="text-grey">{{ $t('门禁同步日志-qvS') }}</text>
          </view>
        </view>
        <view class="cu-item arrow" @click="myRenovation()">
          <view class="content">
            <text class="cuIcon-paintfill text-green"></text>
            <text class="text-grey">{{ $t('房屋装修-qul') }}</text>
          </view>
        </view>
        <view class="cu-item arrow" @click="myParking()">
          <view class="content">
            <text class="cuIcon-taxi text-orange"></text>
            <text class="text-grey">{{ $t('车位申请进度-IT4') }}</text>
          </view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
/** index.js **/
// import context from '../../lib/proprietor/proprietorContext.js'
import { getCurCommunity } from '../../api/community/communityApi.js'
import { setStorageSync } from '../../lib/proprietor/utils/StorageUtil.js'
import mapping from '../../constant/MappingConstant.js'
export default {
  data() {
    return {
      pageSign: ''
    }
  },

  components: {},
  props: {},
  onLoad: function (options) {
    this.pageSign = options.pageSign
  },
  onShow: function () {},
  methods: {
    viewOwner: function () {
      this.vc.navigateTo({
        url: '../viewBindOwner/viewBindOwner'
      })
    },
    myProperty: function () {
      this.vc.navigateTo({
        url: '../my/myProperty'
      })
    },

    myComplaint: function () {
      this.vc.navigateTo({
        url: '/pages/complaint/complaintList'
      })
    },
    myRenovation: function () {
      this.vc.navigateTo({
        url: '../renovation/myRoomList'
      })
    },
    myHouse: function () {
      this.vc.navigateTo({
        url: '../my/myHouse'
      })
    },
    myRepair: function () {
      this.vc.navigateTo({
        url: '/pages/repair/myRepair'
      })
    },
    feeDetail: function () {
      this.vc.navigateTo({
        url: '/pages/fee/payFeeDetail'
      })
    },
    applyRoomDetail: function () {
      this.vc.navigateTo({
        url: '/pages/applyRoom/myRoomList'
      })
    },
    myParking: function () {
      this.vc.navigateTo({
        url: '/pages/applyparking/parkingInfo'
      })
    },
    _machineTranslate: function () {
      this.vc.navigateTo({
        url: '/pages/machine/machineTranslateLog'
      })
    },
    mallOrder: function () {
      const that = this
      let _communityId = ''
      getCurCommunity().then(res => {
        _communityId = res.communityId
        const _url = '/pages/myOrder/myOrder?hcCommunityId=' + _communityId + '&mallFrom=HC'
        setStorageSync(mapping.HC_MALL_CUR_URL, _url)
        uni.navigateTo({
          url: '/pages/hcWebView/hcWebView'
        })
      })
    },
    housekeepingOrder: function () {
      const that = this
      let _communityId = ''
      getCurCommunity().then(res => {
        _communityId = res.communityId
        const _url = '/pages/homemaking/order?hcCommunityId=' + _communityId + '&mallFrom=HC'
        setStorageSync(mapping.HC_MALL_CUR_URL, _url)
        uni.navigateTo({
          url: '/pages/hcWebView/hcWebView'
        })
      })
    }
  }
}
</script>
<style>
@import './my.css';

.header-img {
  width: 200upx;
  height: 200upx;
}
</style>
