<template>
  <view>
    <view class="padding-xl margin-top">
      <canvas style="width: 520upx; height: 520upx; margin: 0 auto" canvas-id="openDoorQrcode"></canvas>
    </view>

    <view class="padding flex flex-direction margin-top">
      <button class="cu-btn bg-green margin-tb-sm lg" @tap="_closeModal()">{{ $t('关闭-KJs') }}</button>
    </view>
  </view>
</template>

<script>
import { listOwnerMachines, getQrCode } from '../../api/applicationKey/applicationKeyApi.js'
import { getCurOwner } from '../../api/owner/ownerApi.js'
const qrCode = require('@/lib/weapp-qrcode.js')

export default {
  data() {
    return {
      communityName: '',
      communityId: '',
      memberId: '',
      qrCode: ''
    }
  },
  onLoad(options) {
    this.vc.onLoad(options)
    this.loadOwnerMachines()
  },
  methods: {
    loadOwnerMachines: function () {
      const _that = this
      getCurOwner().then(_owner => {
        const _data = {
          memberId: _owner.memberId,
          communityId: _owner.communityId,
          page: 1,
          row: 300
        }
        console.log('90909090')
        _that.communityName = _owner.communityName
        _that.communityId = _owner.communityId
        _that.memberId = _owner.memberId
        listOwnerMachines(_data).then(_machines => {
          _that._generatorQrCode(_machines)
        })
      })
    },
    _generatorQrCode: function (_machines) {
      const _that = this
      if (_machines == null || _machines.length < 1) {
        wx.showToast({
          title: this.$t('当前没有权限开门-4Ho'),
          icon: 'none',
          duration: 2000
        })
        return
      }
      //生成二维码
      getQrCode({
        communityId: this.communityId,
        userRole: 'owner',
        machineCode: _machines[0].machineCode,
        userId: this.memberId
      }).then(
        res => {
          const data = res.data
          if (data.code != 0) {
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 2000
            })
            return
          }
          _that.qrCode = data.data
          new qrCode('openDoorQrcode', {
            text: _that.qrCode ? _that.qrCode : this.$t('当前没有绑定门禁设备，暂时无法使用-sQ8'),
            width: 250,
            height: 250,
            colorDark: '#333333',
            colorLight: '#FFFFFF',
            correctLevel: qrCode.CorrectLevel.L
          })
        },
        err => {
          wx.hideLoading()
          wx.showToast({
            title: err,
            icon: 'none',
            duration: 2000
          })
        }
      )
    },
    _closeModal: function () {
      uni.navigateBack({
        delta: 1
      })
    }
  }
}
</script>

<style></style>
