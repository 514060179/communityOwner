<template>
  <view>
    <view class="block__title">{{ $t('发票设置-vKA') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('发票类型-RVW') }}</view>
      <picker bindchange="PickerChange" :value="invoiceTypeIndex" :range="invoiceTypes" :range-key="'name'" @change="invoiceTypeChange">
        <view class="picker">
          {{ invoiceTypeIndex == -1 ? '请选择' : invoiceTypes[invoiceTypeIndex].name }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('发票名头-I9j') }}</view>
      <input v-model="invoiceName" :placeholder="$t('请输入发票名头-eEE')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('纳税人识别号-g4A') }}</view>
      <input v-model="invoiceNum" :placeholder="$t('请输入纳税人识别号-epw')" class="text-right" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('地址、电话-uX8') }}</view>
      <input v-model="invoiceAddress" :placeholder="$t('请输入地址、电话-8rX')" class="text-right" />
    </view>

    <view class="flex flex-direction padding">
      <button class="cu-btn bg-primary margin-tb-sm lg" @click="_updateOwnerInvoice()" v-if="oiId">{{ $t('提交-4TX') }}</button>
      <button class="cu-btn bg-primary margin-tb-sm lg" @click="_saveOwnerInvoice()" v-else>{{ $t('提交-4TX') }}</button>
    </view>
  </view>
</template>

<script>
import { getOwnerId, getOwnerName } from '@/api/owner/ownerApi.js'
import { getOwnerInvoice, saveOwnerInvoice, updateOwnerInvoice } from '@/api/invoice/invoiceApi.js'
import { getCommunityId } from '@/api/community/communityApi.js'
export default {
  data() {
    return {
      invoiceTypeIndex: -1,
      invoiceType: '',
      invoiceName: '',
      invoiceNum: '',
      invoiceAddress: '',
      ownerId: '',
      oiId: ''
    }
  },
  onLoad(options) {
    const _ownerId = getOwnerId()
    if (!_ownerId) {
      uni.showToast({
        icon: 'none',
        title: this.$t('业主不存在-DLp')
      })
      return
    }
    this.ownerId = _ownerId

    //todo 查询发票抬头
    this._getOwnerInvoice()
  },
  computed: {
    invoiceTypes() {
      return [
        {
          name: this.$t('个人-mJj'),
          value: '1001'
        },
        {
          name: this.$t('企业-CjM'),
          value: '2002'
        }
      ]
    }
  },
  methods: {
    invoiceTypeChange: function (e) {
      this.invoiceTypeIndex = e.target.value //取其下标
      const selected = this.invoiceTypes[this.invoiceTypeIndex] //获取选中的数组
      this.invoiceType = selected.value //选中的id
    },
    _getOwnerInvoice: function () {
      const _that = this
      getOwnerInvoice({
        page: 1,
        row: 1,
        communityId: getCommunityId(),
        ownerId: this.ownerId
      }).then(_data => {
        if (!_data || _data.length < 1) {
          return
        }
        _that.invoiceType = _data[0].invoiceType
        _that.invoiceName = _data[0].invoiceName
        _that.invoiceNum = _data[0].invoiceNum
        _that.invoiceAddress = _data[0].invoiceAddress
        _that.oiId = _data[0].oiId
        if (_that.invoiceType == '1001') {
          _that.invoiceTypeIndex = 0
        } else {
          _that.invoiceTypeIndex = 1
        }
      })
    },
    _saveOwnerInvoice: function () {
      saveOwnerInvoice({
        invoiceType: this.invoiceType,
        invoiceName: this.invoiceName,
        invoiceNum: this.invoiceNum,
        invoiceAddress: this.invoiceAddress,
        ownerId: this.ownerId,
        ownerName: getOwnerName(),
        communityId: getCommunityId()
      }).then(_data => {
        uni.showToast({
          icon: 'none',
          title: _data.msg
        })
        if (_data.code == 0) {
          uni.navigateBack()
        }
      })
    },
    _updateOwnerInvoice: function () {
      updateOwnerInvoice({
        invoiceType: this.invoiceType,
        invoiceName: this.invoiceName,
        invoiceNum: this.invoiceNum,
        invoiceAddress: this.invoiceAddress,
        ownerId: this.ownerId,
        oiId: this.oiId,
        communityId: getCommunityId()
      }).then(_data => {
        uni.showToast({
          icon: 'none',
          title: _data.msg
        })
        if (_data.code == 0) {
          uni.navigateBack()
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
  padding: 40rpx 30rpx 20rpx;
}

.button_up_blank {
  height: 40rpx;
}
</style>
