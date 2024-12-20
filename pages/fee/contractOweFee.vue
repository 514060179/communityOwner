<template>
	<view>
		<scroll-view scroll-y>
			<view class="block__title">{{ $t('合同信息-FxE') }}</view>
			<view class="cu-list menu">
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('合同名称-Uni') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{ contractName }}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('合同编号-9eT') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{ contractCode }}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('开始时间-Uv9') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{ contractStartTime }}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('结束时间-3Q1') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{ contractEndTime }}</text>
					</view>
				</view>
			</view>
			<view class="block__title" v-if="fees.length > 0">{{ $t('欠费信息-nx7') }}</view>
			<view class="cu-list menu" v-for="(item,index) in fees" :key="index" :data-item="item">
				<view class="cu-item">
					<view class="content padding-tb-sm">
						<view>
							<view class="text-cut" style="width:220px">{{ item.feeName }}</view>
						</view>
						<view class="text-gray text-sm">
							<text class="margin-right-xs">{{ item.endTime }}{{ $t('至-hYF') }}{{ item.deadlineTime }}</text></view>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{ $t('应缴-Fz5') }}: MOP{{ item.feePrice }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view style="height: 100upx;">
			
		</view>
		<view v-if="fees.length > 0" class="bg-white  border flex justify-end" style="position: fixed;width: 100%;bottom: 0;">

			<view class="action text-orange margin-right line-height">
				{{ $t('合计-87u') }}：MOP {{ receivableAmount }}
			</view>
			<view class="btn-group">
				<!-- #ifdef H5 || MP-WEIXIN -->
				<button class="cu-btn bg-red shadow-blur lgplus sharp" @click="onPayFee()">{{ $t('提交订单-sDX') }}</button>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<button class="cu-btn bg-red shadow-blur lgplus sharp" @click="_payWxApp()">{{ $t('提交订单-sDX') }}</button>
				<!-- #endif -->
			</view>
		</view>
	</view>

	</view>
</template>

<script>
	// pages/fee/payParkingFee.js
import context from '../../lib/proprietor/proprietorContext.js';

	

	// import {
	// 	addMonth,
	// 	formatDate
	// } from '../../lib/proprietor/utils/DateUtil.js'

	import {
		getCurCommunity
	} from '../../api/community/communityApi.js'

	import {
		getRoomOweFees
	} from '../../api/fee/feeApi.js'

	// import {
	// 	getRooms
	// } from '../../api/room/roomApi.js'
	import {getCurContract} from '../../api/contract/contractApi.js'
	const constant = context.constant;


	// #ifdef H5

	const WexinPayFactory = require('../../factory/WexinPayFactory.js');
  // #endif
	export default {
		data() {
			return {
				scrollLeft: 0,
				amount: 0,
				receivableAmount: 0.00,
				communityId: '',
				communityName: '',
				floorNum: '',
				unitNum: '',
				roomNum: '',
				builtUpArea: '',
				additionalAmount: '',
				appId: '',
				fees: [],
				contractId: '',
				contractName: '',
				contractCode: '',
				contractStartTime: '',
				contractEndTime: '',
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			const _that = this;
			context.onLoad(options);
			// #ifdef MP-WEIXIN
			const accountInfo = uni.getAccountInfoSync();
			this.appId = accountInfo.miniProgram.appId;
			// #endif
			// #ifdef H5
			this.appId = uni.getStorageSync(constant.mapping.W_APP_ID)
			// #endif
			this.contractId = options.contractId;

			getCurCommunity()
				.then(function(_curCommunity) {
					_that.communityId = _curCommunity.communityId;
					_that.communityName = _curCommunity.communityName;
					return _curCommunity;
				}).then(function(_curCommunity) {
					_that._loadContractOweFee();
				});
			this._loadCurContract(this.contractId);
		},
		methods: {

			_loadContractOweFee: function() {
				const _that = this;
				const _objData = {
					payObjId: this.contractId,
					payObjType: '7777',
					page: 1,
					row: 50,
					communityId: this.communityId
				}

				getRoomOweFees(_objData)
					.then(function(_fees) {
						_that.fees = _fees;
						return _fees;
					}, function(error) {
						uni.showToast({
							icon: 'none',
							title: this.$t('没有欠费信息-sCU')
						})
					})
					.then(function(_fees) {
						_fees.forEach(function(_item) {
							_that.receivableAmount += _item.feePrice;

						})
						_that.receivableAmount = _that.receivableAmount.toFixed(2);
					})
			},

			_payWxApp: function(_data) {
				const _receivedAmount = this.receivableAmount;
				wx.showLoading({
					title: this.$t('支付中-WHp')
				});

				const _tradeType = 'APP';
				const _objData = {
					cycles: this.feeMonth,
					communityId: this.communityId,
					roomId: this.contractId,
					feeName: '物业费',
					receivedAmount: _receivedAmount,
					tradeType: _tradeType,
					appId: this.appId,
					payObjType:'7777'
				};
				context.request({
					url: constant.url.toOweFeePay,
					header: context.getHeaders(),
					method: 'POST',
					data: _objData,
					//动态数据
					success: function(res) {

						if (res.statusCode == 200 && res.data.code == '0') {
							const data = res.data; //成功情况下跳转
							const obj = {
								appid: data.appId,
								noncestr: data.nonceStr,
								package: 'Sign=WXPay', // 固定值，以微信支付文档为主
								partnerid: data.partnerid,
								prepayid: data.prepayid,
								timestamp: data.timeStamp,
								sign: data.sign // 根据签名算法生成签名
							}
							// 第二种写法，传对象字符串
							const orderInfo = JSON.stringify(obj)
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: orderInfo, //微信、支付宝订单数据
								success: function(res) {
									uni.showToast({
										title: this.$t('支付成功-u1S'),
										duration: 2000
									});
									uni.navigateBack({});
								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));
								}
							});
							wx.hideLoading();
							return;
						}

						wx.hideLoading();
						wx.showToast({
							title: this.$t('缴费失败-UVj'),
							icon: 'none',
							duration: 2000
						});
					},
					fail: function(e) {
						wx.hideLoading();
						wx.showToast({
							title: this.$t('服务器异常了-eja'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			onPayFee: function() {
				const _receivedAmount = this.receivableAmount;
				wx.showLoading({
					title: this.$t('支付中-WHp')
				});
				const _tradeType = 'JSAPI';
				const _objData = {
					cycles: this.feeMonth,
					communityId: this.communityId,
					roomId: this.contractId,
					feeName: '物业费',
					receivedAmount: _receivedAmount,
					tradeType: _tradeType,
					appId: this.appId,
					payObjType:'7777'
				};
				context.request({
					url: constant.url.toOweFeePay,
					header: context.getHeaders(),
					method: 'POST',
					data: _objData,
					//动态数据
					success: function(res) {
						if (res.statusCode == 200 && res.data.code == '0') {
							const data = res.data; //成功情况下跳转
							// #ifdef MP-WEIXIN
							uni.requestPayment({
								'timeStamp': data.timeStamp,
								'nonceStr': data.nonceStr,
								'package': data.package,
								'signType': data.signType,
								'paySign': data.sign,
								'success': function(res) {
									uni.showToast({
										title: this.$t('支付成功-u1S'),
										duration: 2000
									});
									uni.navigateBack({});
								},
								'fail': function(res) {
									console.log('fail:' + JSON.stringify(res));
								}
							});
							// #endif
							// #ifdef H5
							WexinPayFactory.wexinPay(data, function() {
								uni.showToast({
									title: this.$t('支付成功-u1S'),
									duration: 2000
								});
								uni.navigateBack({});
							});
							// #endif
							wx.hideLoading();
							return;
						}

						wx.hideLoading();
						wx.showToast({
							title: this.$t('缴费失败-UVj'),
							icon: 'none',
							duration: 2000
						});
					},
					fail: function(e) {
						wx.hideLoading();
						wx.showToast({
							title: this.$t('服务器异常了-eja'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			_loadCurContract: function(_contractId) {
				const _that = this;
				getCurContract({
					contractId: _contractId
				}).then(data => {
					_that.contractCode = data.contractCode;
					_that.contractName = data.contractName;
					_that.contractStartTime = data.startTime;
					_that.contractEndTime = data.endTime;
				})
			}
		}
	};
</script>
<style>
	.ppf_item {
		padding: 0rpx 0rpx 0rpx 0rpx;
	}

	.block__title {
		margin: 0;
		font-weight: 400;
		font-size: 14px;
		color: rgba(69, 90, 100, .6);
		padding: 40rpx 30rpx 20rpx;
	}

	.button_up_blank {
		height: 40rpx;
	}

	.block__bottom {
		height: 180rpx;
	}

	.fee-last {
		margin-bottom: 200upx;
	}

	.cu-btn.lgplus {
		padding: 0 20px;
		font-size: 18px;
		height: 100upx;

	}

	.cu-btn.sharp {
		border-radius: 0upx;
	}

	.line-height {
		line-height: 100upx;
	}
</style>
