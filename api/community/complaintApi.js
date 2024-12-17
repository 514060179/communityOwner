import {
	requestNoAuth,
	request
} from '../../lib/java110/java110Request.js';
import
url
from '../../constant/url.js';

export function complaint(_data) {
	
	return new Promise((resolve, reject) => {
		let msg = "";
		if (_data.typeCd == "") {
			msg = "请选择投诉类型";
		} else if (_data.complaintName == "") {
			msg = "请填写投诉人";
		} else if (_data.tel == "") {
			msg = "请填写手机号";
		} else if (_data.context == "") {
			msg = "请填写投诉内容";
		}
		console.log('msg=',msg)
		if (msg != "") {
			reject(msg);
			return;
		}
		request({
			url: url.saveComplaint,
			method: "POST",
			data: _data,
			success: function(res) {
				let data = res.data;
				if (data.code == 0) {
					resolve();
				} else {
					reject(data.msg);
				}
			},
			fail: function(res) {
				reject(res);
			}
		});
	})
}

export function getComplaintType(_obj){
	return new Promise((resolve, reject) => {
		request({
			url: url.listComplaintType,
			method: "GET",
			data: _obj,
			success: function(res) {
				let data = res.data;
				if (data.code == 0) {
					resolve(data);
				} else {
					uni.showToast({
						title: data.msg
					})
				}
			},
			fail: function(res) {
				reject(res);
			}
		});
	})
}

export function getComplaints(_obj){
	return new Promise((resolve, reject) => {
		request({
			url: url.listComplaints,
			method: "GET",
			data: _obj,
			success: function(res) {
				let data = res.data;
				if (data.code == 0) {
					resolve(data);
				} else {
					uni.showToast({
						title: data.msg
					})
				}
			},
			fail: function(res) {
				reject(res);
			}
		});
	})
}
export function getComplaintEvent(_obj){
	return new Promise((resolve, reject) => {
		request({
			url: url.listComplaintEvent,
			method: "GET",
			data: _obj,
			success: function(res) {
				let data = res.data;
				if (data.code == 0) {
					resolve(data);
				} else {
					uni.showToast({
						title: data.msg
					})
				}
			},
			fail: function(res) {
				reject(res);
			}
		});
	})
}

/**
 * 投诉评价
 * @param {Object} _data 评价数据
 */
export function appraiseComplaint(_data) {
	return new Promise((resolve, reject) => {
		if(_data.context == ''){
			uni.showToast({
				title:'请填写评价内容',
				icon:'none'
			});
			return ;
		}
		if(_data.complaintId == ''){
			uni.showToast({
				title:'未包含报修信息',
				icon:'none'
			});
			return ;
		}
		
		request({
			url: url.saveComplaintAppraise,
			method: "POST",
			data: _data,
			success: function(res) {
				let data = res.data;
				if (data.code == 0) {
					resolve();
				} else {
					reject(data.msg);
				}
			},
			fail: function(res) {
				reject(res);
			}
		});
	})
}
