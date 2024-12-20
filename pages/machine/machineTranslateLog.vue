<template>
  <view class="pages-machine">
    <view class="machine-container" v-if="machineTranslates.length">
      <view class="item-card" v-for="(item, index) in machineTranslates" :key="index">
        <view class="item-header">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-status">{{ item.state }}</text>
        </view>
        <view class="cell-content">
          <view class="item-cell">
            <view>{{ $t('类型-pGB') }}</view>
            <view class="cell-value">{{ getStatus(item.openTypeCd) }}</view>
          </view>
          <view class="item-cell">
            <view>{{ $t('进出时间-kmp') }}</view>
            <view class="cell-value">{{ item.createTime }}</view>
          </view>
          <view class="item-cell">
            <view>{{ $t('通行区域-rEO') }}</view>
            <view class="cell-value">{{ item.machineName }}</view>
          </view>
          <view class="item-cell">
            <view>{{ $t('备注-8l8') }}</view>
            <view class="cell-value">{{ `${$t('您在-KOg')}[${item.machineName}]上通过[${getStatus(item.openTypeCd)}]方式打开通道` }}</view>
          </view>
        </view>
      </view>
      <view class="more-text">{{ loadMoreText === 'more' ? $t('加载更多-9ox') : $t('没有更多了-Ffe') }}</view>
    </view>
    <view v-else>
      <no-data-page></no-data-page>
    </view>
  </view>
</template>

<script>
  import context from '../../lib/proprietor/proprietorContext.js'
  // import { formatDate } from '../../lib/proprietor/utils/DateUtil.js'
  // import { getCurCommunity } from '@/api/community/communityApi.js'
  import { getOpenList } from '../../api/machine/machineApi.js'
  import noDataPage from '@/components/no-data-page/no-data-page.vue'

  // const constant = context.constant

  // const util = context.util
  export default {
    data() {
      return {
        machineTranslates: [],
        ownerId: '',
        communityId: '',
        personId: '',
        page: 1,
        // noMore: 加载完成  more: '加载更多'
        loadMoreText: 'more'
      }
    },
    components: {
      noDataPage
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
      context.getOwner((res) => {
        this.communityId = res.communityId
        this.personId = res.memberId
        this.getList()
      })
    },
    onReachBottom() {
      if (this.loadMoreText === 'more') this.getList()
    },
    onPullDownRefresh() {
      this.getList(true)
    },
    methods: {
      async getList(isRefresh) {
        try {
          
          if (isRefresh) {
            this.page = 1
          }
          
          const res = await getOpenList({
            iotApiCode: 'listAccessControlInoutBmoImpl',
            page: this.page,
            row: 10,
            communityId: this.communityId,
            personId: this.personId
          })
          
          this.page += 1
          
          this.machineTranslates = isRefresh ? res : this.machineTranslates.concat(res)

          this.loadMoreText = res.length === 10 ? 'more' : 'noMore'
          
        } catch (e) {
          console.log(e, 'e')
        } finally {
          if (isRefresh) uni.stopPullDownRefresh()
        }
      },
      getStatus(openTypeCd) {
        const list = [{
            openTypeCd: '1000',
            openTypeName: this.$t('人脸开门-CBe')
          },
          {
            openTypeCd: '2000',
            openTypeName: this.$t('IC卡-urT')
          },
          {
            openTypeCd: '3000',
            // 二维码
            openTypeName: this.$t('machine.openDoorByQrCode')
          },
          {
            openTypeCd: '4000',
            openTypeName: this.$t('CPU卡-O8U')
          }
        ]
        return list.find(v => v.openTypeCd == openTypeCd)?.openTypeName || '12'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pages-machine {
    padding: 20rpx;
    color: #2E3845;
  }

  .machine-container {

    .item-card {
      background-color: #fff;
      border-radius: 20px;
      margin-bottom: 20rpx;
    }

    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 40rpx 30rpx;
      border-bottom: 4rpx solid #f8f9fa;
      font-size: 36rpx;
      font-weight: 700;

      .item-status {
        color: #c21da0;
      }
    }

    .cell-content {
      padding: 20rpx;
      font-weight: 500;

      .item-cell {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20rpx;

        &:last-child {
          margin-bottom: 0;
        }
        
        .cell-value {
          text-align: end;
          margin-left: 20rpx;
          flex: 1;
        }
      }
    }
  }
  
  .more-text {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30rpx;
    color: #ccc;
  }
</style>
