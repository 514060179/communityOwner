<template>
	<view>
		<view class="block__title">
			<text>访客信息</text>
			<button class="cu-btn bg-blue" @click="_toTempFilePath()" v-show="visitInfo.visitorCode == 'true'">保存</button>
		</view>
		<view class="u-qrcode" style="text-align: center;">
			<canvas style="width: 200px; height: 200px; margin: 0 auto;background: #fff;position: fixed;left: 100%;" canvas-id="myQrcode" v-show="!needLongTapSaveImg"></canvas>
			<canvas style="width: 100%; margin: 0 auto;background: #fff;" :style="{height: visitInfo.visitorCode == 'false' ? '450px' : '850px'}" canvas-id="myBg" v-show="!needLongTapSaveImg"></canvas>
			<image :src="tempFilePath" style="width: 100%; margin: 0 auto;" :style="{height: visitInfo.visitorCode == 'false' ? '450px' : '850px'}" v-show="needLongTapSaveImg"></image>
		</view>
	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	import {listOwnerVisit}  from '../../api/visit/visit.js'
	import drawQrcode from '@/components/weapp-qrcode/weapp.qrcode.esm.js'
	const constant = context.constant;
	const util = context.util;
	export default {
		data() {
			return {
				visitInfo: {},
				ownerInfo: {},
				qrcodeValue: '',
				windowWidth: 0,
				windowHeight: 0,
				tempFilePath: '',
				needLongTapSaveImg: false,
			}
		},
		components: {
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			context.onLoad(options);
			let _that = this;
			context.getOwner(function(_owner) {
				_that.ownerInfo = _owner;
				_that._loadVisitInfo(options.vId);
			});
		},
		onReachBottom : function(){},
		methods: {
			_toTempFilePath: function() {
				if(this.tempFilePath == ''){
					uni.showToast({
						title: '图片未生成',
						icon: 'none'
					})
					return;
				}
				//#ifndef H5
				uni.saveImageToPhotosAlbum({
					filePath: this.tempFilePath,
					success: function() {
						uni.showToast({
							title: '已保存至相册',
							icon: 'none'
						})
					}
				});
				//#endif
				//#ifdef H5
				uni.showToast({
					title: '请长按图片-保存至相册'
				})
				//#endif
			},
			
			_loadVisitInfo: function(vId){
				let _that = this;
				let _objData = {
					page: 1,
					row: 1,
					vId: vId,
					ownerId: this.ownerInfo.ownerId,
					userId: this.ownerInfo.userId,
					communityId: this.ownerInfo.communityId
				}
				listOwnerVisit(_objData).then((_visits) => {
					_that.visitInfo = _visits.visits[0];
					let qrText = _that.visitInfo.vId;
					drawQrcode({
						width: 200,
						height: 200,
						canvasId: 'myQrcode',
						text: qrText,
						callback: (e) => {
							uni.canvasToTempFilePath({
								x: 0,
								y: 0,
								width: 400,
								height: 400,
								destWidth: 400,
								destHeight: 400,
								canvasId: 'myQrcode',
								success: (qrcodeTempRes) => {
									// 获取到单二维码的tempFilePath
									// 将二维码的tempFilePath画到背景canvas上
									uni.getSystemInfo({
										success: (systemRes) => {
											this.windowWidth = systemRes.windowWidth;
											this.windowHeight = systemRes.windowHeight;
											let ctx = uni.createCanvasContext('myBg');
											ctx.setFillStyle('#494949');
											let topHeight = 0;
											// 头部信息
											ctx.setTextAlign('center');
											ctx.font = 'bold 16rpx 微软雅黑';
											if(this.visitInfo.visitorCode == "true"){
												ctx.fillText('访客二维码', this.windowWidth/2, topHeight += 40);
											}else{
												ctx.fillText('访客信息', this.windowWidth/2, topHeight += 40);
											}
											ctx.setFillStyle('#A0A0A0');
											ctx.font = 'normal 14rpx 微软雅黑';
											ctx.fillText('创建时间:' + this.visitInfo.createTime, this.windowWidth/2, topHeight += 20);
											if(this.visitInfo.visitorCode == "true"){
												// 二维码
												ctx.drawImage(qrcodeTempRes.tempFilePath, this.windowWidth/2 - (this.windowWidth - 50) / 2, topHeight += 20, this.windowWidth - 50, this.windowWidth - 50);
												// 预约状态
												ctx.fillText('预约状态', this.windowWidth/2, topHeight += (this.windowWidth - 50) + 20);
											}else{
												// 预约状态
												ctx.fillText('预约状态', this.windowWidth/2, topHeight += 30);
											}
											// 预约状态判断
											ctx.font = 'bold 20rpx 微软雅黑';
											if(this.visitInfo.state == 0 || this.visitInfo.state == 2 || this.visitInfo.state == 3){
												ctx.setFillStyle('#808080');
												ctx.fillText('未生效', this.windowWidth/2, topHeight += 30);
											}else if(this.visitInfo.recordState == 0){
												ctx.setFillStyle('#41A863');
												ctx.fillText('已生效', this.windowWidth/2, topHeight += 30);
											}else{
												ctx.setFillStyle('#DD5044');
												ctx.fillText('已失效', this.windowWidth/2, topHeight += 30);
											}
											// 线
											ctx.setStrokeStyle('#f2f2f2')
											ctx.moveTo(25, topHeight += 20)
											ctx.lineTo(this.windowWidth - 25, topHeight)
											ctx.stroke()
											// 列表
											let listHeight = topHeight;
											// 列表名
											ctx.setTextAlign('left');
											ctx.setFontSize(14);
											ctx.setFillStyle('#A0A0A0');
											ctx.fillText('访客姓名:', 25, topHeight += 25);
											ctx.fillText('访客联系方式:', 25, topHeight += 25);
											ctx.fillText('来访事由:', 25, topHeight += 25);
											ctx.fillText('随行人数:', 25, topHeight += 25);
											ctx.fillText('预计来访时间:', 25, topHeight += 25);
											ctx.fillText('预计离开时间:', 25, topHeight += 25);
											ctx.fillText('车牌号:', 25, topHeight += 25);
											ctx.fillText('车辆审核状态:', 25, topHeight += 25);
											ctx.fillText('停车场:', 25, topHeight += 25);
											ctx.fillText('停车位:', 25, topHeight += 25);
											ctx.fillText('备注:', 25, topHeight += 25);
											// 列表值
											ctx.setTextAlign('right');
											ctx.setFontSize(14);
											ctx.setFillStyle('#494949');
											ctx.fillText(this.visitInfo.vName, this.windowWidth - 25, listHeight += 25);
											ctx.fillText(this.visitInfo.phoneNumber, this.windowWidth - 25, listHeight += 25);
											ctx.fillText(this.visitInfo.visitCase, this.windowWidth - 25, listHeight += 25);
											ctx.fillText(this.visitInfo.entourage, this.windowWidth - 25, listHeight += 25);
											ctx.fillText(this.visitInfo.visitTime, this.windowWidth - 25, listHeight += 25);
											ctx.fillText(this.visitInfo.departureTime, this.windowWidth - 25, listHeight += 25);
											ctx.fillText((this.visitInfo.carNum ? this.visitInfo.carNum : '无'), this.windowWidth - 25, listHeight += 25);
											ctx.fillText((this.visitInfo.carNum ? this.visitInfo.carStateName : '无'), this.windowWidth - 25, listHeight += 25);
											ctx.fillText((this.visitInfo.parkAreaNum ? this.visitInfo.parkAreaNum : '无'), this.windowWidth - 25, listHeight += 25);
											ctx.fillText((this.visitInfo.parkingSpaceNum ? this.visitInfo.parkingSpaceNum : '无'), this.windowWidth - 25, listHeight += 25);
											// ctx.fillText(this.visitInfo.stateRemark, this.windowWidth - 10, listHeight += 25);
											ctx.setTextAlign('left');
											// this.canvasTextAutoLine(this.visitInfo.stateRemark, ctx, 50, listHeight += 25, 20, this.windowWidth / 2);
											if(this.visitInfo.stateRemark){
												this.toFormateStr(this.visitInfo.stateRemark, ctx, 65, listHeight += 25, Math.floor(this.windowWidth / 1.8), 3, 25);
											}
											ctx.draw(true, () => {
												setTimeout(() => {
													// 获取到合并后的地址
													uni.canvasToTempFilePath({
														canvasId: 'myBg',
														fileType: 'jpg',
														success: (res2) => {
															this.tempFilePath = res2.tempFilePath
															//#ifdef H5
															this.needLongTapSaveImg = true;
															//#endif
														}
													})
												})
											})
										}
									})
								} 
							})
						}
					})
				})
			},
			
			toFormateStr: function(str = '', ctx, startX, startY, draw_width, lineNum, steps) {
				var strWidth = ctx.measureText(str).width;     // 测量文本源尺寸信息（宽度）
				var startpoint = startY, keyStr = '', sreLN = strWidth / draw_width;
				var liner = Math.ceil(sreLN);     // 计算文本源一共能生成多少行
				let strlen = parseInt(str.length / sreLN); 	// 等比缩放测量一行文本显示多少个字符
				// 若文本不足一行，则直接绘制，反之大于传入的最多行数（lineNum）以省略号（...）代替
				if (strWidth  < draw_width) {
					ctx.fillText(str, startX, startpoint);
				} else {
					for (var i = 1; i < liner + 1; i++) {
						let startPoint = strlen * (i-1);
						if (i < lineNum || lineNum == -1) {
							keyStr = str.substr(startPoint, strlen);
							ctx.fillText(keyStr, startX, startpoint);
						} else {
							keyStr = str.substr(startPoint, strlen-5) + '...';
							ctx.fillText(keyStr, startX, startpoint);
							break;
						}
						startpoint = startpoint + steps;
					}
				}
			}
		}
	}
</script>

<style>
	page{
		background-color: #fff;
	}
	.solid-bottom::after {
		border-bottom: 2upx solid rgba(0, 0, 0, 0.1);
	}

	.ppf_item {
		padding: 0rpx 0rpx 0rpx 0rpx;
	}

	.block__title {
		display: flex;
		justify-content: space-between;
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
	.u-qrcode{
		width: 100%;
		margin: 0 auto;
	}
	.w100{
		width: 500rpx;
	}
</style>
