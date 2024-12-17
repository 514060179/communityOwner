<template>
	<view>
		<view class="content bg-white margin-top">
			<view class="flex solid-bottom justify-start">
				<view class="item-title padding-sm radius">综合评分</view>
				<view class="item-star padding-sm  radius">
					<sx-rate :value="4" :fontSize="fontSize" :value.sync="rateSync1" @change="appraiseScoreChange" />
				</view>
			</view>
			<view class="cu-form-group padding align-start">
				<view class="title padding-left-sm">服务评价</view>
				<textarea maxlength="200" v-model="context" placeholder="请您填写本次服务感受和评价，以便给大家提供更好的服务品质哦！"></textarea>
			</view>

			<view class="flex flex-direction margin">
				<button class="cu-btn bg-green margin-tb-sm lg" @click="submitAppraiseComplaint()">评价</button>
			</view>

		</view>
	</view>
</template>

<script>
	import SxRate from '@/components/sx-rate'

	import {
		appraiseComplaint
	} from '../../api/community/complaintApi.js'
	import {
		getCurOwner
	} from '../../api/owner/ownerApi.js';
	import {
		getUserId,
		getUserName
	} from '../../api/user/userApi.js';
	import {
		getCommunityId
	} from '@/api/community/communityApi.js'
	export default {
		data() {
			return {
				fontSize: '60upx',
				rateSync1: 2,
				animation: true,
				curAppraise: 2,
				context: '',
				complaintId: '',
				userId: '',
				userName: ''
			}
		},
		components: {
			SxRate
		},
		onLoad(options) {
			let _that = this;
			this.complaintId = options.complaintId;
			this.userId = getUserId();
			this.userName = getUserName();
		},
		methods: {
			appraiseScoreChange(e) {
				this.curAppraise = e;
			},
			submitAppraiseComplaint: function() {
				appraiseComplaint({
						"score": this.curAppraise,
						"context": this.context,
						"communityId": getCommunityId(),
						"complaintId": this.complaintId
					})
					.then((_data) => {
						wx.showToast({
							title: '成功',
							icon: 'none',
							duration: 2000
						});
						uni.navigateBack({
							delta: 1
						});
					}, (error) => {
						wx.showToast({
							title: error,
							icon: 'none',
							duration: 2000
						});
					});
			}
		}
	}
</script>

<style>
	.content {
		height: 100%;
	}

	.item-title {
		width: 200rpx;
	}

	.item-star,
	.item-title {
		vertical-align: middle;
		line-height: 100rpx;
	}
</style>