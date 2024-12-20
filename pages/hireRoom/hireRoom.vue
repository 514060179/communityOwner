<template>
  <view>
    <view class="block__title">{{ $t('房屋信息-lT7') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('出租标题-z7E') }}</view>
      <input v-model="rentingTitle" :placeholder="$t('如香格里拉豪华大单间-GAc')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('房屋信息-lT7') }}</view>
      <picker bindchange="PickerChange" :value="index" :range="roomCloums" @change="roomChange">
        <view class="picker">
          {{ roomName || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group" v-if="builtUpArea != ''">
      <view class="title">{{ $t('房屋面积-DSu') }}</view>
      <input v-model="builtUpArea" style="text-align: right" disabled="disabled" />
    </view>
    <view class="cu-form-group" v-if="apartment != ''">
      <view class="title">{{ $t('户型-taM') }}</view>
      <input v-model="apartment" style="text-align: right" disabled="disabled" />
    </view>
    <view class="cu-form-group" v-if="layer != ''">
      <view class="title">{{ $t('楼层-qGE') }}</view>
      <input v-model="layer" style="text-align: right" disabled="disabled" />
    </view>

    <view class="block__title">{{ $t('出租信息-2KI') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('付费类型-OfP') }}</view>
      <picker id="paymentType" bindchange="PickerChange" :value="paymentTypeIndex" :range-key="'paymentTypeName'" :range="paymentTypes" @change="paymentTypeChange">
        <view class="picker">
          {{ paymentTypes[paymentTypeIndex].paymentTypeName }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('租金-4oa') }}</view>
      <input v-model="price" class="text-right" :placeholder="$t('请输入每月租金-huI')" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('出租方式-Sec') }}</view>
      <picker id="rentingType" bindchange="PickerChange" :value="rentingTypeIndex" :range-key="'rentingTypeName'" :range="rentingTypes" @change="rentingTypeChange">
        <view class="picker">
          {{ rentingTypes[rentingTypeIndex].rentingTypeName }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('服务费-4pN') }}</view>
      <input v-model="servicePrice" class="text-right" disabled="disabled" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('入住日期-g7L') }}</view>
      <picker id="checkIn" bindchange="PickerChange" :value="checkInIndex" :range-key="'checkInName'" :range="checkIns" @change="checkInChange">
        <view class="picker">
          {{ checkIns[checkInIndex].checkInName }}
        </view>
      </picker>
    </view>

    <view class="cu-form-group margin-top">
      <textarea v-model="rentingDesc" :placeholder="$t('请输入描述信息-Pt7')"></textarea>
    </view>

    <view class="block__title">{{ $t('相关图片-z1Y') }}</view>

    <view class="cu-bar bg-white">
      <view class="action">
        {{ $t('图片上传-mfj') }}
      </view>
      <view class="action"> {{ imgList.length }}/4 </view>
    </view>
    <view class="cu-form-group">
      <view class="grid col-4 grid-square flex-sub">
        <view class="bg-img" :key="index" v-for="(img, index) in imgList" bindtap="ViewImage" :data-url="imgList[index]">
          <image :src="imgList[index]" mode="aspectFill"></image>
          <view class="cu-tag bg-red" @tap="deleteImage(index)" :data-index="index">
            <text class="cuIcon-close"></text>
          </view>
        </view>
        <view class="solids" @tap="ChooseImage" v-if="imgList.length < 4">
          <text class="cuIcon-cameraadd"></text>
        </view>
      </view>
    </view>

    <view class="button_up_blank"></view>

    <view class="flex flex-direction">
      <button class="cu-btn bg-green margin-tb-sm lg" @click="submitHireRoom()">{{ $t('提交-4TX') }}</button>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'

import { queryRentingConfig, hireRoom } from '../../api/room/roomApi.js'

import base64 from '../../factory/Base64Factory.js'

export default {
  data() {
    return {
      rooms: [],
      apartment: '',
      builtUpArea: '',
      layer: '',
      price: '',
      roomCloums: [],
      roomIdArr: [],
      roomName: '',
      roomId: '',
      roomShow: false,
      imgList: [],
      userTel: '',
      userName: '',
      photos: [],
      communityId: '',
      communityName: '',
      paymentTypeIndex: 0,
      paymentType: '1001',
      paymentTypeName: '',
      checkInIndex: 0,
      checkIn: '1001',
      checkInName: '',
      rentingTypes: [],
      rentingTypeIndex: 0,
      rentingType: '',
      rentingTypeName: '',
      rentingConfigId: '',
      servicePrice: '',
      rentingDesc: '',
      rentingTitle: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    this.vc.onLoad(options)
    context.getRooms().then(res => {
      const arr = res.data.rooms
      that.rooms = arr
      const roomCloums = []
      const roomIdArr = []
      arr.map(item => {
        roomCloums.push(`${item.floorNum}${this.$t('号楼-G4C')}${item.unitNum}${this.$t('单元-7xd')}${item.roomNum}${this.$t('室-AtK')}`)
        roomIdArr.push(item.roomId)
      })
      that.roomCloums = roomCloums
      that.roomIdArr = roomIdArr
      that.userTel = res.data.owner.link
      that.userName = res.data.owner.appUserName
      that.communityId = res.data.owner.communityId
      that.communityName = res.data.owner.communityName
    })

    //加载报修类型
    this._loadRentingTypes()
  },
  computed: {
    paymentTypes() {
      return [
        {
          id: '1001',
          paymentTypeName: this.$t('押一付一-MXt')
        },
        {
          id: '2002',
          paymentTypeName: this.$t('押一付三-oOs')
        },
        {
          id: '3003',
          paymentTypeName: this.$t('押一付六-RWv')
        }
      ]
    },
    checkIns() {
      return [
        {
          id: '1001',
          checkInName: this.$t('立即入住-LJl')
        },
        {
          id: '2002',
          checkInName: this.$t('预约-JJk')
        }
      ]
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    submitHireRoom: function () {
      const _that = this
      const obj = {
        rentingTitle: this.rentingTitle,
        roomId: this.roomId,
        communityId: this.communityId,
        communityName: this.communityName,
        price: this.price,
        paymentType: this.paymentType,
        rentingConfigId: this.rentingConfigId,
        photos: [],
        rentingDesc: this.rentingDesc,
        ownerTel: this.userTel,
        ownerName: this.userName,
        state: '0',
        checkIn: this.checkIn
      }
      const _photos = this.photos
      _photos.forEach(function (_item) {
        obj.photos.push({
          photo: _item
        })
      })

      hireRoom(obj).then(
        res => {
          //跳转页面
          _that.vc.navigateBack()
        },
        error => {
          console.log(error)
          uni.showToast({
            icon: 'none',
            title: error
          })
        }
      )
    },

    deleteImage: function (e) {
      console.log(e)
      const imageArr = this.$data.imgList
      imageArr.splice(e, 1)
    },
    ChooseImage: function (e) {
      const that = this
      wx.chooseImage({
        count: 4, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: res => {
          console.log(res)
          that.$data.imgList.push(res.tempFilePaths[0])
          let _base64Photo = ''
          base64.urlTobase64(res.tempFilePaths[0]).then(function (_res) {
            _base64Photo = _res
            console.log('base64', _base64Photo)
            that.photos.push(_base64Photo)
          })
        }
      })
    },
    roomChange: function (e) {
      const _that = this
      this.roomId = this.roomIdArr[e.detail.value]
      this.roomName = this.roomCloums[e.detail.value]

      this.rooms.forEach(function (item) {
        if (item.roomId == _that.roomId) {
          _that.apartment = item.apartment
          _that.builtUpArea = item.builtUpArea
          _that.layer = item.layer
        }
      })
    },
    paymentTypeChange: function (e) {
      this.paymentTypeIndex = e.target.value //取其下标
      const selected = this.paymentTypes[this.paymentTypeIndex] //获取选中的数组
      this.paymentType = selected.id //选中的id
      this.paymentTypeName = selected.paymentTypeName //选中的id
    },
    _loadRentingTypes: function () {
      const _that = this
      queryRentingConfig().then(_rentingTypes => {
        _that.rentingTypes = _rentingTypes
        if (_rentingTypes.length > 0) {
          const selected = _rentingTypes[0]
          _that.rentingConfigId = selected.rentingConfigId
          _that.servicePrice = 'MOP' + (selected.servicePrice * selected.serviceOwnerRate).toFixed(2)
        }
      })
    },
    rentingTypeChange: function (e) {
      this.rentingTypeIndex = e.target.value //取其下标
      const selected = this.rentingTypes[this.rentingTypeIndex] //获取选中的数组
      this.rentingConfigId = selected.rentingConfigId //选中的id
      this.rentingTypeName = selected.rentingTypeName //选中的id
      this.servicePrice = 'MOP' + (selected.servicePrice * selected.serviceOwnerRate).toFixed(2)
    },
    checkInChange: function (e) {
      this.checkInIndex = e.target.value //取其下标
      const selected = this.checkIns[this.checkInIndex] //获取选中的数组
      this.checkIn = selected.id //选中的id
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
