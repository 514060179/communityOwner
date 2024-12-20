<template>
	<view>
		<view class="cu-form-group">
			<view class="title">{{ $t('选择楼栋-1vE') }}</view>
			<picker :value="floorIndex" :range="floors" :range-key="'floorNum'" @change="floorChange">
				<view class="picker">
					{{ floorIndex == -1 ? $t('请选择-Ah3') :floors[floorIndex].floorNum }}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('选择单元-nOs') }}</view>
			<picker :value="unitIndex" :range="units" :range-key="'unitNum'" @change="unitChange">
				<view class="picker">
					{{ unitIndex == -1 ? $t('请选择-Ah3') :units[unitIndex].unitNum }}
				</view>
			</picker>
		</view>

		<view class="cu-list menu margin-top">
			<view class="cu-item" v-for="(room, idx) in rooms" :key="idx" >
				<view class="content padding-tb-sm" is-link @click="chooseRoom(room)">
					<view>
						<text class="cuIcon-clothesfill text-blue margin-right-xs"></text> {{ room.roomName }}
					</view>
					<view class="text-gray text-sm">
						<text class="cuIcon-infofill margin-right-xs"></text>{{ room.roomId }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		queryFloors,
		queryUnits,
		queryRoomsByApp
	} from '@/api/community/communityApi.js';
	export default {
		data() {
			return {
				communityId: '',
				floors: [],
				floorIndex: -1,
				floorId: '',
				units: [],
				unitIndex: -1,
				unitId: '',
				rooms: [],
			}
		},
		onLoad(options) {
			this.communityId = options.communityId;
			this._loadFloors();
		},
		methods: {
			_loadFloors: function() {
				const _that = this;
				queryFloors({
					page: 1,
					row: 50,
					communityId: this.communityId,
				}).then((_floors) => {
          console.log(_floors, '_floors')
					_that.floors = _floors;
				})
			},
			_loadUnits: function() {
				const _that = this;
				queryUnits({
					page: 1,
					row: 50,
					communityId: this.communityId,
					floorId: this.floorId
				}).then((_units) => {
					_that.units = _units;
				})
			},
			_loadRooms: function() {
				const _that = this;
				queryRoomsByApp({
					page: 1,
					row: 200,
					communityId: this.communityId,
					unitId: this.unitId
				}).then((_rooms) => {
					_that.rooms = _rooms;
				})
			},
			floorChange: function(e) {
				this.floorIndex = e.target.value
				this.floorId = this.floors[this.floorIndex].floorId;
				this._loadUnits();
			},
			unitChange: function(e) {
				this.unitIndex = e.target.value
				this.unitId = this.units[this.unitIndex].unitId;
				this._loadRooms();
			},
			chooseRoom:function(_room){
				// #ifdef H5
				const pages = getCurrentPages(); // 获取当前页面栈数组
				const prevPage = pages[pages.length - 2]; // 上一页面
				// 设置数据
				prevPage.roomId= _room.roomId;
				prevPage.roomName=_room.roomName;
				// #endif
        
				// #ifdef MP-WEIXIN || APP-PLUS
				uni.setStorageSync('selectRoom',_room);
				
				// #endif
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style>

</style>
