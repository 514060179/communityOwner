import {
	request
} from '../../lib/proprietor/proprietorRequest.js'
import url from '../../constant/url.js'

import mapping from '../../constant/MappingConstant.js'

import { getCurOwner } from '../owner/ownerApi.js'
import { i18n } from '@/main.js'

/**
 * 查询业主合同
 * 
 */
export function getContracts() {
	return new Promise((resolve, reject) => {
		getCurOwner()
			.then(function(_owner) {
				request({
					url: url.queryContract,
					method: "GET",
					data: {
						communityId: _owner.communityId,
						objId: _owner.ownerId,
						page:1,
						row:50
					},
					success: function(res) {
						if (res.statusCode == 200) {
							//将业主信息和房屋信息一起返回
							res.data['owner'] = _owner;
							if (res.data.data.length == 0) {
								reject(i18n.t("业主没有合同信息-Bqk"));
								return;
							}
							resolve(res.data);
						} else {
							reject(i18n.t("查询合同失败-zxT"));
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
 * 查询业主合同
 * objId: _owner.ownerId,
 */
export function getCurContract(_param) {
	_param.page=1;
	_param.row=1;
	return new Promise((resolve, reject) => {
		getCurOwner()
			.then(function(_owner) {
				_param.communityId = _owner.communityId;
				request({
					url: url.queryContract,
					method: "GET",
					data: _param,
					success: function(res) {
						if (res.statusCode == 200) {
							//将业主信息和房屋信息一起返回
							if (res.data.data.length == 0) {
								reject(i18n.t("业主没有合同信息-Bqk"));
								return;
							}
							resolve(res.data.data[0]);
						} else {
							reject(i18n.t("查询合同失败-zxT"));
						}
					},
					fail: function(res) {
						reject(res);
					}
				});
			});
	});
};
