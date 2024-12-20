<template>
  <view class="user-container">
    <view class="notice">
      <view>
        <view class="text">{{ $t('姓-SmP') }}<text decode="true">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</text>{{ $t('名-zfp') }}: {{ obj.repairName }}</view>
        <view class="text">{{ $t('联系方式-k8c') }}: {{ obj.tel }}</view>
        <view class="text">{{ $t('报修类型-qnU') }}: {{ obj.repairTypeName }}</view>
        <view class="text">{{ $t('状-SV8') }}<text decode="true">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</text>{{ $t('态-Kqy') }}: {{ obj.stateName }}</view>
        <!-- <view class="text"> 报修时间: 2019-10-20 21:59:39</view> -->
        <view class="text">{{ $t('预约时间-FzQ') }}: {{ obj.appointmentTime }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import context from '../../../lib/proprietor/proprietorContext.js'
//获取app实例
// const app = getApp().globalData

export default {
  data() {
    return {
      obj: {}
    }
  },

  components: {},
  props: {},
  onLoad: function (e) {
    context.onLoad(e)
    this.setData({
      obj: JSON.parse(e.item)
    })
  },
  onShow: function () {
  },
  methods: {
    setData: function (obj, callback) {
      const that = this
      let keys = []
      let val, data
      const reg = /[d+]/
      Object.keys(obj).forEach(function (key) {
        keys = key.split('.')
        val = obj[key]
        data = that.$data
        keys.forEach(function (key2, index) {
          if (index + 1 == keys.length) {
            if (reg.test(key2)) {
              const re = /(.*?)[(d+)]/.exec(key2)
              const name = re[1]
              const kk = re[2]
              data = data[name]
              data[kk] && that.$set(data, kk, val)
            } else {
              data[key2] && that.$set(data, key2, val)
            }
          } else {
            if (reg.test(key2)) {
              const re = /(.*?)[(d+)]/.exec(key2)
              const name = re[1]
              const kk = re[2]
              data = data[name][kk]
            } else if (data[key2]) {
              that.$set(data, key2, {})
              data = data[key2]
            }
          }
        })
      })
      callback && callback()
    }
  }
}
</script>
<style>
@import './detail.css';
</style>
