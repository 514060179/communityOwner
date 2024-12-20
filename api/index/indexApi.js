/**
 * 首页相关 数据封装API
 * 
 */

import {
  requestNoAuth
} from '../../lib/proprietor/proprietorRequest.js';
import url from '../../constant/url.js';


import {
  dateTimeStringToDateString
} from '../../lib/proprietor/utils/DateUtil.js'
import { i18n } from '@/main.js'

import { compareVersions } from '../../lib/proprietor/utils/versionUtil.js'

/**
 * 查询活动列表
 */
export function getActivitiTitle(dataObj) {

  return new Promise(
    (resolve, reject) => {
      requestNoAuth({
        url: url.queryActivitiesType,
        method: "GET",
        data: dataObj,
        //动态数据
        success: function(res) {
          if (res.statusCode == 200) {
            let _activites = res.data.data;
            resolve(_activites);
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
 * 查询 目录列表
 */
export function getCategoryList() {
  return {
    pageone: [{
      name: i18n.t("fee.oweFee"),
      src: "/static/images/index_payFee.png",
      href: "/pages/fee/oweFee"
      //href: "/pages/fee/oweFeeGarden"

    }, {
      name: i18n.t("fee.roomFeeListNew"),
      src: "/static/images/index_property.png",
      href: "/pages/fee/roomFeeListNew"
    }, {
      name: i18n.t("fee.payParkingFeeList"),
      src: "/static/images/index_park.png",
      href: "/pages/fee/payParkingFeeList"
    }, {
      name: i18n.t("投诉咨询-EKp"),
      src: "/static/images/index_complaint.png",
      href: "/pages/complaint/complaint"
    }, {
      name: i18n.t("repair.repair"),
      src: "/static/images/index_repair.png",
      href: "/pages/repair/repair"
    }, {
      name: i18n.t("notice.index"),
      src: "/static/images/index_notice.png",
      href: "/pages/notice/index"
    }, {
      name: i18n.t("machine.openDoor"),
      src: "/static/images/index_openDoor.png",
      href: "/pages/machine/openDoor"
      // }, {
      // 	name: i18n.t("二维码开门"),
      // 	src: "/static/images/index_openDoor.png",
      // 	href: "/pages/openDoorByQrCode/openDoorByQrCode"
    }, {
      name: i18n.t("联系客服-BOM"),
      src: "/static/images/index_persion.png",
      href: "callProperty"
    }],
    pagetwo: [{
        name: i18n.t("family.familyList"),
        src: "/static/images/index_member.png",
        href: "/pages/family/familyList"
      }, {
        name: i18n.t("applyparking.applyparking"),
        src: "/static/images/index_parking.png",
        href: "/pages/applyparking/applyparking"
      },
      {
        name: i18n.t("空置房-NSC"),
        src: "/static/images/index_emptyRoom.png",
        href: "/pages/applyRoom/applyRoom"
      },
      {
        name: i18n.t("房屋装修-qul"),
        src: "/static/images/index_fitment.png",
        href: "/pages/renovation/roomRenovation"
      },
      // {
      // 	name: i18n.t("临时车收费"),
      // 	src: "/static/images/index_carCharges.png",
      // 	href: "/pages/fee/tempParkingFee"
      // },
      {
        name: i18n.t("fee.contractFeeList"),
        src: "/static/images/index_contractCost.png",
        href: "/pages/fee/contractFeeList"
      },
      {
        name: i18n.t("questionAnswer.questionAnswer"),
        src: "/static/images/index_Voting.png",
        href: "/pages/questionAnswer/questionAnswer"
      },
      {
        name: i18n.t("visit.addVisit"),
        src: "/static/images/index_complaint.png",
        href: "/pages/visit/visitList"
      },
      {
        name: i18n.t("反省上报-xU6"),
        src: "/static/images/index_complaint.png",
        href: "/pages/reportInfoBack/reportInfoBack",
        needLogin: 'N'
      }
    ]
  };
}


/**
 * 查询活动
 */
export function loadActivites(dataObj) {
  return new Promise(
    (resolve, reject) => {
      requestNoAuth({
        url: url.listActivitiess,
        method: "GET",
        data: dataObj,
        //动态数据
        success: function(res) {
          if (res.statusCode == 200) {
            let _activites = res.data.activitiess;
            let _acts = [];
            if (!_activites || _activites.length < 1) {
              resolve(_acts);
              return;
            }

            _activites.forEach(function(_item) {
              _item.src = url.filePath + "?fileId=" + _item.headerImg +
                "&communityId=" + dataObj.communityId +
                "&time=" + new Date();
              _item.startTime = dateTimeStringToDateString(_item.startTime);

              _acts.push(_item);
            });
            resolve(_acts);
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
 * 查询小区广告
 */
export function loadAdverts(dataObj) {
  return new Promise(
    (resolve, reject) => {
      requestNoAuth({
        url: url.listAdvertPhoto,
        method: "GET",
        data: dataObj,
        //动态数据
        success: function(res) {
          if (res.statusCode == 200) {
            let _advertPhotos = res.data;
            resolve(_advertPhotos);
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
 * 查询小区广告
 */
export function listMarketPicByCommunity(dataObj) {
  return new Promise(
    (resolve, reject) => {
      requestNoAuth({
        url: url.listMarketPicByCommunity,
        method: "GET",
        data: dataObj,
        //动态数据
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
 * 查询小区广告
 */
export function listCommunityMarketGoods(dataObj) {
  return new Promise(
    (resolve, reject) => {
      requestNoAuth({
        url: url.listCommunityMarketGoods,
        method: "GET",
        data: dataObj,
        //动态数据
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
 * 版本升级接口
 **/
export function getAppVersion(isShowToast = false) {
  return new Promise((resolve, reject) => {
    let platformStr = uni.getSystemInfoSync().platform
    requestNoAuth({
      url: url.getAppVersion,
      method: "GET",
      data: { 
        lang: uni.getStorageSync('lang') || 'zh-Hant',
        platform: platformStr === 'ios' ? '0' : '1' ,
        channel: platformStr === 'ios' ? 'appStore' : 'googleStore'
      },
      success: function(res) {
        const { data } = res
        if (data.code === 0 && data.data.isOpenTip === 1) {
          const systemInfo = uni.getSystemInfoSync()
          // 0: 相等, 1: 大于 -1:小于
          const compareCode = compareVersions(systemInfo.appVersion, data.data.code)
          // 小于线上版本  isOpenTip： 1弹窗  0:不弹
          if (compareCode == -1 && data.data.isOpenTip == 1) {
            uni.setStorageSync('appUpdate', data.data)
          } else if (compareCode >= 0 && isShowToast) {
            uni.showToast({
              icon: 'none',
              title: i18n.t('当前是最新版本，无需更新！-VOI')
            })
          } else {
            // 清空更新app缓存
            uni.removeStorageSync('appUpdate')
          }
          resolve(res)
        } else {
          reject(res)
        }
      },
      fail: function(e) {
        reject(e)
      }
    })
  })
}
