/**
 * 运营团队信息查询
 */

import {
	request,
	requestNoAuth
} from '../../lib/proprietor/proprietorRequest.js'
import url from '../../constant/url.js'
import context from '../../lib/proprietor/proprietorContext.js';
import mapping from '../../constant/MappingConstant.js';
import { i18n } from '@/main.js'

/** 获取两个时间之间的 间隔时间
 * @param { Date | number | string } startTime 开始时间 字符串格式(6:00 06:00 18:00, 18:00:00) 必须是24小时格式
 * @param { Date | number | string } endTime 结束时间 字符串格式(6:00 06:00 18:00, 18:00:00) 必须是24小时格式
 */
export function getBetweenTime(startTime, endTime) {
	// debugger
	// 校验时间格式
	
	let start = +startTime.split(':')[0];
	let end = +endTime.split(':')[0];
	const resultTime = [];
	// 当 开始时间小于结束时间的时候进入循环
	while (start <= end) {
		// 拼接时间格式 自动给 小于10的时间前面补0
		let setTime = start >= 10 ? `${start}:00` : `0${start}:00`;

		resultTime.push(setTime);
		// 重新设置开始时间
		start += 1;
	}
	return resultTime;
}

/**
 * 查询 场地 2022/10/09
 */
export function getBookingList(_objData) {
	return new Promise((resolve, reject) => {
		// debugger
		requestNoAuth({
			url: url.querySpacePerson,
			method: "GET",
			data: _objData,
			success: function(res) {
				if (res.statusCode == 200) {
					let _data = res.data
					resolve(_data)
					return
				}
				reject()
			},
			fail: function(res) {
				reject(res);
			}
		});
	})
}

/**
 * 查询 场地 2022/10/09
 */
export function getSite(_objData) {
	return new Promise((resolve, reject) => {
		requestNoAuth({
			url: url.getSite,
			method: "GET",
			data: _objData,
			success: function(res) {
				// debugger
				if (res.statusCode == 200) {
					let _data = res.data
					resolve(_data)
					return
				}
				reject()
			},
			fail: function(res) {
				reject(res);
			}
		});
	})
}

/**
 * 查询场馆列表 2022/10/09
 **/
export function getVenue(dataObj) {
	return new Promise(
		(resolve, reject) => {
			requestNoAuth({
				url: url.getVenue,
				method: "GET",
				data: dataObj,
				//动态数据
				success: function(res) {
					// debugger
					if (res.statusCode == 200) {
						let _data = res.data;
						resolve(_data);
						return;
					}
				},
				fail: function(e) {
          reject(e)
					wx.showToast({
						title: i18n.t("服务器异常了-eja"),
						icon: 'none',
						duration: 2000
					});
				}
			});
		})
}

// 查询场地文件
export function getSiteFiles(_objData) {
	return new Promise((resolve, reject) => {
		requestNoAuth({
			url: url.getSiteFiles,
			method: "GET",
			data: _objData,
			success: function(res) {
				// debugger
				if (res.statusCode == 200) {
					let _data = res.data
					resolve(_data)
					return
				}
				reject()
			},
			fail: function(res) {
				reject(res);
			}
		});
	})
}

// 场地预约预下单
export function unifiedPayment(_objData) {
  return new Promise((resolve, reject) => {
    request({
      url: url.unifiedPayment,
      header: context.getHeaders(),
      method: 'POST',
      data: _objData,
      success: (res) => {
        resolve(res)
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}