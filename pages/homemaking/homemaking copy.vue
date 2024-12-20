<template>
  <view class="pages-tabbar">
    <view class="page-container">
      <view class="header-bg"></view>
      <view class="position-relative">
        <vc-tabbar :title="$t('应用中心-cFD')" />
        <service-property></service-property>
        <service-homemaking v-if="false"></service-homemaking>
      </view>
    </view>
  </view>
</template>

<script>
// import { hasOwner } from '../../api/owner/ownerApi.js'
import serviceProperty from '@/components/service/service-property.vue'
import serviceHomemaking from '@/components/service/service-homemaking.vue'
// import param from '../../constant/param.js'
// import { getHousekeepingTypeList } from '../../api/homemaking/homemakingApi.js'
// import { sliceArray } from '../../lib/proprietor/utils/ArrayUtil.js'
// import mapping from '../../constant/MappingConstant.js'
// import { getCommunityId, getMallCommunityId, getMallCommunityName } from '../../api/community/communityApi.js'
export default {
  data() {
    return {
      // 专区目录类型
      selectCommunityName: ''
    }
  },
  components: {
    serviceProperty,
    serviceHomemaking
  },
  onLoad(options) {
    this.vc.onLoad(options)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  .page-container {
    min-height: calc(100vh - 100rpx);
    padding: 0 40rpx 40rpx;
  }
</style>
