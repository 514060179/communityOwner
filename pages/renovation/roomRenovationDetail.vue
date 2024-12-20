<template>
  <view>
    <view class="block__title">{{ $t('业主信息-PQ8') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('名称-fNz') }}</view>
      {{ userName }}
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('联系方式-k8c') }}</view>
      {{ userTel }}
    </view>

    <view class="block__title">{{ $t('房屋信息-lT7') }}</view>
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
    <view class="cu-form-group">
      <view class="title">{{ $t('户型-taM') }}</view>
      {{ roomDetail.apartment }}
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('建筑面积-7e6') }}</view>
      {{ roomDetail.builtUpArea }}{{ $t('尺-ZVV') }}
    </view>
    <view class="block__title">{{ $t('装修申请信息填写-YaP') }}</view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('开始日期-iT7') }}</view>
      <picker mode="date" :value="startTime" start="2020-09-01" end="2050-09-01" @change="dateStartChange">
        <view class="picker">
          {{ startTime || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('结束日期-ez6') }}</view>
      <picker mode="date" :value="endTime" start="2020-09-01" end="2050-09-01" @change="dateEndChange">
        <view class="picker">
          {{ endTime || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('装修单位-qiK') }}</view>
      <input type="text" v-model="renovationCompany" :placeholder="$t('请输入装修单位-mqm')" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('装修负责人-MaD') }}</view>
      <input type="text" v-model="personMain" :placeholder="$t('请输入装修负责人-FtO')" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('负责人电话-sWy') }}</view>
      <picker class="area-picker" :range="areaList" range-key="desc" @change="changeArea">
        <view class="area-item">{{ areaItem.title }}</view>
      </picker>
      <input type="text" v-model="personMainTel" :placeholder="$t('请输入负责人电话-Vhr')" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('装修详情-iQe') }}</view>
      <input type="text" v-model="remark" :placeholder="$t('请输入装修详情-uRd')" />
    </view>
    <view class="btn-box">
      <button type="default" class="btn-sub" @click="subApply()">{{ $t('提交申请-sBk') }}</button>
    </view>

    <view class="button_up_blank"></view>
  </view>
</template>

<script>
  import context from '../../lib/proprietor/proprietorContext.js'
  // const constant = context.constant;
  // const factory = context.factory;
  import { compareDate } from '../../lib/proprietor/utils/DateUtil.js'
  import { checkPhoneNumber } from '../../lib/proprietor/utils/StringUtil.js'
  import { saveRoomRenovation } from '../../api/roomRenovation/roomRenovationApi.js'
  import { getUserName, getUserTel } from '../../api/user/userApi.js'
  import { getCommunityId } from '../../api/community/communityApi.js'
  export default {
    data() {
      return {
        ownerInfo: {},
        ownerFlag: false,
        roomDetail: {},
        startTime: '',
        endTime: '',
        remark: '',
        isPostpone: 'N',
        renovationCompany: '',
        personMain: '',
        personMainTel: '',
        // admin: {},
        property: {},
        userName: '',
        userTel: '',
        // 负责人区号
        areaItem: {}
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      const _that = this
      _that.areaItem = _that.areaList[0]
      context.onLoad(options)
      _that.roomDetail = JSON.parse(options.room)
      console.log(JSON.parse(options.room))
      _that.loadOwenrInfo()
      this.userName = getUserName()
      this.userTel = getUserTel()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {},
    computed: {
      // 区号列表
      areaList() {
        return [{
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
      loadOwenrInfo: function() {
        const _that = this

        context.getOwner(function(_ownerInfo) {
          if (_ownerInfo) {
            _that.ownerFlag = true
            //_that.ownerInfo = _ownerInfo;
            _that._loadProperty()
          } else {
            _that.ownerFlag = false
          }
        })
      },
      _loadProperty: function() {
        const _that = this
        context.getProperty().then(function(_property) {
          _that.property = _property
        })
      },

      // 修改开始时间
      dateStartChange: function(e) {
        this.startTime = e.detail.value
      },

      // 修改结束时间
      dateEndChange: function(e) {
        this.endTime = e.detail.value
      },

      // 提交申请
      subApply: function() {
        let msg = ''
        if (!this.startTime || !this.endTime) {
          msg = this.$t('请选择时间范围-5EK')
        } else if (!compareDate(this.endTime, this.startTime)) {
          msg = this.$t('时间范围有误-Z7v')
        } else if (this.renovationCompany == '') {
          msg = this.$t('请填写装修单位-K1x')
        } else if (this.personMain == '') {
          msg = this.$t('请填写装修负责人-kOp')
        } else if (this.personMainTel == '' || !checkPhoneNumber(this.personMainTel, this.areaItem.title)) {
          msg = this.$t('负责人电话有误-zzX')
        } else if (this.remark == '') {
          msg = this.$t('请填写装修详情-Zc4')
        }

        if (msg != '') {
          uni.showToast({
            title: msg,
            icon: 'none'
          })
          return
        }

        const params = {
          startTime: this.startTime,
          endTime: this.endTime,
          roomName: this.roomDetail.floorNum + '-' + this.roomDetail.unitNum + '-' + this.roomDetail.roomNum,
          roomId: this.roomDetail.roomId,
          communityId: getCommunityId(),
          personName: this.userName,
          personTel: this.userTel,
          remark: this.remark,
          rId: '',
          userId: '',
          isPostpone: this.isPostpone,
          renovationCompany: this.renovationCompany,
          personMain: this.personMain,
          personMainTel: this.personMainTel,
          storeId: this.property.storeId,
          areaCode: this.areaItem.title
        }
        const _that = this
        saveRoomRenovation(params).then(function(_res) {
          uni.showToast({
            title: _that.$t('申请成功-LZo')
          })
          setTimeout(function() {
            uni.navigateBack({ delta: 2 })
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

  ::v-deep .cu-form-group uni-input {
    flex: 3;
    // text-align: right;
  }

  .area-picker {
    width: 100rpx;

    &::after {
      transform: rotate(90deg);
    }

    .area-item {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>