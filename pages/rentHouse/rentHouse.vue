<template>
  <view>
    <view class="myfixed">
      <view class="cu-bar search bg-white">
        <view class="search-form round">
          <text class="cuIcon-search"></text>
          <input :adjust-position="false" v-model="communityName" type="text" :placeholder="$t('请输入小区名-Vnl')" confirm-type="search" />
        </view>
        <view class="action">
          <button @tap="searchRentRoom" class="cu-btn bg-green shadow-blur round">{{ $t('搜索-WEd') }}</button>
        </view>
      </view>
      <scroll-view scroll-x class="bg-white nav margin-top-sm">
        <view class="flex text-center">
          <view class="cu-item flex-sub" :class="{ 'text-orange cur': item.status == TabCur }" v-for="item in title" :key="item.status" @tap="tabSelect" :data-id="item.status">
            {{ item.name }}
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="cu-card article no-card">
      <view class="title-class" style="margin-top: 210upx"></view>
      <view class="cu-item shadow border-bottom padding-top-sm" v-for="(item, index) in rents" :key="index">
        <view class="content" @tap="toDetail(item.rentingId)">
          <!-- <image  src="../../static/images/rentimage.jpg" mode="aspectFill" /> -->
          <image style="height: 160upx" :src="item.src" mode="aspectFill" />
          <view class="desc">
            <view class="title-class renting-title">{{ item.rentingTitle }}</view>
            <view class="text-content">
              <div class="">
                <text class="text-xs">{{ item.builtUpArea }}{{ $t('尺-ZVV') }} </text>
                <text class="margin-left-xs text-xs">{{ item.apartmentName }}</text>
              </div>
              <view class="flex flex-wrap">
                <view class="cu-tag line-orange sm">{{ item.paymentTypeName }}</view>
              </view>

              <view class="flex justify-between margin-top-xs">
                <div>
                  <text class="lg text-gray cuIcon-location text-xs"></text>
                  <text class="text-xs">{{ item.communityName }}</text>
                </div>
                <text class="text-red">{{ item.price }} MOP/{{ $t('月-jmQ') }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
import url from '../../constant/url.js'
const constant = context.constant
const factory = context.factory

const default_img = '../../static/images/rentimage.jpg'

export default {
  data() {
    return {
      isCard: false,
      communityName: '',
      TabCur: 3344,
      scrollLeft: 0,
      page: 1,
      row: 7,
      rents: []
    }
  },
  onLoad() {
    this.loadRentHouse()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.rents.length >= this.page * this.row) {
      this.page = this.page + 1
      this.loadRentHouse()
    }

    // this.page = this.page + 1;
    // console.log(this.page)
    // console.log(this.row)
  },
  computed: {
    title() {
      return [
        {
          name: this.$t('整租-6vc'),
          status: '3344'
        },
        {
          name: this.$t('合租-pZi'),
          status: '4455'
        }
      ]
    }
  },
  methods: {
    IsCard(e) {
      this.isCard = e.detail.value
    },
    tabSelect(e) {
      this.TabCur = e.currentTarget.dataset.id
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
      this.searchRentRoom()
    },
    loadRentHouse: function () {
      const _this = this

      const _paramIn = {
        page: _this.page,
        row: _this.row,
        rentingType: _this.TabCur,
        communityName: _this.communityName,
        state: '1,2,3,4,5,7'
      }
      context.request({
        url: constant.url.queryRentingPool,
        header: context.getHeaders(),
        method: 'GET',
        data: _paramIn,
        success: function (res) {
          const data = res.data.data

          for (let i = 0; i < data.length; i++) {
            let _url = default_img
            const _item = data[i]
            if (_item.hasOwnProperty('photos') && _item.photos.length > 0) {
              //#ifndef H5
              _url = url.baseUrl + _item.photos[0]
              //#endif
              // #ifdef H5
              _url = _item.photos[0]
              //#endif
            }
            _item.src = _url
          }
          _this.rents = _this.rents.concat(data)
        },
        fail: function (e) {
          wx.showToast({
            title: this.$t('服务器异常了-eja'),
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    searchRentRoom: function () {
      this.page = 1
      this.row = 7
      this.rents = []
      this.loadRentHouse()
    },
    toDetail: function (rentingId) {
      console.log(rentingId)
      this.vc.navigateTo({
        url: '/pages/rentHouse/rentingDetail?rentingId=' + rentingId
      })
    }
  }
}
</script>

<style>
.myfixed {
  position: fixed;
  width: 100%;
  height: 180upx;
  z-index: 99;
}

.renting-title {
  font-size: 28upx;
}

.content > image .rentingImage {
  height: 200upx;
}
</style>
