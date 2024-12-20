/**
 * 房屋信息处理 api 接口类
 * 
 */


import { request } from '../../lib/proprietor/proprietorRequest.js'
import url from '../../constant/url.js'

import mapping from '../../constant/MappingConstant.js'

import { getCurOwner } from '../owner/ownerApi.js'
import { i18n } from '@/main.js'

/**
 * 查询业主房屋
 */
export function getRooms() {
	return new Promise((resolve, reject) => {
		
		getCurOwner()
			.then(function(_owner) {
				if(!_owner.ownerId){
					reject(i18n.t('未包含业主信息-Nlq'));
				}
				request({
					url: url.queryRoomsByOwner,
					method: "GET",
					data: {
						communityId: _owner.communityId,
						ownerId: _owner.ownerId
					},
					success: function(res) {
						if (res.statusCode == 200) {
							//将业主信息和房屋信息一起返回
							res.data['owner'] = _owner;
							if (res.data.rooms.length == 0) {
								reject(i18n.t("业主没有房屋信息-OfK"));
								return;
							}
							resolve(res.data);
						} else {
							reject(i18n.t("查询房屋失败-lnf"));
						}
					},
					fail: function(res) {
						reject(res);
					}
				});
			});
	});
};

/**
 * 查询房屋租聘配置
 */
export function queryRentingConfig() {
	return new Promise((resolve, reject) => {
		request({
			url: url.queryRentingConfig,
			method: "GET",
			data: {
				page: 1,
				row: 10
			},
			success: function(res) {

				let data = res.data;
				if (data.code == 0) {
					resolve(data.data);
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

/**
 * 房屋租赁
 * @param {Object} obj 房屋租赁数据
 * "rentingName": this.rentingName,
	"roomId": this.roomId,
	"communityId": this.communityId,
	"price": this.price,
	"paymentType": this.paymentType,
	"rentingConfigId": this.rentingConfigId,
	"photos": [],
	"rentingDesc": this.rentingDesc,
	"ownerTel": this.userTel,
	"ownerName":this.userName,
	"state":"0"
 */
export function hireRoom(obj) {
	return new Promise((resolve, reject) => {
		let msg = "";
		if (obj.rentingName == "") {
			msg = i18n.t("出租标题不能为空-xHO");
		} else if (obj.roomId == "") {
			msg = i18n.t("请选择房屋-KI3");
		} else if (obj.communityId == "") {
			msg = i18n.t("未找到小区信息-xso");
		} else if (obj.price == "") {
			msg = i18n.t("请填写租金(元)-3Cs");
		} else if (obj.paymentType == "") {
			msg = i18n.t("请选择付费类型-dHi");
		} else if (obj.rentingConfigId == "") {
			msg = i18n.t("请选择出租方式-CBQ");
		} else if (obj.rentingDesc == '') {
			msg = i18n.t("请填写出租说明-SaQ");
		} else if (obj.photos.length < 1) {
			msg = i18n.t("请选择图片-pAi");
		} else if (obj.checkIn == '') {
			msg = i18n.t("请选择入住日期-Aq8");
		}

		if (msg != "") {
			reject(msg);
		} else {
			request({
				url: url.saveRentingPool,
				method: "POST",
				data: obj, //动态数据
				success: function(res) {
					let _json = res.data;
					if (_json.code == 0) {
						resolve(_json);
						return;
					}
					reject(_json.msg);
				},
				fail: function(e) {
					reject(i18n.t('服务异常-PzU'));
				}
			});
		}
	})
}

/**
 * 查询房源信息
 * @param {Object} _data 查询 入参
 */
export function getRentingPool(_data) {
	return new Promise((resolve, reject) => {
		request({
			url: url.queryRentingPool,
			method: "GET",
			data: _data,
			success: function(res) {
				let data = res.data;
				if (data.code == 0) {
					resolve(data.data);
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

/**
 * 租房预约
 * @param {Object} obj 租房预约数据
 * {"appointmentId":"","tenantName":"张默默","tenantSex":"0","tenantTel":"18909711234",
 * "appointmentTime":"2020-09-30 01:05:00","appointmentRoomId":"752020080500600202","remark":""}
 */
export function appointmentRoom(obj) {
	return new Promise((resolve, reject) => {
		let msg = "";
		if (obj.tenantName == "") {
			msg = i18n.t("名称不能为空-Zjr");
		} else if (obj.tenantSex == "") {
			msg = i18n.t("性别不能空-bQx");
		} else if (obj.tenantTel == "") {
			msg = i18n.t("手机号不能为空-lEt");
		} else if (obj.appointmentTime == "") {
			msg = i18n.t("请填写预约时间-TFi");
		} else if (obj.appointmentRoomId == "") {
			msg = i18n.t("预约房屋为空-yB3");
		}

		if (msg != "") {
			reject(msg);
		} else {
			request({
				url: url.saveRentingAppointment,
				method: "POST",
				data: obj, //动态数据
				success: function(res) {
					let _json = res.data;
					if (_json.code == 0) {
						resolve(_json);
						return;
					}
					reject(_json.msg);
				},
				fail: function(e) {
					reject(i18n.t('服务异常-PzU'));
				}
			});
		}
	})
}
