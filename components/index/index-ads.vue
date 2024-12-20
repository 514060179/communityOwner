<template>
  <view>
    <view class="home_swiper">
      <swiper class="ad-swiper" indicator-dots="true" indicator-color="rgba(228,228,228,1)" :autoplay="true" indicator-active-color="#FECA49" interval="5000" duration="1000"
        circular="true">
        <block v-for="(item, index) in ad" :key="index" @click="_advertJump(item)">
          <swiper-item class="swiper-item">
            <image style="height: 100%; width: 100%;" :src="item.url" />
          </swiper-item>
        </block>
      </swiper>
    </view>
  </view>
</template>

<script>
  import { loadAdverts } from '../../api/index/indexApi.js'
  export default {
    name: 'IndexAds',
    props: {
      isConnected: {
        type: Boolean
      }
    },
    data() {
      return {
        ad: []
      }
    },
    created() {
      this._loadAdvertPhoto()
    },
    computed: {
      banner() {
        return [{
            url: !this.isConnected ? '' : this.imgUrl + '/h5/images/banner1.png'
          }
        ]
      }
    },
    methods: {
      _loadAdvertPhoto: function() {
        const _that = this
        const _objData = {
          page: 1,
          row: 5,
          locationTypeCd: '2000',
          viewType: '8888',
          clientType: 'H5'
        }
        //查询 广告
        loadAdverts(_objData).then(function(_aPhotos) {
          _that.ad = _aPhotos
          if (!_aPhotos || _aPhotos.length < 1) {
            _that.ad = _that.banner
          }
        })
      },
      _advertJump: function(ad) {
        if (ad.advertType == 3 || !ad.pageUrl) {
          return
        }
        if (ad.advertType == 2) {
          // 站外
          const url = encodeURIComponent(ad.pageUrl)
          uni.navigateTo({
            url: '/pages/hcWebView/hcWebView?url=' + url
          })
          return
        }
        if (ad.advertType == 1) {
          // 站内
          uni.navigateTo({
            url: ad.pageUrl
          })
          return
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .home_swiper {
    width: 100%;
    height: 240rpx;
    margin-bottom: 40rpx;

    .ad-swiper {
      width: 100%;
      height: 240rpx;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 20rpx;
    }

    ::v-deep uni-swiper .uni-swiper-wrapper {
      border-radius: 20rpx;
    }

    ::v-deep uni-swiper .uni-swiper-dot {
      margin-right: 24rpx;
      background: rgba(194, 29, 160, 0.5) !important;
      
      &:last-child {
        margin-right: 0;
      }
    }

    ::v-deep uni-swiper .uni-swiper-dot-active {
      background: rgba(194, 29, 160, 1) !important;
    }

    .swiper-item {
      // border-radius: 20rpx;
    }
  }
</style>