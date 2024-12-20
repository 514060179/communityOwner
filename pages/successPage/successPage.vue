<template>
  <view>
    <view class="bg-white success-msg">
      <view class="  ">
        <view class="padding flex align-center">
          <view class="flex-sub text-center">
            <view class="text-xsl">
              <!-- 支付成功 -->
              <text class="cuIcon-roundcheckfill text-green" v-if="status == 1 || msg"></text>
              <!-- 支付处理中 -->
              <text class="cuIcon-loading2 text-green" v-else></text>
            </view>
            <view class="text-msg" v-if="status == 1 || msg">{{ msg || $t('处理成功-VfN') }}</view>
            <view class="text-msg" v-else>{{ $t('支付处理中-Jb7') }}</view>
          </view>
        </view>
      </view>

      <view class="padding flex flex-direction margin-top">
        <button class="cu-btn bg-green lg" @click="_indexPage()">{{ $t('返回首页-A1Q') }}</button>
      </view>
    </view>

    <view class="home_wrap">
      <success-ads :objType="objType"></success-ads>
    </view>
    <success-goods :objType="objType"></success-goods>
  </view>
</template>

<script>
import successAds from '@/components/success/success-ads.vue'
import successGoods from '@/components/success/success-goods.vue'
import { getPayStatus } from '@/api/payResult/payResultApi.js'
export default {
  data() {
    return {
      msg: '',
      objType: '3003',
      imgs: [],
      goods: [],
      // 支付状态 0:没有成功 1:支付成功
      status: '',
      timer: null
    }
  },
  onLoad(options) {
    this.msg = options.msg
    this.objType = options.objType
    this.payStatus()
  },
  components: {
    successAds,
    successGoods
  },
  onUnload() {
    clearTimeout(this.timer)
  },
  methods: {
    async payStatus() {
      try {
        const orderParams = uni.getStorageSync("orderParams")
        const { status } = await getPayStatus(orderParams)
        this.status = status
        
        if (status == 0) {
          this.timer = setTimeout(() => {
            this.payStatus()
          }, 5000)
        } else {
          clearTimeout(this.timer)
        }
      } catch (e) {
        console.log(e, 'getPayStatus')
      }
    },
    _indexPage: function () {
      uni.switchTab({
        url: '/pages/index/index?wAppId=' + this.vc.getWAppId()
      })
    }
  }
}
</script>

<style>
.success-msg {
  padding-top: 100upx;
  padding-bottom: 50upx;
}

.text-xsl {
  font-size: 180upx;
  line-height: 1.2;
}

.text-msg {
  font-size: 40upx;
}

.home_wrap {
  padding: 20upx 20upx 0;
}
</style>
