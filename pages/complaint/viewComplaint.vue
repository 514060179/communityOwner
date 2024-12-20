<template>
	<view>
		<view class="bg-white">
			<view class="cu-steps">
				<view class="cu-item" :class="index>active?'':'text-green'" v-for="(item,index) in steps" :key="index">
					<text :class="'cuIcon-' + item.cuIcon"></text> {{ item.name }}
				</view>
			</view>
		</view>
		<view class="block__title">{{ $t('房屋信息-lT7') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('市-f8V') }}/{{ $t('区-GEp') }}</view>
			{{ areaName }}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('小区编码-zk2') }}</view>
			{{ communityId }}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('小区名称-Z2i') }}</view>
			{{ communityName }}
		</view>
		<view class="block__title">{{ $t('投诉信息-lwE') }}</view>

		<view class="cu-form-group">
			<view class="title">{{ $t('业主编码-Njh') }}</view>
			{{ appUserId }}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('姓名-rTx') }}</view>
			{{ appUserName }}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('身份证-4Dk') }}</view>
			{{ idCard }}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('手机号-9dl') }}</view>
			{{ link }}
		</view>
		<view class="button_up_blank"></view>

		<!-- <block wx:if="{{active == 1}}">
    <van-button type="danger"  size="large" catchtap="unbindOwner">解绑业主</van-button>
  </block> -->
	</view>
</template>

<script>
	// pages/viewBindOwner/viewBindOwner.js
	import context from '../../lib/proprietor/proprietorContext.js';
	const constant = context.constant;

	export default {
		data() {
			return {
				active: 0,
				areaName: '',
				communityId: '',
				communityName: '',
				appUserName: '',
				appUserId: '',
				idCard: '',
				link: ''
			};
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			context.onLoad(options);
			this.loadOwnerInfo();
		},
		computed: {
			steps() {
				return [{
					cuIcon: 'usefullfill',
					name: this.$t('申请-sdI'),
					desc: ''
				}, {
					cuIcon: 'radioboxfill',
					name: this.$t('审核中-6wR'),
					desc: ''
				}, {
					cuIcon: 'roundcheckfill',
					name: this.$t('完成-64y'),
					desc: ''
				}]
			}
		},
		methods: {
			/**
			 * 加载业主信息
			 */
			loadOwnerInfo: function() {
				const _that = this;

				context.getOwner(function(_ownerInfo) {
					if (_ownerInfo) {
						const _active = _ownerInfo.state == '10000' ? 1 : 2;

						_that.areaName = '西宁市城东区';
						_that.communityId = _ownerInfo.communityId;
						_that.communityName = _ownerInfo.communityName;
						_that.appUserName = _ownerInfo.appUserName;
						_that.appUserId = _ownerInfo.appUserId;
						_that.idCard = _ownerInfo.idCard;
						_that.link = _ownerInfo.link;
						_that.active = _active;
					}
				});
			},
			unbindOwner: function() {
				//调用解绑业主，并且删除本地缓存
				const obj = {
					'appUserId': this.appUserId,
					'communityId': this.communityId
				};
				let msg = '';

				if (obj.appUserId == '' || obj.communityId == '') {
					msg = '数据异常';
					wx.showToast({
						title: msg,
						icon: 'none',
						duration: 2000
					});
					return;
				}

				wx.request({
					url: constant.url.appUserUnBindingOwner,
					header: context.getHeaders(),
					method: 'POST',
					data: obj,
					//动态数据
					success: function(res) {
						console.log(res);

						if (res.statusCode != 200) {
							wx.showToast({
								title: '解绑失败',
								icon: 'none',
								duration: 2000
							});
							return;
						} //成功情况下跳转


						wx.redirectTo({
							url: '/pages/bindOwner/bindOwner'
						});
					},
					fail: function(e) {
						wx.showToast({
							title: '服务器异常了',
							icon: 'none',
							duration: 2000
						});
					}
				});
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
	  padding: 60rpx 30rpx 20rpx;
	}
	
	
	.button_up_blank{
	  height: 40rpx;
	}
</style>
