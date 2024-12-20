<template>
  <view class="user-container">
    <block v-if="questions.length > 0">
      <view class="cu-list menu" v-for="(question, idx) in questions" :key="idx" :data-item="question" @click="gotoDetail(question)">
        <view class="cu-item arrow">
          <view class="content padding-tb-sm">
            <view>
              <text class="text-green margin-right-xs">{{ question.qaType == '3003' ? $t('投票-pG9') : $t('问卷-TpT') }}</text>
              <view class="text-cut" style="width: 220px">{{ question.qaName }}</view>
            </view>
            <view class="text-gray text-sm">
              <text class="margin-right-xs">{{ $t('结束时间-3Q1') }}：</text> {{ question.endTime }}</view
            >
          </view>
          <view class="action" v-if="question.state == '0'">{{ $t('已结束-49w') }}</view>
          <view class="action" v-else-if="question.state == '2'">{{ $t('已投票-A2F') }}</view>
        </view>
      </view>
    </block>
    <view class="cu-list menu" v-if="questions.length === 0">
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-notification text-grey"></text>
          <text class="text-grey">{{ $t('暂无投票问卷信息-WbI') }}</text>
        </view>
        <view class="action"> </view>
      </view>
    </view>
  </view>
</template>

<script>
/** index.js **/
import context from '../../lib/proprietor/proprietorContext.js'
// import { getProperty } from '../../api/property/propertyApi.js'
import { queryQuestionAnswer } from '../../api/question/questionApi.js'
const constant = context.constant //获取app实例
//获取app实例
const app = getApp().globalData

export default {
  data() {
    return {
      communityId: '',
      questions: [],
      currPageIndex: 0,
      pageSize: 10,
      userId: '',
      storeId: ''
    }
  },
  onLoad: function (options) {
    context.onLoad(options)
  },
  onShow: function () {
    const that = this
    that.communityId = context.getCurrentCommunity().communityId
    that.userId = context.getUserInfo().userId
    this._queryQuestionAnswer()
  },
  methods: {
    _queryQuestionAnswer: function () {
      const that = this
      //qaType:'3003',
      queryQuestionAnswer({
        page: 1,
        row: 50,
        state: '1201',
        communityId: that.communityId
      }).then(_data => {
        _data.data.forEach(function (item, index) {
          item.endTime = item.endTime.replaceAll('-', '/')
          const _endTime = new Date(item.endTime)
          const _startTime = new Date(item.startTime.replaceAll('-', '/'))
          if (_startTime.getTime() > new Date().getTime()) {
            item.state = '-1'
          } else if (_endTime.getTime() > new Date().getTime()) {
            item.state = '1'
          } else {
            item.state = '0'
          }
          if (item.userId == that.userId) {
            item.state = '2'
          }
          item.startTime = item.startTime.replace(/:\d{1,2}$/, ' ')
          item.endTime = item.endTime.replace(/:\d{1,2}$/, ' ')
        })
        that.questions = _data.data
      })
    },
    gotoDetail: function (_question) {
      let _msg = this.$t('问卷-TpT')
      if (_question.qaType == '3003') {
        _msg = this.$t('投票-pG9')
      }
      if (_question.state == '-1') {
        uni.showToast({
          icon: 'none',
          title: _msg + this.$t('尚未开始-1wU')
        })
        return
      }
      if (_question.state == '0') {
        uni.showToast({
          icon: 'none',
          title: _msg + this.$t('已结束-49w')
        })
        return
      }
      if (_question.state == '2') {
        uni.showToast({
          icon: 'none',
          title: _msg + this.$t('已投票-A2F')
        })
        return
      }
      const that = this
      if (_question.qaType == '3003') {
        this.vc.navigateTo({
          url: '/pages/questionAnswer/ownerVote?qaId=' + _question.qaId + '&objType=' + _question.objType + '&userQaId=' + _question.userQaId
        })
      } else {
        this.vc.navigateTo({
          url: '/pages/questionAnswer/questionAnswerDetail?qaId=' + _question.qaId + '&objType=' + _question.objType + '&userQaId=' + _question.userQaId
        })
      }
    }
  }
}
</script>
<style>
.cu-list + .cu-list {
  margin-top: 10px;
}
</style>
