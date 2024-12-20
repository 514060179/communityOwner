<template>
  <view>
    <view class="block__title">{{ $t('基本信息-tiN') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('姓名-rTx') }}</view>
      <input v-model="name" :placeholder="$t('请输入成员名称-EVA')" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('身份证-4Dk') }}</view>
      <input v-model="idCard" :placeholder="$t('请输入身份证（选填）-M8a')" maxlength="18" @blur="idCardBlur" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('性别-psV') }}</view>
      <picker bindchange="PickerChange" :range="sexArr" @change="sexChange">
        <view class="picker">
          {{ sex == '0' ? $t('男-yDM') : $t('女-R6K') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('年龄-bp9') }}</view>
      <input type="number" v-model="age" :placeholder="$t('请输入年龄-weM')" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('人员类型-A9o') }}</view>
      <picker :value="typeCdIndex" :range="typeCds" range-key="name" @change="_changeTypeCd">
        <view class="picker">
          {{ typeCds[typeCdIndex].name }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('家庭住址-aUB') }}</view>
      <input type="text" v-model="address" :placeholder="$t('请输入家庭住址（选填）-oTe')" />
    </view>

    <view class="block__title">{{ $t('联系信息-5si') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('手机号-9dl') }}</view>
      <picker class="area-picker" :range="areaList" range-key="desc" @change="changeArea">
        <view class="area-item">{{ areaItem.title }}</view>
      </picker>
      <input v-model="link" :placeholder="$t('请输入手机号（无手机号请填业主手机号）-Jpa')" />
    </view>
    <!-- <view class="cu-form-group">
			<view class="title">验证码</view>
			<input v-model="msgCode" placeholder="请输入短信验证码" name="input" />
			<button class='cu-btn bg-green shadow' :disabled="btnDisabled" @click="_sendMsgCode()">{{btnValue}}</button>
		</view> -->

    <view class="block__title">{{ $t('相关图片-z1Y') }}</view>
    <uploadImageAsync
      ref="vcUploadRef"
      :communityId="communityId"
      :maxPhotoNum="uploadImage.maxPhotoNum"
      :canEdit="uploadImage.canEdit"
      :title="$t('家庭成员照片上传-det')"
      @sendImagesData="sendImagesData"
    ></uploadImageAsync>

    <view class="cu-form-group margin-top">
      <textarea v-model="remark" :placeholder="$t('请输入备注-ePK')"></textarea>
    </view>

    <view class="flex flex-direction margin-top margin-bottom">
      <button class="cu-btn bg-green margin-tb-sm lg" @click="submitOwnerMember()">{{ $t('提交-4TX') }}</button>
    </view>
  </view>
</template>

<script>
// pages/enterCommunity/enterCommunity.js
import context from '../../lib/proprietor/proprietorContext.js'
import { idCardInfoExt, checkPhoneNumber } from '../../lib/proprietor/utils/StringUtil.js'
import uploadImageAsync from '../../components/vc-upload-async/vc-upload-async.vue'
import { sendMsgCode } from '../../api/user/userApi.js'
const constant = context.constant
const factory = context.factory

export default {
  data() {
    return {
      sexArr: ['男', '女'],
      sexShow: false,
      sex: '0',
      name: '',
      link: '',
      remark: '',
      ownerId: '',
      userId: '',
      // 区号
      areaItem: {},
      typeCdIndex: 0,
      ownerTypeCd: '1002',
      idCard: '',
      age: '',
      memberId: '-1',
      communityId: '',
      second: 60,
      btnDisabled: false,
      // btnValue: '验证码',
      msgCode: '',
      address: '',
      photos: [],
      uploadImage: {
        maxPhotoNum: 1,
        canEdit: true
      }
    }
  },

  components: {
    uploadImageAsync
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _that = this
    context.onLoad(options)
    _that.areaItem = _that.areaList[0]
    context.getOwner(function (_owner) {
      _that.ownerId = _owner.ownerId
      _that.communityId = _owner.communityId
    })
  },
  computed: {
    typeCds() {
      return [
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
      this.photos = e[0].fileId
    },
    submitOwnerMember: function (e) {
      const obj = {
        sex: this.sex,
        name: this.name,
        link: this.link,
        remark: this.remark,
        ownerId: this.ownerId,
        userId: this.userId,
        ownerTypeCd: this.ownerTypeCd,
        age: this.age,
        memberId: this.memberId,
        communityId: this.communityId,
        idCard: this.idCard,
        //"msgCode":this.msgCode,
        address: this.address,
        ownerPhoto: this.photos,
        areaCode: this.areaItem.title
      }

      let msg = ''
      if (obj.ownerId == '') {
        msg = this.$t('请填写业主-cfM')
      } else if (obj.name == '') {
        msg = this.$t('请填写姓名-KVh')
      } else if (obj.age == '') {
        msg = this.$t('请填写年龄-YeV')
      } else if (obj.link == '') {
        msg = this.$t('请填写手机号-qYB')
      } else if (!checkPhoneNumber(obj.link, obj.areaCode)) {
        msg = this.$t('手机号有误-CIh')
      }
      // todo 这里手机号关闭 因为 小朋友没有手机号
      //else if (obj.msgCode == "") {
      // 	msg = "请填写验证码";
      // }
      if (msg != '') {
        uni.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
      } else {
        uni.showLoading({
          title: this.$t('提交中-3Ok')
        })
        context.request({
          url: constant.url.saveOwner,
          header: context.getHeaders(),
          method: 'POST',
          data: obj,
          success: function (res) {
            if (res.statusCode == 200 && res.data.code == 0) {
              uni.hideLoading()
              uni.navigateBack()
              return
            }

            uni.hideLoading()
            uni.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          },
          fail: function (e) {
            uni.hideLoading()
            uni.showToast({
              title: this.$t('服务器异常了-eja'),
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    },
    _changeTypeCd: function (e) {
      this.typeCdIndex = e.detail.value
      this.ownerTypeCd = this.typeCds[this.typeCdIndex].value
    },
    idCardBlur: function () {
      if (!this.idCard) return
      const idCard = this.idCard
      if (!isIDCard(idCard)) {
        uni.showToast({
          title: this.$t('身份证号有误-MGt'),
          icon: 'none'
        })
        return
      }
      this.sex = idCardInfoExt(idCard, 2)
      this.age = idCardInfoExt(idCard, 3)
    },
    sexChange: function (e) {
      this.sex = e.detail.value
    },
    _sendMsgCode: function () {
      sendMsgCode(this.link, this)
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
  text-align: right;
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
