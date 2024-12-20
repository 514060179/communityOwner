<template>
  <view>
    <view class="block__title">{{ $t('返省人员信息上报-wXZ') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('姓名-rTx') }}</view>
      <input :value="name" @input="bindInput" data-name="name" required :label="$t('姓名-rTx')" clearable :placeholder="$t('请输入名称-PaE')" name="name" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('身份证-4Dk') }}</view>
      <input :value="idCard" @input="bindInput" data-name="idCard" required :label="$t('身份证-4Dk')" clearable :placeholder="$t('请输入身份证-bqg')" name="idCard" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('手机号-9dl') }}</view>
      <view>
        <input :value="tel" @input="bindInput" data-name="tel" required :label="$t('手机号-9dl')" clearable :placeholder="$t('请输入手机号-Cdr')" name="tel" />
      </view>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('来源地-INq') }}</view>
      <picker @change="bindSourceChange" :value="indexSource" :range="arraySourceType" range-key="name">
        <view>{{ arraySourceType[indexSource].name }}</view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('城市名称-5Th') }}</view>
      <input :value="sourceCityName" @input="bindInput" data-name="sourceCityName" required :label="$t('城市名称-5Th')" clearable :placeholder="$t('请输入城市名称-VU4')" name="sourceCityName" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('返回日期-C6U') }}</view>
      <picker mode="date" :value="bindDate" start="2020-00-01" end="2030-09-01" @change="dateChange">
        <view class="picker">
          {{ bindDate }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('返回时间-Q9e') }}</view>
      <picker mode="time" :value="bindTime" start="00:00" end="23:59" @change="timeChange">
        <view class="picker">
          {{ bindTime }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('备注-8l8') }}</view>
      <textarea v-model="remark" :placeholder="$t('请输入备注-ePK')"></textarea>
    </view>
    <view class="button_up_blank">
      <button class="cu-btn bg-green lg margin-top" @tap="reportBack">{{ $t('上报数据-TRA') }}</button>
    </view>
  </view>
</template>

<script>
// pages/enterCommunity/enterCommunity.js
import { saveReportInfoBackCity } from '../../api/reportInfo/reportInfoApi.js'
// import context from '../../lib/proprietor/proprietorContext.js'
import { getCurCommunity } from '../../api/community/communityApi.js'
// const constant = context.constant

export default {
  data() {
    const currentDate = this.getDate({
      format: true
    })
    return {
      areaCode: '',
      communityName: '',
      communityId: '',
      name: '',
      idCard: '',
      tel: '',
      backTime: '',
      bindDate: currentDate,
      bindTime: '12:01',
      areaShow: false,
      indexSource: 0,
      sourceCityName: '',
      remark: '',
      source: '',
      areaName: null
    }
  },
  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _that = this
    if (!options.communityId) {
      getCurCommunity().then(_community => {
        _that.communityId = _community.communityId
      })
    } else {
      this.communityId = options.communityId
    }
    _that.source = _that.arraySourceType[_that.indexSource].code
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
  computed: {
    arraySourceType() {
      return [
        { code: '1001', name: this.$t('国内-6s7') },
        { code: '2002', name: this.$t('国外-Yzr') }
      ]
    }
  },
  methods: {
    bindSourceChange: function (e) {
      this.indexSource = e.target.value
      this.source = this.arraySourceType[this.indexSource].code
    },
    bindInput: function (e) {
      const _that = this
      const dataset = e.currentTarget.dataset
      const value = e.detail.value
      const name = dataset.name
      _that[name] = value //
    },
    reportBack: function (e) {
      const obj = {
        areaCode: this.areaCode,
        communityId: this.communityId,
        communityName: this.communityName,
        name: this.name,
        idCard: this.idCard,
        tel: this.tel,
        sourceCityName: this.sourceCityName,
        sourceCity: '-1',
        source: this.source,
        bindDate: this.bindDate,
        bindTime: this.bindTime,
        remark: this.remark,
        backTime: this.bindDate + ' ' + this.bindTime + ':00'
      }
      let msg = ''
      if (obj.communityId == '') {
        msg = this.$t('请重新扫码-QT5')
      } else if (obj.name == '') {
        msg = this.$t('请填写姓名-KVh')
      } else if (obj.idCard == '' || obj.idCard.length != 18) {
        msg = this.$t('请正确填写身份证号-EvQ')
      } else if (obj.tel == '' || obj.tel.length != 11) {
        msg = this.$t('请正确填写的手机号-26F')
      } else if (obj.sourceCityName == '') {
        msg = this.$t('请填写城市名称-qmA')
      } else if (!obj.bindDate) {
        msg = this.$t('请选择返回日期-zZB')
      } else if (!obj.bindTime) {
        msg = this.$t('请选择返回时间-1rN')
      }
      if (msg != '') {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showLoading({
          title: this.$t('提交中-3Ok')
        })
        saveReportInfoBackCity(obj).then(
          _data => {
            uni.showToast({
              icon: 'none',
              title: this.$t('保存成功-Bki')
            })
            this.communityId = ''
          },
          err => {
            uni.showToast({
              icon: 'none',
              title: err
            })
          }
        )
      }
    },
    onChange: function (e) {
      console.log(e)
    },
    onCancel: function (e) {
      this.areaShow = false
      // this.setData({
      //   areaShow = false
      // });
    },
    dateChange: function (e) {
      this.bindDate = e.detail.value
    },
    timeChange: function (e) {
      this.bindTime = e.detail.value
    },
    getDate(type) {
      const date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()

      if (type === 'start') {
        year = year - 60
      } else if (type === 'end') {
        year = year + 2
      }
      month = month > 9 ? month : '0' + month
      day = day > 9 ? day : '0' + day
      return `${year}-${month}-${day}`
    }
  }
}
</script>
<style>
@import './reportInfoBack.css';
</style>
