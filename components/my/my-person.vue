<template>
  <view>
    <view class="userinfo">
      <view class="wait" v-if="login">
        <view class="cu-avatar header-img round" :style="{ backgroundImage: 'url(' + headerImg + ')' }"> </view>
        <view class="userinfo-nickname">
          <text class="username">{{ userName }}</text>
          <text class="userphone">{{ userPhone }}</text>
          <text class="userarea" @tap="_changeCommunity()">
            {{ communityName }}
            <text class="cuIcon-settings text-white margin-left-xs"></text>
          </text>
        </view>
      </view>
      <view class="wait" v-else @tap="showLongModel">
        <view class="cu-avatar header-img round" :style="{ backgroundImage: 'url(' + headerImg + ')' }"> </view>
        <view class="login-hint">{{ $t('尊敬的业主，欢迎回来！-qE8') }}</view>
        <view class="login-hint">{{ $t('请点击登录～-rzR') }}</view>
      </view>
    </view>
    <auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>
  </view>
</template>

<script>
  import context from '@/lib/proprietor/proprietorContext.js'
  // const factory = context.factory; //获取app实例
  // const constant = context.constant;
  import conf from '@/conf/config.js'
  import { queryOwnerAccount, getUserTel } from '@/api/user/userApi.js'
  import { getCouponUsers } from '../../api/fee/feeApi.js'

  import { getCommunityId, getCommunityName, getCommunityOwnerName } from '../../api/community/communityApi.js'
  import { loadLoginOwner, getMemberId, hasAuthOwner } from '../../api/owner/ownerApi.js'

  import authOwnerDialog from '@/components/owner/auth-owner-dialog.vue'
  export default {
    name: 'MyPerson',
    data() {
      return {
        userInfo: {},
        headerImg: '',
        userName: '',
        userPhone: '',
        communityName: '',
        blance: '0.00',
        inter: '0.00',
        ka: '0',
        ownerFlag: false, // 是否有业主信息 标记 如果有为 true  没有为false
        login: true
      }
    },
    created() {
      const userImg = uni.getStorageSync('userHeaderImg') || `${conf.imgUrl}/h5/images/serve/head.png`
      this.headerImg = userImg
      this.refreshPageLoginInfo()
    },
    components: {
      authOwnerDialog
    },
    methods: {
      //切换小区
      _changeCommunity: function() {
        uni.navigateTo({
          url: '/pages/my/changeOwnerCommunity'
        })
      },
      refreshPageLoginInfo: function() {
        const _that = this //查询用户信息
        if (!_that.ckeckUserInfo()) {
          _that.login = false
          return
        }
        _that.communityName = getCommunityName()
        _that.login = true
        _that.userName = getCommunityOwnerName()
        _that.userPhone = getUserTel()
        _that.loadOwenrInfo()
        _that.userInfo = context.getUserInfo()
        this.loadOwnerHeaderImg()
        this.loadOwnerAccount()
        this.loadOwnerCoupon()
      },
      ckeckUserInfo: function() {
        return context.checkLoginStatus()
      },
      loadOwenrInfo: function() {
        const _that = this
        context.getOwner(function(_ownerInfo) {
          if (_ownerInfo) {
            _that.ownerFlag = true
          } else {
            _that.ownerFlag = false
          }
        })
      },
      /**
       * 查询业主头像
       */
      loadOwnerHeaderImg: function() {
        const _that = this
        loadLoginOwner({
          memberId: getMemberId(),
          communityId: getCommunityId()
        }).then(_data => {
          if (_data.url) {
            _that.headerImg = _data.url
          } else {
            _that.headerImg = conf.imgUrl + '/h5/images/serve/head.png'
            uni.removeStorageSync("userHeaderImg")
          }
        }).catch(() => {
          _that.headerImg = conf.imgUrl + '/h5/images/serve/head.png'
          uni.removeStorageSync("userHeaderImg")
        })
      },
      // 余额
      loadOwnerAccount: function() {
        const _that = this
        context.getOwner(function(_ownerInfo) {
          if (_ownerInfo) {
            queryOwnerAccount({
              page: 1,
              row: 20,
              idCard: _ownerInfo.idCard,
              link: _ownerInfo.ownerTel,
              communityId: _ownerInfo.communityId
            }).then(data => {
              if (!data) {
                _that.accounts = []
                _that.blance = 0
                return
              }
              _that.accounts = data
              let blanceSum = 0
              let interSum = 0
              //let kaSum = 0;
              _that.accounts.forEach((v, k) => {
                // if(v.acctType == '2005'){
                // 	kaSum += parseFloat(v.amount);
                // }
                if (v.acctType == '2004') {
                  interSum += parseFloat(v.amount)
                }
                if (v.acctType == '2003') {
                  blanceSum += parseFloat(v.amount)
                }
              })
              _that.blance = blanceSum.toFixed(2)
              _that.inter = interSum.toFixed(2)
              //_that.ka = kaSum.toFixed(2);
            })
          }
        })
      },
      loadOwnerCoupon: function() {
        const _that = this
        let _count = 0
        _that.ka = 0
        context.getOwner(function(_ownerInfo) {
          if (_ownerInfo) {
            getCouponUsers({
                page: 1,
                row: 100,
                tel: _ownerInfo.ownerTel,
                communityId: _ownerInfo.communityId,
                state: '1001'
              },
              null
            ).then(_couponList => {
              _couponList.data.forEach(items => {
                if (items.isExpire == 'Y') {
                  _count += parseInt(items.stock)
                }
              })
              _that.ka = _count
            })
          }
        })
      },
      showLongModel: function() {
        this.vc.navigateTo({
            url: '/pages/login/login'
          },
          () => {
            this.refreshPageLoginInfo()
          }
        )
      },
      // 我的钱包
      myAccount: function() {
        hasAuthOwner(this).then(_owner => {
          this.vc.navigateTo({
            url: '/pages/account/myAccount'
          })
        })
      },
      //优惠券
      coupons: function(_item) {
        this.vc.navigateTo({
          url: '/pages/coupon/myCoupons'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .userinfo {
    width: 100%;
    height: 430rpx;
    padding-top: 40rpx;
  }
  
  .header-img {
    width: 140rpx;
    height: 140rpx;
    margin-bottom: 60rpx;
  }

  .wait {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .login-hint {
    font-size: 28rpx;
    line-height: 34rpx;
    color: #ffffff;
  }

  .userinfo-nickname {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .username {
      font-size: 28rpx;
      font-weight: 500;
    }
    
    text {
      font-size: 24rpx;
      font-weight: 500;
      line-height: 36rpx;
      color: #fff;
    }
  }
</style>
