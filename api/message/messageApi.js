/**
 * 消息API
 * 
 */

import { request } from '../../lib/proprietor/proprietorRequest.js';
import url from '../../constant/url.js';

// 获取消息类型-列表
export function getMessageTypeList (data) {
  return new Promise((resolve, reject) => {
    request({
    	url: url.messageTypeList,
    	method: "GET",
    	data, //动态数据
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


// 获取消息列表-列表
export function getNotificationList (data) {
  return new Promise((resolve, reject) => {
    request({
      url: url.notificationList,
      method: "GET",
      data, //动态数据
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

// 获取消息列表-列表
export function readNotification (data) {
  return new Promise((resolve, reject) => {
    request({
      url: url.readNotification,
      method: "POST",
      data, //动态数据
      hiddenLoading: true,
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