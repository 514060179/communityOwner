<template>
  <view>
    <view class="block__title">{{ $t('房屋信息-lT7') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('位置-J8c') }}</view>
      <picker bindchange="PickerChange" :value="repairScopeIndex" :range="repairScopes" :range-key="'name'" @change="repairScopeChange">
        <view class="picker">
          {{ repairScopes[repairScopeIndex].name }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group arrow" v-if="repairObjType == '002' || repairObjType == '003'" @tap="chooseFloor">
      <view class="title">{{ $t('楼栋-tUB') }}</view>
      <input required readonly :label="$t('楼栋-tUB')" v-model="floorNum" class="text-right" :placeholder="$t('请选择楼栋-2RV')" name="floorNum" icon="arrow" />
      <text class="cuIcon-right"></text>
    </view>
    <view class="cu-form-group arrow" v-if="repairObjType == '003'" @tap="chooseUnit">
      <view class="title">{{ $t('单元-7xd') }}</view>
      <input v-model="unitNum" placeholder="请选择单元" class="text-right" />
      <text class="cuIcon-right"></text>
    </view>
    <view class="cu-form-group" v-if="repairObjType == '004'">
      <view class="title">{{ $t('房屋信息-lT7') }}</view>
      <picker bindchange="PickerChange" :value="index" :range="roomCloums" @change="roomChange">
        <view class="picker">
          {{ roomName || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>

    <view class="block__title">{{ $t('报修信息-1sT') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('报修类型-qnU') }}</view>
      <picker id="complaintType" bindchange="PickerChange" :value="repairTypeIndex" :range-key="'repairTypeName'" :range="repairTypes" v-if="repairTypes.length > 0" @change="repairTypeChange">
        <view class="picker">
          {{ repairTypes.length == 0 ? $t('请选择-Ah3') : repairTypes[repairTypeIndex].repairTypeName }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group" v-if="priceScope != ''">
      <view class="title">{{ $t('收费标准-1Hm') }}</view>
      <input disabled="disable" v-model="priceScope" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('报修人-1iu') }}</view>
      <input v-model="bindRepairName" :placeholder="$t('请输入报修人-Ojj')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('手机号-9dl') }}</view>
      <picker class="area-picker" :range="areaList" range-key="desc" @change="changeArea">
        <view class="area-item">{{ areaItem.title }}</view>
      </picker>
      <input v-model="bindTel" :placeholder="$t('请输入手机号-Cdr')" class="text-right" />
    </view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('预约日期-SSV') }}</view>
      <picker mode="date" :value="bindDate" :start="todayDate" end="2050-09-01" @change="dateChange">
        <view class="picker">
          {{ bindDate || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group arrow">
      <view class="title">{{ $t('预约时间-FzQ') }}</view>
      <picker mode="time" :value="bindTime" :start="todayDateTime" end="22:00" @change="timeChange">
        <view class="picker">
          {{ bindTime || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group margin-top">
      <textarea v-model="context" :placeholder="$t('请输入报修内容-AIp')"></textarea>
    </view>

    <view class="block__title">{{ $t('相关图片-z1Y') }}</view>
    <uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum" :canEdit="uploadImage.canEdit" :title="$t('图片上传-mfj')" @sendImagesData="sendImagesData" />

    <view class="button_up_blank"></view>

    <view class="flex flex-direction">
      <button class="cu-btn bg-green margin-tb-sm lg" @click="submitRepair()">{{ $t('提交-4TX') }}</button>
    </view>
  </view>
</template>

<script>
// pages/enterCommunity/enterCommunity.js
import { checkPhoneNumber, checkStrLength } from '../../lib/proprietor/utils/StringUtil.js'
import context from '../../lib/proprietor/proprietorContext.js'
import { formatDate, formatHourAndMin } from '@/lib/proprietor/utils/DateUtil.js'

import { getCommunityId, getCommunityName } from '@/api/community/communityApi.js'

import { getOwnerName, getOwnerTel } from '@/api/owner/ownerApi.js'
import uploadImageAsync from '../../components/vc-upload-async/vc-upload-async.vue'

import { listRepairSettings } from '../../api/repair/repairApi.js'
const constant = context.constant
const factory = context.factory

export default {
  data() {
    return {
      minDate: new Date().getTime(),
      bindDate: '',
      bindTime: '',
      roomCloums: [],
      roomIdArr: [],
      roomName: '',
      roomId: '',
      roomShow: false,
      typeName: '',
      repairType: '',
      typeShow: false,
      timeShow: false,
      imgList: [],
      bindTel: '',
      context: '',
      bindRepairName: '',
      userId: '',
      userName: '',
      storeId: '',
      photos: [],
      communityId: '',
      communityName: '',
      complaintIndex: 0,
      index: 0,
      repairTypes: [],
      repairTypeIndex: 0,
      repairScopeIndex: 3,
      repairObjType: '004',
      repairObjId: '',
      repairObjName: '',
      floorNum: '',
      floorId: '',
      unitNum: '',
      unitId: '',
      priceScope: '',
      todayDate: '',
      todayDateTime: '',
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
    this.communityId = getCommunityId()
    this.communityName = getCommunityName()
    this.userName = getOwnerName()
    this.bindTel = getOwnerTel()
    this.bindRepairName = this.userName
    context.getRooms().then(res => {
      const arr = res.data.rooms
      const roomCloums = []
      const roomIdArr = []
      arr.map(item => {
        roomCloums.push(item.floorNum + this.$t('号楼-G4C') + item.unitNum + this.$t('单元-7xd') + item.roomNum + this.$t('室-AtK'))
        roomIdArr.push(item.roomId)
      })
      that.roomCloums = roomCloums
      that.roomIdArr = roomIdArr
      that.userId = res.data.owner.userId
    })

    //加载报修类型
    this._loadRepairTypes()
    this.todayDate = formatDate(new Date())
    this.todayDateTime = formatHourAndMin(new Date())
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const _floor = uni.getStorageSync('_selectFloor')

    if (_floor != null && _floor != undefined && _floor != '') {
      this.floorNum = _floor.floorNum + this.$t('栋-XZF')
      this.floorId = _floor.floorId
    }

    const _unit = uni.getStorageSync('_selectUnit')
    if (_unit != null && _unit != undefined && _unit != '') {
      this.unitNum = _unit.unitNum + this.$t('单元-7xd')
      this.unitId = _unit.unitId
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //清理楼栋和单元
    uni.removeStorageSync('_selectFloor')
    uni.removeStorageSync('_unitFloor')
  },

  computed: {
    repairScopes() {
      return [
        {
          id: '001',
          name: this.$t('小区-Gal')
        },
        {
          id: '002',
          name: this.$t('楼栋-tUB')
        },
        {
          id: '003',
          name: this.$t('单元-7xd')
        },
        {
          id: '004',
          name: this.$t('房屋-5Ci')
        }
      ]
    },
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
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      } else if (type === 'day') {
        return `${value}日`
      }
      return value
    },

    submitRepair: function (e) {
      const obj = {
        repairName: this.bindRepairName,
        repairType: this.repairType,
        appointmentTime: this.bindDate + ' ' + this.bindTime + ':00',
        tel: this.bindTel,
        roomId: this.roomId,
        photos: this.photos,
        context: this.context,
        userId: this.userId,
        userName: this.userName,
        communityId: this.communityId,
        bindDate: this.bindDate,
        bindTime: this.bindTime,
        repairObjType: this.repairObjType,
        repairChannel: 'Z',
        areaCode: this.areaItem.title
      }

      if (this.repairObjType == '001') {
        obj.repairObjId = this.communityId
        obj.repairObjName = this.communityName
      } else if (this.repairObjType == '002') {
        obj.repairObjId = this.floorId
        obj.repairObjName = this.floorNum
      } else if (this.repairObjType == '003') {
        obj.repairObjId = this.unitId
        obj.repairObjName = this.floorNum + this.unitNum
      } else {
        obj.repairObjId = this.roomId
        obj.repairObjName = this.roomName
      }

      // let _photos = this.photos;
      // _photos.forEach(function(_item) {
      // 	obj.photos.push({
      // 		"photo": _item
      // 	});
      // });
      // 预约时间校验
      const oppoTime = Date.parse(new Date(obj.appointmentTime.replace(/-/g, '/'))),
        now = Date.parse(new Date())
      let msg = ''
      if (obj.repairType == '') {
        msg = this.$t('请选择报修类型-Jpa')
      } else if (obj.repairName == '') {
        msg = this.$t('请填写报修人-wJz')
      } else if (checkStrLength(obj.repairName) > 30) {
        msg = this.$t('报修人长度不能超过15位-MYS')
      } else if (obj.tel == '') {
        msg = this.$t('请填写手机号-qYB')
      } else if (!checkPhoneNumber(obj.tel, obj.areaCode)) {
        msg = this.$t('手机号有误-CIh')
      } else if (!obj.bindDate) {
        msg = this.$t('请选择预约日期-ZK6')
      } else if (!obj.bindTime) {
        msg = this.$t('请选择预约时间-DvZ')
      } else if (now - oppoTime > 1800 * 1000) {
        msg = this.$t('预约时间有误-TBH')
      } else if (obj.context == '') {
        msg = this.$t('请填写报修内容-J6t')
      } else if (obj.repairObjId == '') {
        msg = this.$t('请选择报修位置-C2D')
      }

      if (msg != '') {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
      } else {
        context.request({
          url: constant.url.saveOwnerRepair, //  http://hc.demo.winqi.cn:8012/appApi/ownerRepair.saveOwnerRepair
          header: context.getHeaders(),
          method: 'POST',
          data: obj, //动态数据
          success: function (res) {
            const _json = res.data
            if (_json.code == 0) {
              // wx.redirectTo({
              // 	url: '/pages/repair/myRepair',
              // });
              uni.navigateTo({
                url: '/pages/successPage/successPage?msg=提交成功&objType=4004'
              })
              return
            }
            wx.showToast({
              title: _json.msg,
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
      }
    },
    afterRead: function (event) {
      const { file } = event.detail

      const _that = this

      const { photoList = [] } = this
      photoList.push(file)
      this.photoList = photoList

      factory.base64.urlTobase64(file.path).then(function (_baseInfo) {
        _that.photos.push(_baseInfo)
      })
    },
    roomChange: function (e) {
      this.roomId = this.roomIdArr[e.detail.value]
      this.roomName = this.roomCloums[e.detail.value]
    },
    repairScopeChange: function (e) {
      this.repairScopeIndex = e.target.value //取其下标
      const selected = this.repairScopes[this.repairScopeIndex] //获取选中的数组
      this.repairObjType = selected.id //选中的id
      this._loadRepairTypes()
    },
    repairChange: function (e) {
      this.typeName = this.columns[e.detail.value]
      this.typeId = this.repairIdAttr[e.detail.value]
    },
    repairTypeChange: function (e) {
      this.repairTypeIndex = e.target.value //取其下标
      const selected = this.repairTypes[this.repairTypeIndex] //获取选中的数组
      if (selected == undefined) {
        return
      }
      this.repairType = selected.repairType //选中的id
      const _payFeeFlag = selected.payFeeFlag

      if (_payFeeFlag == 'T') {
        this.priceScope = selected.priceScope
      } else {
        this.priceScope = ''
      }
    },
    dateChange: function (e) {
      this.bindDate = e.detail.value
      if (this.bindDate == formatDate(new Date()).replaceAll('/', '-')) {
        this.todayDateTime = formatHourAndMin(new Date())
      } else {
        this.todayDateTime = '8:30'
      }
    },
    timeChange: function (e) {
      this.bindTime = e.detail.value
    },
    chooseFloor: function (e) {
      context.navigateTo({
        url: '/pages/selectFloor/selectFloor'
      })
    },
    chooseUnit: function (e) {
      if (this.floorId == null || this.floorId == '') {
        uni.showToast({
          title: this.$t('请先选择楼栋-zR9')
        })
        return
      }
      context.navigateTo({
        url: '/pages/selectUnit/selectUnit?floorId=' + this.floorId
      })
    },
    _loadRepairTypes: function () {
      const _communityInfo = context.getCurrentCommunity()
      const _that = this
      // 公共区域标识
      const publicArea = _that.repairObjType == '004' ? 'F' : 'T'
      // 默认选择第一个
      _that.repairTypeIndex = 0
      const dataObj = {
        page: 1,
        row: 50,
        communityId: _communityInfo.communityId,
        publicArea: publicArea
      }
      listRepairSettings(dataObj).then(_json => {
        if (_json.code == 0 && _json.data.length > 0) {
          _that.repairTypes = _json.data

          const selected = _that.repairTypes[_that.repairTypeIndex] //获取选中的数组
          _that.repairType = selected.repairType //选中的id
          const _payFeeFlag = selected.payFeeFlag

          if (_payFeeFlag == 'T') {
            _that.priceScope = selected.priceScope
          } else {
            _that.priceScope = ''
          }
        } else {
          uni.showToast({
            icon: 'none',
            title: this.$t('未配置报修设置-7vr')
          })
        }
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
