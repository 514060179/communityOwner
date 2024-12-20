<template>
  <view>
    <view class="header_fixed" :style="{ top: headerTop }">
      <scroll-view v-if="rooms.length < 5 && rooms.length > 1" class="bg-white nav">
        <view class="flex text-center">
          <view class="cu-item flex-sub" :class="item.roomId == curRoom.roomId ? 'text-green cur' : ''" v-for="(item, index) in rooms" :key="index" @tap="switchRoom(item)" :data-id="index">
            {{ item.floorNum }}{{ $t('栋-XZF') }}{{ item.roomNum }}{{ $t('室-AtK') }}
          </view>
        </view>
      </scroll-view>
      <scroll-view v-if="rooms.length > 4" scroll-x class="bg-white nav" scroll-with-animation scroll-left="true">
        <view class="cu-item flex-sub" :class="item.roomId == curRoom.roomId ? 'text-green cur' : ''" v-for="(item, index) in rooms" :key="index" @tap="switchRoom(item)" :data-id="index">
          {{ item.floorNum }}{{ $t('栋-XZF') }}{{ item.roomNum }}{{ $t('室-AtK') }}
        </view>
      </scroll-view>
    </view>
    <view v-if="rooms.length == 1" class="block__title">{{ rooms[0].floorNum }}{{ $t('栋-XZF') }}{{ rooms[0].roomNum }}{{ $t('室-AtK') }}</view>
    <view v-if="rooms.length > 1" class="margin-header-top"></view>
    <view v-if="noData == false || moreRooms.length > 0" style="padding-bottom: 200rpx">
      <view class="cu-list menu" v-for="(fee, idx) in moreRooms" :key="idx" :data-item="fee" @click="payFee(fee)">
        <view class="cu-item arrow">
          <view class="content padding-tb-sm">
            <view>
              <view class="text-cut" style="width: 220px">{{ fee.feeName }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-else>
      <no-data-page></no-data-page>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
import noDataPage from '@/components/no-data-page/no-data-page.vue'

import { getRooms } from '../../api/room/roomApi.js'

import { getRoomFees } from '../../api/fee/feeApi.js'
import { autoLogin } from '../../api/user/sessionApi.js'
const constant = context.constant

export default {
  data() {
    return {
      rooms: [],
      couponUsers: [],
      curRoom: {},
      moreRooms: [],
      needFefresh: true,
      noData: false
    }
  },

  components: {
    noDataPage
  },
  computed: {
    headerTop() {
      // #ifdef APP
      return 0
      // #endif
      // #ifdef H5
      return '90rpx'
      // #endif
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    context.onLoad(options)
    autoLogin(options)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const _that = this
    if (!this.needFefresh) {
      this.needFefresh = true
      return
    }
    this.noData = false
    getRooms().then(data => {
      const _rooms = data.rooms
      this.rooms = _rooms
      const _owner = data.owner
      _that.moreRooms = []
      if (_rooms.length == 0) {
        _that.noData = true
        return
      }
      _rooms.forEach(function (_room) {
        _room.communityId = _owner.communityId
        _room.communityName = _owner.communityName
      })
      _that.curRoom = _rooms[0]
      _that._loadRoomFee()
    })
  },
  methods: {
    payFee: function (_item) {
      wx.navigateTo({
        url: '/pages/fee/roomFee?fee=' + JSON.stringify(_item)
      })
    },
    _loadRoomFee: function () {
      const _that = this
      const _room = this.curRoom
      const _objData = {
        page: 1,
        row: 30,
        payerObjId: _room.roomId,
        communityId: _room.communityId,
        state: '2008001'
      }
      _that.moreRooms = []
      getRoomFees(_objData, _room).then(
        moreRooms => {
          _that.moreRooms = moreRooms
          _that.noData = false
        },
        () => {
          _that.noData = true
        }
      )
    },
    payFeeDetail: function (_item) {
      wx.navigateTo({
        url: '/pages/fee/payFeeDetail?fee=' + JSON.stringify(_item)
      })
    },
    switchRoom: function (_room) {
      this.curRoom = _room
      this.noData = false
      this._loadRoomFee()
    }
  }
}
</script>
<style>
.ppfl_footer {
  text-align: right;
}
.ppfl_footer .ppfl_footer_his {
  margin-right: 20rpx;
}

.ppfl_c {
  padding: 0rpx 20rpx 20rpx 20rpx;
}

.block__title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 40rpx 30rpx 20rpx;
}

.ppfl_context {
  padding: 20rpx 40rpx 40rpx 40rpx;
  font-size: 28rpx;
  color: #8a8a8a;
}

.ppfl_context .ppfl_context_row {
  margin-top: 30rpx;
}

.button_up_blank {
  height: 40rpx;
}

.solid-bottom::after {
  border-bottom: 2upx solid rgba(0, 0, 0, 0.1);
}

.solid-top::after {
  border-top: 2upx solid rgba(0, 0, 0, 0.1);
}

.margin-header-top {
  height: 100upx;
}

/*  #ifdef  APP-PLUS || MP-WEIXIN  */
.header_fixed {
  position: fixed;
  top: 0upx;
  left: 0;
  width: 100%;
  z-index: 2;
}

/*  #endif  */
/*  #ifdef  H5  */
/** //top: 80upx; **/
.header_fixed {
  position: fixed;
  top: 0upx;
  left: 0;
  width: 100%;
  z-index: 2;
}

/*  #endif  */
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
</style>
