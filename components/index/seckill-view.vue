<template>
  <view v-if="goods && goods.length > 0">
    <view class="bg-white seckill-view margin-top">
      <view class="flex justify-between seckill-view-top">
        <view>
          <text class="view-title">{{ $t('限时秒杀-pfd') }}</text>
          <text class="view-sub-title">{{ curSecHours.name }}{{ $t('专场-fUd') }}</text>
        </view>
        <view>
          <text @tap="_toSeckillGoodsList" class="view-title-more">{{ $t('更多-Miu') }} ></text>
        </view>
      </view>
      <view class="bg-white flex justify-between seckill-goods">
        <view v-for="(item, index) in goods" :key="index" class="seckill-item" @click="_toSeckillGoods(item)">
          <view>
            <image :src="item.coverPhoto"></image>
          </view>
          <view>
            <text class="seckill-price">MOP {{ item.killPrice }}</text>
          </view>
          <view>
            <text class="normal-price">MOP {{ item.price }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { queryProductSeckill } from '@/api/goods/goodsApi.js'
export default {
  name: 'SeckillView',
  data() {
    return {
      goods: [],
      shopId: '',
      curSecHours: {},
      secHours: [
        {
          name: '08:00',
          hours: 8
        },
        {
          name: '10:00',
          hours: 10
        },
        {
          name: '12:00',
          hours: 12
        },
        {
          name: '14:00',
          hours: 14
        },
        {
          name: '15:00',
          hours: 15
        },
        {
          name: '16:00',
          hours: 16
        },
        {
          name: '20:00',
          hours: 20
        },
        {
          name: '22:00',
          hours: 22
        }
      ]
    }
  },
  created() {
    const _goods = {
      coverPhoto: this.imgUrl + '/h5/images/noPic.png',
      killPrice: '1.50',
      price: '2.50'
    }
    this.goods.push(_goods)
    this.goods.push(_goods)
    this.goods.push(_goods)
    this.goods.push(_goods)
    this.computeCurHours()
    this._loadGoods()
  },
  methods: {
    _toSeckillGoodsList: function () {
      this.vc.navigateToMall(
        {
          url: '/pages/goods/seckillList'
        },
        true
      )
    },
    _loadGoods: function () {
      const _that = this
      queryProductSeckill({
        page: 1,
        row: 4,
        killHours: this.curSecHours.hours,
        shopId: this.shopId,
        validData: 'Y'
      }).then(_data => {
        _that.goods = _data
      })
    },
    computeCurHours: function () {
      const _that = this
      const _date = new Date()
      const _curHours = _date.getHours()
      _that.curSecHours = this.secHours[0]
      this.secHours.forEach(_hours => {
        if (_hours.hours >= _curHours) {
          _that.curSecHours = _hours
          return
        }
      })
    },
    _toSeckillGoods: function (_goods) {
      this.vc.navigateToMall(
        {
          url: '/pages/goods/seckillGoods?productId=' + _goods.productId + '&shopId=' + _goods.shopId + '&killId=' + _goods.killId
        },
        true
      )
    }
  }
}
</script>

<style lang="scss">
.seckill-view {
  border-radius: 10upx;
  padding: 20upx;

  .view-title {
    font-size: 36upx;
    color: #444;
  }

  .view-sub-title {
    font-size: 18upx;
    margin-left: 20upx;
    color: #fa2e1b;
  }

  .view-title-more {
    font-size: 18upx;
    color: #777;
    line-height: 48upx;
  }

  .seckill-goods {
    margin-top: 20upx;

    .seckill-item {
      width: 25%;
      text-align: center;

      image {
        width: 90%;
        height: 180upx;
        border-radius: 15upx;
      }
    }

    .seckill-price {
      font-size: 24upx;
      color: #fa2e1b;
    }

    .normal-price {
      font-size: 16upx;
      color: #777;
      text-decoration: line-through;
    }
  }
}
</style>
