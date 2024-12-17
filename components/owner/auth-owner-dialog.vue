<template>
	<view>
		<view class="cu-modal" :class="showAuthOwner==true?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">认证房屋</view>
					<view class="action" @tap="_cancleAuth()">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<view v-if="code == -101">认证审核中</view>
					<view v-else>您还没有认证房屋，请先认证房屋</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action margin-0 flex-sub  solid-left" @tap="_cancleAuth()">关闭</view>
					<view class="action margin-0 flex-sub text-green solid-left" v-if="code != -101" @tap="_toAuth()">去认证</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { navigateTo } from '../../core/vcRoute';
	export default {
		name:"authOwnerDialog",
		data() {
			return {
				showAuthOwner:false,
				code:-1
			};
		},
		methods:{
			openDialog:function(_code,_msg){
				this.code = _code;
				this.showAuthOwner = true;
			},
			_cancleAuth:function(){
				this.showAuthOwner = false;
			},
			_toAuth:function(){
				this.showAuthOwner = false;
				uni.navigateTo({
					url:'/pages/index/authOwner'
				})
			}
		}
	}
</script>

<style>

</style>