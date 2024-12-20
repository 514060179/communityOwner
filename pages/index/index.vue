<template>
  <view class="page-index pages-tabbar">
    <view class="header-bg"></view>
    <view class="home_wrap">
      <vc-tabbar :title="$t('index.index')">
        <!-- <template slot="tabbar-right" v-if="isLogin">
          <view class="tabbar-right" @tap="goToMessage">
            <image src="@/static/images/icons/message-icon.png" />
          </view>
        </template> -->
      </vc-tabbar>
      <!--首页广告-->
      <index-ads ref="adsRef" :isConnected="isConnected"></index-ads>
      <index-menu :list="serveList"></index-menu>
    </view>

    <index-notice ref="indexNoticeRef" :isConnected="isConnected"></index-notice>
    <!-- app升级弹窗 -->
    <app-update-popup v-if="isShowPage"></app-update-popup>
  </view>
</template>

<script>
  import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
  import indexAds from '@/components/index/index-ads.vue'
  import indexMenu from '@/components/index/index-menu.vue'
  import indexNotice from '@/components/index/index-notice.vue'
  import appUpdatePopup from '@/components/app-update-popup/app-update-popup.vue'
  // import { getMallCommunityName } from '../../api/community/communityApi.js'
  import { getCurOwner, hasOwner } from '../../api/owner/ownerApi.js'
  import { getOpenQr } from '@/api/user/userApi.js'
  import { hasLogin } from '../../lib/proprietor/page/Page.js'

  // import conf from '@/conf/config.js'
  import { autoLogin } from '../../api/user/sessionApi.js'
  export default {
    data() {
      return {
        // 网络是否开启
        isConnected: false,
        // 页面显示
        isShowPage: false,
        // 功能服务列表
        serveList: [],
        // 是否登录
        isLogin: false,
        // 用户手机
        link: '',
        // 小区ID
        communityId: '',
        // 重新请求二维码数据时间  5分钟
        qrTime: new Date().getTime()
      }
    },
    components: {
      uniNoticeBar,
      indexAds,
      indexMenu,
      indexNotice,
      appUpdatePopup
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
      await this.$onLaunched
      uni.showTabBar()
      this.isShowPage = true
      this.vc.onLoad(options)
      autoLogin(options)
    },
    onShareAppMessage: function() {
      return {
        title: '首页',
        path: '/pages/index/index?wAppId=' + this.vc.getWAppId(),
        success: function(res) {
          // 转发成功
        },
        fail: function(res) {
          // 转发失败
        }
      }
    },
    onPullDownRefresh() {
      this.$refs.adsRef._loadAdvertPhoto()
      this.$refs.indexNoticeRef._loadData()
      uni.stopPullDownRefresh()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
      this.isLogin = hasLogin()
      // 获取金刚区列表
      const serveList = uni.getStorageSync('serveList')
      if (serveList) {
        this.serveList = serveList
      } else {
        // 默认列表
        const list = [
          {
            name: '家庭成员-gHw',
            src: require('@/static/images/serve/2.png'),
            href: '/pages/family/familyList',
            ownerAuth: true
          },
          {
            name: '社区公告-BtM',
            src: require('@/static/images/serve/7.png'),
            href: '/pages/notice/index',
            ownerAuth: false
          },
          {
            name: '报事维修-p9f',
            src: require('@/static/images/serve/6.png'),
            href: '/pages/repair/repair',
            ownerAuth: true
          },
          {
            name: '投诉咨询-EKp',
            src: require('@/static/images/serve/4.png'),
            href: '/pages/complaint/complaint',
            ownerAuth: true
          },
        ]
        this.serveList = list
        uni.setStorageSync('serveList', list)
      }
      // #ifdef APP
      this.appNetWorkInit()
      // #endif
      
      // #ifdef H5
      this.isConnected = true
      // #endif
      
      this.$refs?.indexNoticeRef?._loadData()

      if (hasLogin() && new Date().getTime() > this.qrTime) this.getQrData()
      
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
      this.$refs.indexNoticeRef._loadActivites()
    },
    computed: {
      //状态栏高度
      statusHeight() {
        let height = 0
        // #ifdef APP
        height = uni.getSystemInfoSync().statusBarHeight || 10
        // #endif
        return height; // 如果没有获取到高度，那么指定10px；
      }
    },
    methods: {
      // 获取二维码信息
      async getQrData() {
        try {
          const { communityId, memberId, link } = await getCurOwner()
          
          const data = await getOpenQr({
            iotApiCode: 'getOwnerAccessControlQRCodeInfoBmoImpl',
            communityId: communityId,
            personId: memberId
          })
          // 设置下次请求时间
          this.qrTime = new Date().getTime() + (5 * 60 * 1000)
          // 保存二维码相关数据
          uni.setStorageSync('qrData', { ...data, link })
        } catch (e) {
          console.log(e, 'getQrData')
        }
      },
      appNetWorkInit() {
        // TODO: 为了解决首次进去没网络授权 图标不出来问题
        const isConnected = uni.getStorageSync("isConnected")
        if (!isConnected || isConnected == 'none') {
          uni.getNetworkType({
            success: (res) => {
              if (res.networkType !== 'none') { 
                this.initNetWork(res.networkType)
              }
            },
            fail: (err) => {
              console.log(err, '')
            }
          });
        } else {
          this.isConnected = true
        }
      },
      // 网络授权完成
      initNetWork(type) {
        this.isConnected = true
        if (this.$refs.adsRef) this.$refs.adsRef._loadAdvertPhoto()
        uni.setStorageSync("isConnected", type)
      },
      /**
       * 加载活动
       * 第一次加载是可能没有小区 则直接下载固定小区
       *
       */
      showModal: function(e) {
        this.vc.navigateTo({
          url: '../bindOwner/bindOwner'
        })
      },
      toPage: function(pageUrl) {
        hasOwner()
        this.vc.navigateTo({
          url: pageUrl
        })
      },
      goToMessage: function() {
        uni.navigateTo({
          url: '/pages/messageList/messageList'
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import './index.css';

  .page-index {
    min-height: 100vh;
    height: 100%;
    background: #f8f9fa;
  }

  .home_wrap {
    position: relative;
    padding: 0 30rpx 40rpx;
  }
  
  .tabbar-right {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    
    image {
      width: 48rpx;
      height: 48rpx;
    }
  }
</style>