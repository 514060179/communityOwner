<template>
  <view class="page-qr">
    <view class="qr-content" :class="{'loading-mask' : loading}" v-if="isLogin">
      <canvas style="width: 420rpx; height: 420rpx; margin: 0 auto;" canvas-id="userQrcode" v-if="!isError"></canvas>
      <text class="cuIcon-icloading loading-box" v-if="loading"></text>
      <view class="hint-text">
        {{ $t('二维码有效期为-XLo') }} {{ timeStr }}
        <text class="refresh" @click="refreshQr">{{ $t('刷新-ICa') }}</text>
      </view>
    </view>
  </view>
</template>

<script>
  import { getOpenQr } from '@/api/user/userApi.js'
  import { getCurOwner } from '../../api/owner/ownerApi.js'
  import { secondToMinuteString } from '@/lib/proprietor/utils/DateUtil.js'
  import { hasLogin } from '@/lib/proprietor/page/Page.js'
  const qrCode = require('@/lib/weapp-qrcode.js')

  import { encrypt, decrypt } from '@/common/crypto/index.js'
  import { getDateYYYYMMDDHHMISS } from '@/lib/proprietor/utils/DateUtil.js'

  export default {
    data() {
      return {
        // 小区ID
        communityId: '',
        // 默认时间5分钟
        second: 0,
        // 倒计时时间戳
        timeStr: '',
        // loading
        loading: true,
        // 定时器
        timer: null,
        // 手机亮度
        brightness: 0,
        // 是否已登录
        isLogin: false,
        // 用户手机号码
        ownerTel: '',
        // 页面报错 || 未授权
        isError: false
      }
    },
    onLoad(options) {
      this.vc.onLoad(options)
    },
    onShow() {
      this.loading = true
      
      // #ifdef APP
      // 获取屏幕亮度
      uni.getScreenBrightness({
        success: (res) => {
          this.brightness = res.value
        }
      });

      // 设置屏幕亮度
      uni.setScreenBrightness({
        value: 1
      });
      // #endif

      // 未登录
      this.isLogin = hasLogin()
      if (!this.isLogin) {
        uni.showToast({
          icon: 'none',
          title: this.$t('未登录，请先登录')
        })
        return
      }
      
      this.isError = false
      
      this._generatorQrCode()
    },
    onHide: function() {
      clearInterval(this.timer)
      // #ifdef APP
      // 恢复手机之前亮度
      uni.setScreenBrightness({
        value: this.brightness
      });
      // #endif
    },
    methods: {
      refreshQr() {
        this.loading = true
        this._generatorQrCode()
      },
      // 倒计时
      countdown() {
        this.timeStr = secondToMinuteString(this.second)
        this.timer = setInterval(() => {
          // 倒计时结束
          if (this.second <= 0) {
            clearInterval(this.timer)
            this._generatorQrCode()
            return
          }
          this.second -= 1
          this.timeStr = secondToMinuteString(this.second)
        }, 1000)
      },
      // rpx 转 px
      rpxToPx(rpx) {
        const screenWidth = uni.getSystemInfoSync().screenWidth
        return (screenWidth * Number.parseInt(rpx)) / 750
      },
      // 生成二维码
      async _generatorQrCode() {
        try {
          // 判断没有门禁ID则再次请求接口
          if (!uni.getStorageSync('qrData').cardId) {
            const { communityId, memberId, link } = await getCurOwner()
            
            const data = await getOpenQr({
              iotApiCode: 'getOwnerAccessControlQRCodeInfoBmoImpl',
              communityId: communityId,
              personId: memberId
            })
            
            // 提示未授权
            if (!data.cardId) {
              uni.showToast({
                icon: 'none',
                title: this.$t('未授权，请联系物业授权')
              })
              this.isError = true
              return
            }
            
            // 保存二维码相关数据
            uni.setStorageSync('qrData', { ...data, link })
          }
          
          const { validNumber, cardId, cardNumber, prefix, secretKey, userType, version, aesKey, link } = uni.getStorageSync('qrData')
          // 四位随机数
          const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
          // 加密的数据
          const str = `${prefix}@${version}@${cardId}@${cardNumber}@${link}@${userType}@${getDateYYYYMMDDHHMISS()}@${randomNumber}`
          // 加密后的内容
          const text = await encrypt(str, decrypt(aesKey, secretKey))

          const qrTimer = setTimeout(() => {
            clearTimeout(qrTimer)
            new qrCode('userQrcode', {
              text,
              width: this.rpxToPx(420),
              height: this.rpxToPx(420),
              colorDark: '#333',
              colorLight: '#fff',
              correctLevel: qrCode.CorrectLevel.H
            })
          }, 100)
          this.second = validNumber
          clearInterval(this.timer)
          // 开启倒计时
          this.countdown()
          this.loading = false
        } catch (e) {
          this.isError = true
          uni.showToast({
            icon: 'none',
            title: e.msg || '二维码生成失败'
          })
        } finally {
          this.loading = false
        }
      },
      // _generatorQrCode: async function() {
      //   const { communityId, ownerTel, link } = await getCurCommunity()
      //   if (!communityId || (!ownerTel && !link)) {
      //     uni.showToast({
      //       icon: 'none',
      //       title: this.$t('当前没有小区信息-ruX')
      //     })
      //     return
      //   }
      //   this.$nextTick(() => {
      //     var userData = {
      //       communityId, // 小區id
      //       ownerTel: ownerTel || link, // 業主手機號
      //       timestamp: new Date().getTime(), // 當前時間戳
      //     };

      //     const signStr = `${userData.communityId}${userData.ownerTel}${userData.timestamp}NewlandProperty`

      //     const sign = md5(signStr).toString().substring(0, 16)

      //     const qrcodeContent = new Buffer(`${userData.communityId}&${userData.ownerTel}&${userData.timestamp}&${sign}`).toString('base64')
      //     new qrCode('userQrcode', {
      //       text: qrcodeContent,
      //       width: this.rpxToPx(280),
      //       height: this.rpxToPx(280),
      //       colorDark: '#fff',
      //       colorLight: 'transparent',
      //       correctLevel: qrCode.CorrectLevel.L
      //     })
      //     clearInterval(this.timer)
      //     this.second = 60 * 5
      //     // 开启倒计时
      //     this.countdown()
      //     this.loading = false
      //   })
      // },
      _closeModal: function() {
        uni.navigateBack({
          delta: 1
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .page-qr {
    height: 100vh;
    background: #fff;
    // background: linear-gradient(180deg, #C21DA0 0%, #5E66AE 99%);
    position: relative;

    .qr-content {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
    }



    .hint-text {
      margin-top: 30rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      font-size: 24rpx;
      font-weight: 500;

      .refresh {
        color: #c21da0;
        margin-left: 10rpx;

        &:active {
          opacity: 0.8;
        }
      }
    }

    .loading-mask {
      position: relative;

      &::after {
        content: '';
        display: block;
        width: 300rpx;
        height: 300rpx;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.5);
      }
    }
  }



  .loading-box {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 160rpx;
    height: 160rpx;
    top: 60rpx;
    left: 50%;
    transform: translateX(-50%) rotate(0deg);
    animation: loading 1s linear infinite;
    z-index: 2;
    font-size: 100rpx;
    color: #000;
  }

  @keyframes loading {

    0% {
      transform: translateX(-50%) rotate(0deg);
    }

    50% {
      transform: translateX(-50%) rotate(240deg);
    }

    100% {
      transform: translateX(-50%) rotate(360deg);
    }
  }
</style>