<template>
	<view>
		<view class="real_list">
			<view class="title">物业服务</view>
			<view class="list">
				<view class="item" v-for="(item,index) in real_list" :key="index" @tap="to(item)">
					<image :src="item.src"></image>
					<view class="text">{{item.name}}</view>
				</view>
			</view>
		</view>
		<auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>

	</view>
</template>

<script>
	import {
		hasAuthOwner
	} from '@/api/owner/ownerApi.js';
	import authOwnerDialog from '@/components/owner/auth-owner-dialog.vue'

	export default {
		name: "serviceProperty",
		data() {
			return {
				real_list: [],
			};
		},
		created() {
			this._loadMenu();
		},
		components: {
			authOwnerDialog
		},
		methods: {
			to: function(v) {
				if (v.name == '商圈') {
					uni.switchTab({
						url: v.href
					});
					return;
				}
				if (!v.href) {
					uni.showToast({
						icon: 'none',
						title: '此功能暂不开放'
					});
					return;
				}
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
			_loadMenu: function() {
				this.real_list = [{
						name: '生活缴费',
						src: this.imgUrl + '/h5/images/serve/1.png',
						href: '/pages/fee/oweFee',
						ownerAuth:true
					},
					{
						name: '房屋费',
						src: this.imgUrl + '/h5/images/serve/5.png',
						href: '/pages/fee/roomFeeListNew',
						ownerAuth:true
					}, {
						name: '停车费',
						src: this.imgUrl + '/h5/images/serve/9.png',
						href: '/pages/fee/payParkingFeeList',
						ownerAuth:true
					}, {
						name: '合同费',
						src: this.imgUrl + '/h5/images/serve/12.png',
						href: '/pages/fee/contractFeeList',
						ownerAuth:true
					},
					{
						name: '水电充值',
						src: this.imgUrl + '/h5/images/serve/5.png',
						href: '/pages/meter/meter',
						ownerAuth:true
					},
					{
						name: '家庭成员',
						src: this.imgUrl + '/h5/images/serve/2.png',
						href: '/pages/family/familyList',
						ownerAuth:true
					},
					{
						name: '访客通行',
						src: this.imgUrl + '/h5/images/serve/3.png',
						href: '/pages/visit/visitList',
						ownerAuth:true
					},
					{
						name: '投诉咨询',
						src: this.imgUrl + '/h5/images/serve/4.png',
						href: '/pages/complaint/complaint',
						ownerAuth:true
					},
					{
						name: '报事维修',
						src: this.imgUrl + '/h5/images/serve/6.png',
						href: '/pages/repair/repair',
						ownerAuth:true
					},
					{
						name: '社区公告',
						src: this.imgUrl + '/h5/images/serve/7.png',
						href: '/pages/notice/index',
						ownerAuth:false
					},
					{
						name: '一键开门',
						src: this.imgUrl + '/h5/images/serve/8.png',
						href: '/pages/machine/openDoor',
						ownerAuth:true
					},
					{
						name: '装修报备',
						src: this.imgUrl + '/h5/images/serve/10.png',
						href: '/pages/renovation/roomRenovation',
						ownerAuth:true
					},
					{
						name: '业主信息',
						src: this.imgUrl + '/h5/images/serve/my1.png',
						href: '/pages/viewBindOwner/viewBindOwner',
						ownerAuth:true
					},
					{
						name: "车位申请",
						src: this.imgUrl + "/h5/images/serve/my6.png",
						href: "/pages/applyparking/applyparking",
						ownerAuth:true
					},
					{
						name: "投票问卷",
						src: this.imgUrl + "/h5/images/serve/my2.png",
						href: "/pages/questionAnswer/questionAnswer",
						ownerAuth:true
					},
					{
						name: '空置房申请',
						src: this.imgUrl + '/h5/images/serve/my9.png',
						href: '/pages/applyRoom/applyRoom',
						ownerAuth:true
					},
					{
						name: '球场预约',
						src: this.imgUrl + '/h5/images/serve/order4.png',
						href: '/pages/appointment/appointment',
						ownerAuth:false
					},
					{
						name: '就餐',
						src: this.imgUrl + '/h5/images/serve/order4.png',
						href: '/pages/reserve/reserveDining',
						ownerAuth:false
					},
					{
						name: '预约服务',
						src: this.imgUrl + '/h5/images/serve/order4.png',
						href: '/pages/reserve/reserveService',
						ownerAuth:false
					},
					{
						name: '物品放行',
						src: this.imgUrl + '/h5/images/serve/order4.png',
						href: '/pages/itemRelease/itemRelease',
						ownerAuth:true
					},
					// {
					// 	name: '智能充电',
					// 	src: this.imgUrl + '/h5/images/serve/my3.png',
					// 	href: '/pages/machine/chargeMachines',
					// 	ownerAuth:false
					// },
					{
						name: '物业打分',
						src: this.imgUrl + '/h5/images/serve/my9.png',
						href: '/pages/complaint/examineStaff',
						ownerAuth:true
					},
					{
						name: '小区公示',
						src: this.imgUrl + '/h5/images/serve/my1.png',
						href: '/pages/common/communityPublicity',
						ownerAuth:false
					},
				];
			}
		}
	}
</script>

<style lang="less">
	.real_list,
	.live_list {
		background: #fff;
		padding: 0 40upx;
		margin-top: 20upx;

		.title {
			line-height: 32upx;
			background: #fff;
			font-size: 30upx;
			font-weight: 600;
			color: #333;
			padding: 40upx 0;
			margin-top: 10px;
		}

		.item {
			width: 25%;
			display: inline-block;
			text-align: center;
			margin-bottom: 40upx;
		}

		image {
			height: 44upx;
			width: 44upx;
			margin-bottom: 10upx;
		}

		.text {
			color: #333;
			font-size: 28upx;
		}
	}
</style>