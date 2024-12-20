/**
 *
 * 本项目只有这里修改相应配置信息，如果不是二次开发 请不要修改其他文件内容
 *
 * @author Ivan
 *
 */

/**
 * @description 是否是生产，用于打包切换环境切换 true: 生产包  false: 测试或开发包
 * @param {Boolean}
 */
// 是否可切环境
const isSwitch = true;

// 是否生产环境
let isRelease = false;

// 获取用户手动设置的环境
const evn = uni.getStorageSync("evn");
if (isSwitch && evn !== "") isRelease = evn;

/**
 * 区分环境
 */

// oss资源url
let commonBaseUrl = "";

// 服务器域名
let baseUrl = "";
//商城的url
let mallUrl = "";
//商城小程序ID
let mallMinAppId = "";
// APP 或者 公众号  appId
let wAppId = ""; //微信AppId
//app支付时这里需要填写支付秘钥
let appPayKey = "";
// 日志级别
const logLevel = "DEBUG";
// 商场首页
const mallUrlIndexPage = mallUrl + "#/pages/index/index?mallFrom=HC";
//商城token 刷新页面
const mallUrlRefresh = mallUrl + "#/pages/mallTokenRefresh/mallTokenRefresh?mallFrom=HC";
/**
 * 判断环境
 */
if (isRelease) {
  // 生产
  // #ifdef H5
  baseUrl = "/";
  // #endif

  // #ifdef APP
  baseUrl = "https://proprietor.newlandgo.com/";
  // #endif

  // 不区分端
  commonBaseUrl = "https://newland-property.oss-cn-hangzhou.aliyuncs.com";
  // 商城访问地址
  mallUrl = "http://mallapp.homecommunity.cn";
} else {
  // 测试、开发
  // #ifdef H5
  baseUrl = "/";
  // #endif

  // #ifdef APP
  // TODO： 待替换
  // baseUrl = 'https://proprietoruat.newlandgo.com/'
  baseUrl = "https://proprietoruatmo.newlandgo.com/";
  // #endif

  // 不区分端
  commonBaseUrl = "https://newland-property.oss-cn-hangzhou.aliyuncs.com";
  // 商城访问地址
  mallUrl = "https://mpromalluat.newlandgo.com";
  // mallUrl = "http://192.168.10.229:8000";
}

/**
 * 不区分环境
 */
// 系统配置
let DEFAULT_COMMUNITY_ID = "";
let systemName = "脈動";
const _systemConfig = uni.getStorageSync("proprietorSystemConfig");
if (_systemConfig) {
  mallUrl = _systemConfig.mallUrl;
  commonBaseUrl = _systemConfig.imgUrl;
  systemName = _systemConfig.ownerTitle;
  DEFAULT_COMMUNITY_ID = _systemConfig.defaultCommunityId;
}

export default {
  baseUrl: baseUrl,
  mallUrl: mallUrl,
  mallUrlIndexPage: mallUrlIndexPage,
  mallUrlRefresh: mallUrlRefresh,
  commonBaseUrl: commonBaseUrl,
  // 用于没有登录展示
  DEFAULT_COMMUNITY_ID: DEFAULT_COMMUNITY_ID,
  DEFAULT_COMMUNITY_NAME: "暫未綁定小區",
  wAppId: wAppId,
  logLevel: logLevel,
  appPayKey: appPayKey,
  imgUrl: commonBaseUrl,
  systemName: systemName,
  mallMinAppId: mallMinAppId,
  isPro: isRelease,
  isSwitch: isSwitch,
};
