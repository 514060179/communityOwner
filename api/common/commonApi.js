/**
 * 发送验证码
 */


import {
	request,
	requestNoAuth,
	uploadFile
} from '../../lib/proprietor/proprietorRequest.js'
import url from '../../constant/url.js'

import mapping from '../../constant/MappingConstant.js'
import { i18n } from '@/main.js'

function timer(_that) {
	let promise = new Promise((resolve, reject) => {
		let setTimer = setInterval(
			() => {
				let second = this.second - 1;
				_that.second = second;
				_that.btnValue = second + '秒';
				_that.btnDisabled = true;
				if (_that.second <= 0) {
					_that.second = 60;
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

export function sendMessageCode(_objData,_that) {

	return new Promise((resolve, reject) => {
		requestNoAuth({
			url: url.userSendSms,
			method: "POST",
			data: _objData, //动态数据
			success: function(res) {
				//成功情况下跳转
				if (res.statusCode == 200) {
					uni.showToast({
						title: i18n.t('验证码下发成功-3um'),
						icon: 'none',
						duration: 2000
					});
					timer(_that);
					resolve();
					return;
				}
				uni.hideLoading();
				uni.showToast({
					title: res.data,
					icon: 'none',
					duration: 2000
				});
			},
			fail: function(e) {
				uni.hideLoading();
				uni.showToast({
					title: i18n.t("服务器异常了-eja"),
					icon: 'none',
					duration: 2000
				})
			}
		});
	})

}

// 异步上传图片
export function uploadImageAsync(_objData,_that) {
	return new Promise( (resolve, reject) => {
		request({
			url: url.uploadImage,
			data: _objData,
			method: "POST",
			//动态数据
			success: function(res) {
				if (res.statusCode == 200) {
					let imgInfo = res.data;
					resolve(imgInfo);
				}
			},
			fail: function(e) {
				uni.hideLoading();
				uni.showToast({
					title: i18n.t("服务器异常了-eja"),
					icon: 'none'
				})
			}
		});
	})
}

/**
 * 刷新用户
 * @param {Object} _objData
 */
export function getRegisterProtocol(){
	return new Promise((resolve, reject) => {
		requestNoAuth({
			url: url.listRegisterProtocol,
			method: "GET",
			data: {
				page:1,
				row:1
			}, //动态数据
			success: function(res) {
				if (res.data.code == 0) {
					resolve(res.data.data);
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


