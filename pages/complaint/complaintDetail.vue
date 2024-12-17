<template>
	<view>
		<view class="padding margin-top">
			<text>订单信息</text>
		</view>
		<view class="cu-list menu" >
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-edit text-green"></text>
					<text class="text-grey">投诉编码</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.complaintId}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-ticket text-green"></text>
					<text class="text-grey">房屋编码</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.roomName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-footprint text-green"></text>
					<text class="text-grey">类型</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.typeName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-profile text-green"></text>
					<text class="text-grey">投诉人</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.complaintName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-phone text-green"></text>
					<text class="text-grey">投诉电话</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.tel}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-time text-green"></text>
					<text class="text-grey">投诉时间</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.createTime}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="cuIcon-comment text-blue margin-right-xs"></text>投诉内容</view>
					<view class="text-gray text-sm">
						<text class="cuIcon-infofill margin-right-xs"></text>{{complaint.context}}</view>
				</view>
			</view>
			
			<view class="cu-item" v-if="complaint.photos && complaint.photos.length > 0">
				<view class="margin-top grid text-center col-3 grid-square" >
					<view class="" v-for="(_item,index) in complaint.photos" :key="index">
						<image mode="scaleToFill" :data-url="_item.url" :src="_item.url" @tap="preview(index)"></image>
					</view>
				</view>
			</view>
		
		</view>
		
		<view class="cu-timeline margin-top">
			<view class="cu-time">工单</view>
			<view class="cu-item " v-for="(item,index) in audits" :key="index">
				<view class="bg-cyan content"  v-if="item.eventType == '1000'">
					<text>{{item.createUserName}} 于</text> {{item.createTime}} 投诉
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '1001'">
					<text>{{item.createUserName}} 于</text> {{item.createTime}}处理
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '1001'">
					<text>处理意见：</text> {{item.remark}}
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '2002'">
					<text>{{item.createUserName}} 于</text> {{item.createTime}}评价
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '2002'">
					<text>评价内容：</text> {{item.remark}}
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '3003'">
					<text>{{item.createUserName}} 于</text> {{item.createTime}}回复
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '3003'">
					<text>回复内容：</text> {{item.remark}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	import config from '../../conf/config.js';
	import {getComplaints,getComplaintEvent} from '@/api/community/complaintApi.js';
	export default {
		data() {
			return {
				complaintId:'',
				communityId:'',
				complaint:{},
				audits:[],
				photoUrl: config.commonBaseUrl + '/callComponent/download/getFile/file',
			}
		},
		onLoad(options) {
			let _complaintId = options.complaintId;
			this.complaintId = _complaintId;
			this.communityId = options.communityId;
			this._loadCompaint();
			this._listWorkflowAuditInfo();
		},
		methods: {
			/**
			 * 加载我的报修
			 */
			_loadCompaint: function(_active) {
				let that = this;
				getComplaints({
					complaintId: that.complaintId,
					page: 1,
					row: 1,
					communityId: that.communityId
				}).then(_data=>{
					let _ownerComplaints = _data.data;
					that.complaint = _ownerComplaints[0];
				});
			},
			_listWorkflowAuditInfo: function(_active) {
				let _that =this;
				getComplaintEvent({
					complaintId: _that.complaintId,
					page: 1,
					row: 100,
					communityId: _that.communityId
				}).then(_data=>{
					_that.audits = _data.data;
				})
			},
			preview: function(index) {
				let urls = [];
				this.complaint.photos.forEach((item) => {
					urls.push(item.url);
				})
				uni.previewImage({
					current: index,
					urls: urls
				})
			},
		}
	}
</script>

<style>

</style>
