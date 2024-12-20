/**
 * 业主相关 数据封装API
 * 
 */

import {
	request
} from '../../lib/proprietor/proprietorRequest.js';
import
url
from '../../constant/url.js';

import mapping from '../../constant/MappingConstant.js';
import { i18n } from '@/main.js'

import {
	hasLogin
} from '../user/sessionApi.js';
import {
	getCommunityId
} from '../community/communityApi.js';

export function getOwnerId() {
	let _ownerInfo = wx.getStorageSync(mapping.OWNER_INFO);
	if (_ownerInfo) {
		return _ownerInfo.ownerId;
	}
	return "-1"
}

export function getOwnerName() {
	let _ownerInfo = wx.getStorageSync(mapping.OWNER_INFO);
	if (_ownerInfo) {
		return _ownerInfo.ownerName;
	}
	return "-1"
}

export function getOwnerTel() {
	let _ownerInfo = wx.getStorageSync(mapping.OWNER_INFO);
	if (_ownerInfo) {
		return _ownerInfo.ownerTel;
	}
	return "-1"
}

export function getMemberId() {
	let _ownerInfo = wx.getStorageSync(mapping.OWNER_INFO);
	if (_ownerInfo) {
		return _ownerInfo.memberId;
	}
	return "-1"
}

/**
 * 是否认证了业主
 */
export function hasAuthOwner(_that) {
	return new Promise((resolve, reject) => {
		if (!hasLogin()) {
			uni.showToast({
				icon: 'none',
				title: i18n.t('未登录,请先登录!-ZMp')
			});
			reject(i18n.t('未登录,请先登录!-ZMp'));
			return;
		}
		let _ownerInfo = wx.getStorageSync(mapping.OWNER_INFO);
		if (_ownerInfo) {
			resolve(_ownerInfo);
			return;
		}

		request({
			url: url.queryUserAuthOwner,
			method: "GET",
			data: {
				page: 1,
				row: 1
			},
			success: function(res) {
				let _json = res.data;
				if (_json.code != 0) {
					//todo 弹出 认证对话框
					_that.$refs.authOwnerDialogRef.openDialog(_json.code, _json.msg);
					reject(_json.msg);
					return;
				}
				let _ownerInfo = _json.data;
				wx.setStorageSync(mapping.OWNER_INFO, _ownerInfo);
				let _currentCommunityInfo = {
					communityId: _ownerInfo.communityId,
					communityName: _ownerInfo.communityName,
          sCommunityTel: _ownerInfo.communityTel
				};
				wx.setStorageSync(mapping.CURRENT_COMMUNITY_INFO, { ..._ownerInfo, ..._currentCommunityInfo });
				resolve(_ownerInfo);
			},
			fail: function(error) {
				// 查询失败
				reject();
			}
		});
	})
}


/**
 * 查询当前业主信息
 * 
 * return {
	 memberId:'',
	 ownerName:'',
	 ownerId:'',
	 ownerTel:''
 }
 */
export function getCurOwner() {
	return new Promise((resolve, reject) => {
		let _ownerInfo = uni.getStorageSync(mapping.OWNER_INFO);
		resolve(_ownerInfo);
	});
}

/**
 * 查询当前业主信息
 */
export function refreshOwner() {
	return new Promise(
		(resolve, reject) => {
			let _userInfo = uni.getStorageSync(mapping.USER_INFO);
      console.log(_userInfo, '_userInfo')
			if (!_userInfo) {
				reject();
				return;
			}
			request({
				url: url.queryAppUserBindingOwner,
				data: {
					openId: JSON.parse(_userInfo).openId
				},
				success: function(res) {
					let _json = res.data;
					if (_json.code == 0 && _json.data && _json.data.length > 0) {
						let _ownerInfo = _json.data[0];
						if (_ownerInfo == null || _ownerInfo == undefined) {
							//没有业主信息
							reject();
							return;
						}
						if (_ownerInfo.state == '12000') {
							uni.setStorageSync(mapping.OWNER_INFO, _ownerInfo);
							let _currentCommunityInfo = {
								communityId: _ownerInfo.communityId,
								communityName: _ownerInfo.communityName,
                sCommunityTel: _ownerInfo.communityTel
							};
							uni.setStorageSync(mapping.CURRENT_COMMUNITY_INFO, _currentCommunityInfo);
						}
						resolve(_json.data[0]);
					}
				},
				fail: function(error) {
					// 查询失败
					reject();
				}
			});
		});
}



export function getUserAddress(_data) {
	return new Promise((resolve, reject) => {
		let moreRooms = [];
		request({
			url: url.queryUserAddress,
			method: "GET",
			data: _data, //动态数据
			success: function(res) {
				let _data = res.data;
				if (_data.code == 0) {
					resolve(_data);
					return;
				}
				reject(_data.msg);
			},
			fail: function(e) {
				reject(e);
			}
		});
	})
}



/**
 * add by wuxw
 * @param {Object} _data 保存 用户地址
 */
export function saveUpdateUserAddress(_data) {

	return new Promise((resolve, reject) => {

		if (_data.userId == '') {
			reject(i18n.t("用户不能为空-k2I"));
			return;
		} else if (_data.areaCode == '') {
			reject(i18n.t("地区不能为空-kiw"));
			return;
		} else if (_data.tel == '') {
			reject(i18n.t("手机号不能为空-lEt"));
			return;
		} else if (_data.address == '') {
			reject(i18n.t("地址不能为空-ue1"));
			return;
		} else if (_data.isDefault == '') {
			reject(i18n.t("默认地址不能为空-TI1"));
			return;
		}
		let moreRooms = [];
		request({
			url: url.saveUserAddress,
			method: "POST",
			data: _data, //动态数据
			success: function(res) {
				let _data = res.data;
				if (_data.code == 0) {
					resolve(_data);
					return;
				}
				reject(_data.msg);
			},
			fail: function(e) {
				reject(e);
			}
		});
	})
}

/**
 * add by wuxw
 * @param {Object} _data 保存 用户地址
 */
export function deleteUserAddress(_data) {

	return new Promise((resolve, reject) => {

		if (_data.userId == '') {
			reject(i18n.t("用户不能为空-k2I"));
			return;
		} else if (_data.addressId == '') {
			reject(i18n.t("地址不能为空-ue1"));
			return;
		}
		request({
			url: url.deleteUserAddress,
			method: "POST",
			data: _data, //动态数据
			success: function(res) {
				let _data = res.data;
				if (_data.code == 0) {
					resolve(_data);
					return;
				}
				reject(_data.msg);
			},
			fail: function(e) {
				reject(e);
			}
		});
	})
}

/**
 * add by wuxw
 * @param {Object} _data 删除家庭成员
 */
export function deleteOwnerMember(_data) {

	return new Promise((resolve, reject) => {

		if (_data.memberId == '') {
			reject(i18n.t("成员ID不能为空-bOY"));
			return;
		} else if (_data.communityId == '') {
			reject(i18n.t("小区不能为空-dCN"));
			return;
		}
		request({
			url: url.deleteOwner,
			method: "POST",
			data: _data, //动态数据
			success: function(res) {
				let _data = res.data;
				if (_data.code == 0) {
					resolve(_data);
					return;
				}
				reject(_data.msg);
			},
			fail: function(e) {
				reject(e);
			}
		});
	})
}
/**
 * 判断是否存在业主
 * 
 */
export function hasOwner() {
  const token = uni.getStorageSync("token")
  if (!token) return
	let _ownerInfo = wx.getStorageSync(mapping.OWNER_INFO);
	if (!_ownerInfo) {
		uni.showToast({
			icon: 'none',
			title: i18n.t('未查询到业主房产-ify')
		})
		throw new Error(i18n.t('业主不存在-DLp'));
	}

	let _memberId = _ownerInfo.memberId;
	if (!_memberId) {
		uni.showToast({
			icon: 'none',
			title: i18n.t('未查询到业主房产-ify')
		})
		throw new Error(i18n.t('业主不存在-DLp'));
	}
	if (_memberId == '-1') {
		uni.showToast({
			icon: 'none',
			title: i18n.t('未查询到业主房产-ify')
		})
		throw new Error(i18n.t('业主不存在-DLp'));
	}
}

export function loadLoginOwner(_data) {
	return new Promise((resolve, reject) => {
		let moreRooms = [];
		request({
			url: url.queryCurrentOwner,
			method: "GET",
			data: _data, //动态数据
			success: function(res) {
				let _data = res.data;
				if (_data.code == 0) {
          uni.setStorageSync('userHeaderImg', _data.data.url)
					resolve(_data.data);
					return;
				}
				reject(_data.msg);
			},
			fail: function(e) {
				reject(e);
			}
		});
	})
}

/**
 * 认证业主
 * @param {Object} _data
 */
export function authOwner(_data) {
	let msg = "";
	if (_data.communityId == "") {
		msg = i18n.t("请选择小区-M5Q");
	} else if (_data.roomId == "") {
		msg = i18n.t("请选择房屋-KI3");
	} else if (_data.roomName == "") {
		msg = i18n.t("请选择房屋-KI3");
	} else if (_data.link == "") {
		msg = i18n.t("请填写手机号-qYB");
	} else if (_data.ownerName == "") {
		msg = i18n.t("请填写人员名称-XrC");
	} else if (_data.ownerTypeCd == "") {
		msg = i18n.t("请选择人员类型-cWd");
	}

	if (msg != "") {
		wx.showToast({
			title: msg,
			icon: 'none',
			duration: 2000
		});
		return;
	}
	return new Promise((resolve, reject) => {
		request({
			url: url.authOwner,
			method: "POST",
			data: _data,
			success: function(res) {
				let _json = res.data;
				wx.showToast({
					title: _json.msg,
					icon: 'none',
					duration: 2000
				});
				if (_json.code != 0) {
					reject(_json.msg);
					return;
				}
				resolve(_json);
			},
			fail: function(error) {
				// 查询失败
				reject();
			}
		});
	})
}

/**
 * 删除房屋认证
 * @param {Object} _data
 */
export function deleteAuthOwner(_data) {
	let msg = "";
	if (_data.appUserId == "") {
		msg = "参数错误";
	} 

	if (msg != "") {
		wx.showToast({
			title: msg,
			icon: 'none',
			duration: 2000
		});
		return;
	}
	return new Promise((resolve, reject) => {
		request({
			url: url.deleteAuthOwner,
			method: "POST",
			data: _data,
			success: function(res) {
				let _json = res.data;
				wx.showToast({
					title: _json.msg,
					icon: 'none',
					duration: 2000
				});
				if (_json.code != 0) {
					reject(_json.msg);
					return;
				}
				resolve(_json);
			},
			fail: function(error) {
				// 查询失败
				reject();
			}
		});
	})
}

/**
 * 查询认证记录
 * @param {Object} _data
 */
export function queryAuthOwnerLog(_data) {
	return new Promise((resolve, reject) => {
		let moreRooms = [];
		request({
			url: url.queryAuthOwnerLog,
			method: "GET",
			data: _data, //动态数据
			success: function(res) {
				let _data = res.data;
				if (_data.code == 0) {
					resolve(_data);
					return;
				}
				reject(_data.msg);
			},
			fail: function(e) {
				reject(e);
			}
		});
	})
}
