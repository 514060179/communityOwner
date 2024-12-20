/**
 * HC智慧家园配置文件
 * 
 * 本项目只有这里修改相应配置信息，如果不是二次开发 请不要修改其他文件内容
 * 
 * @website http://www.homecommunity.cn/
 * @author 吴学文
 * @QQ 928255095
 */
let _systemConfig = uni.getStorageSync('proprietorSystemConfig');
// #ifdef H5
// 服务器域名 公众号时，配置为 / 就可以
const baseUrl = '/';
// #endif

// #ifndef H5
//服务器域名 小程序 或者 app 时 后端地址
const baseUrl = 'http://192.168.8.213:8008/';
// const baseUrl = 'https://wuye.taksongroup.com/';
// #endif

let commonBaseUrl = 'https://newland-property.oss-cn-hangzhou.aliyuncs.com/';

//商城的url
let mallUrl = 'http://mallapp.homecommunity.cn/';

//商城小程序ID
let mallMinAppId = "xxx";

//默认的小区ID和名称，用户还没有登录时显示的小区信息

let DEFAULT_COMMUNITY_ID = ""; //HC测试小区id  用于没有登录时展示相关信息
let DEFAULT_COMMUNITY_NAME = "暫未綁定小區";

// APP 或者 公众号  appId
const wAppId = ""; //微信AppId

//app支付时这里需要填写支付秘钥
const appPayKey = "";

const logLevel = "DEBUG"; // 日志级别

let systemName = "脈動";

if (_systemConfig) {
  mallUrl = _systemConfig.mallUrl;
  commonBaseUrl = _systemConfig.imgUrl;
  systemName = _systemConfig.ownerTitle;
  DEFAULT_COMMUNITY_ID = _systemConfig.defaultCommunityId;
}

const mallUrlIndexPage = mallUrl + '#/pages/index/index?mallFrom=HC';

//商城token 刷新页面
const mallUrlRefresh = mallUrl + "#/pages/mallTokenRefresh/mallTokenRefresh?mallFrom=HC"

const isPro = false

export default {
  baseUrl: baseUrl,
  mallUrl: mallUrl,
  mallUrlIndexPage: mallUrlIndexPage,
  mallUrlRefresh: mallUrlRefresh,
  commonBaseUrl: commonBaseUrl,
  DEFAULT_COMMUNITY_ID: DEFAULT_COMMUNITY_ID,
  DEFAULT_COMMUNITY_NAME: DEFAULT_COMMUNITY_NAME,
  wAppId: wAppId,
  logLevel: logLevel,
  appPayKey: appPayKey,
  imgUrl: commonBaseUrl,
  systemName: systemName,
  mallMinAppId: mallMinAppId,
  isPro: isPro
}