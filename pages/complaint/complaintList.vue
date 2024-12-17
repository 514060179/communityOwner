<template>
	<view>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="active==0?'text-green cur':''" @tap="tabSelect(0)">
					正在处理
				</view>
				<view class="cu-item flex-sub" :class="active==1?'text-green cur':''" @tap="tabSelect(1)">
					处理完成
				</view>
			</view>
		</scroll-view>

		<view v-if="active == 0" class="ppfl_c">
			<view v-if="noData==false">
				<view v-for="(item,index) in waitComplaint" :key="index"
					class="bg-white margin-top margin-right-xs radius margin-left-xs padding">
					<view class="flex padding-bottom-xs solid-bottom justify-between">
						<view>{{item.complaintId}}</view>
						<view class="text-gray">{{item.tel}}</view>
					</view>
					<view class="flex margin-top justify-between">
						<view class="text-gray">投诉类型</view>
						<view class="text-gray">{{item.typeName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">投诉人</view>
						<view class="text-gray">{{item.complaintName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">所属房间</view>
						<view class="text-gray">{{item.roomName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">报修内容</view>
						<view class="text-gray">{{item.context}}</view>
					</view>

					<view class="solid-top flex justify-end margin-top padding-top-sm padding-bottom-sm">
						<button class="cu-btn sm line-gray" @click="_toComplaintDetail(item)">详情</button>
					</view>
				</view>
			</view>
			<view v-else>
				<no-data-page></no-data-page>
			</view>
		</view>


		<view v-if="active == 1" class="ppfl_c">
			<view v-if="noData==false">

				<view v-for="(item,index) in complaintd" :key="index"
					class="bg-white margin-top margin-right-xs radius margin-left-xs padding">
					<view class="flex padding-bottom-xs solid-bottom justify-between">
						<view>{{item.complaintId}}</view>
						<view class="text-gray">{{item.tel}}</view>
					</view>
					<view class="flex margin-top justify-between">
						<view class="text-gray">投诉类型</view>
						<view class="text-gray">{{item.typeName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">投诉人</view>
						<view class="text-gray">{{item.complaintName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">所属房间</view>
						<view class="text-gray">{{item.roomName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">投诉时间</view>
						<view class="text-gray">{{item.createTime }}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">投诉内容</view>
						<view class="text-gray">{{item.context}}</view>
					</view>
					<view 
						class="solid-top flex justify-end margin-top padding-top-sm padding-bottom-sm">
						<button class="cu-btn sm bg-green " @click="_appraiseComplaint(item)">评价</button>
						<button class="cu-btn sm line-gray margin-left" @click="_toComplaintDetail(item)">详情</button>
					</view>
				</view>
			</view>
			<view v-else>
				<no-data-page></no-data-page>
			</view>
		</view>

	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	import noDataPage from '@/components/no-data-page/no-data-page.vue';
	import {
		getComplaints
	} from '@/api/community/complaintApi.js';
	import {getCommunityId} from '../../api/community/communityApi.js';
	export default {
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,
				waitComplaint: [],
				complaintd: [],
				active: 0,
				ownerId: '',
				roomId: '',
				communityId: '',
				page: 1,
				totalPage: 0,
				loading: false,
				noData: false,
				userId: ''
			};
		},
		components: {
			noDataPage
		},
		onLoad: function(options) {
			let that = this;
			context.onLoad(options);
			this.communityId = getCommunityId();

			that._loadCompaint(that.active);

		},
		onShow: function() {
			let that = this;
			if (that.communityId) {
				that._loadCompaint(that.active);
			}
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this._loadCompaint(this.active);
			uni.stopPullDownRefresh();
		},

		methods: {
			/**
			 * 加载我的报修
			 */
			_loadCompaint: function(_active) {
				let that = this;

				let _state = '';
				if (_active == 0) {
					_state = 'W';
				} else {
					_state = 'C';
				}
				getComplaints({
					state: _state,
					roomIds: that.roomId,
					page: 1,
					row: 10,
					communityId: that.communityId,
				}).then(_data => {
					let _ownerComplaints = _data.data;
					if (_ownerComplaints.length < 1) {
						that.noData = true;
					}
					if (_active == 0) {
						that.waitComplaint = _ownerComplaints;
					} else {
						that.complaintd = _ownerComplaints;
					}
					return;
				});

			},
			onChange: function(e) {
				this._loadCompaint(e.detail.index);
			},
			tabSelect: function(_active) {
				this.active = _active;
				this._loadCompaint(_active);
				this.noData = false;
			},
			_toComplaintDetail: function(_item) {
				context.navigateTo({
					url: '/pages/complaint/complaintDetail?complaintId=' +
						_item.complaintId +
						"&communityId=" + _item.communityId
				})
			},
			_appraiseComplaint: function(_item) {
				context.navigateTo({
					url: '/pages/complaint/appraiseComplaint?complaintId=' +
						_item.complaintId +
						"&communityId=" + _item.communityId 
				})
			}
		}
	};
</script>
<style>
	.user-container {
		padding: 25rpx 10rpx;
		background-color: #F0F0F0;

		/*border: 1px solid black;*/
	}

	.add_button {}

	.notice {
		margin: 10rpx 7rpx;
		padding: 25rpx;
		background-color: #ffffff;
		border-radius: 7rpx;
		/* display: flex;
	    justify-content: space-between;
	    align-items: flex-end; */
	}

	.title {
		border-bottom: 1rpx solid #dedede;
		font-weight: 700;
		font-size: 34rpx;
		color: #5f5e5e;
		display: flex;
		justify-content: space-between;
	}

	.text {
		padding: 4rpx 0;
		font-size: 30rpx;
	}

	.main {
		/* display: flex;
	  justify-content: space-between;
	  align-items: flex-end; */
		position: relative;
	}

	.main_right {
		position: absolute;
		right: 0px;
		bottom: 0px;
	}

	.button {
		margin-right: 10px;
	}
</style>