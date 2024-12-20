import {
	requestNoAuth,request
} from '../../lib/proprietor/proprietorRequest.js';
import url from '../../constant/url.js'
import { i18n } from '@/main.js'
 
 export function getCatalogs(dataObj) {
 	return new Promise(
 		(resolve, reject) => {
 			requestNoAuth({
 				url: url.listReserveCatalog,
 				method: "GET",
 				data: dataObj,
 				//动态数据
 				success: function(res) {
 					if (res.data.code == 0) {
 						let _communtiys = res.data.data;
 						resolve(_communtiys);
 						return ;
 					}
 					reject(i18n.t('未包含数据-4gm'));
 				},
 				fail: function(e) {
 					reject(e);
 				}
 			});
 		})
 }
 
 export function getCatalogGoodss(dataObj) {
 	return new Promise(
 		(resolve, reject) => {
 			requestNoAuth({
 				url: url.listReserveGoods,
 				method: "GET",
 				data: dataObj,
 				//动态数据
 				success: function(res) {
 					if (res.data.code == 0) {
 						let _communtiys = res.data.data;
 						resolve(_communtiys);
 						return ;
 					}
 					reject(i18n.t('未包含数据-4gm'));
 				},
 				fail: function(e) {
 					reject(e);
 				}
 			});
 		})
 }
 export function getReserveParams(dataObj) {
 	return new Promise(
 		(resolve, reject) => {
 			requestNoAuth({
 				url: url.listReserveParams,
 				method: "GET",
 				data: dataObj,
 				//动态数据
 				success: function(res) {
 					if (res.data.code == 0) {
 						let _communtiys = res.data.data;
 						resolve(_communtiys);
 						return ;
 					}
 					reject(i18n.t('未包含数据-4gm'));
 				},
 				fail: function(e) {
 					reject(e);
 				}
 			});
 		})
 }
 export function getReserveGoodsOrderTime(dataObj) {
 	return new Promise(
 		(resolve, reject) => {
 			requestNoAuth({
 				url: url.listReserveGoodsOrderTime,
 				method: "GET",
 				data: dataObj,
 				//动态数据
 				success: function(res) {
 					if (res.data.code == 0) {
 						let _communtiys = res.data.data;
 						resolve(_communtiys);
 						return ;
 					}
 					reject(i18n.t('未包含数据-4gm'));
 				},
 				fail: function(e) {
 					reject(e);
 				}
 			});
 		})
 }
 
 
 
