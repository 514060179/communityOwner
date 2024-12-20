<template>
  <view class="page-login" :style="{'padding-top': statusHeight + 'px'}">
    <!-- 导航栏 -->
    <vc-tabbar isBack isFixed :title="$t('登录-kx4')" background="none" />

    <view class="login-content">
      <view class="header-card">
        <view class="logo-content">
          <image :src="logoUrl" />
        </view>
        <text>{{ $t('尊敬的业主，欢迎回来！-qE8') }}</text>
      </view>

      <view class="login-form-content">
        <view class="form-item">
          <view class="item-label">{{ $t('手机号-9dl') }}</view>
          <view class="item-cell">
            <view class="item-cell_area" @tap="openPopup('area')">
              <text>{{ areaItem.title }}</text>
            </view>
            <view class="item-cell_input">
              <input v-model="username" type="text" :placeholder="$t('请输入手机号-Cdr')" />
            </view>
          </view>
        </view>
        <view class="form-item">
          <view class="item-label">{{ loginByPhone ? $t('验证码-dkC') : $t('密码-J8X') }}</view>
          <view class="item-cell">
            <image :src="`../../static/images/icons/password.png`" />
            <view class="item-cell_input">
              <input v-model="password" :password="!showPass" :placeholder="loginByPhone ? $t('请输入验证码-HOU') : $t('请输入密码-8j6')" />
            </view>
            <image class="icon-eye" :src="passwordUrl" v-if="!loginByPhone" @tap="changePassType" />
            <button class="item-cell_button" :disabled="btnDisabled" @click="sendMsgCode()" v-else>
              {{ btnValue || $t('获取验证码-TpM') }}
            </button>
          </view>
        </view>
        <!-- 隐私协议 -->
        <view class="protocol-content">
          <view class="protocol-hint" v-if="!isCheckedProtocol">
            <view class="hint">{{ $t('请勾选同意后再进行登录-FmQ') }}</view>
          </view>
          <view class="protocol-box">
            <checkbox-group @change="changeProtocol">
              <checkbox value="protocol" :checked="isCheckedProtocol" />
            </checkbox-group>
            <view class="protocol-cell">
              <text>{{ $t('我已阅读并同意-YDC') }}</text>
              <text class="primary-text" @tap="linkClick('agreement')">《{{ $t('用戶協議-75k') }}》</text>
              <text>{{ $t('和-xGZ') }}</text>
              <text class="primary-text" @tap="linkClick('privacy')">《{{ $t('隱私政策-dQB') }}》</text>
            </view>
          </view>
        </view>

        <view class="botton-content">
          <view class="button-box blue-bg" @click="_doLogin()">{{ $t('登录-kx4') }}</view>
          <view class="button-box primary-bg" @click="_doRegister()">{{ $t('login.register') }}</view>
          <view class="button-box" @click="_doLoginPhone()">{{ phoneLoginName || $t('验证码登录-zBP') }}</view>
        </view>
      </view>
    </view>
    <vc-area-popup v-if="areaPopup" :selectArea="areaItem" @selectArae="changeArea" @close="closePopup" />
    <vc-protocol-popup v-if="protocolPopup" :type="protocolType" @close="closePopup" />
	<slider-verification-code v-if="showVerify" :modalShow="showVerify" @closeModal="onVerifySuccess" />
  </view>
</template>

<script>
  import { sendSmsCode, ownerLogin } from '../../api/user/userApi.js'
  import context from '../../lib/proprietor/proprietorContext.js'
  import { saveUserLoginInfo, removeUserLoginInfo } from '@/lib/proprietor/utils/StorageUtil.js'
  import { checkPhoneNumber } from '../../lib/proprietor/utils/StringUtil.js'
  import { hasAuthOwner } from '../../api/owner/ownerApi.js'
  import conf from '@/conf/config.js'
  import SliderVerificationCode from '@/components/SlideVerify/SlideVerify.vue'
  
  // #ifdef APP
  import jPush from '@/common/utils/jpush.js'
  // #endif

  const constant = context.constant
  const factory = context.factory
  const login = 1 //1标识登录页面 请下发code 不要下发key

  export default {
	  components: {
	  	SliderVerificationCode,
	  },
    data() {
      return {
        logoUrl: '',
        username: '',
        password: '',
        // 区号
        areaItem: {
          id: 1,
          title: '+853',
          desc: this.$t('中国澳门-NCE')
        },
        code: '',
        loginByPhone: false,
        msgCode: '',
        btnDisabled: false,
        btnValue: '',
        phoneLoginName: '',
        // 是否勾选隐私协议
        isCheckedProtocol: false,
		// 密码icon路径
		passwordUrl: '',
        // 是否展示密码
        showPass: false,
        // 区号弹窗
        areaPopup: false,
        // 隐私政策弹窗
        protocolPopup: false,
        // 用户协议 / 隐私政策
        protocolType: 'privacy',
		showVerify:false,
		silderInfo:{} // 存储滑块验证信息
      }
    },
    onLoad() {
	  this.passwordUrl = "../../static/images/icons/close-eye.png";
      const userImg = uni.getStorageSync('userHeaderImg') || `${this.imgUrl}/h5/images/logo.jpg`
      this.logoUrl = userImg
      this.isCheckedProtocol = uni.getStorageSync('protocolChecked') || false
      const userPhone = uni.getStorageSync('userLoginPhone')
      if (userPhone) {
        this.username = userPhone.username
        this.areaItem = userPhone.areaItem
      }
      
      //todo 清除缓存内容，以防 业主后退，然后还显示他的东西
      uni.removeStorageSync('ownerInfo')
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('JAVA110_USER_INFO')
      uni.removeStorageSync('currentCommunityInfo')
      removeUserLoginInfo()
    },
    computed: {
      //状态栏高度
      statusHeight() {
        //#ifdef H5
        return 0;
        //#endif
        return uni.getSystemInfoSync().statusBarHeight || 10; //如果没有获取到高度，那么指定10px；
      }
    },
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
      // 切换密码展示和隐藏
      changePassType() {
        this.showPass = !this.showPass
		this.passwordUrl = this.showPass ? "../../static/images/icons/open-eye.png" : "../../static/images/icons/close-eye.png";
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
      // 切换勾选隐私政策
      changeProtocol(e) {
        this.isCheckedProtocol = e.detail.value.includes('protocol')
      },
      // 切换区号
      changeArea(e) {
        this.areaItem = e
        this.areaPopup = false
      },
	  
	  // 滑块验证成功回调
	   onVerifySuccess(data){
	    this.showVerify = false;
	    // 如果没有验证数据，说明是关闭操作，直接返回
	    if (!data.captcha || !data.id) {
	      return;
	    }
	   sendSmsCode({ tel: this.username, areaCode: this.areaItem.title }, this);
	  },
      
      // 登录
      async _doLogin() {
        const _that = this
        if (this.username == '') {
          uni.showToast({
            title: this.$t('请填写用户名-LEc'),
            icon: 'none'
          })
          return
        }
        if (!checkPhoneNumber(this.username, this.areaItem.title)) {
          uni.showToast({
            title: this.$t('手机号有误-CIh'),
            icon: 'none'
          })
          return
        }
        if (this.password == '') {
          uni.showToast({
            title: this.$t('请填写密码-a9w'),
            icon: 'none'
          })
          return
        }
        if (!this.isCheckedProtocol) {
          uni.showToast({
            title: this.$t('请阅读并同意《用戶协议》和《隐私政策》-Vg8'),
            icon: 'none'
          })
          return
        }
        try {
          const _obj = {
            username: this.username,
            password: this.password,
            areaCode: this.areaItem.title,
            code: _that.code,
            appId: this.vc.getWAppId(),
            loginByPhone: this.loginByPhone
          }
          const _user = await ownerLogin(this, _obj)
          //todo 保存登录信息
          saveUserLoginInfo(_user.userId, _user.token, _user.key)
          uni.setStorageSync('protocolChecked', this.isCheckedProtocol)
          // 记住用户的手机号和区号
          uni.setStorageSync('userLoginPhone', { areaItem: this.areaItem, username: _obj.username })
          hasAuthOwner()
          // #ifdef APP
          // 注册极光设备别名
          const alias = conf.isPro ? `prod_${_user.userId}` : `test_${_user.userId}`
          jPush.setAlias({
            alias,
            sequence: 1
          })
          // #endif
          uni.navigateTo({
            url: '/pages/login/loginInitWechat?communityId=' + _user.communityId
          })
        } catch (e) {
          uni.showToast({
            icon: 'none',
            title: e
          })
          console.log(e)
        } finally {
          uni.hideLoading()
        }
        
      },
      // 去注册
      _doRegister: function() {
        //let _url = '/pages/login/registerByWechat';
        const _url = '/pages/login/register'
        this.vc.navigateTo({
          url: _url
        })
      },
      // 发送验证码
      sendMsgCode: function() {
        if (!this.isCheckedProtocol) {
          uni.showToast({
            title: this.$t('请阅读并同意《用戶协议》和《隐私政策》-Vg8'),
            icon: 'none'
          })
          return
        }
		
		if (!this.username) {
		  uni.showToast({
		    title: this.$t('请填写手机号-qYB'),
		    icon: 'none'
		  })
		  return
		}
		this.showVerify= true;
        // sendSmsCode({ tel: this.username, areaCode: this.areaItem.title }, this)
      },
      // 切换密码登录/验证码登录
      _doLoginPhone: function() {
        this.loginByPhone = !this.loginByPhone
        this.password = ''
        if (this.loginByPhone) {
          this.phoneLoginName = this.$t('密码登录-BWB')
          this.showPass = true
        } else {
          this.phoneLoginName = this.$t('验证码登录-zBP')
          this.showPass = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-login {
    min-height: 100vh;
    background: linear-gradient(180deg, #C21DA0 0%, #5E66AE 100%);
  }

  .login-content {
    padding-top: 150rpx;

    .header-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 28rpx;
      color: #fff;
      margin-bottom: 56rpx;

      .logo-content {
        width: 148rpx;
        height: 148rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #ffffff;
        margin-bottom: 56rpx;

        image {
          width: 140rpx;
          height: 140rpx;
          border-radius: 50%;
        }
      }
    }

    .login-form-content {
      padding: 60rpx;

      .form-item {
        margin-bottom: 20rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .item-label {
          color: #fff;
          font-size: 24rpx;
          margin-bottom: 10rpx;
        }

        .item-cell {
          width: 100%;
          height: 100rpx;
          background-color: #fff;
          border-radius: 20rpx;
          display: flex;
          align-items: center;
          padding: 10rpx 28rpx;

          .item-cell_area {
            display: flex;
            align-items: center;
            font-size: 24rpx;

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

          .item-cell_input {
            flex: 1;
            padding: 0 20rpx 0 30rpx;

            ::v-deep uni-input {
              font-size: 24rpx;
            }

            ::v-deep .uni-input-placeholder {
              color: #C0C4CC;
            }
          }

          image {
            width: 40rpx;
            height: 40rpx;
          }

          .icon-eye {
            width: 40rpx;
            height: 30rpx;
          }

          .item-cell_button {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 50rpx;
            padding: 10rpx;
            font-size: 20rpx;
            color: #ffffff;
            background: #C21DA0;
            border-radius: 10rpx;
          }
        }
      }
    }

    .protocol-content {
      font-size: 24rpx;
      color: #ffffff;

      .protocol-hint {
        display: flex;

        .hint {
          padding: 6rpx 18rpx;
          border-radius: 8rpx;
          background-color: #E196D1;
          position: relative;
          margin-bottom: 6rpx;

          &::after {
            content: '';
            position: absolute;
            left: 8rpx;
            bottom: -6rpx;
            width: 0;
            height: 0;
            border-left: 8rpx solid transparent;
            border-right: 8rpx solid transparent;
            border-top: 8rpx solid #E196D1;
          }
        }
      }

      .protocol-box {
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
    }

    .botton-content {
      margin-top: 60rpx;

      .button-box {
        width: 100%;
        height: 100rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20rpx;
        color: #fff;
        font-size: 28rpx;
        margin-bottom: 14rpx;

        &:active {
          opacity: 0.8;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }

      .blue-bg {
        background: #606EF0;
      }

      .primary-bg {
        background: #C21DA0;
      }
    }
  }
</style>
