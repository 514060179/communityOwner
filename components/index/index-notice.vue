<template>
  <view class="notice-container">
    <scroll-view class="scroll-box" scroll-x>
      <view class="tab-header-card" v-for="(item) in tabList" :key="item.typeCd" @tap="changeTab(item)">
        <view class="tab-header-item" :class="{ 'tab-header-item_active': item.typeCd === activeTabId }">
          <view class="tab-header-item_title">{{ item.typeName }}</view>
          <view class="tab-header-item_sub_title">{{ item.typeDesc }}</view>
        </view>
      </view>
    </scroll-view>
    <view class="content">
      <view class="notice-box" v-if="notices.length">
        <block v-for="(item, index) in notices" :key="index">
          <notice-card :noticeData="item" @emitClick="_toDetail(item)" />
        </block>
        <view class="more-text">{{ moreType === 'nomore' ? $t('没有更多了-Ffe') : $t('正在加载...-N7S') }}</view>
      </view>
      <!-- 暂无数据 -->
      <view class="empty-container" v-else>
        <vc-empty :emptyData="{ img: require('@/static/images/empty/data-empty.png'), tip: this.$t('暂无数据-bBG')}" :isFixed="false" />
      </view>
    </view>
  </view>
</template>

<script>
  import { VcEmpty } from '../vc-empty/vc-empty.vue'
  import { getActivitiTitle, loadActivites } from '../../api/index/indexApi.js'
  export default {
    name: 'IndexNotice',
    components: { VcEmpty },
    props: {
      isConnected: {
        type: Boolean
      }
    },
    data() {
      return {
        // tab列表
        tabList: [],
        // 公告列表
        notices: [],
        // 页码
        page: 1,
        // 小区ID
        communityId: '',
        // 选中tab
        activeTabId: '',
        // 加载中/加载更多
        moreType: "loading",
        // 列表loading
        activeLoading: false
      }
    },
    created() {
      this._loadData()
    },
    methods: {
      // 切换tab
      changeTab(tabItem) {
        this.activeTabId = tabItem.typeCd
        this.page = 1
        this.moreType = 'loading'
        this._loadActivites(true)
      },
      async _loadData() {
        try {
          const _communityInfo = await this.vc.getCurCommunity()
          this.communityId = _communityInfo.communityId
          this._loadActivitiesType()
        } catch (e) {
          console.log(e, '_loadData')
        }
      },
      //查询 活动标题
      async _loadActivitiesType() {
        try {
          const list = await getActivitiTitle({
            page: 1,
            row: 10,
            communityId: this.communityId,
            defaultShow: 'Y'
          })
          this.tabList = list

          if (list && list.length > 0) this.activeTabId = list[0].typeCd
          
          this.page = 1
          this.moreType = 'loading'
          this._loadActivites(true)
        } catch (e) {
          console.log(e, '_loadActivitiesType')
        }
      },
      async _loadActivites(isRefresh = false) {
        try {
          if (this.activeLoading || this.activeTabId == '' || (this.moreType === 'nomore' && !isRefresh)) return
          
          this.activeLoading = true
          
          const _acts = await loadActivites({
            page: this.page,
            row: 5,
            communityId: this.communityId,
            typeCd: this.activeTabId,
            defaultShow: 'Y',
            clientType: 'H5'
          })
          
          this.notices = isRefresh ? _acts : this.notices.concat(_acts)

          if (_acts && _acts.length !== 5 ) this.moreType = 'nomore'
          
          this.page += 1
        } catch (e) {
          console.log(e, '_loadActivites')
        } finally {
          this.activeLoading = false
        }
      },
      _toDetail: function(_item) {
        this.vc.navigateTo({
          url: '/pages/activites/activitesDetail?activitiesId=' + _item.activitiesId + '&title=' + _item.title + '&communityId=' + _item.communityId
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .notice-container {

    .content {
      padding: 40rpx 30rpx;
    }

    .notice-box {
      display: flex;
      flex-direction: column;
    }

    .empty-container {
      width: 100%;
      height: 500rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 20rpx;
      background-color: #fff;
      box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.1);
    }
  }

  .scroll-box {
    width: 100%;
    padding: 0 30rpx;
    white-space: nowrap;
  }

  .tab-header-card {
    min-width: 25%;
    padding: 0 10rpx;
    display: inline-block;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 2rpx;
      height: 36rpx;
      background: #ECECEC;
      margin-left: 10rpx;
    }

    &:last-child::after {
      content: none;
    }

    .tab-header-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;

      .tab-header-item_title {
        font-size: 30rpx;
        color: #333333;
        font-weight: 500;
      }

      .tab-header-item_sub_title {
        font-size: 22rpx;
        color: #999999;
        font-weight: 350;
        padding: 4rpx 10rpx;
        border-radius: 50rpx;
      }
    }

    .tab-header-item_active {
      .tab-header-item_title {
        color: #C21DA0;
      }

      .tab-header-item_sub_title {
        color: #fff;
        background: #606EF0;
      }
    }
  }

  .more-text {
    margin: 20rpx auto 0;
    color: rgba(0, 0, 0, 0.5);
  }
</style>
