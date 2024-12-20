<template>
  <view>
    <view class="serve_box">
      <view class="serve_title">
        {{ $t('功能服务-GP8') }}<text class="more" @click="more()">{{ $t('查看全部-tQE') }}</text>
      </view>
      <view class="serve_list">
        <view class="serve_item" v-for="(item, index) in list" :key="index" @click="to(item)">
          <image :src="item.src" v-if="item.src" />
          <view class="text">{{ $t(item.name) }}</view>
        </view>
      </view>
    </view>

    <view class="connect-box">
      <view class="connect-left">
        <view class="title">{{ $t('联系物业-mCn') }}</view>
        <view class="hint">{{ $t('即刻搞定-Utt') }}</view>
      </view>
      <view class="connect-right" @tap="callPropertyTel">
        <image src="@/static/images/icons/call.png" />
        <text>{{ $t('一键拨打-Y1h') }}</text>
      </view>
    </view>

    <view class="cu-modal" :class="callPropertyModal == true ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">
            {{ $t('拨打电话-YnL') }}
            <text v-if="property.communityQrCode">/ {{ $t('加微信好友-sFb') }}</text>
          </view>
          <view class="action" @tap="_cancleCall()">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl">
          <view v-if="property.communityQrCode">
            <image class="call-qrcode" :src="property.communityQrCode"></image>
          </view>
          <view>{{ $t('您确认拨打-yat') }},{{ property.communityName }}{{ $t('物业客服电话-NKY') }}<br />{{ property.sCommunityTel }}</view>
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action margin-0 flex-sub solid-left" @tap="_cancleCall()">{{ $t('取消-KvD') }}</view>
          <view class="action margin-0 flex-sub text-green solid-left" @tap="_doCall()">{{ $t('拨号-1vJ') }}</view>
        </view>
      </view>
    </view>
    <auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>
  </view>
</template>

<script>
  import { hasAuthOwner } from '../../api/owner/ownerApi.js'
  import { hasLogin } from '../../lib/proprietor/page/Page.js'

  import authOwnerDialog from '@/components/owner/auth-owner-dialog.vue'

  import { getCommunityName, getCommunityTel } from '../../api/community/communityApi.js'

  export default {
    name: 'IndexMenu',
    data() {
      return {
        callPropertyModal: false,
        property: {}
      }
    },
    components: {
      authOwnerDialog
    },
    props: {
      list: {
        type: Array,
        default: () => []
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
            }
          )
        }
      },
      callPropertyTel: function() {
        //拨打电话
        const _that = this
        if (!hasLogin()) {
          this.vc.navigateTo({
            url: '../login/showlogin'
          })
          return
        }

        this.property.sCommunityTel = getCommunityTel()
        this.property.communityName = getCommunityName()
        _that.callPropertyModal = true
      },
      _doCall: function() {
        const _that = this
        uni.makePhoneCall({
          // 手机号
          phoneNumber: _that.property.sCommunityTel,
          // 成功回调
          success: res => {
            this.callPropertyModal = false
            console.log('调用成功!')
          },
          // 失败回调
          fail: res => {
            console.log('调用失败!')
          }
        })
      },
      _cancleCall: function() {
        this.callPropertyModal = false
      },
      more: function() {
        uni.navigateTo({
          url: '/pages/homemaking/homemaking'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .serve_box {
    padding: 20rpx 30rpx;
    background: #fff;
    margin-bottom: 20rpx;
    border-radius: 20rpx;
    box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.1);

    .serve_title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 30rpx;
      font-weight: 500;
      color: #333333;

      .more {
        color: #C21DA0;
        font-size: 24rpx;
        font-weight: normal;
      }
    }

    .serve_list {
      display: flex;
      flex-wrap: wrap;
    }

    .serve_item {
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

    .home_item:last-child {
      margin-right: 0;
    }
  }

  .connect-box {
    margin-top: 30rpx;
    width: 100%;
    height: 120rpx;
    border-radius: 20rpx;
    padding: 20rpx 30rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.1);

    .connect-left {
      font-family: Source Han Sans;

      .title {
        font-size: 30rpx;
        font-weight: 500;
        color: #333333;
      }

      .hint {
        margin-top: 5rpx;
        font-size: 24rpx;
        color: #999999;
      }

    }

    .connect-right {
      width: 265rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      padding: 0 10rpx;
      color: #fff;
      font-size: 24rpx;
      background: rgba(194, 29, 160, 0.5);
      border-radius: 80rpx;

      image {
        width: 80rpx;
        height: 80rpx;
      }

      text {
        margin-left: 27rpx;
      }

      &:active {
        opacity: 0.8;
      }
    }
  }


  .call-qrcode {
    width: 480rpx;
    height: 480rpx;
  }
</style>