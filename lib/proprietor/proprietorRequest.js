import coreUtil from './utils/CoreUtil.js'
import app from '../../constant/AppConstant.js'
import { i18n } from '@/main.js'
import { getDateYYYYMMDDHHMISS } from './utils/DateUtil.js'
import url from '../../constant/url.js'
import mapping from '../../constant/MappingConstant.js'
import { getToken } from './utils/StorageUtil.js';
import { hasLogin } from '../../api/user/sessionApi.js';
import { debug, warn, info, error } from './utils/LogUtil.js';
import md5 from './utils/md5Util.js'
// #ifdef APP
import jPush from '@/common/utils/jpush.js'
// #endif

const waitingList = [] // 等待请求队列
const excutingList = [] // 执行队列
const limit = 10 // 最大请求数

/**
 * 获取请求头信息
 **/
export function getHeaders() {
  let _wAppId = uni.getStorageSync(mapping.W_APP_ID);
  let _token = getToken();
  if (!_token) {
    _token = "no login";
  }
  return {
    "app-id": app.appId,
    "transaction-id": coreUtil.wxuuid(),
    "req-time": getDateYYYYMMDDHHMISS(),
    "sign": '1234567',
    "user-id": '-1',
    // #ifdef APP
    "cookie": '_java110_token_=' + getToken(),
    // #endif
    "Accept": '*/*',
    "w-app-id": _wAppId,
    "Authorization": "Bearer " + _token
  };
}

/**
 * 删除所有的缓存
 * @param String[] _unClearList 
 * @description _unClearList 需要保留的列表
 */
const clearLogOutData = function(_unClearList) {

  let data = {}
  let list = _unClearList || mapping.saveStorageList
    
  if (list.length) {
    // 取出要过滤的值
    for (let i = 0; i < list.length; i++) {
      const value = uni.getStorageSync(list[i])
      if (value !== '') data[list[i]] = value
    }
  }
  
  // 清除所有缓存
  uni.clearStorageSync()
  
  // 设置要过滤的值
  if (list.length) {
    for(var key in data) {
      uni.setStorageSync(key, data[key])
    }
  }
}


export function createSign(_reqObj) {

  let _header = _reqObj.header;
  let _transactionId = _header["transaction-id"];
  let _reqTime = _header["req-time"];
  let _appId = _header["app-id"];
  let reqInfo = _transactionId + _reqTime + _appId;

  if (_reqObj.method == 'GET') {
    reqInfo += '?';
    for (let key in _reqObj.data) {
      // #ifdef MP-WEIXIN
      reqInfo += (key + '=' + _reqObj.data[key] + '&');
      // #endif
      // #ifndef MP-WEIXIN
      if (_reqObj.data[key]) {
        reqInfo += (key + '=' + _reqObj.data[key] + '&');
      } else {
        reqInfo += (key + '=' + '&');
      }
      // #endif

    }
    if (reqInfo.endsWith('&')) {
      reqInfo = reqInfo.substr(0, reqInfo.length - 1);
    }
    if (reqInfo.endsWith('?')) {
      reqInfo = reqInfo.substr(0, reqInfo.length - 1);
    }
  } else {
    if (typeof _reqObj.data === "object") {
      reqInfo += JSON.stringify(_reqObj.data);
    } else {
      reqInfo += _reqObj.data;
    }
  }
  reqInfo += "whoisyoudad!!!"
  let _sign = md5(reqInfo);
  _reqObj.header.sign = _sign;

}

function requestAuth(_reqObj) {

  //这里判断只有在 post 方式时 放加载框
  if (_reqObj.hasOwnProperty("method") && "POST" == _reqObj.method && !_reqObj.hiddenLoading) {
    uni.showLoading({
      title: '加载中',
      mask: true
    });
    _reqObj.complete = function() {
      uni.hideLoading();
    }
  }

  let _headers = getHeaders();
  if (_reqObj.hasOwnProperty('header')) {
    let _header = _reqObj.header;
    for (let key in _headers) {
      _header.key = _headers[key];
    }
  } else {
    _reqObj.header = _headers;
  }

  //白名单直接跳过检查登录
  if (url.NEED_NOT_LOGIN_URL.includes(_reqObj.url)) {
    _reqObj.communityId = mapping.HC_TEST_COMMUNITY_ID;
    //todo create sign
    createSign(_reqObj);
    uni.request(_reqObj);
    return;
  }

  if (!hasLogin()) {
    //todo 这里延迟跳转，等待如果界面又自登陆的话 自登陆完成
    setTimeout(function() {
      uni.navigateTo({
        url: '/pages/login/showlogin'
      })
    }, 1500);
    return;
  }
  createSign(_reqObj);

  const successFun = _reqObj.success

  const requestTask = uni.request({
    ..._reqObj,
    success: (res) => {
      // 给挤下线了
      if (res.data && (res.data.code === 2000 || res.data.code === 1996)) {
        clearAllRequest()
        // #ifdef APP        
        // 删除极光别名
        jPush.deleteAlias({ sequence: 1 })
        // #endif
        // 清除登录标识
        uni.removeStorageSync('loginFlag')
        clearLogOutData()
        uni.showModal({
          title: res.data.code === 2000 ? i18n.t("下线提醒-odG") : i18n.t("登录提醒"),
          content: res.data.msg,
          confirmText: i18n.t("去登录-8b1"),
          success: (res) => {
            if (res.confirm) {
              uni.reLaunch({ url: "/pages/login/login" })
            } else {
              uni.switchTab({ url: "/pages/index/index" })
            }
          }
        })
      } else {
        successFun(res)
      }
    },
    complete: () => {
      uni.hideLoading()
      // 删除已执行请求
      const excutingIndex = excutingList.findIndex(item => item === requestTask)
      excutingList.splice(excutingIndex, 1)

      // 执行等待队列
      const [apiFn] = waitingList
      if (excutingList.length === 0 && typeof apiFn === 'function') {
        apiFn()
        waitingList.splice(0, 1)
      }
    }
  });

  // 当前请求加入正在执行队列
  excutingList.push(requestTask)
}

/**
 * http 请求 加入是否登录判断
 */
export function request(_reqObj) {

  // 正在执行请求大于阈值 ? 当前请求加入等待队列 : 执行
  excutingList.length > limit ?
    waitingList.push(() => { requestAuth(_reqObj) }) :
    requestAuth(_reqObj)
}

// 中断请求任务
function clearAllRequest() {
  if (excutingList.length > 0) {
    for (let i = 0; i < excutingList.length; i++) {
      const item = excutingList[i]
      if (item && item.abort) {
        item.abort()
      }
    }
    // 清空队列
    excutingList.length = 0
    waitingList.length = 0
  }
}

/**
 * 
 * 不用鉴权的 HTTP 请求
 * @param {Object} _reqObj 请求参数
 */
export function requestNoAuth(_reqObj) {
  // debug('proprietorRequest', 'requestNoAuth', _reqObj);
  //这里判断只有在 post 方式时 放加载框
  if (_reqObj.hasOwnProperty("method") && "POST" == _reqObj.method) {
    uni.showLoading({
      title: '加载中',
      mask: true
    });
    _reqObj.complete = function() {
      uni.hideLoading();
    }
  }
  let _headers = getHeaders();
  if (_reqObj.hasOwnProperty('header')) {
    let _header = _reqObj.header;
    for (let key in _headers) {
      _header.key = _headers[key];
    }
  } else {
    _reqObj.header = _headers;
  }
  createSign(_reqObj);
  uni.request(_reqObj);
}