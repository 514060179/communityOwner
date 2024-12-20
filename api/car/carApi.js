/**
 * 车辆信息处理 api 接口类
 * 
 * add by 吴学文 QQ 928255095
 */


import {
  request,
  requestNoAuth
} from '../../lib/proprietor/proprietorRequest.js'
import url from '../../constant/url.js'

import mapping from '../../constant/MappingConstant.js'
import { i18n } from '@/main.js'

/**
 * 查询业主车辆
 */
export function getCars(_objData) {
  return new Promise((resolve, reject) => {
    request({
      url: url.queryOwnerCars,
      method: "GET",
      data: _objData,
      success: function(res) {
        if (res.statusCode == 200) {
          //将业主信息和房屋信息一起返回
          let _parkingSpaces = res.data.data;
          if (_parkingSpaces.length == 0) {
            reject(i18n.t("业主没有房屋信息-OfK"));
            return;
          }
          resolve(_parkingSpaces);
        } else {
          reject(i18n.t("查询车辆失败-Zhq"));
        }
      },
      fail: function(res) {
        reject(res);
      }
    });
  });
};


export function queryWaitPayFeeTempCar(_objData) {
  return new Promise((resolve, reject) => {
    requestNoAuth({
      url: url.queryWaitPayFeeTempCar,
      method: "GET",
      data: _objData,
      success: function(res) {
        if (res.statusCode == 200) {
          //将业主信息和房屋信息一起返回
          resolve(res.data);
        } else {
          reject(i18n.t("查询车辆失败-Zhq"));
        }
      },
      fail: function(res) {
        reject(res);
      }
    });
  });
};
/**
 * 保存业主车辆
 */
export function customCarInOut(_objData) {
  return new Promise((resolve, reject) => {
    requestNoAuth({
      url: url.customCarInOut,
      method: "POST",
      data: _objData,
      success: function(res) {
        //将业主信息和房屋信息一起返回
        resolve(res);
      },
      fail: function(res) {
        reject(res);
      }
    });
  });
};
