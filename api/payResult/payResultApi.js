/**
 * 支付相关
*/

import { request } from '../../lib/proprietor/proprietorRequest.js'
import url from '../../constant/url.js'

/**
 * 
*/
export function getPayStatus(_data) {
  return new Promise((resolve, reject) => {
    request({
      url: url.getPayStatus,
      method: "POST",
      data: _data,
      hiddenLoading: true,
      success: function (res) {
        resolve(res.data)
      },
      fail: function (error) {
        reject(error)
      }
    })
  })
}