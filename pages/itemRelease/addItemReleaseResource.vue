<template>
  <view>
    <view class="flex justify-between">
      <view class="page-title">
        {{ $t('申请放行物品-quI') }}
      </view>
      <view>
        <button class="cu-btn bg-red margin-tb-sm margin-right-sm" @click="_addRes">{{ $t('添加-Tka') }}</button>
      </view>
    </view>

    <view class="cu-form-group" v-for="(item, index) in res" :key="index" @click="_editResource(item)">
      <view class="title">{{ item.resName }}</view>
      <view>{{ item.amount }}</view>
    </view>

    <view class="flex flex-direction">
      <button class="cu-btn bg-primary margin-tb-sm lg" @click="_doFinishRes()">{{ $t('确定-vdT') }}</button>
    </view>

    <view class="cu-modal" :class="{ show: isShow }">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{ $t('添加物品-Gdn') }}</view>
          <view class="action" @tap="_cancle()">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="">
          <view class="cu-form-group">
            <view class="title">{{ $t('物品名称-m62') }}</view>
            <input v-model="curRes.resName" :placeholder="$t('请输入物品名称-LDD')" class="text-right" />
          </view>
          <view class="cu-form-group">
            <view class="title">{{ $t('数量-vfS') }}</view>
            <input v-model="curRes.amount" type="number" :placeholder="$t('请输入数量-8HZ')" class="text-right" />
          </view>
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action margin-0 flex-sub solid-left" @tap="_cancle()" v-if="!curRes.in">{{ $t('取消-KvD') }}</view>
          <view class="action margin-0 flex-sub solid-left" @tap="_delete()" v-else>{{ $t('删除-ILp') }}</view>
          <view class="action margin-0 flex-sub text-green solid-left" @tap="_doSummit()">{{ $t('确定-vdT') }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      res: [],
      curRes: {
        resName: '',
        amount: ''
      },
      isShow: false
    }
  },
  onLoad() {
    const _res = uni.getStorageSync('_tempItemReleaseResource')
    if (_res) {
      this.res = _res
    }
  },
  methods: {
    _addRes: function () {
      this.isShow = true
    },
    _editResource: function (item) {
      this.curRes = item
      this.isShow = true
    },
    _cancle: function () {
      this.isShow = false
    },
    _delete: function () {
      const _tmpRes = []
      this.res.forEach(item => {
        if (item.resName != this.curRes.resName) {
          _tmpRes.push(item)
        }
      })
      this.curRes = {
        resName: '',
        amount: ''
      }
      this.isShow = false
      this.res = _tmpRes
    },
    _doSummit: function () {
      if (!this.curRes.resName || !this.curRes.amount) {
        uni.showToast({
          icon: 'none',
          title: this.$t('请填写物品信息-4Yq')
        })
        return
      }
      this.curRes.in = true
      this.res.push(this.curRes)
      this.curRes = {
        resName: '',
        amount: ''
      }

      this.isShow = false
    },
    _doFinishRes: function () {
      uni.setStorageSync('_tempItemReleaseResource', this.res)
      uni.navigateBack({
        delta: 1
      })
    }
  }
}
</script>

<style lang="scss">
.page-title {
  font-weight: 400;
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 30rpx 30rpx 20rpx;
}
</style>
