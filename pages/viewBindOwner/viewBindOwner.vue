<template>
  <view>
    <view class="block__title">{{ $t('小区信息-kxU') }}</view>
    <view class="cu-list menu">
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-info text-green"></text>
          <text class="text-grey">{{ $t('小区编码-zk2') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ communityId }}</text>
        </view>
      </view>

      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-home text-green"></text>
          <text class="text-grey">{{ $t('小区名称-Z2i') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ communityName }}</text>
        </view>
      </view>
    </view>
    <view class="block__title">{{ $t('业主信息-PQ8') }}</view>
    <view class="cu-list menu">
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-profile text-green"></text>
          <text class="text-grey">{{ $t('姓名-rTx') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ appUserName }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-phone text-green"></text>
          <text class="text-grey">{{ $t('手机号-9dl') }}</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ link }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// pages/viewBindOwner/viewBindOwner.js
import context from '../../lib/proprietor/proprietorContext.js'

import { getCommunityId, getCommunityName } from '@/api/community/communityApi.js'
import { loadLoginOwner } from '../../api/owner/ownerApi.js'
const constant = context.constant

export default {
  data() {
    return {
      areaName: '',
      communityId: '',
      communityName: '',
      appUserName: '',
      appUserId: '',
      idCard: '',
      link: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    context.onLoad(options)
    this.loadOwnerInfo()
    this.communityName = getCommunityName()
  },
  methods: {
    /**
     * 加载业主信息
     */
    loadOwnerInfo: function () {
      const _that = this

      loadLoginOwner({
        communityId: getCommunityId()
      }).then(function (_ownerInfo) {
        console.log(_ownerInfo)
        if (_ownerInfo) {
          const _active = _ownerInfo.state == '10000' ? 1 : 2
          _that.areaName = _ownerInfo.parentAreaName + _ownerInfo.areaName
          _that.communityId = _ownerInfo.communityId
          _that.appUserName = _ownerInfo.name
          _that.link = _ownerInfo.link
        }
      })
    },
    unbindOwner: function () {
      //调用解绑业主，并且删除本地缓存
      const obj = {
        appUserId: this.appUserId,
        communityId: this.communityId
      }
      let msg = ''

      if (obj.appUserId == '' || obj.communityId == '') {
        msg = this.$t('数据异常-v8r')
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
        return
      }

      context.request({
        url: constant.url.appUserUnBindingOwner,
        header: context.getHeaders(),
        method: 'POST',
        data: obj,
        //动态数据
        success: function (res) {
          console.log(res)

          if (res.statusCode != 200) {
            wx.showToast({
              title: this.$t('解绑失败-atq'),
              icon: 'none',
              duration: 2000
            })
            return
          } //成功情况下跳转

          wx.redirectTo({
            url: '/pages/bindOwner/bindOwner'
          })
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
@import './viewBindOwner.css';

text {
  text-align: center;
}
</style>
