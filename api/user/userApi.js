/**
 * 首页相关 数据封装API
 * add by 吴学文 2020-09-07
 * QQ 92825595
 * 
 */

import {
  request,
  requestNoAuth
} from '../../lib/proprietor/proprietorRequest.js'
import url from '../../constant/url.js';
import { checkPhoneNumber } from '../../lib/proprietor/utils/StringUtil.js'

import context from '../../lib/proprietor/proprietorContext.js'


import { dateTimeStringToDateString } from '../../lib/proprietor/utils/DateUtil.js'
const constant = context.constant;

import { i18n } from '@/main.js'


export function timer(_that) {
  let second = 60;
  const promise = new Promise((resolve, reject) => {
    const setTimer = setInterval(
      () => {
        second = second - 1;
        _that.btnValue = second + i18n.t('秒-YHR');
        _that.btnDisabled = true;
        if (second <= 0) {
          second = 60;
          _that.btnValue = i18n.t('获取验证码-TpM');
          _that.btnDisabled = false;
          resolve(setTimer)
        }
      }, 1000)
  })
  promise.then((setTimer) => {
    clearInterval(setTimer)
  })
}
/**
 * 查询活动列表
 */
export function sendSmsCode(obj, _that) {
  if (obj.tel == '') {
    uni.showToast({
      title: i18n.t('请输入手机号-Cdr'),
      icon: 'none',
      duration: 2000
    });
    return;
  }
  if (!checkPhoneNumber(obj.tel, obj.areaCode)) {
    uni.showToast({
      title: i18n.t('手机号有误-CIh'),
      icon: 'none'
    })
    return
  }
  uni.showLoading({
    title: i18n.t('加载中-BUD'),
    mask: true
  });
  return new Promise(
    (resolve, reject) => {
      requestNoAuth({
        url: url.userSendSms,
        method: 'POST',
        data: obj,
        //动态数据
        success: function(res) {
          uni.hideLoading();
          const _json = res.data;

          if (_json.code == 0) {
            uni.hideLoading();
            uni.showToast({
              title: _json.data,
              icon: 'none',
              duration: 2000
            });
            timer(_that);
            resolve();
            return;
          }
          uni.showToast({
            title: _json.msg,
            icon: 'none',
            duration: 2000
          });
          reject();
        },
        fail: function(e) {
          uni.hideLoading();
          reject();
        }
      });
    })
}

/**
 * 查询用户账户信息
 * @param {Object} _objData
 */
export function queryOwnerAccount(_objData) {
  return new Promise((resolve, reject) => {
    request({
      url: url.queryOwnerAccount,
      method: 'GET',
      data: _objData, //动态数据
      success: function(res) {
        if (res.statusCode == 200) {
          //成功情况下跳转
          const _feeDiscounts = res.data.data;
          resolve(_feeDiscounts);
          return;
        }
        reject();
      },
      fail: function(e) {
        reject();
      }
    });
  })
}

/**
 * 查询用户账户信息明细
 * @param {Object} _objData
 */
export function queryOwnerAccountDetail(_objData) {
  return new Promise((resolve, reject) => {
    request({
      url: url.queryOwnerAccountDetail,
      method: 'GET',
      data: _objData, //动态数据
      success: function(res) {
        if (res.statusCode == 200) {
          resolve(res);
          return;
        }
        reject();
      },
      fail: function(e) {
        reject();
      }
    });
  })
}

/**
 * 刷新用户
 * @param {Object} _objData
 */
export function refreshUserOpenId(_objData) {
  return new Promise((resolve, reject) => {
    requestNoAuth({
      url: url.refreshOpenId,
      method: 'GET',
      data: _objData, //动态数据
      success: function(res) {
        if (res.statusCode == 200) {
          resolve(res.data);
          return;
        }
        reject();
      },
      fail: function(e) {
        reject();
      }
    });
  })
}



export function getWechatMiniOpenId(_objData) {
  return new Promise((resolve, reject) => {
    requestNoAuth({
      url: url.getWechatMiniOpenId,
      method: 'GET',
      data: _objData, //动态数据
      success: function(res) {
        if (res.statusCode == 200) {
          resolve(res.data);
          return;
        }
        reject();
      },
      fail: function(e) {
        reject();
      }
    });
  })
}
/**
 * 刷新用户
 * @param {Object} _objData
 */
export function getOpenIdFromAliPay(_objData) {
  return new Promise((resolve, reject) => {
    requestNoAuth({
      url: url.getOpenIdFromAliPay,
      method: 'GET',
      data: _objData, //动态数据
      success: function(res) {
        if (res.statusCode == 200) {
          resolve(res.data);
          return;
        }
        reject();
      },
      fail: function(e) {
        reject();
      }
    });
  })
}
/**
 * 刷新用户
 * @param {Object} _objData
 */
export function queryDict(_objData) {
  return new Promise((resolve, reject) => {
    requestNoAuth({
      url: url.queryDict,
      method: 'GET',
      data: _objData, //动态数据
      success: function(res) {
        if (res.statusCode == 200) {
          resolve(res.data);
          return;
        }
        reject();
      },
      fail: function(e) {
        reject();
      }
    });
  })
}

/**
 * 查询活动列表
 */
export function generatorUserQrCode(_that) {
  const obj = {
    tel: '123'
  };
  return new Promise(
    (resolve, reject) => {
      request({
        url: url.generatorUserQrCode,
        method: 'POST',
        data: obj,
        //动态数据
        success: function(res) {
          uni.hideLoading();
          resolve(res.data);
        },
        fail: function(e) {
          uni.hideLoading();
          reject();
        }
      });
    })
}

export function getCommunityWechatAppId(_objData) {
  return new Promise((resolve, reject) => {
    requestNoAuth({
      url: url.getCommunityWechatAppId,
      method: 'GET',
      data: _objData, //动态数据
      success: function(res) {
        if (res.statusCode == 200) {
          resolve(res.data);
          return;
        }
        reject();
      },
      fail: function(e) {
        reject();
      }
    });
  })
}

export function ownerLogin(_that, _data) {
  uni.showLoading({
    title: i18n.t('加载中-BUD'),
    mask: true
  });
  return new Promise(
    (resolve, reject) => {
      requestNoAuth({
        url: url.ownerUserLogin,
        method: 'POST',
        data: _data,
        //动态数据
        success: function(res) {
          uni.hideLoading();
          const _json = res.data;
          if (_json.code != 0) {
            reject(_json.msg);
            return;
          }
          //todo 保存业主信息
          uni.setStorageSync('userInfo', _json.data);
          uni.setStorageSync('currentCommunityInfo', {
            communityId: _json.data.communityId,
            communityName: _json.data.communityName,
            sCommunityTel: _json.data.communityTel
          });
          resolve(_json.data);
        },
        fail: function(e) {
          uni.hideLoading();
          reject(e);
        }
      });
    })
}

export function refreshAppUserBindingOwnerOpenId(_that, _data) {
  uni.showLoading({
    title: i18n.t('加载中-BUD'),
    mask: true
  });
  return new Promise(
    (resolve, reject) => {
      requestNoAuth({
        url: url.refreshAppUserBindingOwnerOpenId,
        method: 'POST',
        data: _data,
        //动态数据
        success: function(res) {
          uni.hideLoading();
          const _json = res.data;
          if (_json.code != 0) {
            reject(_json.msg);
            return;
          }
          resolve(_json);
        },
        fail: function(e) {
          uni.hideLoading();
          reject(e);
        }
      });
    })
}

export function getUserId() {
  const _userInfo = uni.getStorageSync('userInfo');
  if (!_userInfo) {
    return null;
  }

  return _userInfo.userId;
}

export function getUserName() {
  const _userInfo = uni.getStorageSync('userInfo');
  if (!_userInfo) {
    return null;
  }

  return _userInfo.userName;
}

export function getUserTel() {
  const _userInfo = uni.getStorageSync('userInfo');
  if (!_userInfo) {
    return null;
  }

  return _userInfo.ownerTel;
}

export function ownerRegiter(_data) {
  return new Promise(
    (resolve, reject) => {
      requestNoAuth({
        url: url.ownerRegiter,
        method: 'POST',
        data: _data,
        //动态数据
        success: function(res) {
          const _data = res.data;
          if (_data.code == 0) {
            resolve(_data)
            return;
          }
          uni.showToast({
            title: _data.msg,
            icon: 'none',
            duration: 2000
          });
        },
        fail: function(e) {
          uni.hideLoading();
          reject(e);
        }
      });
    })
}

// 获取用户二维码信息
export function getOpenQr(_objData) {
  return new Promise((resolve, reject) => {
    request({
      url: url.getOpenQr,
      method: 'GET',
      data: _objData, //动态数据
      success: function(res) {
        if (res.data.code === 0) {
          resolve(res.data.data);
          return;
        }
        reject(res.data);
      },
      fail: function(e) {
        reject(e);
      }
    });
  })
}

// 极光注册alias
export function userRegisterAlias(_objData) {
  return new Promise((resolve, reject) => {
    request({
      url: url.userRegisterAlias,
      method: 'POST',
      data: _objData,
      success: (res) => {
        console.log(res, 'reg')
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 删除极光注册alias
export function userDeleteAlias() {
  const userId = uni.getStorageSync('userInfo').userId
  const platform = uni.getSystemInfoSync().platform
  return new Promise((resolve, reject) => {
    request({
      url: url.userDeleteAlias,
      method: 'POST',
      data: { userId, platform },
      success: (res) => {
        console.log(res)
        resolve(res)
      },
      fail: (err) => {
        console.log(err)
        reject(err)
      }
    })
  })
}

export function sliderInfo() {
	// let url = 'https://muat.newlandgo.com/api/common/666666/slider/captcha';
	let url = '/slider/captcha';
	return new Promise((resolve, reject) => {
	  requestNoAuth({
	    url: url,
	    method: 'POST',
		header:{
			'platform': '1',
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		},
	    data: { version:"1.0.0"},
	    success: (res) => {
	      console.log(res)
	      resolve(res.data)
	    },
	    fail: (err) => {
	      console.log(err)
	      reject(err)
	    }
	  })
	})
}

export function checkSlider(data){
		// let url ="https://api.newlandgo.com/api/common/666666/"+"check/slider/captcha"
		let url = '/check/slider/captcha';

	const params = {
		version: "1.0.0", 
		...data,
	
	};
	let paramsData = ''
	if(params){
		Object.keys(params).forEach(function (key) {
			paramsData += key + '=' + encodeURIComponent(params[key]) + '&';
		});
	}
	console.log(paramsData)
	
	return new Promise((resolve, reject) => {
	  requestNoAuth({
	    url: url,
	    method: 'POST',
		header:{
			'platform': '1',
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		},
	    data: paramsData,
	    success: (res) => {
	      resolve(res.data)
	    },
	    fail: (err) => {
	      reject(err)
	    }
	  })
	})
}