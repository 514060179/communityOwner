<template>
	<view>
		<view class="block__title">房屋信息</view>
		<view class="cu-form-group">
			<view class="title">房屋信息</view>
			<picker  :value="index" :range="roomCloums" @change="_changeRoom">
				<view class="picker">
					{{roomName}}
				</view>
			</picker>
		</view>
		<view class="block__title">投诉信息</view>
		<view class="cu-form-group">
			<view class="title">投诉类型</view>
			<picker :value="complaintIndex" :range="typeCds" :range-key="'typeName'" @change="_changeComplaint">
				<view class="picker">
					{{typeName}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">投诉人</view>
			<input id="complaintName" v-model="complaintName"  placeholder="请输入投诉人"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">手机号</view>
			<input id="tel" v-model="tel"  placeholder="请输入手机号"></input>
		</view>
		<view class="cu-form-group margin-top">
			<textarea id="context" v-model="context" placeholder="请输入投诉内容"></textarea>
		</view>

		<view class="block__title">照片信息</view>
		<uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum" :canEdit="uploadImage.canEdit" :title="uploadImage.imgTitle" @sendImagesData="sendImagesData"></uploadImageAsync>
		
		<view class="button_up_blank"></view>
		<view class="flex flex-direction">
			<button class="cu-btn bg-green margin-tb-sm lg" @click="_submitComplaint()">提交</button>
		</view>
	</view>
</template>

<script>
	// pages/enterCommunity/enterCommunity.js
	import * as TanslateImage from '../../lib/java110/utils/translate-image.js';
	
	import {checkPhoneNumber} from '../../lib/java110/utils/StringUtil.js';
	import context from '../../lib/java110/Java110Context.js';
	import uploadImageAsync from "../../components/vc-upload-async/vc-upload-async.vue";
	import {complaint,getComplaintType} from '@/api/community/complaintApi.js';
	import {getCommunityId} from '@/api/community/communityApi.js'
	const constant = context.constant;
	const factory = context.factory;

	export default {
		data() {
			return {
				imgList: [],
				imageIndex: 0,
				index: null,
				complaintIndex: 0,
				roomCloums: [],
				roomIdArr: [],
				roomName: "请选择",
				roomId: '',
				roomShow: false,
				typeCds: [],
				typeName: '请选择',
				typeCd: '',
				typeShow: false,
				photoList: [],
				tel: '',
				context: '',
				complaintName: '',
				userId: '',
				storeId: '',
				photos: [],
				communityId: "",
				uploadImage: {
					maxPhotoNum: 4,
					imgTitle: '图片上传',
					canEdit: true
				}
			};
		},
		components: {
			uploadImageAsync
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let that = this;
			context.onLoad(options);
			context.getRooms().then(res => {
				let arr = res.data.rooms;
				let roomCloums = [];
				let roomIdArr = [];
				arr.map(item => {
					roomCloums.push(item.floorNum + "-" + item.unitNum + "-" + item.roomNum);
					roomIdArr.push(item.roomId);
				});
				that.roomCloums = roomCloums;
				that.roomIdArr = roomIdArr;
				that.userId = res.data.owner.appUserId;
				that.communityId = res.data.owner.communityId;
				that.complaintName = res.data.owner.appUserName;
				that.tel = res.data.owner.link;
			});
			this._loadComplaintType();
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			sendImagesData: function(e){
				this.photos = [];
				if(e.length > 0){
					e.forEach((img) => {
						this.photos.push(img.fileId);
					})
				}
			},
			_changeComplaint:function(e){
				this.typeName = this.typeCds[e.detail.value].typeName;
				this.typeCd = this.typeCds[e.detail.value].typeCd;
			},
			_changeRoom: function(e) {
				this.roomName = this.roomCloums[e.detail.value];
				this.roomId = this.roomIdArr[e.detail.value];
			},
			_submitComplaint: function(e) {
				complaint({
					"typeCd": this.typeCd,
					"complaintName": this.complaintName,
					"tel": this.tel,
					"roomId": this.roomId,
					"photos": this.photos,
					"context": this.context,
					"userId": this.userId,
					"communityId": this.communityId
				}).then(_data =>{
					uni.navigateTo({
						url:"/pages/successPage/successPage?msg=提交成功&objType=4004"
					})
				},err=>{
					uni.showToast({
						icon:'none',
						title:err
					})
				});
			},
			_loadComplaintType:function(){
				let _that = this;
				getComplaintType({
					page:1,
					row:100,
					communityId:getCommunityId()
				}).then(_data=>{
					_that.typeCds = _data.data;
				})
			}
		}
	};
</script>
<style>
	
	
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
	
	.uploader-container{
	  margin: 0 10px;
	}
	
	.aku_photo_view{
	  background-color: #FFF;
	  padding: 40rpx 0 40rpx 40rpx;
	}
	
	.aku_photo_view text{
	  font-size: 30rpx;
	  color: #8a8a8a
	}
</style>
