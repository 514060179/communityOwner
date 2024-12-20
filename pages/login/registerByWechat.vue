<template>
  <view>
    <view class="block__title">{{ $t('选择小区-Jil') }}</view>

    <view class="cu-form-group arrow">
      <view class="title">{{ $t('市-f8V') }}/{{ $t('区-GEp') }}</view>
      <pickerAddress @change="change">{{ areaName || $t('请选择地区-Hrr') }}</pickerAddress>
      <text class="cuIcon-right"></text>
    </view>

    <view class="cu-form-group" @tap="chooseCommunity">
      <view class="title">{{ $t('小区名称-Z2i') }}</view>
      <input v-model="communityName" required readonly :label="$t('小区名称-Z2i')" :placeholder="$t('请选择小区-M5Q')" name="communityName" icon="arrow" />
      <text class="cuIcon-right"></text>
    </view>

    <view class="block__title">{{ $t('业主信息-PQ8') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('姓名-rTx') }}</view>
      <input v-model="appUserName" required :label="$t('姓名-rTx')" clearable :placeholder="$t('请输入名称-PaE')" name="appUserName" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('身份证-4Dk') }}</view>
      <input v-model="idCard" required :label="$t('身份证-4Dk')" clearable :placeholder="$t('请输入身份证-bqg')" name="idCard" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('密码-J8X') }}</view>
      <input v-model="password" required type="password" :label="$t('密码-J8X')" clearable :placeholder="$t('请输入密码-8j6')" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('确认密码-NGn') }}</view>
      <input v-model="rePassword" required type="password" :label="$t('确认密码-NGn')" clearable :placeholder="$t('请输入确认密码-SzS')" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('手机号-9dl') }}</view>
      <input v-model="link" required :label="$t('手机号-9dl')" disabled="disabled" clearable :placeholder="$t('请输入手机号-Cdr')" />
      <button class="cu-btn bg-green" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">{{ $t('获取手机号-qlK') }}</button>
    </view>
    <view class="padding flex flex-direction margin-top">
      <button class="cu-btn bg-green lg" @click="_doRegister()">{{ $t('绑定-Nl3') }}</button>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
import pickerAddress from '../../components/pickerAddress/pickerAddress.vue'
import { ownerRegiter } from '../../api/user/userApi.js'
const constant = context.constant

export default {
  components: {
    pickerAddress
  },
  data() {
    return {
      title: 'Hello',
      areaCode: '',
      areaName: '',
      communityName: '',
      communityId: '',
      appUserName: '',
      idCard: '',
      link: '',
      second: 60,
      msgCode: '',
      areaShow: false,
      // btnValue: '验证码',
      btnDisabled: false,
      password: '',
      rePassword: '',
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {}
      },
      sessionKey: '',
      openId: ''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _that = this
    const _location = context.getLocation()
    const _currentLocation = context.getCurrentLocation()

    const _areaName = _currentLocation.city + _currentLocation.district
    const _areaCode = _currentLocation.adcode
    //加载省份
    context._loadArea('', '', function (_areaList) {
      _that.areaList = _areaList
      _that.communityName = _location
      _that.areaCode = _areaCode
      _that.areaName = _areaName
    })

    uni.login({
      success: res => {
        console.log('login', res)
        _that.wxLogin(res.code)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.areaCode == '' || this.areaCode == undefined) {
      const _currentLocation = context.getCurrentLocation()
      const _areaName = _currentLocation.city + _currentLocation.district
      const _areaCode = _currentLocation.adcode
      this.areaCode = _areaCode
      this.areaName = _areaName
    } else {
      const community = uni.getStorageSync('_selectCommunity')
      if (community != null && community != undefined) {
        this.communityId = community.communityId
        this.communityName = community.name
      }
    }
  },
  methods: {
    onGetPhoneNumber(e) {
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
        wx.showToast({
          title: this.$t('手机号码未授权，请授权后再使用-3Vo'),
          icon: 'none'
        })
        return
      }
      const _that = this
      wx.request({
        url: constant.url.getWxPhoto,
        method: 'post',
        header: context.getHeaders(),
        data: {
          iv: e.detail.iv,
          // 用户非敏感信息
          key: _that.sessionKey,
          // 签名
          decryptData: e.detail.encryptedData
        },
        success: function (res) {
          const _json = res.data
          console.log('日志', _json)
          if (_json.code == 0) {
            _that.link = _json.data.phoneNumber
          }
        },
        fail: function (error) {}
      })
    },
    _doRegister: function (e) {
      const obj = {
        areaCode: this.areaCode,
        communityId: this.communityId,
        communityName: this.communityName,
        appUserName: this.appUserName,
        idCard: this.idCard,
        link: this.link,
        msgCode: this.msgCode,
        password: this.password,
        openId: this.openId,
        sessionKey: this.sessionKey
      }

      let msg = ''
      if (this.password == '' || this.password != this.rePassword) {
        msg = this.$t('密码和重置密码不一致-1pY')
      } else if (obj.areaCode == '') {
        msg = this.$t('请选择地区-Hrr')
      } else if (obj.communityName == '') {
        msg = this.$t('请填写小区名称-MXB')
      } else if (obj.appUserName == '') {
        msg = this.$t('请填写业主名称-ERf')
      } else if (obj.link == '') {
        msg = this.$t('请填写手机号-qYB')
      }
      if (msg != '') {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
      } else {
        ownerRegiter(obj).then(_data => {
          if (_data.code == 0) {
            wx.hideLoading()
            wx.redirectTo({
              url: '/pages/login/login'
            })
            return
          }
        })
      }
    },
    change: function (data) {
      const _that = this
      _that.areaName = ''

      data.data.forEach(function (_obj) {
        _that.areaName += _obj.name
      })
      _that.areaCode = data.data[2].code
      console.log(data)
    },
    /**
     * 选择小区
     */
    chooseCommunity: function (e) {
      if (this.areaCode == '' || this.areaCode == undefined) {
        wx.showToast({
          title: this.$t('请先选择地区-FEa'),
          icon: 'none'
        })
        return
      }
      wx.navigateTo({
        url: '/pages/my/viewCommunitys?areaCode=' + this.areaCode
      })
    },
    wxLogin: function (_code) {
      const _that = this
      let _appId = ''
      // #ifdef MP-WEIXIN
      const accountInfo = uni.getAccountInfoSync()
      _appId = accountInfo.miniProgram.appId
      // #endif
      wx.request({
        url: constant.url.loginUrl,
        method: 'post',
        header: context.getHeaders(),
        data: {
          code: _code,
          // 用户非敏感信息
          signature: '',
          // 签名
          encryptedData: '',
          // 用户敏感信息
          iv: '', // 解密算法的向量
          appId: _appId,
          userInfo: {}
        },
        success: function (res) {
          const sessionKey = res.data.sessionKey
          _that.sessionKey = sessionKey
          _that.openId = res.data.openId
        },
        fail: function (error) {
          // 调用服务端登录接口失败
          const sessionKey = res.data.sessionKey
          _that.sessionKey = sessionKey
          _that.openId = res.data.openId
        }
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
  text-align: center;
}
</style>
