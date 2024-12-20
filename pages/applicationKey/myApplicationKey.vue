<template>
  <view>
    <view class="my_ak">
      <view class="my_ak_text_01">
        <text>{{ $t('每月1日自动更新-xPm') }}</text>
      </view>
      <view class="my_ak_text_02">
        <text>{{ pwd || $t('请先申请钥匙-uQu') }}</text>
      </view>
      <view class="my_ak_text_03">
        <text>{{ $t('有效期至-5vL') }}{{ endTime }}</text>
      </view>
      <view class="cu-bar bg-white">
        <view class="action">
          <text class="text-xl text-bold">{{ $t('说明-xo8') }}</text>
        </view>
      </view>
      <view class="my_ak_text_explain">
        <text>1.{{ $t('在门禁机上点击“密码开门”，再输入密码直接开门-hM8') }}</text>
      </view>
      <view class="my_ak_text_explain">
        <text>2.{{ $t('该密码能开启的门禁机有-aah') }}：{{ loactions || $t('没有门禁-NDS') }}</text>
      </view>
      <view class="my_ak_text_explain">
        <text>3.{{ $t('如果有新门禁添加时，则重新申请钥匙才能开新的门禁-VFF') }}</text>
      </view>
      <view class="my_ak_text_explain">
        <text>4.{{ $t('如果分享密码给来访者，建议分享访客密码-TOE') }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
const constant = context.constant

export default {
  data() {
    return {
      applicationKeys: [],
      pwd: '',
      loactions: '',
      endTime: '0000-00-00 00:00:00',
      idCard: '',
      communityId: ''
    }
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    context.onLoad(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const _that = this

    context.getOwner(function (_owner) {
      const _idCard = _owner.idCard
      const _communityId = _owner.communityId

      _that.idCard = _idCard
      _that.communityId = _communityId

      _that.loadApplicationKey()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    loadApplicationKey: function () {
      const _that = this

      const _objData = {
        page: 1,
        row: 10,
        idCard: this.idCard,
        communityId: this.communityId,
        typeFlag: '1100102'
      }
      context.request({
        url: constant.url.listApplicationKeys,
        header: context.getHeaders(),
        method: 'GET',
        data: _objData,
        //动态数据
        success: function (res) {
          console.log(res)

          if (res.statusCode == 200) {
            //成功情况下跳转
            const _applicationKeys = res.data.applicationKeys

            if (_applicationKeys.length == 0) {
              wx.showToast({
                title: this.$t('未查询到钥匙-uLP'),
                icon: 'none',
                duration: 2000
              })
              return
            }

            _that.applicationKeys = _applicationKeys

            _that.showPwd()
          }
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
    showPwd: function () {
      const _applicationKeys = this.applicationKeys
      let _pwd = ''
      let _loactions = ''
      let _endTime = ''

      for (let _akIndex = 0; _akIndex < _applicationKeys.length; _akIndex++) {
        if (_applicationKeys[_akIndex].state != '10001') {
          continue
        }

        _pwd = _applicationKeys[_akIndex].pwd
        _loactions += _applicationKeys[_akIndex].locationObjName + ','
        _endTime = _applicationKeys[_akIndex].endTime
      }

      if (_pwd == '') {
        return
      }

      this.pwd = _pwd
      this.loactions = _loactions
      this.endTime = _endTime
    }
  }
}
</script>
<style>
.my_ak {
  margin-top: 20rpx;
  background-color: #fff;
  padding: 40rpx 40rpx 40rpx 40rpx;
}

.my_ak .my_ak_text_01 {
  text-align: center;
}

.my_ak .my_ak_text_02 {
  text-align: center;
  color: #c21da0;
  font-size: 56rpx;
  margin: 40rpx 0 40rpx 0;
  letter-spacing: 40rpx;
}

.my_ak .my_ak_text_03 {
  text-align: center;
  color: #8a8a8a;
  font-size: 24rpx;
}

.my_ak .my_ak_text_01 text {
  font-size: 24rpx;
  color: #8a8a8a;
}

.my_ak .my_ak_text_explain {
  color: #8a8a8a;
  font-size: 24rpx;
  margin-bottom: 20rpx;
}
</style>
