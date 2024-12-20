// #ifdef APP
const bocPayPlugin = uni.requireNativePlugin('NL-BocPayUniPlugin')
// #endif
import conf from '@/conf/config.js'
export default {
  methods: {
    // 中银支付
    bocPayMixin(res, fn) {
      // #ifdef APP
      const { payToken, iosBocpayAppId, androidBocpayAppId, wechatPayAppId, wechatPayLink, alipaySchemes, publicKey, support_paytype, merchantMarketInformation } = res
      const lang = uni.getStorageSync("lang")
      
      let language = ''
      let payMethods = support_paytype
      let env = conf.isPro ? 'BocAasEnviromentTypeBU' : 'BocAasEnviromentTypeCU'
      let appId = ''
      // 平台差异
      if (uni.getSystemInfoSync().platform === 'ios') {
        language = 'TC'
        appId = iosBocpayAppId
        payMethods = JSON.parse(decodeURIComponent(support_paytype))
      } else if (uni.getSystemInfoSync().platform === 'android') {
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
      // 调用支付
      bocPayPlugin.showPayView(
        payToken,
        publicKey,
        env,
        merchantMarketInformation,
        language,
        payMethods,
        (res) => {
          fn && fn(res)
        }
      )
      // #endif
    }
  }
}