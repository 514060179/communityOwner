<template>
  <view>
    <view class="real_list">
      <view class="title">{{ $t('物业服务-N2o') }}</view>
      <view class="list">
        <view class="item" v-for="(item, index) in realList" :key="index" @tap="to(item)">
          <image :src="item.src"></image>
          <view class="text">{{ item.name }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { hasAuthOwner } from '@/api/owner/ownerApi.js'

  export default {
    name: 'ServiceProperty',
    data() {
      return {}
    },
    computed: {
      realList() {
        return [{
            name: this.$t('生活缴费-lv4'),
            src: this.imgUrl + '/h5/images/serve/1.png',
            href: '/pages/fee/oweFee',
            ownerAuth: true
          },
          {
            name: this.$t('房屋费-WFo'),
            src: this.imgUrl + '/h5/images/serve/5.png',
            href: '/pages/fee/roomFeeListNew',
            ownerAuth: true
          },
          {
            name: this.$t('停车费-RR3'),
            src: this.imgUrl + '/h5/images/serve/9.png',
            href: '/pages/fee/payParkingFeeList',
            ownerAuth: true
          },
          // {
          //   name: this.$t('合同费'),
          //   src: this.imgUrl + '/h5/images/serve/12.png',
          //   href: '/pages/fee/contractFeeList',
          //   ownerAuth: true
          // },
          // {
          //   name: this.$t('水电充值'),
          //   src: this.imgUrl + '/h5/images/serve/5.png',
          //   href: '/pages/meter/meter',
          //   ownerAuth: true
          // },
          {
            name: this.$t('家庭成员-gHw'),
            src: this.imgUrl + '/h5/images/serve/2.png',
            href: '/pages/family/familyList',
            ownerAuth: true
          },
          {
            name: this.$t('访客通行-sdW'),
            src: this.imgUrl + '/h5/images/serve/3.png',
            href: '/pages/visit/visitList',
            ownerAuth: true
          },
          {
            name: this.$t('投诉咨询-EKp'),
            src: this.imgUrl + '/h5/images/serve/4.png',
            href: '/pages/complaint/complaint',
            ownerAuth: true
          },
          {
            name: this.$t('报事维修-p9f'),
            src: this.imgUrl + '/h5/images/serve/6.png',
            href: '/pages/repair/repair',
            ownerAuth: true
          },
          {
            name: this.$t('社区公告-BtM'),
            src: this.imgUrl + '/h5/images/serve/7.png',
            href: '/pages/notice/index',
            ownerAuth: false
          },
          {
            name: this.$t('一键开门-bES'),
            src: this.imgUrl + '/h5/images/serve/8.png',
            href: '/pages/openDoor/userQrCode',
            type: 'tab',
            ownerAuth: true
          },
          {
            name: this.$t('装修报备-Sho'),
            src: this.imgUrl + '/h5/images/serve/10.png',
            href: '/pages/renovation/roomRenovation',
            ownerAuth: true
          },
          {
            name: this.$t('业主信息-PQ8'),
            src: this.imgUrl + '/h5/images/serve/my1.png',
            href: '/pages/viewBindOwner/viewBindOwner',
            ownerAuth: true
          },
          {
            name: this.$t('车位申请-swz'),
            src: this.imgUrl + '/h5/images/serve/my6.png',
            href: '/pages/applyparking/applyparking',
            ownerAuth: true
          },
          {
            name: this.$t('投票问卷-U4H'),
            src: this.imgUrl + '/h5/images/serve/my2.png',
            href: '/pages/questionAnswer/questionAnswer',
            ownerAuth: true
          },
          // {
          // 	name: this.$t('空置房申请'),
          // 	src: this.imgUrl + '/h5/images/serve/my9.png',
          // 	href: '/pages/applyRoom/applyRoom',
          // 	ownerAuth:true
          // },
          {
            name: this.$t('场地预约-Sqe'),
            src: this.imgUrl + '/h5/images/serve/order4.png',
            href: '/pages/appointment/appointment',
            ownerAuth: false
          },
          // {
          // 	name: this.$t('就餐'),
          // 	src: this.imgUrl + '/h5/images/serve/order4.png',
          // 	href: '/pages/reserve/reserveDining',
          // 	ownerAuth:false
          // },
          {
            name: this.$t('服务预约-wPN'),
            src: this.imgUrl + '/h5/images/serve/order15.png',
            href: '/pages/reserve/reserveService',
            ownerAuth: false
          },
          // {
          // 	name: this.$t('物品放行'),
          // 	src: this.imgUrl + '/h5/images/serve/order4.png',
          // 	href: '/pages/itemRelease/itemRelease',
          // 	ownerAuth:true
          // },
          // {
          // 	name: this.$t('智能充电'),
          // 	src: this.imgUrl + '/h5/images/serve/my3.png',
          // 	href: '/pages/machine/chargeMachines',
          // 	ownerAuth:false
          // },
          // {
          // 	name: this.$t('物业打分'),
          // 	src: this.imgUrl + '/h5/images/serve/my9.png',
          // 	href: '/pages/complaint/examineStaff',
          // 	ownerAuth:true
          // },
          {
            name: this.$t('小区公示-rqn'),
            src: this.imgUrl + '/h5/images/serve/my11.png',
            href: '/pages/common/communityPublicity',
            ownerAuth: false
          }
        ]
      }
    },
    methods: {
      to: function(v) {
        // 无需鉴权
        if (!v.ownerAuth) {
          if (v.tab == 'tab') {
            uni.switchTab({
              url: v.href
            })
          } else {
            this.vc.navigateTo({
              url: v.href
            })
          }
        } else {
          hasAuthOwner(this).then(
            _owner => {
              if (v.type === 'tab') {
                uni.switchTab({
                  url: v.href
                })
              } else {
                this.vc.navigateTo({
                  url: v.href
                })
              }
            })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .real_list {
    padding: 20rpx 30rpx;
    background: #fff;
    margin-bottom: 20rpx;
    border-radius: 20rpx;

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