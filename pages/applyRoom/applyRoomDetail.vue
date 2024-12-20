<template>
  <view>
    <view class="block__title">{{ $t('业主信息-PQ8') }}</view>
    <!-- <view class="cu-form-group">
			<view class="title">业主ID</view>
			{{ownerInfo.memberId}}
		</view> -->
    <view class="cu-form-group">
      <view class="title">{{ $t('名称-fNz') }}</view>
      {{ userName }}
    </view>
    <!-- <view class="cu-form-group">
			<view class="title">身份证</view>
			{{ownerInfo.idCard}}
		</view> -->
    <view class="cu-form-group">
      <view class="title">{{ $t('联系方式-k8c') }}</view>
      {{ userTel }}
    </view>

    <view class="block__title">{{ $t('房屋信息-lT7') }}</view>
    <!-- <view class="cu-form-group">
			<view class="title">房屋ID</view>
			{{roomDetail.roomId}}
		</view> -->
    <view class="cu-form-group">
      <view class="title">{{ $t('楼栋-tUB') }}</view>
      {{ roomDetail.floorNum }}{{ $t('号楼-G4C') }}
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('单元-7xd') }}</view>
      {{ roomDetail.unitNum }}{{ $t('单元-7xd') }}
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('房屋编号-ubF') }}</view>
      {{ roomDetail.roomNum }}{{ $t('室-AtK') }}
    </view>

    <view class="cu-form-group">
      <view class="title">{{ $t('楼层-qGE') }}</view>
      {{ roomDetail.layer }}{{ $t('层-gJR') }}
    </view>
    <!-- <view class="cu-form-group">
			<view class="title">房间数</view>
			{{roomDetail.section}}个
		</view> -->
    <view class="cu-form-group">
      <view class="title">{{ $t('户型-taM') }}</view>
      {{ roomDetail.apartment }}
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('建筑面积-7e6') }}</view>
      {{ roomDetail.builtUpArea }}{{ $t('平方米-Gma') }}
    </view>
    <!-- <view class="cu-form-group">
			<view class="title">单价</view>
			{{roomDetail.unitPrice+'元/平方米'}}
		</view> -->

    <view class="block__title">{{ $t('空置房申请信息填写-CZ8') }}</view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('优惠类型-t3t') }}</view>
      <picker mode="selector" :range="applyTypes" range-key="typeName" @change="applyTypeChange">
        <view class="picker">
          {{ applyTypeShow || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('费用项目-Ytm') }}</view>
      <picker mode="selector" :range="feeTypeCds" range-key="feeName" @change="feeTypeCdsChange">
        <view class="picker">
          {{ feeTypeCd || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('开始日期-iT7') }}</view>
      <picker mode="date" :value="bindStartDate" start="2020-09-01" end="2050-09-01" @change="dateStartChange">
        <view class="picker">
          {{ bindStartDate || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('结束日期-ez6') }}</view>
      <picker mode="date" :value="bindEndDate" start="2020-09-01" end="2050-09-01" @change="dateEndChange">
        <view class="picker">
          {{ bindEndDate || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('申请说明-U8y') }}</view>
      <input type="text" v-model="createRemark" />
    </view>
    <view class="block__title">{{ $t('图片材料-HZy') }}</view>
    <uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum" :canEdit="uploadImage.canEdit" :title="$t('图片上传-mfj')" @sendImagesData="sendImagesData" />

    <view class="btn-box">
      <button type="default" class="btn-sub" @click="subApply()">{{ $t('提交申请-sBk') }}</button>
    </view>

    <view class="button_up_blank"></view>
  </view>
</template>

<script>
// pages/my/myHouseDetail.js
// import * as TanslateImage from '../../lib/proprietor/utils/translate-image.js'
import context from '../../lib/proprietor/proprietorContext.js'
import { compareDate } from '../../lib/proprietor/utils/DateUtil.js'
import { queryApplyRoomDiscountType, saveApplyRoomDiscount, listRoomFee } from '../../api/applyRoom/applyRoomApi.js'
import uploadImageAsync from '../../components/vc-upload-async/vc-upload-async.vue'
import { getUserName, getUserTel } from '../../api/user/userApi.js'
import { getCommunityId } from '@/api/community/communityApi.js'
// const factory = context.factory
export default {
  data() {
    return {
      ownerInfo: {},
      // 用户信息
      ownerFlag: false,
      // 是否有业主信息 标记 如果有为 true  没有为false
      roomDetail: {},
      bindStartDate: '',
      bindEndDate: '',
      createRemark: '',
      applyType: '',
      applyTypeShow: '',
      applyTypes: [],
      feeTypeCds: [],
      feeId: '',
      feeTypeCd: '',
      photos: [],
      communityId: '',
      userName: '',
      userTel: '',
      uploadImage: {
        maxPhotoNum: 4,
        canEdit: true
      }
    }
  },

  components: {
    uploadImageAsync
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _that = this
    context.onLoad(options)
    _that.roomDetail = JSON.parse(options.room)
    _that.communityId = _that.roomDetail.communityId
    _that.loadApplyRoomDiscountType()
    _that.loadOwenrInfo()
    _that.loadRoomFee()
    this.userName = getUserName()
    this.userTel = getUserTel()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    sendImagesData: function (e) {
      this.photos = []
      if (e.length > 0) {
        e.forEach(img => {
          this.photos.push(img.fileId)
        })
      }
    },
    loadRoomFee: function () {
      const _that = this
      const params = {
        page: 1,
        row: 50,
        communityId: this.roomDetail.communityId,
        payerObjId: this.roomDetail.roomId,
        state: '2008001'
      }
      listRoomFee(params).then(function (data) {
        const fees = data.fees
        _that.feeTypeCds = fees
      })
    },

    loadApplyRoomDiscountType: function () {
      const _that = this
      const params = {
        communityId: this.roomDetail.communityId,
        page: 1,
        row: 50
      }
      queryApplyRoomDiscountType(params).then(function (types) {
        _that.applyTypes = types
      })
    },

    loadOwenrInfo: function () {
      const _that = this

      context.getOwner(function (_ownerInfo) {
        console.log(_ownerInfo)

        if (_ownerInfo) {
          _that.ownerFlag = true
          _that.ownerInfo = _ownerInfo
        } else {
          _that.ownerFlag = false
        }
      })
    },

    /**
     * 类型修改
     * @param {Object} e
     */
    applyTypeChange: function (e) {
      if (this.applyTypes.length > 0) {
        this.applyType = this.applyTypes[e.detail.value].applyType
        this.applyTypeShow = this.applyTypes[e.detail.value].typeName
      }
    },

    /**
     * @param {Object} e
     * 费用项改变
     */
    feeTypeCdsChange: function (e) {
      if (this.feeTypeCds.length > 0) {
        this.feeId = this.feeTypeCds[e.detail.value].feeId
        this.feeTypeCd = this.feeTypeCds[e.detail.value].feeName
      }
    },

    /**
     * 修改开始时间
     * @param {Object} e
     */
    dateStartChange: function (e) {
      this.bindStartDate = e.detail.value
    },

    /**
     * 修改结束时间
     * @param {Object} e
     */
    dateEndChange: function (e) {
      this.bindEndDate = e.detail.value
    },

    /**
     * 提交申请
     */
    subApply: function () {
      let msg = ''
      if (this.applyType == '') {
        msg = this.$t('请选择优惠类型-LWZ')
      } else if (this.feeId == '') {
        msg = this.$t('请选择费用项目-lxw')
      } else if (!this.bindStartDate || !this.bindEndDate) {
        msg = this.$t('请选择时间范围-5EK')
      } else if (!compareDate(this.bindEndDate, this.bindStartDate)) {
        msg = this.$t('时间范围有误-Z7v')
      } else if (this.createRemark == '') {
        msg = this.$t('请填写申请说明-TLH')
      }

      if (msg != '') {
        uni.showToast({
          title: msg,
          icon: 'none'
        })
        return
      }

      const params = {
        startTime: this.bindStartDate,
        // endTime: this.bindEndDate + ' 23:59:59',
        // endTime: date2String(addDay(new Date(this.bindEndDate.replace(/-/g, "/")), 1)),
        endTime: this.bindEndDate,
        roomName: this.roomDetail.floorNum + '-' + this.roomDetail.unitNum + '-' + this.roomDetail.roomNum,
        roomId: this.roomDetail.roomId,
        communityId: getCommunityId(),
        createUserName: this.userName,
        createUserTel: this.userTel,
        createRemark: this.createRemark,
        ardId: '',
        applyType: this.applyType,
        feeId: this.feeId,
        photos: this.photos
      }
      saveApplyRoomDiscount(params).then(function (_res) {
        uni.showToast({
          title: this.$t('申请成功-LZo')
        })
        setTimeout(function () {
          uni.navigateBack({})
        }, 1000)
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

.block__bottom {
  height: 180rpx;
}

.btn-box {
  padding: 30rpx 0;
}
.btn-sub {
  width: 80%;
  margin: 0 auto;
  background-color: #1f8dee !important;
  color: #fff !important;
}
</style>
