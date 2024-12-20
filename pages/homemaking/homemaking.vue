<template>
  <view class="pages-tabbar">
    <view class="page-container">
      <view class="header-bg"></view>
      <view class="position-relative">
        <vc-tabbar :title="isEdit ? $t('管理应用') : $t('应用中心-cFD')" :isBack="!isEdit">
          <template slot="tabbar-left" v-if="isEdit">
            <view class="tabbar-left" @tap="cancelEdit">{{ $t('取消-KvD') }}</view>
          </template>
          <template slot="tabbar-right">
            <view class="tabbar-right" @tap="clickTabRight">{{ isEdit ? $t('保存-7BK') : $t('编辑-uTL') }}</view>
          </template>
        </vc-tabbar>
        <view class="content">
          <!-- 编辑的应用 -->
          <view class="real_list">
            <view class="title">{{ $t('首页应用-6ia') }}</view>
            <view class="list">
              <view class="item" v-for="(item, index) in selectList" :key="index">
                <view class="img-content">
                  <image v-if="isEdit" class="item-icon" src="@/static/images/icons/indeterminate.png" @tap.stop="changeApp(item, 'delete')" />
                  <image :src="item.src"></image>
                </view>
                <view class="text">{{ $t(item.name) }}</view>
              </view>
            </view>
          </view>
          <!-- 所有应用 -->
          <view class="real_list">
            <view class="title">{{ $t('物业服务-N2o') }}</view>
            <view class="list">
              <view class="item" v-for="(item, index) in realList" :key="index" @tap="to(item)">
                <view class="img-content">
                  <image v-if="isEdit && !selectHrefList.includes(item.href) " class="item-icon" src="@/static/images/icons/add.png" @tap.stop="changeApp(item, 'add')" />
                  <image :src="item.src"></image>
                </view>
                <view class="text">{{ $t(item.name) }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { hasAuthOwner } from '@/api/owner/ownerApi.js'
  export default {
    data() {
      return {
        isEdit: false,
        selectList: []
      }
    },
    onLoad(options) {
      this.vc.onLoad(options)
      this.selectList = uni.getStorageSync('serveList') || []
    },
    methods: {
      // 取消编辑
      cancelEdit() {
        // 重新赋值回显
        this.selectList = uni.getStorageSync('serveList') || []
        this.isEdit = false
      },
      // 保存 / 编辑
      clickTabRight() {
        if (!this.isEdit) {
          // 打开编辑设置
          this.isEdit = true
          return
        }
        if (this.selectList.length < 4) {
          uni.showToast({
            icon: 'none',
            title: this.$t('选中的应用不能少于4个-Z3P')
          })
          return
        }
        uni.setStorageSync('serveList', this.selectList)

        this.isEdit = false
      },
      // 新增 / 删除
      changeApp(item, type) {
        if (type === 'delete') {
          this.selectList = this.selectList.filter(v => v.href !== item.href)
        } else {
          if (this.selectList.length >= 8) {
            uni.showToast({
              icon: 'none',
              title: this.$t('最多只能显示8个-dRr')
            })
            return
          }
          this.selectList.push(item)
        }
      },
      // 跳转
      to(v) {
        // 编辑状态不做跳转
        if (this.isEdit) return
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
    },
    computed: {
      selectHrefList() {
        return this.selectList.map(v => v.href)
      },
      realList() {
        return [{
            name: '生活缴费-lv4',
            src: require('@/static/images/serve/1.png'),
            href: '/pages/fee/oweFee',
            ownerAuth: true
          },
          {
            name: '房屋费-WFo',
            src: require('@/static/images/serve/5.png'),
            href: '/pages/fee/roomFeeListNew',
            ownerAuth: true
          },
          {
            name: '停车费-RR3',
            src: require('@/static/images/serve/9.png'),
            href: '/pages/fee/payParkingFeeList',
            ownerAuth: true
          },
          // {
          //   name: '合同费',
          //   src: require('@/static/images/serve/12.png'),
          //   href: '/pages/fee/contractFeeList',
          //   ownerAuth: true
          // },
          // {
          //   name: '水电充值',
          //   src: require('@/static/images/serve/5.png'),
          //   href: '/pages/meter/meter',
          //   ownerAuth: true
          // },
          {
            name: '家庭成员-gHw',
            src: require('@/static/images/serve/2.png'),
            href: '/pages/family/familyList',
            ownerAuth: true
          },
          {
            name: '访客通行-sdW',
            src: require('@/static/images/serve/3.png'),
            href: '/pages/visit/visitList',
            ownerAuth: true
          },
          {
            name: '投诉咨询-EKp',
            src: require('@/static/images/serve/4.png'),
            href: '/pages/complaint/complaint',
            ownerAuth: true
          },
          {
            name: '报事维修-p9f',
            src: require('@/static/images/serve/6.png'),
            href: '/pages/repair/repair',
            ownerAuth: true
          },
          {
            name: '社区公告-BtM',
            src: require('@/static/images/serve/7.png'),
            href: '/pages/notice/index',
            ownerAuth: false
          },
          {
            name: '一键开门-bES',
            src: require('@/static/images/serve/8.png'),
            href: '/pages/openDoor/userQrCode',
            type: 'tab',
            ownerAuth: true
          },
          {
            name: '装修报备-Sho',
            src: this.imgUrl + '/h5/images/serve/10.png',
            href: '/pages/renovation/roomRenovation',
            ownerAuth: true
          },
          {
            name: '业主信息-PQ8',
            src: require('@/static/images/serve/my1.png'),
            href: '/pages/viewBindOwner/viewBindOwner',
            ownerAuth: true
          },
          {
            name: '车位申请-swz',
            src: require('@/static/images/serve/my6.png'),
            href: '/pages/applyparking/applyparking',
            ownerAuth: true
          },
          {
            name: '投票问卷-U4H',
            src: require('@/static/images/serve/my2.png'),
            href: '/pages/questionAnswer/questionAnswer',
            ownerAuth: true
          },
          // {
          // 	name: '空置房申请',
          // 	src: this.imgUrl + '/h5/images/serve/my9.png',
          // 	href: '/pages/applyRoom/applyRoom',
          // 	ownerAuth:true
          // },
          {
            name: '场地预约-Sqe',
            src: require('@/static/images/serve/order4.png'),
            href: '/pages/appointment/appointment',
            ownerAuth: false
          },
          // {
          // 	name: '就餐',
          // 	src: this.imgUrl + '/h5/images/serve/order4.png',
          // 	href: '/pages/reserve/reserveDining',
          // 	ownerAuth:false
          // },
          {
            name: '服务预约-wPN',
            src: require('@/static/images/serve/order15.png'),
            href: '/pages/reserve/reserveService',
            ownerAuth: false
          },
          // {
          // 	name: '物品放行',
          // 	src: this.imgUrl + '/h5/images/serve/order4.png',
          // 	href: '/pages/itemRelease/itemRelease',
          // 	ownerAuth:true
          // },
          // {
          // 	name: '智能充电',
          // 	src: this.imgUrl + '/h5/images/serve/my3.png',
          // 	href: '/pages/machine/chargeMachines',
          // 	ownerAuth:false
          // },
          // {
          // 	name: '物业打分',
          // 	src: this.imgUrl + '/h5/images/serve/my9.png',
          // 	href: '/pages/complaint/examineStaff',
          // 	ownerAuth:true
          // },
          {
            name: '小区公示-rqn',
            src: require('@/static/images/serve/my11.png'),
            href: '/pages/common/communityPublicity',
            ownerAuth: false
          }
        ]
      }
    },
  }
</script>

<style lang="scss" scoped>
  .page-container {
    min-height: 100vh;
  }

  .tabbar-left {
    color: #fff;
  }

  .tabbar-right {
    height: 50rpx;
    font-size: 26rpx;
    color: #fff;
    padding: 0 30rpx;
    border-radius: 40rpx;
    line-height: 50rpx;
    background-color: #606EF0;

    &:active {
      opacity: 0.8;
    }
  }

  .content {
    padding: 40rpx;
  }

  .real_list {
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
        animation-name: scaleAnimation; // 动画名
        animation-duration: 0.5s; // 动画时长
        animation-iteration-count: 1; // 动画次数
        transition-timing-function: ease-in-out; // 动画过渡

        .img-content {
          position: relative;

          image {
            height: 80rpx;
            width: 80rpx;
          }

          .item-icon {
            width: 32rpx;
            height: 32rpx;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 2;
            animation-name: scaleAnimation; // 动画名
            animation-duration: 0.5s; // 动画时长
            animation-iteration-count: 1; // 永久动画
            transition-timing-function: ease-out; // 动画过渡
          }
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

  @keyframes scaleAnimation {

    // 动画设置
    0% {
      transform: scale(0.8);
    }

    50% {
      transform: scale(1.15);
    }
    
    100% {
      transform: scale(1);
    }
  }
</style>