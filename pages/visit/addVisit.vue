<template>
  <view>
    <view class="block__title">{{ $t('房屋信息-lT7') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('房屋信息-lT7') }}</view>
      <picker :range="roomCloums" @change="roomChange">
        <view class="picker">
          {{ roomName || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="block__title">{{ $t('访客信息-MtP') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('访客姓名-VVL') }}</view>
      <input v-model="vName" :placeholder="$t('请输入访客姓名-vwt')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('访客性别-RRr') }}</view>
      <picker :value="visitGenderIndex" :range="visitGenderScopes" :range-key="'name'" @change="visitGenderChange">
        <view class="picker">
          {{ visitGenderScopes[visitGenderIndex].name }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('访客联系方式-TLU') }}</view>
      <picker class="area-picker" :range="areaList" range-key="desc" @change="changeArea">
        <view class="area-item">{{ areaItem.title }}</view>
      </picker>
      <input v-model="phoneNumber" :placeholder="$t('请输入访客联系方式-wIt')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('车牌号-c9W') }}</view>
      <input v-model="carNum" type="text" :placeholder="$t('请输入访客车牌号-W4K')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('随行人数-yD2') }}</view>
      <input v-model="entourage" :placeholder="$t('请输入随行人数-JhB')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('来访时间-7d6') }}</view>
      <uni-datetime-picker v-model="visitTime" style="width: 70%"></uni-datetime-picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('离开时间-jL4') }}</view>
      <uni-datetime-picker v-model="departureTime" style="width: 70%"></uni-datetime-picker>
    </view>
    <view class="block__title">{{ $t('拜访事由-iIz') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('事由类型-arA') }}</view>
      <picker :value="reasonTypeIndex" :range="reasonTypeScopes" :range-key="'name'" @change="reasonTypeChange">
        <view class="picker">
          {{ reasonTypeScopes[reasonTypeIndex].name }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('拜访事由-iIz') }}</view>
      <input v-model="visitCase" :placeholder="$t('请输入拜访事由-jsI')" class="text-right" />
    </view>

    <view class="block__title">{{ $t('照片信息-Hgr') }}</view>
    <uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum" :canEdit="uploadImage.canEdit" :title="$t('图片上传-mfj')"
      @sendImagesData="sendImagesData"></uploadImageAsync>

    <view class="button_up_blank"></view>
    <view class="noti">
      <!-- <view class="text-red text-sm margin-left-sm">*预计来访时和预计离开时间间隔不能超过24小时</view> -->
      <view class="text-red text-sm margin-left-sm">*{{ $t('预约车辆自开始时间起计算，免费停放N分钟-YYl', { n: freeInfo.freeTime }) }}</view>
      <view class="text-red text-sm margin-left-sm" v-show="freeInfo.freeTimes > 0">*{{ $t('预约车辆每天限制N次登记，超过次数系统不会审核-D97', { n: freeInfo.freeTimes }) }}</view>
    </view>

    <view class="flex flex-direction">
      <button class="cu-btn bg-green margin-tb-sm lg" @click="submitVisit()">{{ $t('提交-4TX') }}</button>
    </view>
  </view>
</template>

<script>
  // pages/visit/addVisit.js
  import context from '../../lib/proprietor/proprietorContext.js'
  import { listOwnerVisit, saveAddVisit } from '../../api/visit/visit.js'
  import { queryDict } from '../../api/user/userApi.js'
  import uniDatetimePicker from '../../components/uni-datetime-picker/uni-datetime-picker.vue'
  import CarNumber from '../../components/codecook-carnumber/components/codecook-carnumber/codecook-carnumber.vue'
  import { formatTimeNow } from '../../lib/proprietor/utils/DateUtil.js'
  import { checkPhoneNumber, checkStrLength } from '../../lib/proprietor/utils/StringUtil.js'
  // import * as TanslateImage from '../../lib/proprietor/utils/translate-image.js'
  import uploadImageAsync from '../../components/vc-upload-async/vc-upload-async.vue'
  // const factory = context.factory

  export default {
    data() {
      return {
        vName: '',
        phoneNumber: '',
        visitGender: 0,
        visitGenderIndex: 0,
        visitGenderScopes: [{
            value: '0',
            name: '男'
          },
          {
            value: '1',
            name: '女'
          }
        ],
        carNum: '',
        entourage: 0,
        visitTime: '',
        departureTime: '',
        visitCase: '',
        reasonType: '',
        reasonTypeIndex: 0,
        reasonTypeScopes: [{
          name: '请选择'
        }],
        roomCloums: [],
        roomIdArr: [],
        ownerId: '',
        userId: '',
        communityId: '',
        roomId: '',
        roomName: '',
        photos: [],
        freeInfo: {},
        uploadImage: {
          maxPhotoNum: 1,
          canEdit: true
        },
        // 区号
        areaItem: {},
      }
    },

    components: {
      uniDatetimePicker,
      CarNumber,
      uploadImageAsync
    },
    props: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      const that = this
      context.onLoad(options)
      that.areaItem = that.areaList[0]
      this.visitTime = formatTimeNow()
      // 房屋信息
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
        that.ownerId = res.data.owner.ownerId
        that.userId = res.data.owner.userId
        that.communityId = res.data.owner.communityId
        // 只有一个房屋时，默认选中
        if (roomCloums.length == 1) {
          that.roomId = roomIdArr[0]
          that.roomName = roomCloums[0]
        }
        // 查询免费时长、次数信息
        that._queryFreeInfo()
        that._queryReasonTypeList()
      })
    },
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
      sendImagesData: function(e) {
        this.photos = e[0].fileId
      },
      _queryFreeInfo: function() {
        const _that = this
        const _objData = {
          page: 1,
          row: 1,
          communityId: _that.communityId,
          addVisitType: 'initAddVisitParameter'
        }
        listOwnerVisit(_objData).then(function(info) {
          _that.freeInfo = info
        })
      },
      _queryReasonTypeList: function() {
        const _that = this
        const _objData = {
          name: 's_visit_info',
          type: 'reason_type'
        }
        queryDict(_objData).then(function(info) {
          _that.reasonTypeScopes = _that.reasonTypeScopes.concat(info)
        })
      },
      // 选择性别
      visitGenderChange: function(e) {
        this.visitGenderIndex = e.target.value
        this.visitGender = this.visitGenderScopes[this.visitGenderIndex].value
      },
      reasonTypeChange: function(e) {
        this.reasonTypeIndex = e.detail.value
        this.reasonType = this.reasonTypeScopes[this.reasonTypeIndex].statusCd
      },
      roomChange: function(e) {
        this.roomId = this.roomIdArr[e.detail.value]
        this.roomName = this.roomCloums[e.detail.value]
      },
      // 提交
      submitVisit: function() {
        const obj = {
          roomId: this.roomId,
          roomName: this.roomName,
          vName: this.vName,
          visitGender: this.visitGender,
          phoneNumber: this.phoneNumber,
          carNum: this.carNum,
          entourage: this.entourage,
          visitTime: this.visitTime.replace(/\//g, '-'),
          departureTime: this.departureTime,
          reasonType: this.reasonType,
          visitCase: this.visitCase,
          photo: this.photos,
          videoPlaying: false,
          ownerId: this.ownerId,
          userId: this.userId,
          communityId: this.communityId,
          areaCode: this.areaItem.title
        }

        let msg = ''
        if (obj.roomId == '') {
          msg = this.$t('请选择房屋-KI3')
        } else if (obj.vName == '') {
          msg = this.$t('请填写访客姓名-5Mr')
        } else if (checkStrLength(obj.vName) > 10) {
          msg = this.$t('访客姓名过长-Lgf')
        } else if (obj.phoneNumber == '') {
          msg = this.$t('请填写手机号-qYB')
        } else if (!checkPhoneNumber(obj.phoneNumber, obj.areaCode)) {
          msg = this.$t('手机号有误-CIh')
        } else if (obj.entourage === '') {
          msg = this.$t('请填写随行人数-FAn')
        } else if (!/^\d+$/.test(obj.entourage) && obj.entourage != 0) {
          msg = this.$t('随行人数有误-LWj')
        } else if (obj.departureTime == '') {
          msg = this.$t('请选择结束时间-SzK')
        } else if (obj.reasonType === '') {
          msg = this.$t('请选择事由类型-Szr')
        } else {
          const start = Date.parse(new Date(obj.visitTime.replace(/-/g, '/'))),
            end = Date.parse(new Date(obj.departureTime.replace(/-/g, '/'))),
            now = Date.parse(new Date())
          if (now - start > 1800 * 1000) {
            msg = this.$t('开始时间有误-Vrh')
          } else if (end == 0 || start - end >= 0 || now - end >= 0) {
            msg = this.$t('结束时间有误-zUL')
          }
        }

        if (msg != '') {
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
          })
          return
        }
        const _that = this
        saveAddVisit(obj).then(function(data) {
          if (data.code == 0) {
            // wx.redirectTo({
            // 	url: '/pages/visit/addVisitSuccess?msg=' + data.msg,
            // });
            // 成功跳转详情页
            const _objData = {
              page: 1,
              row: 1,
              ownerId: _that.ownerId,
              userId: _that.userId,
              communityId: _that.communityId
            }
            listOwnerVisit(_objData).then(function(list) {
              const info = list.visits[0]
              uni.redirectTo({
                url: '/pages/visit/visitDetail?vId=' + info.vId
              })
            })
            return
          }
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        })
      }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {}
  }
</script>
<style lang="scss" scoped>
  @import './addVisit.css';
  
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