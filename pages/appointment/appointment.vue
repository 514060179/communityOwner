<template>
  <view class="page-appointment">
    <vc-tabbar isBack isFixed :title="$t('场馆预约-JOw')" :background="titleBg" />
    <view class="header-bg"></view>
    <view class="content">
      <view class="tab-header" :style="{ top: statusHeight }">
        <view class="tab-item" v-for="item in tabList" :key="item.id" @tap="changeTab(item)">
          <image :src="item.selectIcon" v-if="item.id === selectTabId" />
          <image :src="item.icon" v-else />
          <text>{{ item.title }}</text>
        </view>
      </view>
      <!-- 场地预约 -->
      <view class="box" v-show="selectTabId === 1">
        <block v-for="(item, index) in SiteList" :key="index">
          <site-card :site="item" @clickCard="goToCommodity" />
        </block>
      </view>
      <!-- 场地守则 -->
      <view class="box" v-show="selectTabId === 2">
        <block v-for="(rItem, rIndex) in ruleList" :key="rIndex">
          <other-card :cardData="rItem" @openPdf="openPdf" />
        </block>
      </view>
      <!-- 价目表 -->
      <view class="box" v-show="selectTabId === 3">
        <block v-for="(pItem, pIndex) in priceList" :key="pIndex">
          <other-card :cardData="pItem" @openPdf="openPdf" />
        </block>
      </view>
    </view>
  </view>
</template>

<script>
  import { getSite, getSiteFiles } from '@/api/appointment/appointmentApi.js'
  import SiteCard from '@/components/appointment/site-card.vue'
  import OtherCard from '@/components/appointment/other-card.vue'
  export default {
    components: { SiteCard, OtherCard },
    data() {
      return {
        // 选择的tabID
        selectTabId: 1,
        // 导航栏背景颜色
        titleBg: 'none',
        // 小区ID
        communityId: '',
        // 场馆列表
        SiteList: [],
        // 守则表
        ruleList: [],
        // 价目表
        priceList: [],
      }
    },
    onLoad() {
      this.vc.getCurCommunity().then((_communityInfo) => {
        this.communityId = _communityInfo.communityId
        
        Promise.all([this.querySite(), this.getSiteFiles(1), this.getSiteFiles(2)])
      })
    },
    onPageScroll(e) {
      const opacity = e.scrollTop > 50 ? 1 : e.scrollTop / 50
      this.titleBg = `rgba(194, 29, 160, ${opacity})`
    },
    onPullDownRefresh() {
      Promise.all([this.querySite(), this.getSiteFiles(1), this.getSiteFiles(2)]).then(() => {
        uni.stopPullDownRefresh()
      })
    },
    computed: {
      tabList() {
        return [{
            id: 1,
            title: this.$t('场地预约-Sqe'),
            icon: this.imgUrl + '/h5/images/venues/site.png',
            selectIcon: this.imgUrl + '/h5/images/venues/selected-site.png'
          },
          {
            id: 2,
            title: this.$t('场馆守则-rrY'),
            icon: this.imgUrl + '/h5/images/venues/rule.png',
            selectIcon: this.imgUrl + '/h5/images/venues/selected-rule.png'
          },
          {
            id: 3,
            title: this.$t('价目表-xQQ'),
            icon: this.imgUrl + '/h5/images/venues/price.png',
            selectIcon: this.imgUrl + '/h5/images/venues/selected-price.png'
          }
        ]
      },
      //状态栏高度
      statusHeight() {
        const { screenWidth, statusBarHeight } = uni.getSystemInfoSync()
        let top = 0
        //#ifdef H5
        top = screenWidth * Number.parseInt(90) / 750
        //#endif
        // #ifdef APP
        top = (screenWidth * Number.parseInt(90) / 750) + statusBarHeight
        // #endif
        return top + 'px'
      }
    },
    methods: {
      // 获取场馆列表
      async querySite() {
        try {
          const { data } = await getSite({
            page: 1,
            row: 100,
            communityId: this.communityId
          })
          this.SiteList = data || []
        } catch (e) {
          console.log(e, 'queryVenue')
        }
      },
      // 获取场馆列表
      async getSiteFiles(type) {
        try {
          // type: 1-守则 2-价目表
          const { data } = await getSiteFiles({
            page: 1,
            row: 100,
            type,
            communityId: this.communityId
          })
          if (type === 1) {
            this.ruleList = data || []
          } else {
            this.priceList = data || []
          }
        } catch (e) {
          console.log(e, 'queryVenue')
        }
      },
      // 切换tab
      changeTab(e) {
        if (this.selectTabId === e.id) return
        this.selectTabId = e.id
      },
      // 打开pdf文件
      openPdf(e) {
        uni.downloadFile({
          url: `${this.imgUrl}/hc/${e.filePath}`,
          success: function (res) {
            var filePath = res.tempFilePath;
            uni.openDocument({
              filePath: filePath,
              showMenu: true,
              success: function (res) {
                console.log('打开文档成功');
              },
              fail(e) {
                uni.showToast({
                  icon: 'error',
                  title: e.msg
                })
              }
            });
          }
        })
      },
      // 跳转商品详情
      goToCommodity(e) {
        uni.setStorageSync('appointmentSpace', e)
        this.vc.navigateTo({
          url: `/pages/appointment/appointment-commodity?communityId=${this.communityId}`
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .page-appointment {
    width: 100%;
    min-height: 100vh;
    position: relative;

    .content {
      padding: 40rpx 30rpx 30rpx;
      position: relative;
    }

    .tab-header {
      position: sticky;
      top: 0rpx;
      width: 100%;
      height: 190rpx;
      border-radius: 20rpx;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-around;
      box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.1);
      z-index: 3;

      .tab-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #2E3845;
        font-size: 24rpx;
        font-weight: 500;

        image {
          height: 80rpx;
          width: 80rpx;
          margin-bottom: 6rpx;
        }
      }

    }

    .box {
      margin-top: 20rpx;
    }
  }
</style>
