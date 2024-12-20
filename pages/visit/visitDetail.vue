<template>
  <view class="page-detail">
    <view class="block__title">
      <text>{{ $t('访客信息-MtP') }}</text>
      <button class="cu-btn bg-primary" @click="_toTempFilePath()" v-show="visitInfo.visitorCode == 'true' && takeEffect && second > 0">{{ $t('保存-7BK') }}</button>
    </view>
    <view class="header-box" v-if="second != -1">
      <text class="header-box-title">{{ $t('有效时间-GHS') }}</text>
      <text>{{ second > 0 ? effectiveTimeStr : $t('二维码已过期-SXK') }}</text>
    </view>
    <view class="u-qrcode" style="text-align: center">
      <canvas style="width: 400rpx; height: 400rpx; margin: 0 auto; background: #fff; position: fixed; left: 100%" canvas-id="myQrcode" v-show="!needLongTapSaveImg"></canvas>
      <canvas style="width: 100%; margin: 0 auto; background: #fff" :style="{ height: visitInfo.visitorCode == 'false' ? '900rpx' : '1700rpx' }" canvas-id="myBg" v-show="!needLongTapSaveImg"></canvas>
      <image :src="tempFilePath" style="width: 100%; margin: 0 auto" :style="{ height: visitInfo.visitorCode == 'false' ? '900rpx' : '1700rpx' }" v-show="needLongTapSaveImg"></image>
      <!-- 二维码失效蒙层 -->
      <view class="qr-mask" v-if="visitInfo.visitorCode == 'true' && second <= 0">
        <view class="mask-box">{{ $t('已失效-jdM') }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
import { listOwnerVisit } from '../../api/visit/visit.js'
import drawQrcode from '@/components/weapp-qrcode/weapp.qrcode.esm.js'
import { secondToDateString, secondToHoursString, secondToMinuteString } from '@/lib/proprietor/utils/DateUtil.js'
// const constant = context.constant
// const util = context.util
export default {
  data() {
    return {
      visitInfo: {},
      ownerInfo: {},
      qrcodeValue: '',
      windowWidth: 0,
      windowHeight: 0,
      tempFilePath: '',
      needLongTapSaveImg: false,
      second: -1,
      effectiveTimeStr: '',
      timer: null
    }
  },
  components: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    context.onLoad(options)
    const _that = this
    context.getOwner(function (_owner) {
      _that.ownerInfo = _owner
      _that._loadVisitInfo(options.vId)
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    clearInterval(this.timer)
    let timer = setTimeout(() => {
      clearTimeout(timer)
      uni.stopPullDownRefresh()
      uni.redirectTo({
        url: '/pages/visit/visitDetail?vId=' + this.visitInfo.vId
      })
    }, 500)
  },
  onUnload: function () {
    clearInterval(this.timer)
  },
  computed: {
    // 已生效状态
    takeEffect() {
      // 0, 2, 3 都是未生效状态
      const codeList = ['0', '2', '3']
      return !codeList.includes(this.visitInfo.state) && this.visitInfo.recordState == 0
    }
  },
  methods: {
    // 倒计时
    countdown() {
      function formatTimeStr (second) {
        if (second >= (60 * 60 * 24)) {
          return secondToDateString(second)
        } else if (second >= (60 * 60)) {
          return secondToHoursString(second)
        } else {
          return secondToMinuteString(second)
        }
      }
      this.effectiveTimeStr = formatTimeStr(this.second)
      this.timer = setInterval(() => {
        // 倒计时介绍
        if (this.second <= 0) {
          clearInterval(this.timer)
          return 
        }
        this.second -= 1
        this.effectiveTimeStr = formatTimeStr(this.second)
      }, 1000)
    },
    _toTempFilePath: function () {
      const _that = this
      if (this.tempFilePath == '') {
        uni.showToast({
          title: _that.$t('图片未生成-kd2'),
          icon: 'none'
        })
        return
      }
      //#ifndef H5
      uni.saveImageToPhotosAlbum({
        filePath: _that.tempFilePath,
        success: function () {
          uni.showToast({
            title: _that.$t('已保存至相册-Olx'),
            icon: 'none'
          })
        },
        fail: () => {
          const appAuthorizeSetting = uni.getAppAuthorizeSetting()
          if (!appAuthorizeSetting.albumAuthorized || appAuthorizeSetting.albumAuthorized == 'denied') {
            uni.showModal({
              title: _that.$t('权限未开启-BFT'),
              content: _that.$t('需要您授权图片的访问权限才能保存图片-unh'),
              confirmText: _that.$t('跳转设置-2Uq'),
              success: (s) => {
                if (s.confirm) {
                  uni.openAppAuthorizeSetting()
                }
              }
            })
          }
        }
      })
      //#endif
      //#ifdef H5
      uni.showToast({
        title: _that.$t('请长按图片-保存至相册-2S3')
      })
      //#endif
    },
    rpxToPx(rpx) {
      const screenWidth = uni.getSystemInfoSync().screenWidth
      return (screenWidth * Number.parseInt(rpx)) / 750
    },
    _loadVisitInfo: function (vId) {
      const _that = this
      const _objData = {
        page: 1,
        row: 1,
        vId: vId,
        ownerId: this.ownerInfo.ownerId,
        userId: this.ownerInfo.userId,
        communityId: this.ownerInfo.communityId
      }
      listOwnerVisit(_objData).then(_visits => {
        _that.visitInfo = _visits.visits[0]
        let nowDateTime = new Date().getTime()
        let endDateTime = new Date(_visits.visits[0].departureTime).getTime()
        if (nowDateTime > endDateTime) {
          _that.second = 0
        } else {
          _that.second = Math.floor((endDateTime - nowDateTime) / 1000)
          _that.countdown()
        }
        const qrText = _that.visitInfo.vId
        drawQrcode({
          width: _that.rpxToPx(400),
          height: _that.rpxToPx(400),
          canvasId: 'myQrcode',
          text: qrText,
          callback: () => {
            uni.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: _that.rpxToPx(800),
              height: _that.rpxToPx(800),
              destWidth: _that.rpxToPx(800),
              destHeight: _that.rpxToPx(800),
              canvasId: 'myQrcode',
              success: qrcodeTempRes => {
                // 获取到单二维码的tempFilePath
                // 将二维码的tempFilePath画到背景canvas上
                uni.getSystemInfo({
                  success: systemRes => {
                    this.windowWidth = systemRes.windowWidth
                    this.windowHeight = systemRes.windowHeight
                    const ctx = uni.createCanvasContext('myBg')
                    ctx.setFillStyle('#494949')
                    let topHeight = 0
                    // 头部信息
                    ctx.setTextAlign('center')
                    ctx.font = `bold ${Math.floor(_that.rpxToPx(32))}px 微软雅黑`
                    ctx.set
                    if (this.visitInfo.visitorCode == 'true') {
                      ctx.fillText(this.$t('访客二维码-Gha'), this.windowWidth / 2, (topHeight += _that.rpxToPx(80)))
                    } else {
                      ctx.fillText(this.$t('访客信息-MtP'), this.windowWidth / 2, (topHeight += _that.rpxToPx(80)))
                    }
                    ctx.setFillStyle('#A0A0A0')
                    ctx.font = `normal ${Math.floor(_that.rpxToPx(28))}px 微软雅黑`
                    ctx.fillText(this.$t('创建时间:-avb') + this.visitInfo.createTime, this.windowWidth / 2, (topHeight += _that.rpxToPx(40)))
                    if (this.visitInfo.visitorCode == 'true') {
                      // 二维码
                      ctx.drawImage(qrcodeTempRes.tempFilePath, this.windowWidth / 2 - (this.windowWidth - _that.rpxToPx(100)) / 2, (topHeight += _that.rpxToPx(40)), this.windowWidth - _that.rpxToPx(100), this.windowWidth - _that.rpxToPx(100))
                      // 预约状态
                      ctx.fillText(this.$t('预约状态-9Rq'), this.windowWidth / 2, (topHeight += this.windowWidth - _that.rpxToPx(100) + _that.rpxToPx(40)))
                    } else {
                      // 预约状态
                      ctx.fillText(this.$t('预约状态-9Rq'), this.windowWidth / 2, (topHeight += _that.rpxToPx(60)))
                    }
                    // 预约状态判断
                    ctx.font = `bold ${Math.floor(_that.rpxToPx(40))}px 微软雅黑`
                    if (this.visitInfo.state == 0 || this.visitInfo.state == 2 || this.visitInfo.state == 3) {
                      ctx.setFillStyle('#808080')
                      ctx.fillText(this.$t('未生效-dpb'), this.windowWidth / 2, (topHeight += _that.rpxToPx(60)))
                    } else if (this.visitInfo.recordState == 0) {
                      ctx.setFillStyle('#41A863')
                      ctx.fillText(this.$t('已生效-BRt'), this.windowWidth / 2, (topHeight += _that.rpxToPx(60)))
                    } else {
                      ctx.setFillStyle('#DD5044')
                      ctx.fillText(this.$t('已失效-jdM'), this.windowWidth / 2, (topHeight += _that.rpxToPx(60)))
                    }
                    // 线
                    ctx.setStrokeStyle('#f2f2f2')
                    ctx.moveTo(25, (topHeight += _that.rpxToPx(40)))
                    ctx.lineTo(this.windowWidth - _that.rpxToPx(50), topHeight)
                    ctx.stroke()
                    // 列表
                    let listHeight = topHeight
                    // 列表名
                    ctx.setTextAlign('left')
                    ctx.setFontSize(_that.rpxToPx(28))
                    ctx.setFillStyle('#A0A0A0')
                    ctx.fillText(this.$t('访客姓名:-nsm'), _that.rpxToPx(50), (topHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.$t('访客联系方式:-Rwi'), _that.rpxToPx(50), (topHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.$t('来访事由:-dUf'), _that.rpxToPx(50), (topHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.$t('随行人数:-hu7'), _that.rpxToPx(50), (topHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.$t('预计来访时间:-fKQ'), _that.rpxToPx(50), (topHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.$t('预计离开时间:-I7l'), _that.rpxToPx(50), (topHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.$t('车牌号:-I8e'), _that.rpxToPx(50), (topHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.$t('车辆审核状态:-Hxi'), _that.rpxToPx(50), (topHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.$t('停车场:-IXh'), _that.rpxToPx(50), (topHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.$t('停车位:-wmF'), _that.rpxToPx(50), (topHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.$t('备注:-ZBZ'), _that.rpxToPx(50), (topHeight += _that.rpxToPx(50)))
                    // 列表值
                    ctx.setTextAlign('right')
                    ctx.setFontSize(_that.rpxToPx(28))
                    ctx.setFillStyle('#494949')
                    ctx.fillText(this.visitInfo.vName, this.windowWidth - _that.rpxToPx(50), (listHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.visitInfo.phoneNumber, this.windowWidth - _that.rpxToPx(50), (listHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.visitInfo.visitCase, this.windowWidth - _that.rpxToPx(50), (listHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.visitInfo.entourage, this.windowWidth - _that.rpxToPx(50), (listHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.visitInfo.visitTime, this.windowWidth - _that.rpxToPx(50), (listHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.visitInfo.departureTime, this.windowWidth - _that.rpxToPx(50), (listHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.visitInfo.carNum ? this.visitInfo.carNum : this.$t('无-SU3'), this.windowWidth - _that.rpxToPx(50), (listHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.visitInfo.carStateName ? this.visitInfo.carStateName : this.$t('无-SU3'), this.windowWidth - _that.rpxToPx(50), (listHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.visitInfo.parkAreaNum ? this.visitInfo.parkAreaNum : this.$t('无-SU3'), this.windowWidth - _that.rpxToPx(50), (listHeight += _that.rpxToPx(50)))
                    ctx.fillText(this.visitInfo.parkingSpaceNum ? this.visitInfo.parkingSpaceNum : this.$t('无-SU3'), this.windowWidth - _that.rpxToPx(50), (listHeight += _that.rpxToPx(50)))
                    // ctx.fillText(this.visitInfo.stateRemark, this.windowWidth - 10, listHeight += _that.rpxToPx(50));
                    ctx.setTextAlign('left')
                    // this.canvasTextAutoLine(this.visitInfo.stateRemark, ctx, 50, listHeight += _that.rpxToPx(50), 20, this.windowWidth / 2);
                    if (this.visitInfo.stateRemark) {
                      this.toFormateStr(this.visitInfo.stateRemark, ctx, 65, (listHeight += _that.rpxToPx(50)), Math.floor(this.windowWidth / 1.8), 3, _that.rpxToPx(50))
                    }
                    ctx.draw(true, () => {
                      setTimeout(() => {
                        // 获取到合并后的地址
                        uni.canvasToTempFilePath({
                          canvasId: 'myBg',
                          fileType: 'jpg',
                          success: res2 => {
                            this.tempFilePath = res2.tempFilePath
                            //#ifdef H5
                            this.needLongTapSaveImg = true
                            //#endif
                          }
                        })
                      })
                    })
                  }
                })
              }
            })
          }
        })
      })
    },

    toFormateStr: function (str = '', ctx, startX, startY, draw_width, lineNum, steps) {
      var strWidth = ctx.measureText(str).width // 测量文本源尺寸信息（宽度）
      var startpoint = startY,
        keyStr = '',
        sreLN = strWidth / draw_width
      var liner = Math.ceil(sreLN) // 计算文本源一共能生成多少行
      const strlen = parseInt(str.length / sreLN) // 等比缩放测量一行文本显示多少个字符
      // 若文本不足一行，则直接绘制，反之大于传入的最多行数（lineNum）以省略号（...）代替
      if (strWidth < draw_width) {
        ctx.fillText(str, startX, startpoint)
      } else {
        for (var i = 1; i < liner + 1; i++) {
          const startPoint = strlen * (i - 1)
          if (i < lineNum || lineNum == -1) {
            keyStr = str.substr(startPoint, strlen)
            ctx.fillText(keyStr, startX, startpoint)
          } else {
            keyStr = str.substr(startPoint, strlen - 5) + '...'
            ctx.fillText(keyStr, startX, startpoint)
            break
          }
          startpoint = startpoint + steps
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-detail {
  background-color: #fff;
}
.solid-bottom::after {
  border-bottom: 2upx solid rgba(0, 0, 0, 0.1);
}

.ppf_item {
  padding: 0rpx 0rpx 0rpx 0rpx;
}

.block__title {
  display: flex;
  justify-content: space-between;
  margin: 0;
  font-weight: 400;
  font-size: 28rpx;
  color: rgba(69, 90, 100, 0.6);
  padding: 40rpx 30rpx 20rpx;
}

.button_up_blank {
  height: 40rpx;
}

.block__bottom {
  height: 180rpx;
}
.u-qrcode {
  width: 100%;
  margin: 0 auto;
  position: relative;
}
.w100 {
  width: 500rpx;
}

.qr-mask {
  position: absolute;
  width: 100%;
  height: 680rpx;
  top: 140rpx;
  left: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  
  .mask-box {
    width: 460rpx;
    height: 460rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 14rpx solid rgba(194, 29, 160, 0.6);
    border-radius: 50%;
    font-size: 100rpx;
    font-weight: 700;
    color: rgba(194, 29, 160, 0.6);
    transform: rotate(315deg);
  }
}

.header-box {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #c21da0;
  font-weight: bold;
  
  .header-box-title {
    color: rgba(0,0,0,0.9);
    margin-right: 20rpx;
    font-weight: 400;
  }
}
</style>
