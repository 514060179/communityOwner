<template>
  <view class="page-commodity">
    <vc-tabbar isBack isFixed :title="selectSpace.name" :background="titleBg" />
    <view class="header-bg"></view>
    <view class="commodity-content">
      <view class="date-content">
        <view class="data-title">{{ $t('预约日期-SSV') }}</view>
        <vc-calendar :actDay="actDay" @onDayClick='onDayClick' :disabledDate="disabledDate" :disabledAfter="true" />
        <!-- 选择时间 -->
        <view class="select-date">
          <view class="select-label">{{ $t('已选-nJ7') }}</view>
          <view class="select-button" @click="open">{{ $t('选择时间-nxu') }}</view>
        </view>
        <!-- <view class="select-hint">⚠️注意：十二歲以下小童需要由十八歲！</view> -->
      </view>
      <!-- 预约记录 -->
      <view class="site-box">
        <view class="site-title">{{ $t('预约记录-XGq') }}</view>
        <block v-if="appointmentList.length">
          <block v-for="(item, index) in appointmentList" :key="index">
            <site-card :site="item" :isOrder="true" @clickCard="goToDetail" />
          </block>
        </block>
        <view class="empty-container" v-else>
          <vc-empty :emptyData="{ img: require('@/static/images/empty/data-empty.png'), tip: this.$t('暂无数据-bBG')}" :isFixed="false" />
        </view>
      </view>
    </view>

    <!-- 时间弹窗 -->
    <uni-popup ref="popup" type="bottom" :isMaskClick="false">
      <view class="popup-container">
        <view class="popup-title">{{ $t('选择时间-nxu') }}</view>
        <picker-view class="picker-view" v-model="timeDate" @change="bindChange">
          <picker-view-column>
            <view class="item" v-for="(item) in timeList" :key="item.timeId">{{item.timeValue}}</view>
          </picker-view-column>
        </picker-view>
        <view class="popup-button-container">
          <view class="popup-button popup-cancel" @tap="cancelTime">{{ $t('取消-KvD') }}</view>
          <view class="popup-button popup-confirm" @tap="confirmTime">{{ $t('确认-Hp3') }}</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import { getBookingList } from '@/api/appointment/appointmentApi.js'
  import { formatDate } from '@/lib/proprietor/utils/DateUtil.js'
  import SiteCard from '@/components/appointment/site-card.vue'
  // import SysParams from '../../constant/param.js'
  export default {
    components: { SiteCard },
    data() {
      return {
        title: '',
        // 商品信息信息
        appointmentList: [],
        // 选中的时间
        actDay: [],
        // 禁用时间
        disabledDate: [],
        // 标题背景颜色
        titleBg: 'none',
        // 选中时间下标
        timeDate: [0],
        // 场馆ID
        spaceId: '',
        // 选中的场馆信息
        selectSpace: {},
        // 选中的时间
        selectTimeList: [],
        // 可选时间列表
        openTimeList: [],
        loading: false,
      }
    },
    onPageScroll(e) {
      const opacity = e.scrollTop > 50 ? 1 : e.scrollTop / 50
      this.titleBg = `rgba(194, 29, 160, ${opacity})`
    },
    onLoad() {
      this.selectSpace = uni.getStorageSync('appointmentSpace') || {}
      this.actDay = [formatDate(new Date(), '-')]
      this.openTimeList = this.selectSpace.openTimes.filter(v => v.isOpen === 'Y')
      this.queryBookingList()
    },
    onShow() {
      if (this.selectSpace.spaceId) this.queryBookingList()
    },
    computed: {
      // 时间列表
      timeList() {
        const nowDate = formatDate(new Date(), '-')
        let filterList = this.openTimeList
        if (nowDate === this.actDay[0]) {
          filterList = filterList.filter(v => v.hours > new Date().getHours())
        }
        
        const list = filterList.map(v => {
          let startTime = Number(v.hours)
          let endTime = Number(v.hours) + 1
          if (startTime < 10) startTime = `0${startTime}`
          if (endTime < 10) endTime = `0${endTime}`
          
          return {
            ...v,
            timeValue: `${startTime}:00 - ${endTime}:00`
          }
        })
        return list
      }
    },
    methods: {
      // 获取预约列表
      async queryBookingList() {
        try {
          if (this.loading) return
          this.loading = true
          const { data } = await getBookingList({
            page: 1,
            row: 100,
            spaceId: this.selectSpace.spaceId,
            communityId: this.selectSpace.communityId
          })
          if (data.length) {
            let list = []
            for(let key in data) {
              if (data[key].times.length) {
                list.push({ ...data[key], hours: data[key].times[0].hours, timeId: data[key].times[0].timeId, state: data[key].times[0].state })
              }
            }
            this.appointmentList = list
            
          }
        } catch (e) {
          console.log(e, 'queryVenue')
        } finally {
          this.loading = false
        }
      },
      // 选择日期
      onDayClick(data) {
        if (this.actDay[0] === data.date) return
        this.timeDate = [0]
        this.actDay = [data.date]
      },
      // 改变时间
      bindChange(e) {
        // let [startIndex, endIndex] = e.detail.value
        this.timeDate = e.detail.value
        this.selectTimeList = [this.timeList[e.detail.value[0]]]
      },
      // 取消选择时间
      cancelTime() {
        this.$refs.popup.close()
      },
      // 确认选择时间
      confirmTime() {
        this.$refs.popup.close()
        
        const bookList = this.selectTimeList.length ? this.selectTimeList : [this.timeList[0]]
        
        const params = Object.assign({}, this.selectSpace, {
          bookDate: this.actDay[0], // 订场日期
          bookList: JSON.stringify(bookList)// 订场列表
        })
        uni.setStorageSync('appointmentSpace', params)
        this.vc.navigateTo({
          url: '/pages/appointment/appointmentPay'
        })
      },
      // 打开弹窗
      open() {
        this.$refs.popup.open()
      },
      // 跳转预约详情
      goToDetail(e) {
        this.vc.navigateTo({
          url: '/pages/appointment/myBooksRenovationDetail?books=' + JSON.stringify(e)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .page-commodity {
    min-height: 100vh;
  }

  .commodity-content {
    padding: 30rpx;
    position: relative;

  }

  .date-content {
    border-radius: 20rpx;
    background-color: #fff;
    padding: 16rpx 30rpx;

    .data-title {
      font-size: 30rpx;
      font-weight: 500;
      font-size: #333333;
    }

    .select-date {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30rpx;
    }

    .select-label {
      display: flex;
      align-items: center;
      font-size: 30rpx;
      color: #C21DA0;
      font-size: 500;

      &:before {
        content: '';
        display: inline-block;
        width: 30rpx;
        height: 30rpx;
        border-radius: 50%;
        background-color: #C21DA0;
        margin-right: 20rpx;
      }
    }

    .select-button {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #fff;
      padding: 7rpx 24rpx;
      background-color: #C21DA0;
      border-radius: 60rpx;

      &:active {
        opacity: 0.8;
      }
    }

    .select-hint {
      font-size: 22rpx;
      color: #C21DA0;
      font-weight: normal;
    }
  }

  .site-box {
    margin-top: 60rpx;

    .site-title {
      font-size: 30rpx;
      font-weight: 500;
      font-size: #333333;
      margin-bottom: 34rpx;
    }

    .empty-container {
      padding: 20rpx;
      border-radius: 20rpx;
      background-color: #fff;
    }
  }

  .popup-container {
    width: 100%;
    height: 580rpx;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    padding: 56rpx 100rpx;

    .popup-title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 60rpx;
      font-size: 24rpx;
      font-weight: 500;
    }

    .picker-view {
      width: 100%;
      height: 250rpx;
    }

    .item {
      font-size: 28rpx;
      color: #2E3845;
      font-weight: bold;
      text-align: center;
    }

    .popup-button-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 60rpx;
    }

    .popup-button {
      width: 240rpx;
      height: 60rpx;
      border-radius: 60rpx;
      color: #fff;
      font-size: 24rpx;
      font-weight: normal;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .popup-cancel {
      background-color: #606EF0;
    }

    .popup-confirm {
      background-color: #C21DA0;
    }
  }

  .uni-picker-view-indicator {

    &::after,
    &:before {
      content: none
    }
  }
</style>
