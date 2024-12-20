<template>
  <view>
    <view class="bg-white money-info text-center">
      <view class="money-black"></view>
      <view class="money-title">{{ $t('订单金额-Cbl') }}</view>
      <view class="money-value">MOP {{ money }}</view>
    </view>
    <!-- 支付按钮 -->
    <view class="cu-bar btn-group" style="margin-top: 30px">
      <button @click="_submit" class="cu-btn bg-primary shadow-blur round lg" :disabled="!appId">{{ $t('确认支付-Zci') }}</button>
    </view>
  </view>
</template>

<script>
  import { isNotNull } from '../../lib/proprietor/utils/StringUtil.js'
  import { refreshUserOpenId, getWechatMiniOpenId, getCommunityWechatAppId } from '../../api/user/userApi.js'
  import { isWxOrAli } from '../../lib/proprietor/utils/EnvUtil.js'
  import { cashierPayFee } from '../../api/fee/feeApi.js'
  import bocPayMixin from '@/common/mixin/bocPayMixin.js'
  
  export default {
    mixins: [bocPayMixin],
    data() {
      return {
        communityId: '',
        money: 0.0,
        business: '',
        openId: '',
        appId: '',
        data: {},
        cashierUserId: '',
        platform: '',
        // 是否正在跳转支付
        isJumpPay: false
      }
    },
    onShow() {
      // #ifdef APP
      // 监听页面返回，主要为了处理ios中银没有支付回调问题
      if (this.isJumpPay && this.platform === 'ios') {
        uni.showLoading({
          title: this.$t('正在支付...-M3h')
        })
        this.isJumpPay = false
        const timer = setTimeout(() => {
          clearTimeout(timer)
          uni.hideLoading()
          uni.redirectTo({
            url: `/pages/successPage/successPage?objType=3003`
          })
        }, 1000)
      }
      // #endif
    },
    onLoad(options) {
      const { openId, communityId, cashierUserId, money, business } = options
      this.openId = openId
      this.communityId = communityId
      this.cashierUserId = cashierUserId
      this.money = money
      this.business = business
      this.data = uni.getStorageSync('doing_cashier')
      this.platform = uni.getSystemInfoSync().platform

      const _that = this
      this._loadAppId(function() {
        if (!isNotNull(_that.openId)) {
          //刷新 openId
          if (isWxOrAli() == 'ALIPAY') {
            _that._refreshAliPayOpenId()
            return
          }
          //todo h5 情况
          _that._refreshWechatOpenId()
          return

          // 微信小程序
          // _that._refreshWechatMiniOpenId();
        }
      })
    },
    methods: {
      _loadAppId: function(_call) {
        const _objType = '1100' // todo public
        // 微信小程序
        // _objType = "1000";

        const _that = this
        getCommunityWechatAppId({
          communityId: this.communityId,
          objType: _objType
        }).then(_data => {
          _that.appId = _data.data
          _call()
        })
      },
      _refreshWechatOpenId: function() {
        const _redirectUrl = window.location.href
        refreshUserOpenId({
          redirectUrl: _redirectUrl,
          wAppId: this.appId
        }).then(_data => {
          if (_data.code == 0) {
            // window.location.href = _data.data.openUrl;
            return
          }
        })
      },
      _refreshWechatMiniOpenId: function() {
        const _that = this
        wx.login({
          success: function(loginRes) {
            if (!loginRes.code) {
              return
            }
            const accountInfo = uni.getAccountInfoSync()
            const appId = accountInfo.miniProgram.appId
            getWechatMiniOpenId({
              code: loginRes.code,
              appId: appId
            }).then(_data => {
              if (_data.code != 0) {
                uni.showToast({
                  icon: 'none',
                  title: _data.msg
                })
                return
              }
              _that.openId = _data.data
            })
          },
          fail: function(error) {
            // 调用 wx.login 接口失败
            console.log('调用wx.login获取code失败')
            console.log(error)
          }
        })
      },
      _submit: function() {
        if (!this.appId) {
          uni.showToast({
            icon: 'none',
            title: this.$t('小区未配置支付信息-7WP')
          })
          return
        }
        const _data = this.data
        _data.business = this.business
        // #ifdef APP
        _data.tradeType = 'app'
        // #endif
        // #ifdef H5
        _data.tradeType = 'web'
        // #endif
        _data.appId = this.appId
        _data.cashierUserId = this.cashierUserId
        _data.openId = this.openId
        cashierPayFee(_data, (res) => {
          const { code, payUrl, orderId } = res

          if (code == 200) {
            // #ifdef APP
            // 中银支付  调用mixin中的方法
            uni.setStorageSync('orderParams', { ...this.data, orderId })
            if (this.platform === 'ios') this.isJumpPay = true
            this.bocPayMixin(res, (e) => {
              if (e == '200') {
                uni.redirectTo({
                  url: `/pages/successPage/successPage?objType=3003`
                })
              } else {
                uni.showToast({
                  icon: 'none',
                  title: e
                })
              }
            })
            // #endif

            // #ifdef H5
            if (payUrl) {
              uni.setStorageSync('orderParams', { ...this.data, orderId })
              window.location.href = payUrl
            } else {
              uni.showToast({
                title: '支付payUrl为空'
              })
            }
            // #endif
          } else {
            uni.showToast({
              icon: 'none',
              title: res.msg
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .money-info {
    height: 400upx;
    margin: 20upx;

    .money-black {
      height: 120upx;
    }

    .money-title {
      font-size: 32upx;
    }

    .money-value {
      color: #e54d42;
      margin-top: 20upx;
      font-size: 64upx;
    }
  }
</style>
