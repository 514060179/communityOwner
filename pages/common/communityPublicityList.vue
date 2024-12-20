<template>
  <view class="user-container">
    <block v-if="publicitys.length > 0">
      <view class="cu-list menu" v-for="(publicity, idx) in publicitys" :key="idx" :data-item="publicity" @click="gotoDetail(publicity)">
        <view class="cu-item arrow">
          <view class="content padding-tb-sm">
            <view>
              <text class="cuIcon-notification text-cut text-green margin-right-xs"></text>
              <view class="text-cut" style="width: 220px">{{ publicity.title }}</view>
            </view>
            <view class="text-gray text-sm">
              <text class="margin-right-xs">{{ $t('发布人-MaU') }}：</text> {{ publicity.createUserName }}</view
            >
          </view>
        </view>
      </view>
      <uni-load-more
        :status="loadingStatus"
        :content-text="{
          contentdown: $t('上拉加载更多-sqA'),
          contentrefresh: $t('加载中-BUD'),
          contentnomore: $t('没有更多-iHG')
        }"
      />
    </block>
    <block v-else>
      <view class="cu-list menu">
        <view class="cu-item">
          <view class="content">
            <text class="cuIcon-notification text-grey"></text>
            <text class="text-grey">{{ $t('暂无公告信息-pCx') }}</text>
          </view>
          <view class="action"> </view>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
import { getCommunityPublicity, getCommunityId } from '@/api/community/communityApi.js'

export default {
  data() {
    return {
      publicitys: [],
      pubType: '',
      loadingStatus: ''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _that = this
    this.pubType = options.pubType
    this._loadPublicitys()
  },

  methods: {
    /**
     * 加载活动
     * 第一次加载是可能没有小区 则直接下载固定小区
     *
     */
    _loadPublicitys: function () {
      const _that = this
      getCommunityPublicity({
        communityId: getCommunityId(),
        pubType: this.pubType,
        page: 1,
        row: 50
      }).then(_data => {
        _that.publicitys = _data
      })
    },
    gotoDetail: function (_item) {
      uni.navigateTo({
        url: '/pages/common/communityPublicityDetail?pubId=' + _item.pubId + '&communityId=' + _item.communityId
      })
    }
  }
}
</script>
<style lang="scss">
.user-container {
  padding: 25rpx 10rpx;
  background-color: #f0f0f0;
  /*border: 1px solid black;*/
}

.notice {
  margin: 10rpx 7rpx;
  padding: 25rpx;
  background-color: #ffffff;
  border-radius: 7rpx;
}
.title {
  border-bottom: 1rpx solid #dedede;
  font-weight: 700;
  font-size: 34rpx;
  color: #c21da0;
}
.content {
  padding: 15rpx 0;
  font-size: 25rpx;
  color: #7b7b7b;
  /* overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; 
    -webkit-box-orient: vertical; */
}
.txt {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.footer {
  padding: 15rpx 0;
  font-size: 22rpx;
  color: #adadad;
}
.cu-list + .cu-list {
  margin-top: 10px;
}
</style>
