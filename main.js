import Vue from 'vue';
import App from './App';
import conf from './conf/config.js';
// 语言包
import messages from './locale/index'
import VueI18n from 'vue-i18n'

// 获取用户设置的语言、用户没有设置则获取设备的语言、不然就默认繁体
const defaultLang = uni.getStorageSync('lang')

let lang = ''
// 第一次进app未设置语言
if (!uni.getStorageSync('lang')) {
  const phoneLang = uni.getLocale()
  lang = phoneLang
  // 判断语言是否是 简体和繁体之外的语言  是则默认繁体
  if (phoneLang !== 'zh-Hant' && phoneLang !== 'zh-Hans') lang = 'zh-Hant'
} else {
  lang = defaultLang
}

// 设置默认语言
if (!defaultLang) uni.setStorageSync('lang', lang)

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: lang,
  fallbackLocale: 'zh-Hant',
  messages,
  silentTranslationWarn: true
})

import vc from './core/vcFramework.js'
// 小程序全局分享设置
// import share from './common/mixin/shareMixin.js'
// Vue.mixin(share)

Vue.config.productionTip = false;

Vue.prototype.vc = vc;
Vue.prototype.imgUrl = conf.imgUrl;

Vue.prototype.$onLaunched = new Promise(resolve => {
    Vue.prototype.$isResolve = resolve
})


App.mpType = 'app';

const app = new Vue({
    ...App,
    i18n
});
app.$mount();

export { i18n }
