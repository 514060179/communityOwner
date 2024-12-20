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
			<view class="block__title">{{ $t('费用信息-3Hv') }}</view>
			<view class="cu-list menu fee-last">
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('费用编号-y7z') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{ feeId }}</text>
					</view>
				</view>
				<view class="cu-item" v-if="feeFlag == '1003006'">
					<view class="content">
						<text class="text-grey">{{ $t('金额-LrA') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{ amount }}MOP/{{ $t('月-jmQ') }}</text>
					</view>
				</view>
				<view class="cu-item" v-else>
					<view class="content">
						<text class="text-grey">{{ $t('金额-LrA') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">MOP{{ amount }}</text>
					</view>
				</view>
				<view class="cu-item arrow" v-if="feeFlag == '1003006'">
					<view class="content">
						<text class="text-grey">{{ $t('周期-FZx') }}</text>
					</view>
					<view class="action">
						<picker bindchange="PickerChange" :value="index" :range="feeMonthList" @change="dateChange">
							<view class="picker">
								{{ feeMonthName }}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item" v-if="feeFlag != '2006012'">
					<view class="content">
						<text class="text-grey">{{ $t('到期时间-N71') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{ endTime }}</text>
					</view>
				</view>
				<gift-coupon ref="giftCoupon" ></gift-coupon>
				<vcDiscount
					ref="vcDiscountRef"
					@computeFeeDiscount="computeFeeDiscount"
					payerObjType="3333"
					:payerObjId="contractId"
					:endTime="formatEndTime"
					:feeId="feeId"
					:cycles="feeMonth"
					:communityId="communityId" />
			</view>
			
		</scroll-view>
		<view class=" bg-white  border flex justify-end" style="position: fixed;width: 100%;bottom: 0;">
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
	import giftCoupon from '@/components/coupon/gift-coupon.vue'
	
	import vcDiscount from '@/components/vc-discount/vc-discount.vue'
	
	
	
	// #ifdef APP-PLUS
	import {getPayInfo} from '../../factory/WexinAppPayFactory.js'
	// #endif
	
	import {addMonth,formatDate,date2String} from '../../lib/proprietor/utils/DateUtil.js'
	
	import {getCurContract} from '../../api/contract/contractApi.js'
	const constant = context.constant;

	
	// #ifdef H5
	
	const WexinPayFactory = require('../../factory/WexinPayFactory.js');
  // #endif
	export default {
		components:{
			vcDiscount,
			giftCoupon
		},
		data() {
			return {
				date: '2018-12-25',
				index: 0,
				active: 0,
				TabCur: 0,
				scrollLeft: 0,
				showFeeMonth: false,
				feeMonthList: [],
				feeMonthName: '',
				feeMonth: 1,
				endTime: '',
				ordEndTime: '',
				formatEndTime: '',
				amount: 0,
				receivableAmount: 0.00,
				communityId: '',
				communityName: '',
				feeId: '',
				contractId: '',
				contractName: '',
				contractCode: '',
				contractStartTime: '',
				contractEndTime: '',
				costList: [{}, {}], //费用清单
				additionalAmount: '',
				appId: '',
				feeFlag:'',
				paymentCycle:1,
				squarePrice: 0,
			};
		},
		
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			context.onLoad(options);
			// #ifdef MP-WEIXIN
			const accountInfo = uni.getAccountInfoSync();
			this.appId = accountInfo.miniProgram.appId;
			// #endif
			// #ifdef H5
				this.appId = uni.getStorageSync(constant.mapping.W_APP_ID)
			// #endif
			const _fee = JSON.parse(options.fee);
			this._loadCurContract(_fee.contractId);
			const _amount = _fee.amount;
			let _receivableAmount = _amount;
			if(_fee.feeFlag == '2006012'){ // 周期性费用
				_receivableAmount = _amount;
			}else{ // 一次性费用
				_receivableAmount = (_amount * _fee.paymentCycle).toFixed(2);
			}
			const _communityInfo = context.getCurrentCommunity();
			const _lastDate = new Date(_fee.endTime);
			this.receivableAmount = _receivableAmount;
			this.communityId = _communityInfo.communityId;
			this.communityName = _communityInfo.communityName;
			this.floorNum = _fee.floorNum;
			this.unitNum = _fee.unitNum;
			this.roomNum = _fee.roomNum;
			this.contractId = _fee.contractId;
			this.layer = _fee.layer;
			this.builtUpArea = _fee.builtUpArea;
			this.feeId = _fee.feeId;
			this.amount = _amount;
			this.additionalAmount = _fee.additionalAmount;
			this.ordEndTime = _fee.endTime;
			this.formatEndTime = date2String(_fee.endTime);
			this.feeFlag = _fee.feeFlag;
			this.squarePrice = _fee.squarePrice;
			if(this.feeFlag == '2006012'){
				return;
			}
			this.paymentCycle = _fee.paymentCycle;	
			for (let _index = 1; _index < 7; _index++) {
				this.feeMonthList.push(_index * this.paymentCycle + '个月')
			}
			this.feeMonthName = this.paymentCycle + '个月';
			this.feeMonth = this.paymentCycle;
			const _endTime = addMonth(_lastDate, parseInt(this.feeMonth));
			this.endTime = formatDate(_endTime);
			
			this.$nextTick(() => {
				this.$refs.vcDiscountRef._loadFeeDiscount(this.feeId,this.communityId,this.feeMonth);
				this.$refs.giftCoupon.listGiftCoupon(this.feeId, this.communityId, this.feeMonth);
			})
		},
		computed: {
			tablist() {
				return [this.$t('缴费-OKv'), this.$t('历史-8KF')]
			}
		},
		methods: {
			computeFeeDiscount:function(_price){
				// this.receivableAmount = this.receivableAmount - _price;
				this.receivableAmount = (parseFloat(this.receivableAmount) + parseFloat(_price)).toFixed(2);
			},
			dateChange: function(e) {
				let _feeMonthName = null;
				_feeMonthName = this.feeMonthList[e.detail.value];
				const _feeMonth = _feeMonthName.replace('个月','');
				 const _receivableAmount = _feeMonth * this.amount;
				//let _receivableAmount = _feeMonth * (this.builtUpArea * this.squarePrice + parseFloat(this.additionalAmount));
				const _lastDate = new Date(this.ordEndTime);
				const _newDate = addMonth(_lastDate, parseInt(_feeMonth));
				this.showFeeMonth = false;
				this.feeMonthName = _feeMonthName;
				this.receivableAmount = _receivableAmount.toFixed(2);
				this.feeMonth = _feeMonth;
				this.endTime = formatDate(_newDate);
				this.$refs.vcDiscountRef._loadFeeDiscount(this.feeId,this.communityId,this.feeMonth);
				this.$refs.giftCoupon.listGiftCoupon(this.feeId, this.communityId, this.feeMonth);
			},
			onFeeMonthChange: function(e) {
				console.log(e);
			},
			onFeeMonthCancel: function(e) {
				this.showFeeMonth = false;
			},
			_payWxApp: function(_data) {
				const _receivedAmount = this.receivableAmount;
				wx.showLoading({
					title: '支付中'
				});

				const _tradeType = 'APP';
				const _objData = {
					cycles: this.feeMonth,
					communityId: this.communityId,
					feeId: this.feeId,
					feeName: '物业费',
					receivedAmount: _receivedAmount,
					tradeType: _tradeType,
					appId: this.appId,
					endTime: this.formatEndTime
				};
				context.request({
					url: constant.url.preOrder,
					header: context.getHeaders(),
					method: 'POST',
					data: _objData,
					//动态数据
					success: function(res) {
						if (res.statusCode == 200 && res.data.code == '0') {
							const data = res.data; //成功情况下跳转
							
							let obj = {};
							let orderInfo = {};
							// #ifdef MP-WEIXIN
							 obj = {
								appid: data.appId,
								noncestr: data.nonceStr,
								package: 'Sign=WXPay', // 固定值，以微信支付文档为主
								partnerid: data.partnerid,
								prepayid: data.prepayid,
								timestamp: data.timeStamp,
								sign: data.sign // 根据签名算法生成签名
							}
							// #endif
							// #ifdef APP-PLUS
							obj = getPayInfo(data);
							// #endif
							
							// 第二种写法，传对象字符串
							orderInfo = JSON.stringify(obj)
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: orderInfo, //微信、支付宝订单数据
								success: function(res) {
									uni.showToast({
										title: '支付成功',
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
							title: '缴费失败',
							icon: 'none',
							duration: 2000
						});
					},
					fail: function(e) {
						wx.hideLoading();
						wx.showToast({
							title: '服务器异常了',
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			onPayFee: function() {
				const _receivedAmount = this.receivableAmount;
				wx.showLoading({
					title: '支付中'
				});
				const _tradeType = 'JSAPI';
				const _objData = {
					cycles: this.feeMonth,
					communityId: this.communityId,
					feeId: this.feeId,
					feeName: '物业费',
					receivedAmount: _receivedAmount,
					tradeType: _tradeType,
					appId: this.appId,
					payerObjId: this.contractId,
					payerObjType: 3333,
					endTime: this.formatEndTime
				};
				context.request({
					url: constant.url.preOrder,
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
										title: '支付成功',
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
								WexinPayFactory.wexinPay(data,function(){
									uni.showToast({
										title: '支付成功',
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
							title: '缴费失败',
							icon: 'none',
							duration: 2000
						});
					},
					fail: function(e) {
						wx.hideLoading();
						wx.showToast({
							title: '服务器异常了',
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			_loadCurContract:function(_contractId){
				const _that =this;
				getCurContract({
					contractId:_contractId
				}).then(data =>{
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
	.ppf_item{
	  padding: 0rpx 0rpx 0rpx 0rpx;
	}
	
	.block__title {
	  margin: 0;
	  font-weight: 400;
	  font-size: 14px;
	  color: rgba(69,90,100,.6);
	  padding: 40rpx 30rpx 20rpx;
	}
	
	.button_up_blank{
	  height: 40rpx;
	}
	
	.block__bottom{
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
