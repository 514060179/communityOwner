<template>
  <view>
    <view class="cu-form-group">
      <view class="title">{{ $t('类型-pGB') }}</view>
      <picker :range="typeCds" :value="index" @change="changeTypeCd">
        <view class="picker">
          {{ typeCdName || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('分类-mS1') }}</view>
      <picker :value="classificationIndex" :range="classifications" @change="_changeClassifications">
        <view class="picker">
          {{ classificationName || $t('请选择-Ah3') }}
        </view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('参考价格-RKf') }}</view>
      <input v-model="referencePrice" type="number" :placeholder="$t('请输入参考价格-JRW')" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('联系人-wR2') }}</view>
      <input v-model="publishUserName" :placeholder="$t('请输入联系人,如:吴先生-CC3')" />
    </view>
    <view class="cu-form-group">
      <view class="title">{{ $t('联系电话-Gao') }}</view>
      <input v-model="publishUserLink" type="number" :placeholder="$t('请输入联系电话-zct')" />
    </view>
    <view class="cu-form-group margin-top">
      <textarea v-model="context" :placeholder="$t('请输入内容-avQ')"></textarea>
    </view>

    <view class="cu-bar bg-white margin-top" v-if="typeCd == 222222">
      <view class="action">
        {{ $t('图片上传-mfj') }}
      </view>
      <view class="action"> {{ imgList.length }}/6 </view>
    </view>
    <view class="cu-form-group" v-if="typeCd == 222222">
      <view class="grid col-3 grid-square flex-sub">
        <view class="bg-img" v-for="(img, index) in imgList" :key="index" :data-url="imgList[index]">
          <image :src="imgList[index]" mode="aspectFill"></image>
          <view class="cu-tag bg-red" @tap="deleteImage(index)" :data-index="index">
            <text class="cuIcon-close"></text>
          </view>
        </view>
        <view class="solids" @tap="ChooseImage" v-if="imgList.length < 6">
          <text class="cuIcon-cameraadd"></text>
        </view>
      </view>
    </view>
    <view class="flex flex-direction margin">
      <button class="cu-btn bg-green margin-tb-sm lg" @tap="submitJunk()">{{ $t('发布-Q8R') }}</button>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
const constant = context.constant
const factory = context.factory
export default {
  data() {
    return {
      imgList: [],
      photos: [],
      index: 0,
      typeCdIds: ['222222', '333333'],
      typeCdName: '',
      typeCd: '',
      classificationName: '',
      classificationIndex: 0,
      classificationId: '',
      classificationIds: ['10008', '10002'],
      classification: '',
      referencePrice: '',
      publishUserId: '',
      publishUserName: '',
      publishUserLink: '',
      context: '',
      communityId: ''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _that = this
    context.onLoad(options)
    context.getOwner(res => {
      console.log('_ownerInfo', res)
      _that.publishUserId = res.userId
      _that.communityId = res.communityId
      _that.publishUserLink = res.link
      _that.publishUserName = res.appUserName
    })
  },
  computed: {
    typeCds() {
      return [this.$t('旧货-BPu'), this.$t('需求-7nO')]
    },
    classifications() {
      return [this.$t('家具-tc5'), this.$t('电器-COH')]
    }
  },
  methods: {
    changeTypeCd: function (e) {
      const index = e.detail.value
      this.typeCdName = this.typeCds[index]
      this.typeCd = this.typeCdIds[index]
    },
    _changeClassifications: function (e) {
      const _index = e.detail.value
      this.classificationName = this.classifications[_index]
      this.classification = this.classificationIds[_index]
    },
    submitJunk: function () {
      const obj = {
        typeCd: this.typeCd,
        classification: this.classification,
        context: this.context,
        referencePrice: this.referencePrice,
        publishUserName: this.publishUserName,
        publishUserLink: this.publishUserLink,
        photos: [],
        publishUserId: this.publishUserId,
        communityId: this.communityId
      }
      const _photos = this.photos

      _photos.forEach(function (_item) {
        obj.photos.push({
          photo: _item
        })
      })
      let msg = ''
      if (obj.typeCd == '') {
        msg = this.$t('类型为空-Tou')
      } else if (obj.classification == '') {
        msg = this.$t('分类为空-qM5')
      } else if (obj.context == '') {
        msg = this.$t('发布内容为空-1tW')
      } else if (obj.referencePrice == '') {
        msg = this.$t('参考价格为空-nfc')
      } else if (obj.publishUserName == '') {
        msg = this.$t('发布人为空-eJe')
      } else if (obj.publishUserLink == '') {
        msg = this.$t('联系方式为空-BA1')
      } else if (obj.publishUserId == '') {
        msg = this.$t('发布信息为空-Y2a')
      } else if (obj.communityId == '') {
        msg = this.$t('小区信息为空-jbe')
      }

      if (msg != '') {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
      } else {
        console.log('提交数据', obj)
        context.request({
          url: constant.url.saveJunkRequirement,
          header: context.getHeaders(),
          method: 'POST',
          data: obj,
          //动态数据
          success: function (res) {
            console.log(res) //成功情况下跳转
            if (res.statusCode != 200) {
              uni.showToast({
                icon: 'none',
                title: res.data,
                duration: 2000
              })
              return
            }
            uni.showToast({
              icon: 'none',
              title: this.$t('处理成功-VfN'),
              duration: 2000
            })

            uni.navigateBack({
              delta: 1
            })
          },
          fail: function (e) {
            console.log(e)
            wx.showToast({
              title: this.$t('服务器异常了-eja'),
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    },
    removePhoto: function (e) {
      console.log(e.detail.index)
      const _imgList = []
      this.imgList.forEach(function (item, index) {
        if (index != e.detail.index) {
          _imgList.push(item)
        }
      })
      const _photos = []
      this.photos.forEach(function (item, index) {
        if (index != e.detail.index) {
          _photos.push(item)
        }
      })
      this.photos = _photos
      this.imgList = _imgList
    },
    deleteImage: function (e) {
      console.log(e)
      const imageArr = this.$data.imgList
      imageArr.splice(e, 1)
    },
    ChooseImage: function (e) {
      const that = this
      wx.chooseImage({
        count: 4, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: res => {
          console.log(res)
          that.$data.imgList.push(res.tempFilePaths[0])
          let _base64Photo = ''
          factory.base64.urlTobase64(res.tempFilePaths[0]).then(function (_res) {
            _base64Photo = _res
            console.log('base64', _base64Photo)
            that.photos.push(_base64Photo)
          })
        }
      })
    }
  }
}
</script>

<style></style>
