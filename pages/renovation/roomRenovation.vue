<template>
  <view class="tab-container bg-white">
    <view class="cu-list menu">
      <block v-if="rooms.length > 0">
        <view class="cu-item arrow" v-for="(item, key) in rooms" :key="key" :data-item="item" @click="toApplyDetail(item)">
          <view class="content padding-tb-sm">
            <view>
              <text class="cuIcon-homefill text-green margin-right-xs"></text>
              {{ item.floorNum }}{{ $t('号楼-G4C') }}{{ item.unitNum }}{{ $t('单元-7xd') }}{{ item.roomNum }}{{ $t('室-AtK') }}
            </view>
            <view class="text-gray text-sm"> <text class="cuIcon-right margin-right-xs"></text> {{ item.roomId }}</view>
          </view>
          <view class="action"> </view>
        </view>
      </block>
      <view class="cu-item" v-if="rooms.length === 0">
        <view class="content">
          <text class="cuIcon-warn text-green"></text>
          <text class="text-grey">{{ $t('暂无房屋信息-TZP') }}</text>
        </view>
        <view class="action"> </view>
      </view>
    </view>
    <!-- <instructions4use @disagree="_disagree"></instructions4use> -->
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
// import instructions4use from '@/components/instructions4use/instructions4use.vue'

import { getRooms } from '../../api/room/roomApi.js'

export default {
  data() {
    return {
      rooms: [],
      curRoom: {},
      moreRooms: []
    }
  },

  components: {
    // instructions4use
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    context.onLoad(options)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const _that = this
    getRooms().then(data => {
      const _rooms = data.rooms
      this.rooms = _rooms
      const _owner = data.owner
      _that.moreRooms = []
      if (_rooms.length == 0) {
        return
      }
      _rooms.forEach(function (_room) {
        _room.communityId = _owner.communityId
        _room.communityName = _owner.communityName
      })
      _that.curRoom = _rooms[0]
    })
  },
  methods: {
    toApplyDetail: function (_item) {
      this.vc.navigateTo({
        url: '/pages/renovation/roomRenovationDetail?room=' + JSON.stringify(_item)
      })
    }

    // _disagree: function(){
    // 	uni.switchTab({
    // 		url: '/pages/index/index'
    // 	})
    // }
  }
}
</script>

<style>
.tab-container {
  /*border: 1px solid black;*/

  margin-top: 30rpx;
}
.tab-item {
  padding: 20rpx 30rpx;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.tab-item-hover {
  background-color: #e6e6e6;
}
.tab-icon {
  width: 30rpx;
  height: 30rpx;
}
.tab-text {
  display: inline-block;
  margin-left: 10rpx;
  color: #1e1e1e;
}
.tab-arrow {
  display: inline-block;
  width: 20rpx;
  height: 20rpx;
  border: 1px solid #cdcdcd;

  border-left: none;
  border-bottom: none;

  transform: rotate(45deg);
}
.border-bottom .icon {
  font-size: 38rpx;
  line-height: 38rpx;
}
</style>
