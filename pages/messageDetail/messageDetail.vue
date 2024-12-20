<template>
  <view class="page-message-detail">
    <view class="message-title">{{ notification.title }}</view>
    <rich-text class="message-content" :nodes="notification.content"></rich-text>
    <view class="message-footer">
      <view>{{ notification.senderName }}</view>
      <view>{{ notification.sentTime }}</view>
    </view>
  </view>
</template>

<script>
  import { readNotification } from "@/api/message/messageApi.js"
  import { getCommunityId } from '@/api/community/communityApi.js'
  import { getUserId } from '../../api/user/userApi.js'
  export default {
    name: 'MessageDetail',
    data() {
      return {
        notification: {}
      }
    },
    methods: {
      // 设置已读
      async setReadNotification() {
        try {
          await readNotification({
            communityId: getCommunityId(),
            userId: getUserId(),
            type: this.notification.type,
            id: this.notification.id
          })
          uni.setStorageSync('notification', { ...this.notification, isRead: 1 })
        } catch (e) {
          console.log(e)
        }
      },
    },
    onLoad() {
      this.notification = uni.getStorageSync('notification')
      
      if (this.notification.isRead === 0) this.setReadNotification()
    }
  }
</script>

<style lang="scss" scoped>
.page-message-detail {
  padding: 60rpx;
  
  .message-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #2E3845;
    text-align: center;
  }
  
  .message-content {
    padding: 40rpx 0;
    font-size: 24rpx;
    font-weight: normal;
    line-height: 26rpx;
    color: #2E3845;
    line-height: 40rpx;
  }
  
  .message-footer {
    font-size: 24rpx;
    font-weight: normal;
    color: #2E3845;
    
    view {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
