/**
 * 业主相关 数据封装API
 * add by 吴学文 2020-09-07
 * QQ 92825595
 * 
 */

import {
	request
} from '../../lib/java110/java110Request.js';
import
url
from '../../constant/url.js';

import mapping from '../../constant/MappingConstant.js';

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
				title: '未登录,请先登录!'
			});
			reject('未登录,请先登录!');
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
					communityName: _ownerInfo.communityName
				};
				wx.setStorageSync(mapping.CURRENT_COMMUNITY_INFO, _currentCommunityInfo);
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
			let _userInfo = wx.getStorageSync(mapping.USER_INFO);
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
							wx.setStorageSync(mapping.OWNER_INFO, _ownerInfo);
							let _currentCommunityInfo = {
								communityId: _ownerInfo.communityId,
								communityName: _ownerInfo.communityName
							};
							wx.setStorageSync(mapping.CURRENT_COMMUNITY_INFO, _currentCommunityInfo);
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
			reject("用户不能为空");
			return;
		} else if (_data.areaCode == '') {
			reject("地区不能为空");
			return;
		} else if (_data.tel == '') {
			reject("手机号不能为空");
			return;
		} else if (_data.address == '') {
			reject("地址不能为空");
			return;
		} else if (_data.isDefault == '') {
			reject("默认地址不能为空");
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
			reject("用户不能为空");
			return;
		} else if (_data.addressId == '') {
			reject("地址不能为空");
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
			reject("成员ID不能为空");
			return;
		} else if (_data.communityId == '') {
			reject("小区不能为空");
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
	let loginFlag = wx.getStorageSync(mapping.LOGIN_FLAG);
	let nowDate = new Date();
	//判断如果是APP
	if (!loginFlag || loginFlag.expireTime < nowDate.getTime()) {
		return;
	}
	let _ownerInfo = wx.getStorageSync(mapping.OWNER_INFO);
	if (!_ownerInfo) {
		uni.showToast({
			icon: 'none',
			title: '未查询到业主房产'
		})
		throw new Error('业主不存在');
	}

	let _memberId = _ownerInfo.memberId;
	if (!_memberId) {
		uni.showToast({
			icon: 'none',
			title: '未查询到业主房产'
		})
		throw new Error('业主不存在');
	}
	if (_memberId == '-1') {
		uni.showToast({
			icon: 'none',
			title: '未查询到业主房产'
		})
		throw new Error('业主不存在');
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
		msg = "请选择小区";
	} else if (_data.roomId == "") {
		msg = "请选择房屋";
	} else if (_data.roomName == "") {
		msg = "请选择房屋";
	} else if (_data.link == "") {
		msg = "请填写手机号";
	} else if (_data.ownerName == "") {
		msg = "请填写人员名称";
	} else if (_data.ownerTypeCd == "") {
		msg = "请选择人员类型";
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
