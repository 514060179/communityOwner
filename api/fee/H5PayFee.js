
import context from '../../lib/proprietor/proprietorContext.js';
import WexinPayFactory from '../../factory/WexinPayFactory.js'
import mapping from '../../constant/MappingConstant.js'
import url from '../../constant/url.js'
import { i18n } from '@/main.js'

export function payOweFee(_that) {
	let _receivedAmount = _that.receivableAmount;
	wx.showLoading({
		title: i18n.t('支付中-WHp')
	});
	let _tradeType = 'JSAPI';
	let _objData = {
		business: "oweFee",
		cycles: _that.feeMonth,
		communityId: _that.communityId,
		ownerId: _that.ownerId,
		feeName: i18n.t('物业费-bRl'),
		receivedAmount: _receivedAmount,
		tradeType: _tradeType,
		appId: uni.getStorageSync(mapping.W_APP_ID),
		storeId: _that.storeId
	};
	context.request({
		url: url.unifiedPayment,
		header: context.getHeaders(),
		method: "POST",
		data: _objData,
		//动态数据
		success: function(res) {
			if (res.statusCode == 200 && res.data.code == '0') {
				let data = res.data; //成功情况下跳转
				WexinPayFactory.wexinPay(data, function() {
					// uni.showToast({
					// 	title: "支付成功",
					// 	duration: 2000
					// });
					// uni.navigateBack({});
					uni.navigateTo({
						url:"/pages/successPage/successPage?msg=支付成功&objType=3003"
					})
				});
				wx.hideLoading();
				return;
			}
			wx.hideLoading();
			wx.showToast({
				title: i18n.t("缴费失败-UVj"),
				icon: 'none',
				duration: 2000
			});
		},
		fail: function(e) {
			wx.hideLoading();
			wx.showToast({
				title: i18n.t("服务器异常了-eja"),
				icon: 'none',
				duration: 2000
			});
		}
	});
}
