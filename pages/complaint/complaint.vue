<template>
  <view>
    <view class="block__title">{{ $t('房屋信息-lT7') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('房屋信息-lT7') }}</view>
      <picker :value="index" :range="roomCloums" @change="_changeRoom">
        <view class="picker">
          {{ roomName || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="block__title">{{ $t('投诉信息-lwE') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('投诉类型-gyd') }}</view>
      <picker :value="complaintIndex" :range="typeCds" :range-key="'typeName'" @change="_changeComplaint">
        <view class="picker">
          {{ typeName || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('投诉人-iAs') }}</view>
      <input id="complaintName" v-model="complaintName" :placeholder="$t('请输入投诉人-r1A')" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('手机号-9dl') }}</view>
      <picker class="area-picker" :range="areaList" range-key="desc" @change="changeArea">
        <view class="area-item">{{ areaItem.title }}</view>
      </picker>
      <input id="tel" v-model="tel" :placeholder="$t('请输入手机号-Cdr')" />
    </view>
    <view class="cu-form-group margin-top">
      <textarea id="context" v-model="context" :placeholder="$t('请输入投诉内容-BrJ')"></textarea>
    </view>

    <view class="block__title">{{ $t('照片信息-Hgr') }}</view>
    <uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum" :canEdit="uploadImage.canEdit" :title="$t('图片上传-mfj')" @sendImagesData="sendImagesData" />

    <view class="button_up_blank"></view>
    <view class="flex flex-direction">
      <button class="cu-btn bg-green margin-tb-sm lg" @click="_submitComplaint()">{{ $t('提交-4TX') }}</button>
    </view>
  </view>
</template>

<script>
// pages/enterCommunity/enterCommunity.js
import * as TanslateImage from '../../lib/proprietor/utils/translate-image.js'

import { checkPhoneNumber } from '../../lib/proprietor/utils/StringUtil.js'
import context from '../../lib/proprietor/proprietorContext.js'
import uploadImageAsync from '../../components/vc-upload-async/vc-upload-async.vue'
import { complaint, getComplaintType } from '@/api/community/complaintApi.js'
import { getCommunityId } from '@/api/community/communityApi.js'
const constant = context.constant
const factory = context.factory

export default {
  data() {
    return {
      imgList: [],
      imageIndex: 0,
      index: null,
      complaintIndex: 0,
      roomCloums: [],
      roomIdArr: [],
      roomName: '',
      roomId: '',
      roomShow: false,
      typeCds: [],
      typeName: '',
      typeCd: '',
      typeShow: false,
      photoList: [],
      tel: '',
      context: '',
      complaintName: '',
      userId: '',
      storeId: '',
      photos: [],
      communityId: '',
      uploadImage: {
        maxPhotoNum: 4,
        canEdit: true
      },
      // 区号
      areaItem: {},
    }
  },
  components: {
    uploadImageAsync
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    context.onLoad(options)
    that.areaItem = that.areaList[0]
    context.getRooms().then(res => {
      const arr = res.data.rooms
      const roomCloums = []
      const roomIdArr = []
      arr.map(item => {
        roomCloums.push(item.floorNum + '-' + item.unitNum + '-' + item.roomNum)
        roomIdArr.push(item.roomId)
      })
      that.roomCloums = roomCloums
      that.roomIdArr = roomIdArr
      that.userId = res.data.owner.appUserId
      that.communityId = res.data.owner.communityId
      that.complaintName = res.data.owner.ownerName
      that.tel = res.data.owner.ownerTel
      if (arr.length === 1) {
        this.roomName = arr[0].roomName
        this.roomId = arr[0].roomId
      }
    })
    this._loadComplaintType()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  computed: {
    // 区号列表
    areaList() {
      return [
        {
          id: 1,
          title: '+853',
          desc: `+853 (${this.$t('中国澳门-NCE')})`
        },
        {
          id: 2,
          title: '+852',
          desc: `+852 (${this.$t('中国香港-18S')})`
        },
        {
          id: 3,
          title: '+86',
          desc: `+86 (${this.$t('中国大陆-vi7')})`
        },
        {
          id: 4,
          title: '+886',
          desc: `+886 (${this.$t('中国台湾-3Uu')})`
        }
      ]
    }
  },
  methods: {
    // 切换区号
    changeArea(e) {
      this.areaItem = this.areaList[e.detail.value]
    },
    sendImagesData: function (e) {
      this.photos = []
      if (e.length > 0) {
        e.forEach(img => {
          this.photos.push(img.fileId)
        })
      }
    },
    _changeComplaint: function (e) {
      this.typeName = this.typeCds[e.detail.value].typeName
      this.typeCd = this.typeCds[e.detail.value].typeCd
    },
    _changeRoom: function (e) {
      this.roomName = this.roomCloums[e.detail.value]
      this.roomId = this.roomIdArr[e.detail.value]
    },
    _submitComplaint: function (e) {
      complaint({
        typeCd: this.typeCd,
        complaintName: this.complaintName,
        tel: this.tel,
        roomId: this.roomId,
        photos: this.photos,
        context: this.context,
        userId: this.userId,
        communityId: this.communityId,
        areaCode: this.areaItem.title
      }).then(
        _data => {
          uni.navigateTo({
            url: '/pages/successPage/successPage?msg=提交成功&objType=4004'
          })
        },
        err => {
          uni.showToast({
            icon: 'none',
            title: err
          })
        }
      )
    },
    _loadComplaintType: function () {
      const _that = this
      getComplaintType({
        page: 1,
        row: 100,
        communityId: getCommunityId()
      }).then(_data => {
        _that.typeCds = _data.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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

.uploader-container {
  margin: 0 10px;
}

.aku_photo_view {
  background-color: #fff;
  padding: 40rpx 0 40rpx 40rpx;
}

.aku_photo_view text {
  font-size: 30rpx;
  color: #8a8a8a;
}
::v-deep .cu-form-group uni-input {
  flex: 3;
  // text-align: right;
}

.area-picker {
  width: 100rpx;
  
  &::after{
    transform: rotate(90deg);
  }
  
  .area-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
