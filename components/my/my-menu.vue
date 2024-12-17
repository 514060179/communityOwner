<template>
	<view>
		<view class="serve_box">
			<view class="serve_title">基础服务</view>
			<view class="serve_list">
				<view class="list">
					<view class="item" v-for="(item,index) in serve_list" :key="index" @tap="to_serve(item)">
						<image :src="item.src"></image>
						<view class="text">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #ifdef H5 && WUYE -->
		<view class="order_box">
			<view class="order_title">我的订单</view>
			<view class="order_list">
				<view class="list">
					<view class="item" v-for="(item,index) in order_list" :key="index" @tap="toMallOrders()">
						<image :src="item.src"></image>
						<view class="text">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
		<auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>
	</view>
</template>

<script>
	import context from '@/lib/java110/Java110Context.js';
	const factory = context.factory; //获取app实例
	const constant = context.constant;
	import {
		hasAuthOwner
	} from '@/api/owner/ownerApi.js';
	import authOwnerDialog from '@/components/owner/auth-owner-dialog.vue'
	export default {
		name: "myMenu",
		data() {
			return {
				order_list: [{
						name: '待付款',
						src: this.imgUrl + '/h5/images/serve/order1.png',
						href: ''
					},
					{
						name: '待发货',
						src: this.imgUrl + '/h5/images/serve/order2.png',
						href: ''
					},
					{
						name: '待收货',
						src: this.imgUrl + '/h5/images/serve/order3.png',
						href: ''
					},
					{
						name: '已完成',
						src: this.imgUrl + '/h5/images/serve/order4.png',
						href: ''
					}
				],
				serve_list: [{
						name: '业主信息',
						src: this.imgUrl + '/h5/images/serve/my1.png',
						href: '/pages/viewBindOwner/viewBindOwner',
						ownerAuth: true
					},
					{
						name: '我的物业',
						src: this.imgUrl + '/h5/images/serve/my2.png',
						href: '/pages/my/myProperty',
						ownerAuth: true
					},
					{
						name: '我的房屋',
						src: this.imgUrl + '/h5/images/serve/my3.png',
						href: '/pages/my/myHouse',
						ownerAuth: true
					},
					{
						name: '我的报修',
						src: this.imgUrl + '/h5/images/serve/my4.png',
						href: '/pages/repair/myRepair',
						ownerAuth: true
					},
					{
						name: '缴费记录',
						src: this.imgUrl + '/h5/images/serve/my5.png',
						href: '/pages/fee/payFeeDetail',
						ownerAuth: true
					},
					{
						name: '我的车位',
						src: this.imgUrl + '/h5/images/serve/my6.png',
						href: '/pages/applyparking/parkingInfo',
						ownerAuth: true
					},
					{
						name: '我的投诉',
						src: this.imgUrl + '/h5/images/serve/11.png',
						href: '/pages/complaint/complaintList',
						ownerAuth: true
					},
					{
						name: '门禁日志',
						src: this.imgUrl + '/h5/images/serve/my9.png',
						href: '/pages/machine/machineTranslateLog',
						ownerAuth: true
					},
					{
						name: '空置房记录',
						src: this.imgUrl + '/h5/images/serve/my8.png',
						href: '/pages/applyRoom/myRoomList',
						ownerAuth: true
					},
					{
						name: '装修记录',
						src: this.imgUrl + '/h5/images/serve/my10.png',
						href: '/pages/renovation/myRoomList',
						ownerAuth: true
					},
					{
						name: '订场记录',
						src: this.imgUrl + '/h5/images/serve/my8.png',
						href: '/pages/appointment/myBoomList',
						ownerAuth: false
					},
					{
						name: '预约记录',
						src: this.imgUrl + '/h5/images/serve/my8.png',
						href: '/pages/reserve/reserveMyOrder',
						ownerAuth: false
					},
					{
						name: '放行记录',
						src: this.imgUrl + '/h5/images/serve/my8.png',
						href: '/pages/itemRelease/myItemReleaseList',
						ownerAuth: true
					},
					// {
					// 	name: '充电订单',
					// 	src: this.imgUrl + '/h5/images/serve/11.png',
					// 	href: '/pages/machine/chargeMachineOrders',
					// 	ownerAuth: false
					// },
					{
						name: '发票',
						src: this.imgUrl + '/h5/images/serve/my5.png',
						href: '/pages/invoice/invoice',
						ownerAuth: true
					},
				]
			};
		},
		created() {

		},
		components: {
			authOwnerDialog
		},
		methods: {
			// 我的服务跳转
			to_serve(v) {
				if (!v.ownerAuth) {
					this.vc.navigateTo({
						url: v.href
					});
					return;
				}
				hasAuthOwner(this).then(_owner => {
					this.vc.navigateTo({
						url: v.href
					});
				})
			},
			ckeckUserInfo: function() {
				return context.checkLoginStatus();
			},
			toMallOrders() {
				if (!this.ckeckUserInfo()) {
					this.vc.navigateTo({
						url: '../login/showlogin'
					}, () => {
						this.refreshPageLoginInfo();
					});
					return;
				}
				this.vc.navigateToMall({
					url: '/pages/myOrder/myOrderAll'
				})
			},
		}
	}
</script>

<style lang="less">
	.order_box {
		margin-top: 20upx;

		.order_title {
			line-height: 42upx;
			font-size: 30upx;
			font-weight: 600;
			color: #333;
			padding: 20upx;
		}

		.order_list {
			padding: 20upx 20upx 0;
			background: #fff;
		}

		.item {
			width: 25%;
			display: inline-block;
			text-align: center;
			margin-bottom: 20upx;
		}

		image {
			height: 44upx;
			width: 44upx;
		}

		.text {
			color: #333;
			font-size: 28upx;
		}
	}

	.serve_box {
		margin-top: 20upx;

		.serve_title {
			line-height: 42upx;
			font-size: 30upx;
			font-weight: 600;
			color: #333;
			padding: 20upx;
		}

		.serve_list {
			padding: 40upx 20upx 0;
			background: #fff;
		}

		.item {
			width: 20%;
			display: inline-block;
			text-align: center;
			margin-bottom: 40upx;
		}

		image {
			height: 44upx;
			width: 44upx;
		}

		.text {
			color: #333;
			font-size: 28upx;
		}
	}
</style>