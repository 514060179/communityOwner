<template>
  <view class="page-message" :style="{ paddingTop: pagePaadingHeight }">
    <!-- 头部 -->
    <view class="header-content">
      <!-- 导航栏 -->
      <vc-tabbar title="消息中心" isBack />
      <!-- tab栏 -->
      <view class="tabs-box">
        <view class="tab-box_left">
          <view class="tab" :class="{ 'active-tab': activeTab === tab.type }" v-for="tab in tabs" :key="tab.type" @tap="changeTab(tab)">
            {{ tab.name }}
          </view>
        </view>
        <view class="tab-box_right" @tap="setReadNotification()">{{ $t('清除未读') }}</view>
      </view>
    </view>
    <!-- 内容 -->
    <view class="content">
      <view class="item" v-for="item in messageList" :key="item.id">
        <view class="item-date">{{  item.sentTime | formatMessageDate }}</view>
        <view class="item-cell" @tap="goToDetail(item)">
          <view class="item-cell_title">
            <view class="item-cell_tag" v-if="item.isRead === 0">NEW</view>
            <view class="item-cell_tag is-read" v-else>
              <image src="@/static/images/icons/file.png" />
            </view>
            <view class="item-cell_title-label">{{ item.title }}</view>
          </view>
          <rich-text class="item-cell-body" :nodes="item.content"></rich-text>
          <view class="item-cell_detail">查看详情 &gt;</view>
        </view>
      </view>
      <!-- 空页面 -->
      <view class="empty-container" v-if="!messageList.length && !loading">
        <vc-empty :emptyData="{ img: require('@/static/images/empty/data-empty.png'), tip: this.$t('暂无数据-bBG')}" :isFixed="false" />
      </view>
      <view class="more-text" v-if="messageList.length">{{ moreType === 'nomore' ? $t('没有更多了-Ffe') : $t('正在加载...-N7S') }}</view>
    </view>
  </view>
</template>

<script>
  import { getMessageTypeList, getNotificationList, readNotification } from "@/api/message/messageApi.js"
  import { getCommunityId } from '@/api/community/communityApi.js'
  import { getUserId } from '../../api/user/userApi.js'
  import { VcEmpty } from '@/components/vc-empty/vc-empty.vue'
  import { formatMessageDate } from "@/common/filters/index.js"
  
  export default {
    name: "MessageList",
    components: { VcEmpty },
    filters: { formatMessageDate },
    data() {
      return {
        loading: true,
        // 选中的tabID
        activeTab: -1,
        // tab列表
        tabs: [],
        // 页码
        page: 1,
        // 小区ID
        communityId: '',
        // 用户ID
        userId: '',
        // 消息列表
        messageList: [],
        // 加载中
        moreType: 'nomore'
      }
    },
    //上拉加载更多
    onReachBottom() {
      if (this.loading || this.moreType === 'nomore') return
      this.getNotificationList()
    },
    //下拉刷新
    onPullDownRefresh() {
      this.getNotificationList(true)
    },
    onShow() {
      const messageItem = uni.getStorageSync('notification')
      if (messageItem) {
        const index = this.messageList.findIndex(item => item.id === messageItem.id)
        // 替换已读消息(节省刷新列表请求)
        this.messageList.splice(index, 1, messageItem)
        uni.removeStorageSync('notification')
      }
    },
    onLoad() {
      this.communityId = getCommunityId()
      this.userId = getUserId()
      this.getTypeList()
    },
    computed: {
      pagePaadingHeight() {
        const { statusBarHeight } = uni.getSystemInfoSync()
        return statusBarHeight + 'px'
      }
    },
    methods: {
      // 切换tab
      changeTab(e) {
        if (e.type === this.activeTab) return
        this.activeTab = e.type
        this.getNotificationList(true)
      },
      // 获取消息类型列表
      async getTypeList() {
        try {
          const { data } = await getMessageTypeList({ communityId : this.communityId })
          this.tabs = data
          this.activeTab = data[0].type
          this.getNotificationList()
        } catch (e) {
          console.log(e)
        }
      },
      // 获取消息列表
      async getNotificationList(isRefresh = false) {
        try {
          this.loading = true
          this.moreType = 'loading'
          if (isRefresh) {
            this.page = 1
            uni.showLoading()
          }
          
          const { data } = await getNotificationList({
            communityId : this.communityId,
            userId: this.userId,
            type: this.activeTab,
            page: this.page,
            row: 10
          })
          this.messageList = isRefresh ? data : this.messageList.concat(data || [])
          if (data?.length !== 10) {
            this.moreType = 'nomore'
          }
          this.page += 1
        } catch (e) {
          // 刷新列表报错则置为空列表
          if (isRefresh) this.messageList = []
          uni.showToast({
            title: e,
            icon: 'none'
          })
        } finally {
          uni.stopPullDownRefresh();
          this.loading = false
          uni.hideLoading()
        }
      },
      // 设置已读
      async setReadNotification(id = '') {
        try {
          let params = {
            communityId: this.communityId,
            userId: this.userId,
            type: this.activeTab
          }
          // 判断有id 就传
          if (id) {
            params = Object.assign({}, params, { id })
          } else {
            uni.showLoading()
          }
          
          await readNotification(params)
          
          // 假如没有传id 证明是全部设为已读，则刷新列表
          if (!id) this.getNotificationList(true)
        } catch (e) {
          console.log(e)
        } finally {
          uni.hideLoading()
        }
      },
      // 跳转至详情
      goToDetail(item) {
        uni.setStorageSync('notification', item)
        uni.navigateTo({
          url: '/pages/messageDetail/messageDetail'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-message {
    font-family: Source Han Sans;
    padding-top: 20rpx;

    .header-content {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(180deg, #C21DA0 0%, #5E66AE 99%);
      z-index: 9;

      .tabs-box {
        height: 110rpx;
        padding: 40rpx 30rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
      }

      .tab-box_left {
        flex: 1;
        display: flex;
        align-items: center;

        .tab {
          font-size: 30rpx;
          font-weight: 400;
          margin-right: 60rpx;
          position: relative;

          &:last-child {
            margin-right: 10rpx;
          }

          &:after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 6rpx;
            border-radius: 6rpx;
            background-color: #fff;
            transition: all 0.2s ease-out;
          }

          &:active {
            opacity: 0.8;
          }
        }

        .active-tab {
          font-weight: 500;

          &:after {
            width: 60rpx;
          }
        }
      }

      .tab-box_right {
        font-size: 24rpx;
        font-weight: normal;
        display: flex;
        align-items: center;

        &:before {
          content: '';
          display: inline-block;
          background-image: url("/static/images/icons/clear-icon.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          width: 40rpx;
          height: 40rpx;
          margin-right: 8rpx;
        }
      }
    }

    .content {
      padding: 200rpx 30rpx 30rpx;

      .item {
        margin-bottom: 30rpx;

        .item-date {
          padding: 20rpx;
          text-align: center;
          font-size: 22rpx;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.5);
        }

        .item-cell {
          padding: 34rpx 28rpx 16rpx;
          background-color: #fff;
          border-radius: 20rpx;
          box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);

          &:active {
            opacity: 0.8;
          }
        }

        .item-cell_title {
          display: flex;
          align-items: center;
          font-size: 26rpx;
          font-weight: normal;
          color: #333;

        }

        .item-cell_tag {
          width: 100rpx;
          height: 40rpx;
          padding: 0 20rpx;
          margin-right: 24rpx;
          font-size: 22rpx;
          font-weight: bold;
          color: #fff;
          line-height: 40rpx;
          border-radius: 40rpx;
          background: #606EF0;
          text-align: center;
          
          image {
            width: 36rpx;
            height: 36rpx;
          }
        }
        
        .is-read {
          background: #979797;
        }

        .item-cell_title-label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-cell-body {
          font-family: Source Han Sans;
          margin: 20rpx 0;
          font-size: 20rpx;
          font-weight: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          
        }

        .item-cell_detail {
          padding-top: 18rpx;
          display: flex;
          justify-content: flex-end;
          font-size: 22rpx;
          color: rgba(0, 0, 0, 0.5);
          border-top: 2rpx solid #ECECEC;
        }
      }
    }
    
    .empty-container {
      width: 100%;
      height: 500rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .more-text {
      margin: 20rpx auto 0;
      text-align: center;
      color: rgba(0, 0, 0, 0.5);
    }
  }
</style>