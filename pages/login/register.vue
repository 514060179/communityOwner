<template>
  <view>
    <view class="block__title">{{ $t('注册信息-ZYZ') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('手机号-9dl') }}</view>
      <view class="area-cell" @tap="openPopup('area')">
        <text>{{ areaItem.title }}</text>
      </view>
      <input v-model="link" required :label="$t('手机号-9dl')" clearable :placeholder="$t('请输入手机号-Cdr')" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('密码-J8X') }}</view>
      <input v-model="password" required type="password" label="密码" clearable :placeholder="$t('请输入密码-8j6')" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('确认密码-NGn') }}</view>
      <input v-model="rePassword" required type="password" label="确认密码" clearable :placeholder="$t('请输入确认密码-SzS')" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('验证码-dkC') }}</view>
      <input v-model="msgCode" :placeholder="$t('请输入短信验证码-YxH')" name="input" />
      <button class="cu-btn bg-green shadow" :disabled="btnDisabled" @click="_sendMsgCode()">{{ btnValue || $t('获取验证码-TpM') }}</button>
    </view>
    <view class="protocol-box">
      <checkbox-group @change="_changeReadme">
        <checkbox value="readme" />
      </checkbox-group>
      <view class="protocol-cell">
        <text>{{ $t('我已阅读并同意-YDC') }}</text>
        <text class="primary-text" @tap="linkClick('agreement')">《{{ $t('用戶協議-75k') }}》</text>
        <text>{{ $t('和-xGZ') }}</text>
        <text class="primary-text" @tap="linkClick('privacy')">《{{ $t('隱私政策-dQB') }}》</text>
      </view>
    </view>
    <view class="padding flex flex-direction margin-top">
      <button class="cu-btn bg-green lg" @click="_doRegister()">{{ $t('绑定-Nl3') }}</button>
    </view>
    <!-- 区号弹窗 -->
    <vc-area-popup v-if="areaPopup" :selectArea="areaItem" @selectArae="changeArea" @close="closePopup" />
    <!-- 隐私政策弹窗 -->
    <vc-protocol-popup v-if="protocolPopup" :type="protocolType" @close="closePopup" />
  </view>
</template>

<script>
  import context from '../../lib/proprietor/proprietorContext.js'
  import conf from '../../conf/config'
  import { sendSmsCode, ownerRegiter } from '../../api/user/userApi.js'
  import { checkPhoneNumber } from '../../lib/proprietor/utils/StringUtil.js'

  const constant = context.constant

  export default {
    data() {
      return {
        link: '',
        second: 60,
        codeMsg: '',
        msgCode: '',
        // 区号
        areaItem: {
          id: 1,
          title: '+853',
          desc: this.$t('中国澳门-NCE')
        },
        areaShow: false,
        btnValue: '',
        btnDisabled: false,
        password: '',
        rePassword: '',
        readme: false,
        // 区号弹窗
        areaPopup: false,
        // 隐私政策弹窗
        protocolPopup: false,
        // 用户协议 / 隐私政策
        protocolType: 'privacy'
      }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},
    methods: {
      linkClick(type) {
        if (type === 'agreement') {
          // 用户协议
          // #ifdef H5
          window.open("https://proprietor.newlandgo.com/agreement.html",'_blank')
          // #endif
          // #ifdef APP
          plus.runtime.openWeb('https://proprietor.newlandgo.com/agreement.html')
          // #endif
        } else if (type === 'privacy') {
          // #ifdef H5
          window.open("https://proprietor.newlandgo.com/privacy.html", '_blank')
          // #endif
          // 隐私政策
          // #ifdef APP
          plus.runtime.openWeb('https://proprietor.newlandgo.com/privacy.html')
          // #endif
        }
      },
      // 切换区号
      changeArea(e) {
        this.areaItem = e
        this.areaPopup = false
      },
      // 关闭弹窗
      closePopup() {
        this.areaPopup = false
        this.protocolPopup = false
      },
      // 打开弹窗  区号/用户协议/隐私政策
      openPopup(type) {
        if (type === 'area') {
          this.areaPopup = true
        } else if (type === 'privacy' || type === 'protocol') {
          this.protocolType = type
          this.protocolPopup = true
        }
      },
      _sendMsgCode: function() {
        sendSmsCode({ tel: this.link, areaCode: this.areaItem.title }, this)
      },
      _changeReadme: function(e) {
        if (e.detail.value && e.detail.value.length > 0) {
          this.readme = true
        } else {
          this.readme = false
        }
      },
      _doRegister: function(e) {
        let _communityId = uni.getStorageSync('DEFAULT_COMMUNITY_ID')
        if (!_communityId) {
          _communityId = conf.DEFAULT_COMMUNITY_ID
        }
        const obj = {
          link: this.link,
          msgCode: this.msgCode,
          password: this.password,
          openId: uni.getStorageSync(constant.mapping.CURRENT_OPEN_ID),
          areaCode: this.areaItem.title,
          defaultCommunityId: _communityId
        }
        if (!this.readme) {
          wx.showToast({
            title: this.$t('请阅读并同意《用戶协议》和《隐私政策》-Vg8'),
            icon: 'none',
            duration: 2000
          })
          return
        }
        let msg = ''
        if (this.password == '' || this.password != this.rePassword) {
          msg = this.$t('密码和重置密码不一致-1pY')
        } else if (obj.link == '') {
          msg = this.$t('请填写手机号-qYB')
        } else if (!checkPhoneNumber(obj.link, obj.areaCode)) {
          msg = this.$t('手机号有误-CIh')
        } else if (obj.msgCode == '') {
          msg = this.$t('请填写验证码-2Ng')
        }
        if (msg != '') {
          uni.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
          })
          return
        }
        ownerRegiter(obj).then(_data => {
          if (_data.code == 0) {
            wx.hideLoading()
            wx.redirectTo({
              url: '/pages/login/login'
            })
            return
          }
        })
      },
      change: function(data) {
        const _that = this
        _that.areaName = ''
        data.data.forEach(function(_obj) {
          _that.areaName += _obj.name
        })
        _that.areaCode = data.data[2].code
        console.log(data)
      },

      _readMe: function() {
        uni.navigateTo({
          url: '/pages/login/registerProtocol'
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
    text-align: center;
  }

  .read-me {
    line-height: 64upx;
  }

  .user-read {
    margin-left: 10upx;
    color: darkgreen;
  }

  ::v-deep .cu-form-group uni-input {
    flex: 3;
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

  .area-cell {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    margin-right: 14rpx;

    &::after {
      display: inline-block;
      content: " ";
      margin-left: 15rpx;
      margin-bottom: 10rpx;
      height: 14rpx;
      width: 14rpx;
      border-width: 0 4rpx 4rpx 0;
      border-color: #333333;
      border-style: solid;
      transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      transform-origin: center;
      transition: transform .3s;
    }
  }

  .protocol-box {
    padding: 30rpx 20rpx;
    display: flex;
    align-items: center;

    ::v-deep uni-checkbox .uni-checkbox-input {
      width: 30rpx;
      height: 30rpx;
      color: #C21DA0 !important;
      border-radius: 8rpx;
      border: none;
    }

    ::v-deep uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
      font-size: 24rpx;
    }

    ::v-deep uni-radio::before,
    uni-checkbox::before {
      content: none;
    }
  }

  .protocol-cell {
    margin-left: 20rpx;
  }

  .primary-text {
    color: #E196D1;
  }
</style>