<template>
  <view>
    <scroll-view scroll-y>
      <view class="block__title">{{ $t('订单信息-43M') }}</view>
      <form>
        <view class="cu-list menu">
          <view class="cu-item">
            <view class="content">
              <text class="text-b">{{ orderInfo.name }}</text>
            </view>
          </view>
          <view class="cu-item">
            <view class="content">
              <text class="text-grey">{{ $t('预约日期-SSV') }}</text>
            </view>
            <view class="action">
              <text class="text-grey text-sm"> {{ orderInfo.bookDate }}</text>
            </view>
          </view>
          <view class="block__title">{{ $t('场地信息-CeS') }}</view>
          <view class="cu-list menu" v-for="(item, index) in bookList" :key="index">
            <view class="cu-item">
              <view class="content">
                <text class="text-grey">{{ $t('预约时间-FzQ') }}</text>
              </view>
              <view class="action">
                <text class="text-grey text-sm">{{ item.timeValue }}</text>
              </view>
            </view>
          </view>
        </view>

      </form>
    </scroll-view>
    <!-- 底部 -->
    <view class=" bg-white  border flex cu-form-group" style="position: fixed;width: 100%;bottom: 0;">
      <view class="title">{{ $t('总计-Jlq') }}:
        <text class="solid-bottom text-xxl text-price text-red">{{ total }}</text>
      </view>
      <view class="btn-group">
        <button @click="submit" class="cu-btn round bg-primary" style="background-color: #1cbbb4;">{{ $t('提交订单-sDX') }}</button>
      </view>
    </view>
  </view>

  </view>
</template>

<script>
  import context from '../../lib/proprietor/proprietorContext.js';
  import { unifiedPayment } from '@/api/appointment/appointmentApi.js'
  import { getUserName, getUserTel } from '../../api/user/userApi.js'
  import conf from '@/conf/config.js'
  // #ifdef APP
  const bocPayPlugin = uni.requireNativePlugin('NL-BocPayUniPlugin')
  // #endif

  export default {
    data() {
      return {
        // 场馆信息
        orderInfo: {},
        // 选中的时间列表
        bookList: [],
        // 总价
        total: 0,
        // 是否正在跳转支付
        isJumpPay: false
      };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
      this.orderInfo = uni.getStorageSync('appointmentSpace') || {}
      this.bookList = JSON.parse(this.orderInfo.bookList)
      this.total = (Number(this.orderInfo.feeMoney) * this.bookList.length).toFixed(2)
      this.loadOwenrInfo();
    },
    onShow() {
      // #ifdef APP
      // 监听页面返回，主要为了处理ios中银没有支付回调问题
      const platform = uni.getSystemInfoSync().platform
      if (this.isJumpPay && platform === 'ios') {
        this.isJumpPay = false
        uni.showLoading({
          title: this.$t('正在支付...-M3h')
        })
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
    methods: {
      loadOwenrInfo() {
        context.getOwner((_ownerInfo) => {
          this.ownerInfo = _ownerInfo;
        });
      },
      // 预下单
      async submit() {
        try {
          const spaces = [{
            spaceId: this.orderInfo.spaceId,
            openTimes: this.bookList
          }]

          const cashierUserId = uni.getStorageSync('userInfo').userId

          const _objData = {
            business: 'venueReservation',
            // #ifdef APP
            tradeType: 'app',
            // #endif
            // #ifdef H5
            tradeType: 'h5',
            // #endif
            communityId: this.orderInfo.communityId,
            spaces: JSON.stringify(spaces),
            personName: getUserName(),
            personTel: getUserTel(),
            payWay: '2',
            state: 'S',
            remark: '',
            appointmentTime: this.orderInfo.bookDate
          };
          const { data } = await unifiedPayment(_objData)
          const {
            code,
            payToken,
            iosBocpayAppId,
            androidBocpayAppId,
            // wechatPayAppId,
            // wechatPayLink,
            // alipaySchemes,
            publicKey,
            support_paytype,
            merchantMarketInformation,
            payUrl,
            orderId,
            msg
          } = data
          if (code == 200) {
            // #ifdef APP
            const lang = uni.getStorageSync("lang")
            const platform = uni.getSystemInfoSync().platform
            let language = ''
            let payMethods = support_paytype
            let env = conf.isPro ? 'BocAasEnviromentTypeBU' : 'BocAasEnviromentTypeCU'
            let appId = ''
            // 平台差异
            if (platform === 'ios') {
              language = 'TC'
              appId = iosBocpayAppId
              payMethods = JSON.parse(decodeURIComponent(support_paytype))
            } else if (platform === 'android') {
              appId = androidBocpayAppId
              language = 'ZH'
            }

            if (lang === 'en') language = 'EN'

            // 设置环境 true: 生产  false: 测试环境
            bocPayPlugin.setEnvironmentWithProduction(conf.isPro)
            // 初始化boc支付方式
            // bocPayPlugin.registerBocPay(this.platform === 'ios' ? iosBocpayAppId : androidBocpayAppId)
            bocPayPlugin.registerBocPay(appId)
            // 初始化微信支付方式
            // bocPayPlugin.registerWechatPay(wechatPayAppId, wechatPayLink)
            // 初始化支付宝支付方式
            // bocPayPlugin.registerAliPaySchemes(alipaySchemes)
            // 存储订单信息
            uni.setStorageSync('orderParams', { business: _objData.business, communityId: _objData.communityId, orderId, cashierUserId })
            if (platform === 'ios') this.isJumpPay = true
            // 调用支付
            bocPayPlugin.showPayView(
              payToken,
              publicKey,
              env,
              merchantMarketInformation,
              language,
              payMethods,
              (res) => {
                if (res == '200') {
                  uni.redirectTo({
                    url: `/pages/successPage/successPage?objType=3003`
                  })
                } else {
                  uni.showToast({
                    icon: "none",
                    title: res
                  })
                }
              }
            )
            // #endif

            // #ifdef H5
            if (payUrl) {
              uni.setStorageSync('orderParams', { business: _objData.business, communityId: _objData.communityId, orderId, cashierUserId })
              window.location.href = payUrl
            } else {
              uni.showToast({
                title: '支付payUrl为空'
              })
            }
            // #endif
            // 免费预约
          } else if (code == '100') {
            uni.showToast({
              title: this.$t('预约成功-frr')
            })
            const timer = setTimeout(() => {
              clearTimeout(timer)
              uni.navigateBack({
                delta: 1
              })
            }, 1000)
          } else {
            uni.showToast({
              icon: 'none',
              title: msg
            })
          }
        } catch (e) {
          console.log(e, 'submit')
        }
      }
    }
  };
</script>
<style>
  .ppf_item {
    padding: 0rpx 0rpx 0rpx 0rpx;
  }

  .block__title {
    margin: 0;
    font-weight: 400;
    font-size: 14px;
    color: rgba(69, 90, 100, .6);
    padding: 40rpx 30rpx 20rpx;
  }

  .button_up_blank {
    height: 40rpx;
  }

  .block__bottom {
    height: 180rpx;
  }

  .fee-last {
    margin-bottom: 200upx;
  }

  .cu-btn.lgplus {
    padding: 0 20px;
    font-size: 18px;
    height: 100upx;

  }

  .cu-btn.sharp {
    border-radius: 0upx;
  }

  .line-height {
    line-height: 100upx;
  }
</style>
