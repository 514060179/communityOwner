<template>
  <view>
    <view class="block__title">{{ $t('房屋信息-lT7') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('小区-Gal') }}</view>
      <picker bindchange="PickerChange" :value="communityIndex" :range="communitys" :range-key="'name'" @change="communityChange">
        <view class="picker">
          {{ communitys[communityIndex].name }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group arrow" v-if="communityId" @tap="chooseRoom">
      <view class="title">{{ $t('房屋-5Ci') }}</view>
      <input readonly v-model="roomName" class="text-right" :placeholder="$t('请选择房屋-KI3')" icon="arrow" />
      <text class="cuIcon-right"></text>
    </view>
    <view class="block__title">{{ $t('人员信息-FMW') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('人员名称-cEO') }}</view>
      <input v-model="ownerName" :placeholder="$t('请输入名称-PaE')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('手机号-9dl') }}</view>
      <input v-model="link" disabled="disabled" :placeholder="$t('请输入手机号-Cdr')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('人员类型-A9o') }}</view>
      <picker :value="typeCdIndex" :range="typeCds" range-key="name" @change="_changeTypeCd">
        <view class="picker">
          {{ typeCds[typeCdIndex].name }}
        </view>
      </picker>
    </view>

    <view class="flex flex-direction margin-top margin-bottom">
      <button class="cu-btn bg-primary margin-tb-sm lg" @click="_doAuthOwner()">{{ $t('提交-4TX') }}</button>
    </view>
  </view>
</template>

<script>
import { getCommunitys } from '../../api/community/communityApi.js'
import { getUserTel } from '../../api/user/userApi.js'
import { authOwner } from '../../api/owner/ownerApi.js'
export default {
  data() {
    return {
      communityIndex: 0,
      communityId: '',
      roomId: '',
      roomName: '',
      link: '',
      ownerName: '',
      communitys: [],
      typeCdIndex: 0,
      ownerTypeCd: '1001'
    }
  },
  onLoad(options) {
    this.communitys = [
      {
        communityId: '',
        name: this.$t('请选择小区-M5Q')
      }
    ]
    this._loadCommunitys()
    this.link = getUserTel()
  },
  onShow() {
    const _selectRoom = uni.getStorageSync('selectRoom')
    if (_selectRoom) {
      this.roomName = _selectRoom.roomName
      this.roomId = _selectRoom.roomId
      uni.removeStorageSync('selectRoom')
    }
  },
  computed: {
    typeCds() {
      return [
        {
          value: '1001',
          name: this.$t('业主-FFN')
        },
        {
          value: '1002',
          name: this.$t('家庭成员-gHw')
        },
        {
          value: '1003',
          name: this.$t('租客-w3O')
        },
        {
          value: '1005',
          name: this.$t('其他-IFU')
        }
      ]
    }
  },
  methods: {
    communityChange: function (e) {
      this.communityIndex = e.target.value //取其下标
      const selected = this.communitys[this.communityIndex] //获取选中的数组
      this.communityId = selected.communityId //选中的id
    },
    _loadCommunitys: function () {
      const _that = this
      getCommunitys({
        page: 1,
        row: 500
      }).then(_communitys => {
        _communitys.forEach(_c => {
          _that.communitys.push(_c)
        })
      })
    },
    chooseRoom: function () {
      uni.navigateTo({
        url: '/pages/family/selectRoom?communityId=' + this.communityId
      })
    },
    _changeTypeCd: function (e) {
      this.typeCdIndex = e.detail.value
      this.ownerTypeCd = this.typeCds[this.typeCdIndex].value
    },
    _doAuthOwner: function () {
      authOwner({
        communityId: this.communityId,
        roomName: this.roomName,
        roomId: this.roomId,
        link: this.link,
        ownerName: this.ownerName,
        ownerTypeCd: this.ownerTypeCd
      }).then(_data => {
        //todo 跳转到认证历史页面
        uni.navigateTo({
          url: '/pages/index/authOwnerLog'
        })
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
