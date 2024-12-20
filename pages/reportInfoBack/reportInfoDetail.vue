<template>
  <view>
    <view style="background-color: white; padding: 40rpx 30rpx 10rpx; text-align: center; color: black; font-size: 20px">{{ setting.name }}</view>
    <view class="" v-for="(item, index) in titles" :key="index">
      <view class="block__title">{{ index + 1 }}，{{ item.title }}</view>
      <radio-group class="block" @change="radioChange($event, item)" v-if="item.titleType == '1001'">
        <view class="cu-form-group" v-for="(valueItem, valueIndex) in item.reportInfoSettingTitleValueDtos" :key="valueIndex">
          <view class="title">{{ valueItem.qaValue }}</view>
          <radio :class="item.radio == valueItem.valueId ? 'checked' : ''" :checked="item.radio == valueItem.valueId ? true : false" :value="valueItem.valueId" />
        </view>
      </radio-group>
      <checkbox-group class="block" @change="checkboxChange($event, item)" v-else-if="item.titleType == '2002'">
        <view class="cu-form-group" v-for="(valueItem, valueIndex) in item.reportInfoSettingTitleValueDtos" :key="valueIndex">
          <view class="title">{{ valueItem.qaValue }}</view>
          <checkbox :class="item.radio[valueIndex].selected == '1' ? 'checked' : ''" :checked="item.radio[valueIndex].selected == '1' ? true : false" :value="valueItem.valueId"> </checkbox>
        </view>
        <!--:checked="item.radio[valueIndex].checked?true:false"-->
      </checkbox-group>
      <view v-else>
        <view class="cu-form-group">
          <textarea maxlength="512" v-model="item.radio" :placeholder="$t('请回答-b1F')" />
        </view>
      </view>
    </view>

    <view class="block__title">{{ $t('人员信息-FMW') }}</view>
    <view class="cu-form-group">
      <view class="title">{{ $t('姓名-rTx') }}</view>
      <input
:value="name"
@input="bindInput"
data-name="name"
required
:label="$t('姓名-rTx')"
clearable
:placeholder="$t('请输入名称-PaE')"
name="name" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('身份证-4Dk') }}</view>
      <input
:value="idCard"
@input="bindInput"
data-name="idCard"
required
:label="$t('身份证-4Dk')"
clearable
:placeholder="$t('请输入身份证-bqg')"
name="idCard" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('手机号-9dl') }}</view>
      <input
:value="tel"
@input="bindInput"
data-name="tel"
required
:label="$t('手机号-9dl')"
clearable
:placeholder="$t('请输入手机号-Cdr')"
name="tel" />
    </view>
    <view class="button_up_blank"></view>
    <view class="flex flex-direction">
      <button class="cu-btn bg-green margin-tb-sm lg" @click="submitQuestionAnswer()">提交</button>
    </view>

    <view class="cu-modal" :class="finishFlag == true ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{ $t('登记完成-o1B') }}</view>
          <view class="action" @tap="_cancleFinishModal()">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl"> {{ $t('感谢您的反馈-pQN') }} </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action margin-0 flex-sub solid-left" @tap="_cancleFinishModal()">{{ $t('关闭-KJs') }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import context from '../../lib/proprietor/proprietorContext.js'

import { saveReportInfoAnswerValue, querySettingTitle, querySetting, queryReportInfoAnswerByOpenId } from '../../api/reportInfo/reportInfoApi.js'

// #ifdef H5
import { getPageWAppId, wechatRefreshToken } from '@/lib/proprietor/page/PageH5.js'
// #endif
export default {
  data() {
    return {
      name: '',
      idCard: '',
      tel: '',
      setting: {},
      titles: [],
      qaId: '',
      objType: '',
      openId: '',
      finishFlag: false
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    // #ifdef H5
    if (!options.openId) {
      getPageWAppId(options)
      wechatRefreshToken(window.location.href, 2, window.location.href)
      return
    }
    this.openId = options.openId
    this._loadUserInfo(options.openId)
    // #endif
    this.settingId = options.settingId
    this.communityId = options.communityId
    querySetting({
      communityId: this.communityId,
      settingId: this.settingId,
      page: 1,
      row: 100
    }).then(_data => {
      that.setting = _data.data[0]
    })
    querySettingTitle({
      communityId: this.communityId,
      settingId: this.settingId,
      page: 1,
      row: 100
    }).then(_data => {
      _data.data.forEach(item => {
        if (item.titleType == '1001') {
          item.radio = ''
        } else if (item.titleType == '2002') {
          // checked: false
          item.radio = []
          item.reportInfoSettingTitleValueDtos.forEach(value => {
            item.radio.push({
              checked: false,
              valueId: value.valueId,
              selected: '0'
            })
          })
        } else {
          item.radio = ''
        }
      })

      that.titles = _data.data.sort(function (a, b) {
        return a.seq - b.seq
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    bindInput: function (e) {
      const _that = this
      const dataset = e.currentTarget.dataset
      const value = e.detail.value
      const name = dataset.name
      _that[name] = value //
    },
    radioChange: function (e, item) {
      item.radio = e.detail.value
    },
    checkboxChange: function (e, item) {
      item.radio.forEach(value => {
        value.selected = '0'
        value.checked = false
      })
      item.radio.forEach(value => {
        e.detail.value.forEach(_dValue => {
          if (value.valueId == _dValue) {
            if (value.selected == '0') {
              value.selected = '1'
              value.checked = true
            }
          }
        })
      })
    },
    submitQuestionAnswer: function (e) {
      let obj = {
        communityId: this.communityId,
        communityName: this.communityName,
        name: this.name,
        idCard: this.idCard,
        tel: this.tel,
        sourceCityName: this.sourceCityName,
        sourceCity: '-1',
        source: this.source,
        bindDate: this.bindDate,
        bindTime: this.bindTime,
        remark: this.remark,
        backTime: this.bindDate + ' ' + this.bindTime + ':00',
        openId: this.openId
      }
      let msg = ''
      if (obj.communityId == '') {
        msg = this.$t('请从新扫码-OR2')
      } else if (obj.name == '') {
        msg = this.$t('请填写姓名-KVh')
      } else if (obj.idCard == '' || obj.idCard.length != 18) {
        msg = this.$t('请正确填写身份证号-EvQ')
      } else if (obj.tel == '' || obj.tel.length != 11) {
        msg = this.$t('请正确填写的手机号-26F')
      }
      if (msg != '') {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
        return
      }
      const _questionAnswerTitles = []
      const _titles = this.titles
      let _valueId = ''
      _titles.forEach(item => {
        if (item.titleType == '2002') {
          const _valueContent = []
          item.radio.forEach(_radio => {
            if (_radio.selected == '1') {
              _valueContent.push(_radio.valueId)
            }
          })
          _questionAnswerTitles.push({
            communityId: this.communityId,
            valueContent: _valueContent,
            titleId: item.titleId,
            titleType: item.titleType
          })
        } else {
          _valueId = item.radio
          _questionAnswerTitles.push({
            communityId: this.communityId,
            valueContent: _valueId,
            titleId: item.titleId,
            titleType: item.titleType
          })
        }
      })
      let reflag = false
      _questionAnswerTitles.forEach(item => {
        if (item.valueContent.toString().length == 0) {
          uni.showToast({
            icon: 'none',
            title: this.$t('保存成功-Bki')
          })
          reflag = true
          return false
        }
      })
      if (reflag) {
        uni.showToast({
          icon: 'none',
          title: this.$t('有未答项，请作答！-ak9')
        })
        return false
      }
      obj = {
        settingId: this.settingId,
        communityId: this.communityId,
        personName: this.name,
        idCard: this.idCard,
        tel: this.tel,
        openId: this.openId,
        questionAnswerTitles: _questionAnswerTitles
      }
      const _that = this
      saveReportInfoAnswerValue(obj).then(
        _data => {
          uni.showToast({
            icon: 'none',
            title: this.$t('保存成功-Bki')
          })
          this.communityId = ''
          _that.finishFlag = true
        },
        err => {
          uni.showToast({
            icon: 'none',
            title: err
          })
        }
      )
    },
    _loadUserInfo: function (_openId) {
      const _that = this
      queryReportInfoAnswerByOpenId({
        openId: _openId
      }).then(_data => {
        const _params = _data.data
        if (!_params || _params.length < 1) {
          return
        }
        _that.name = _params[0].personName
        _that.idCard = _params[0].idCard
        _that.tel = _params[0].tel
      })
    },
    _cancleFinishModal: function () {
      this.finishFlag = false
      uni.navigateBack({
        delta: 1
      })
    }
  }
}
</script>
<style>
.block__title {
  margin: 0;
  font-weight: 400;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
  padding: 40rpx 30rpx 10rpx;
}

.button_up_blank {
  height: 40rpx;
}
</style>
