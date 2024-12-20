<template>
  <view>
    <view class="cu-modal bottom-modal" :class="isShowOrderUp ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white">
          <view class="action"> {{ $t('预约商品-Wwm') }} </view>
          <view class="action">
            <button class="cu-btn line-blue round sm" @click="_closes()">{{ $t('关闭-KJs') }}</button>
          </view>
        </view>
        <scroll-view scroll-y style="height: 700upx">
          <block>
            <view>
              <view class="cu-list menu no-padding">
                <view class="cu-item" v-for="(items, sub) in goods" :key="sub">
                  <view class="">
                    <view class="text-grey">
                      <text class="text-abc">{{ items.goodsName }}({{ items.quantity }}{{ $t('次-TUc') }}) MOP{{ items.money }}</text></view
                    >
                    <view class="text-gray text-sm flex justify-start">
                      <view v-for="(item, index) in items.hours" :key="index">
                        <view>{{ item }}{{ $t('时-ExD') }};</view>
                      </view>
                    </view>
                  </view>
                  <view class="action">
                    <button class="cu-btn line-red round sm" @click="_delete(items)">{{ $t('删除-ILp') }}</button>
                  </view>
                </view>
              </view>
            </view>
          </block>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SelectedGoods',
  data() {
    return {
      isShowOrderUp: false,
      goods: []
    }
  },
  methods: {
    viewSelectModal: function (_goodsList) {
      this.isShowOrderUp = true
      this.goods = _goodsList
      console.log('this.goods', this.goods)
    },
    _closes: function () {
      this.isShowOrderUp = false
    },
    _delete: function (_goods) {
      const _tmpGoods = []
      this.goods.forEach(_item => {
        if (_item.goodsId != _goods.goodsId) {
          _tmpGoods.push(_item)
        }
      })
      this.goods = _tmpGoods
      this.$emit('deleteGoods', _goods)
    }
  }
}
</script>

<style></style>
