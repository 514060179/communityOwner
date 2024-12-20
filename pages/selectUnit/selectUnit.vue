<template>
  <view>
    <view class="cu-bar search bg-white">
      <view class="search-form round">
        <text class="cuIcon-search"></text>
        <input v-model="searchValue" data-name="searchValue" name="searchValue" @focus="onChange" @blur="onSearch" :adjust-position="false" :placeholder="$t('请输入单元编号-Jzr')" confirm-type="search" />
      </view>
      <view class="action">
        <button class="cu-btn bg-green shadow-blur round" @tap="onSearch">{{ $t('搜索-WEd') }}</button>
      </view>
    </view>
    <view class="cu-list menu">
      <view class="cu-item" v-for="(unit, idx) in units" :key="idx" :label="unit.unitId">
        <view class="content padding-tb-sm" is-link @click="chooseUnit(unit)">
          <view> <text class="cuIcon-clothesfill text-blue margin-right-xs"></text> {{ unit.unitNum }}{{ $t('单元-7xd') }}</view>
          <view class="text-gray text-sm"> <text class="cuIcon-infofill margin-right-xs"></text> {{ unit.unitId }}</view>
        </view>
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
      appUserName: '',
      areaCode: '',
      searchValue: '',
      unitName: '',
      units: [],
      floorId: ''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    context.onLoad(options)
    const _floorId = options.floorId
    this.floorId = _floorId
    this.loadUnit()
  },
  methods: {
    onSearch() {
      this.loadUnit()
    },

    onClick() {
      this.loadUnit()
    },

    chooseUnit: function (_unit) {
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      uni.setStorageSync('_selectUnit', _unit)
      prevPage.unitName = _unit.name
      //console.log(e);
      wx.navigateBack({
        delta: 1
      })
    },
    loadUnit: function () {
      const _that = this
      const _communityInfo = context.getCurrentCommunity()
      const dataObj = {
        page: 1,
        row: 15,
        communityId: _communityInfo.communityId,
        name: this.searchValue,
        floorId: this.floorId
      }
      context.request({
        url: constant.url.queryUnit,
        header: context.getHeaders(),
        method: 'GET',
        data: dataObj,
        //动态数据
        success: function (res) {
          console.log(res) //成功情况下跳转

          if (res.statusCode == 200) {
            const _units = res.data

            _that.units = _units
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

<style></style>
