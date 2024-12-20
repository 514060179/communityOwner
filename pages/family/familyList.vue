<template>
  <view>
    <view v-if="owners.length > 0">
      <view class="block__title">{{ $t('成员信息-esK') }}</view>
      <view v-for="(item, index) in owners" :key="index" class="bg-white margin-bottom margin-right-xs radius margin-left-xs padding">
        <view class="flex padding-bottom-xs solid-bottom justify-between">
          <view>{{ item.name }}</view>
          <view class="text-gray">{{ item.link }}</view>
        </view>
        <view class="flex margin-top justify-between">
          <view class="text-gray">{{ $t('成员编号-mV1') }}</view>
          <view class="text-gray">{{ item.memberId }}</view>
        </view>
        <!-- <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('身份证号-EYN') }}</view>
          <view class="text-gray">{{ item.idCard }}</view>
        </view> -->

        <!-- <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('成员年龄-UHb') }}</view>
          <view class="text-gray">{{ item.age }}{{ $t('岁-luL') }}</view>
        </view> -->
        <view class="flex margin-top-xs justify-between">
          <view class="text-gray">{{ $t('成员性别-sUr') }}</view>
          <view class="text-gray">{{ item.sex == 0 ? $t('男-yDM') : $t('女-R6K') }}</view>
        </view>

        <!-- <view class="solid-top flex justify-end margin-top padding-top-sm padding-bottom-sm">
          <button class="cu-btn sm bg-red" @click="_deleteOwnerMember(item)">{{ $t('删除-ILp') }}</button>
        </view> -->
      </view>
    </view>
    <view v-else>
      <no-data-page></no-data-page>
    </view>
    <view class="button_up_blank"></view>
    <!-- 1001: 业主本人 1002: 家庭成员 -->
    <!-- <view v-if="ownerTypeCd == '1001'" class="bg-white border flex justify-end" style="position: fixed; width: 100%; bottom: 0">
      <view class="action text-orange margin-right line-height"> </view>
      <view class="btn-group">
        <button class="cu-btn bg-green shadow-blur lgplus sharp" @click="goAdd()">{{ $t('添加成员-FZh') }}</button>
      </view>
    </view> -->

    <view class="cu-modal" :class="delOwnerMemberFlag == true ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{ $t('温馨提示-Tfh') }}</view>
          <view class="action" @tap="_cancleDeleteOwnerMember()">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl"> {{ $t('您确认删除该成员？-mwp') }} </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action margin-0 flex-sub solid-left" @tap="_cancleDeleteOwnerMember()">{{ $t('取消-KvD') }}</view>
          <view class="action margin-0 flex-sub text-green solid-left" @tap="_doDeleteOwnerMember()">{{ $t('确认-Hp3') }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
import noDataPage from '@/components/no-data-page/no-data-page.vue'

import { deleteOwnerMember } from '../../api/owner/ownerApi.js'
const constant = context.constant
export default {
  data() {
    return {
      owners: [],
      delOwnerMemberFlag: false,
      page: 1,
      totalPage: 0,
      loading: false,
      communityId: '',
      ownerId: '',
      curOwnerMember: {},
      ownerTypeCd: ''
    }
  },
  components: {
    noDataPage
  },
  onLoad: function (options) {
    context.onLoad(options)
  },
  onShow: function () {
    this._initData()
  },
  onPullDownRefresh: function () {
    // 上拉刷新
    if (!this.loading) {
      this.getTable(1, true).then(() => {
        // 处理完成后，终止下拉刷新
        wx.stopPullDownRefresh()
      })
    }
  },
  onReachBottom: function () {
    console.log(1, !this.loading, this.page < this.totalPage) // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求

    if (!this.loading && this.page < this.totalPage) {
      this.getTable(this.page + 1)
    }
  },
  methods: {
    _initData: function () {
      const that = this
      that.owners = []
      context.getOwner(function (_owner) {
        that.communityId = _owner.communityId
        that.ownerId = _owner.ownerId
        that.ownerTypeCd = _owner.ownerTypeCd
        that.getTable(1)
      })
    },
    getTable: function (page, override) {
      const that = this
      this.loading = true
      const _paramIn = {
        communityId: that.communityId,
        ownerId: that.ownerId
      }
      context.request({
        url: constant.url.queryOwnerMembers,
        header: context.getHeaders(),
        method: 'GET',
        data: _paramIn,
        success: function (res) {
          if (res.statusCode == 200) {
            const _owners = res.data.owners
            that.owners = _owners
            that.loading = false
          }
          uni.stopPullDownRefresh()
        },
        fail: function (e) {
          wx.showToast({
            title: this.$t('服务器异常了-eja'),
            icon: 'none',
            duration: 2000
          })
          uni.stopPullDownRefresh()
        }
      })
    },
    goAdd: function (e) {
      this.vc.navigateTo({
        url: '/pages/family/family'
      })
    },
    _deleteOwnerMember: function (item) {
      this.delOwnerMemberFlag = true
      this.curOwnerMember = item
    },
    _cancleDeleteOwnerMember: function (item) {
      this.delOwnerMemberFlag = false
    },
    _doDeleteOwnerMember: function () {
      const that = this
      this.curOwnerMember.communityId = this.communityId
      deleteOwnerMember(this.curOwnerMember).then(
        res => {
          uni.showToast({
            icon: 'none',
            title: this.$t('删除成功-12x')
          })
          that._cancleDeleteOwnerMember()
          that._initData()
        },
        err => {
          uni.showToast({
            icon: 'none',
            title: err
          })
          that._cancleDeleteOwnerMember()
        }
      )
    }
  }
}
</script>
<style>
.ppf_item {
  padding: 0rpx 0rpx 0rpx 0rpx;
}

.block__title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 40rpx 30rpx 20rpx;
}

.button_up_blank {
  height: 100rpx;
}

.cu-btn.lgplus {
  padding: 0 20px;
  font-size: 18px;
  height: 100upx;
}

.cu-btn.sharp {
  border-radius: 0upx;
}

.line-height {
  line-height: 100upx;
}
</style>
