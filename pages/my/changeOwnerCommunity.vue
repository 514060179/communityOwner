<template>
  <view>
    <view>
      <view class="padding">{{ $t('小区信息-kxU') }}</view>
      <view class="cu-list menu" v-if="communitys.length > 0">
        <view class="cu-item" v-for="(item, sub) in communitys" :key="sub" @tap="doChangeCommunity(item)">
          <view class="content padding-tb-sm">
            <view> <text class="lg cuIcon-homefill text-blue margin-right-xs"></text> {{ item.communityName }} </view>
            <view class="text-gray text-sm"> <text class="lg text-gray cuIcon-location margin-right-xs"></text> {{ item.name }} </view>
          </view>
        </view>
      </view>
      <block v-else>
        <view class="cu-list menu">
          <view class="cu-item">
            <view class="content">
              <text class="cuIcon-notification text-grey"></text>
              <text class="text-grey">{{ $t('暂无小区信息-75l') }}</text>
            </view>
            <view class="action"> </view>
          </view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import { getOwnerCommunitys } from '../../api/community/communityApi.js'
import { getOpenQr } from '@/api/user/userApi.js'
import { hasAuthOwner, getCurOwner } from '../../api/owner/ownerApi.js'
import mapping from '../../constant/MappingConstant.js'
import { getUserTel } from '@/api/user/userApi.js'

export default {
  data() {
    return {
      communityName: '',
      communitys: []
    }
  },
  onLoad() {
    const _that = this
    hasAuthOwner().then(_owner => {
      _that._loadCommunitys()
    })
  },
  methods: {
    _loadCommunitys: function () {
      const _that = this
      getOwnerCommunitys({
        link: getUserTel()
      }).then(_communitys => {
        _that.communitys = _communitys
      })
    },
    // 切换小区
    async doChangeCommunity (_community) {
      try {
        
        const { communityId } = await getCurOwner()
        
        if (communityId === _community.communityId) {
          uni.navigateBack({
            delta: 1
          })
          return
        }
        
        uni.showLoading({
          title: this.$t('正在切换小区...')
        })
        uni.setStorageSync(mapping.CURRENT_COMMUNITY_INFO, _community)
        uni.setStorageSync('ownerInfo', {
          memberId: _community.memberId,
          ownerName: _community.name,
          ownerId: _community.ownerId,
          ownerTel: _community.link,
          communityId: _community.communityId,
          link: _community.link,
          ownerTypeCd: _community.ownerTypeCd
        })
        
        const data = await getOpenQr({
          iotApiCode: 'getOwnerAccessControlQRCodeInfoBmoImpl',
          communityId: _community.communityId,
          personId: _community.memberId
        })
        
        // 保存二维码相关数据
        uni.setStorageSync('qrData', { ...data, link: _community.link })
        
        uni.showToast({
          title: this.$t('切换成功')
        })
        
        setTimeout(() => {
          uni.navigateBack({
            delta: 1
          })
        }, 1000)
        
      } catch (e) {
        uni.removeStorageSync('qrData')
        uni.navigateBack({
          delta: 1
        })
        console.log(e,' doChangeCommunity')
      } finally {
        uni.hideLoading()
      }
    }
  }
}
</script>

<style></style>
