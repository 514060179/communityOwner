<template>
  <view>
    <view class="bg-white">
      <view class="cu-steps">
        <view class="cu-item" :class="index > active ? '' : 'text-green'" v-for="(item, index) in steps" :key="index"> <text :class="'cuIcon-' + item.cuIcon"></text> {{ item.name }} </view>
      </view>
    </view>
    <view class="block__title">{{ $t('业主信息-PQ8') }}</view>
    <view class="cu-list menu">
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-info text-green"></text>
          <text class="text-grey">{{ $t('申请编码-f3m') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ applicationKeyId }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-order text-green"></text>
          <text class="text-grey">{{ $t('状态-NXA') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ stateName }}</text>
        </view>
      </view>

      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-profile text-green"></text>
          <text class="text-grey">{{ $t('姓名-rTx') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ name }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-wefill text-green"></text>
          <text class="text-grey">{{ $t('年龄-bp9') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ age }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-friend text-green"></text>
          <text class="text-grey">{{ $t('性别-psV') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ sex }}</text>
        </view>
      </view>
    </view>

    <view class="block__title">{{ $t('身份信息-9zz') }}</view>
    <view class="cu-list menu">
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-vipcard text-green"></text>
          <text class="text-grey">{{ $t('身份-4AM') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ typeCdName }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-card text-green"></text>
          <text class="text-grey">{{ $t('身份证-4Dk') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ idCard }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-time text-green"></text>
          <text class="text-grey">{{ $t('开始时间-Uv9') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ startTime }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-time text-green"></text>
          <text class="text-grey">{{ $t('结束时间-3Q1') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ endTime }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-phone text-green"></text>
          <text class="text-grey">{{ $t('手机号-9dl') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ tel }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// pages/viewApplicationKeyUser/viewApplicationKeyUser.js
import context from '../../lib/proprietor/proprietorContext.js'
const constant = context.constant

export default {
  data() {
    return {
      active: 0,
      applicationKeyId: '',
      name: '',
      age: 0,
      sex: '',
      typeCdName: '',
      idCard: '',
      startTime: null,
      endTime: null,
      tel: '',
      stateName: '',
      communityId: ''
    }
  },

  computed: {
    steps() {
      return [
        {
          cuIcon: 'usefullfill',
          name: this.$t('申请-sdI'),
          desc: ''
        },
        {
          cuIcon: 'radioboxfill',
          name: this.$t('审核中-6wR'),
          desc: ''
        },
        {
          cuIcon: 'roundcheckfill',
          name: this.$t('完成-64y'),
          desc: ''
        }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    context.onLoad(options)
    this.applicationKeyId = options.applicationKeyId
    this.communityId = options.communityId
    this.showApplicationKey()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
    showApplicationKey: function () {
      const _that = this

      const _objData = {
        page: 1,
        row: 1,
        applicationKeyId: this.applicationKeyId,
        communityId: this.communityId
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

            const _applicationKey = _applicationKeys[0]
            let _active = '0'
            let _sex = this.$t('女-R6K')
            let _typeCd = ''

            if (_applicationKey.state == '10001') {
              _active = '2'
            } else if (_applicationKey.state == '10003') {
              _active = '2'
            } else {
              _active = '1'
            }

            if (_applicationKey.sex == '0') {
              _sex = this.$t('男-yDM')
            }

            if (_applicationKey.typeCd == '10004') {
              _typeCd = this.$t('业主-FFN')
            } else if (_applicationKey.typeCd == '10005') {
              _typeCd = this.$t('家庭成员-gHw')
            } else {
              _typeCd = this.$t('租客-w3O')
            }

            _that.applicationKeyId = _applicationKey.applicationKeyId
            _that.name = _applicationKey.name
            _that.age = _applicationKey.age
            _that.sex = _sex
            _that.typeCdName = _typeCd
            _that.idCard = _applicationKey.idCard
            _that.startTime = _applicationKey.startTime
            _that.endTime = _applicationKey.endTime
            _that.tel = _applicationKey.tel
            _that.active = _active
            _that.stateName = _applicationKey.stateName
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
    }
  }
}
</script>
<style>
.block__title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 60rpx 30rpx 20rpx;
}

.button_up_blank {
  height: 40rpx;
}

.aku_photo_view {
  background-color: #fff;
  height: 250rpx;
  padding: 40rpx 0 40rpx 40rpx;
}

.aku_photo_view text {
  font-size: 30rpx;
  color: #8a8a8a;
}

text {
  text-align: center;
}
</style>
