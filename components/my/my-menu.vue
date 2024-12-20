<template>
  <view>
    <view class="card">
      <view class="title">{{ $t('基础服务-7sT') }}</view>
      <view class="list">
        <view class="item" v-for="(item, index) in serve_list" :key="index" @tap="to_serve(item)">
          <image :src="item.src"></image>
          <view class="text">{{ item.name }}</view>
        </view>
      </view>
    </view>
    <view class="card" v-if="false">
      <view class="title">{{ $t('我的订单-Ubi') }}</view>
      <view class="list">
        <view class="item" v-for="(item, index) in order_list" :key="index" @tap="toMallOrders()">
          <image :src="item.src"></image>
          <view class="text">{{ item.name }}</view>
        </view>
      </view>
    </view>
    <auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>
  </view>
</template>

<script>
  import context from '@/lib/proprietor/proprietorContext.js'
  import { hasAuthOwner } from '@/api/owner/ownerApi.js'
  import authOwnerDialog from '@/components/owner/auth-owner-dialog.vue'
  // const factory = context.factory //获取app实例
  // const constant = context.constant
  export default {
    name: 'MyMenu',
    data() {
      return {}
    },
    created() {},
    components: {
      authOwnerDialog
    },
    computed: {
      order_list() {
        return [{
            name: this.$t('待付款-7uB'),
            src: this.imgUrl + '/h5/images/serve/order1.png',
            href: ''
          },
          {
            name: this.$t('待发货-4ln'),
            src: this.imgUrl + '/h5/images/serve/order2.png',
            href: ''
          },
          {
            name: this.$t('待收货-5yJ'),
            src: this.imgUrl + '/h5/images/serve/order3.png',
            href: ''
          },
          {
            name: this.$t('已完成-YqK'),
            src: this.imgUrl + '/h5/images/serve/order4.png',
            href: ''
          }
        ]
      },
      serve_list() {
        return [{
            name: this.$t('业主信息-PQ8'),
            src: require('@/static/images/serve/my1.png'),
            href: '/pages/viewBindOwner/viewBindOwner',
            ownerAuth: true
          },
          {
            name: this.$t('我的物业-sLp'),
            src: require('@/static/images/serve/my2.png'),
            href: '/pages/my/myProperty',
            ownerAuth: true
          },
          {
            name: this.$t('我的房屋-hAO'),
            src: require('@/static/images/serve/5.png'),
            href: '/pages/my/myHouse',
            ownerAuth: true
          },
          {
            name: this.$t('我的报修-yfR'),
            src: require('@/static/images/serve/6.png'),
            href: '/pages/repair/myRepair',
            ownerAuth: true
          },
          {
            name: this.$t('缴费记录-8IN'),
            src: require('@/static/images/serve/my5.png'),
            href: '/pages/fee/payFeeDetail',
            ownerAuth: true
          },
          {
            name: this.$t('我的车位-R2Z'),
            src: require('@/static/images/serve/my6.png'),
            href: '/pages/applyparking/parkingInfo',
            ownerAuth: true
          },
          {
            name: this.$t('我的投诉-Ca9'),
            src: require('@/static/images/serve/4.png'),
            href: '/pages/complaint/complaintList',
            ownerAuth: true
          },
          {
          	name: this.$t('门禁日志-Ys9'),
          	src: require('@/static/images/serve/my9.png'),
          	href: '/pages/machine/machineTranslateLog',
          	ownerAuth: true
          },
          // {
          // 	name: this.$t('空置房记录'),
          // 	src: this.imgUrl + '/h5/images/serve/my8.png',
          // 	href: '/pages/applyRoom/myRoomList',
          // 	ownerAuth: true
          // },
          {
          	name: this.$t('renovation.myRoomRenovationList'),
          	src: require('@/static/images/serve/my10.png'),
          	href: '/pages/renovation/myRoomList',
          	ownerAuth: true
          },
          {
            name: this.$t('订场记录-Flq'),
            src: require('@/static/images/serve/my8.png'),
            href: '/pages/appointment/myBoomList',
            ownerAuth: false
          },
          {
            name: this.$t('服务预约-I2z'),
            src: require('@/static/images/serve/2.png'),
            href: '/pages/reserve/reserveMyOrder',
            ownerAuth: false
          }
          // {
          // 	name: this.$t('放行记录'),
          // 	src: this.imgUrl + '/h5/images/serve/my8.png',
          // 	href: '/pages/itemRelease/myItemReleaseList',
          // 	ownerAuth: true
          // },
          // {
          // 	name: this.$t('充电订单'),
          // 	src: this.imgUrl + '/h5/images/serve/11.png',
          // 	href: '/pages/machine/chargeMachineOrders',
          // 	ownerAuth: false
          // },
          // {
          // 	name: this.$t('发票'),
          // 	src: this.imgUrl + '/h5/images/serve/my5.png',
          // 	href: '/pages/invoice/invoice',
          // 	ownerAuth: true
          // },
        ]
      }
    },
    methods: {
      // 我的服务跳转
      to_serve(v) {
        if (!v.ownerAuth) {
          this.vc.navigateTo({
            url: v.href
          })
          return
        }
        hasAuthOwner(this).then(_owner => {
          this.vc.navigateTo({
            url: v.href
          })
        })
      },
      ckeckUserInfo: function() {
        return context.checkLoginStatus()
      },
      toMallOrders() {
        if (!this.ckeckUserInfo()) {
          this.vc.navigateTo({
              url: '../login/showlogin'
            },
            () => {
              this.refreshPageLoginInfo()
            }
          )
          return
        }
        this.vc.navigateToMall({
          url: '/pages/myOrder/myOrderAll'
        })
      }
    }
  }
</script>

<style lang="less">
  .card {
    padding: 20rpx 30rpx;
    background: #fff;
    margin-bottom: 20rpx;
    border-radius: 20rpx;
    box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.1);

    .title {
      font-size: 30rpx;
      font-weight: 500;
      color: #333333;
    }

    .list {
      display: flex;
      flex-wrap: wrap;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 24rpx 0;
        width: 25%;
        text-align: center;
        font-size: 28rpx;

        image {
          height: 80rpx;
          width: 80rpx;
        }

        .text {
          margin-top: 8rpx;
          white-space: nowrap;
          font-size: 24rpx;
          color: #2E3845;
          font-weight: 500;
        }
      }
    }
  }
</style>
