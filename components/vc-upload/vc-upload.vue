<template>
  <view>
    <view class="cu-bar bg-white">
      <view class="action">
        {{ title || $t('图片上传-mfj') }}
      </view>
      <view class="action" v-if="canEdit"> {{ imgList.length }}/{{ maxPhotoNum }} </view>
    </view>
    <view class="cu-form-group">
      <view class="grid col-4 grid-square flex-sub">
        <view class="bg-img" v-for="(img, index) in imgList" :key="index" @click.stop="preview(index)">
          <image :src="img" mode="aspectFill"></image>
          <view class="cu-tag bg-red" v-if="canEdit" @tap.stop="deleteImage(index)">
            <text class="cuIcon-close"></text>
          </view>
        </view>
        <view class="solids" @tap="ChooseImage" v-if="canEdit && imgList.length < maxPhotoNum">
          <text class="cuIcon-cameraadd"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import * as TanslateImage from '../../lib/proprietor/utils/translate-image.js'
import conf from '../../conf/config.js'
const context = require('../../lib/proprietor/proprietorContext.js')
const factory = context.factory
export default {
  name: 'VcUpload',
  data() {
    return {
      photos: [],
      imgList: []
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    maxPhotoNum: {
      type: Number,
      default: 1
    },
    sendImgList: {
      type: Array,
      default() {
        return []
      }
    },
    count: {
      type: Number,
      default: 1
    },
    sizeType: {
      type: Array,
      default() {
        return ['original', 'compressed']
      }
    },
    sourceType: {
      type: Array,
      default() {
        return ['album', 'camera']
      }
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    obj: {
      photos(newName, oldName) {
        this.sendData()
      },
      deep: true
    },
    photos: function (val) {
      this.sendData()
    }
  },
  // watch: {
  //   photos: function (val) {
  //     this.sendData()
  //   },
  //   deep: true
  // },
  mounted() {
    this.imgList = this.sendImgList
    if (this.imgList.length > 0) {
      uni.showLoading({
        title: this.$t('图片加载中...-fnA'),
        mask: true
      })
    }
    this.imgList.forEach((item, index) => {
      let url = ''
      if (item.indexOf('http') != -1) {
        url = item
      } else {
        url = conf.commonBaseUrl + item
      }
      uni.request({
        url: url,
        method: 'GET',
        responseType: 'arraybuffer',
        success: async res => {
          const base64 = wx.arrayBufferToBase64(res.data) //把arraybuffer转成base64
          const Base64Url = 'data:image/jpeg;base64,' + base64 //不加上这串字符，在页面无法显示
          this.photos.push(Base64Url)
          if (this.photos.length == this.imgList.length) {
            uni.hideLoading()
          }
        }
      })
      // uni.downloadFile({
      // 	url: conf.commonBaseUrl + item,
      // 	success: (imgRes) => {
      // 		this.imgList[index] = imgRes.tempFilePath;
      // 		wx.getFileSystemManager().readFile({
      // 			filePath: imgRes.tempFilePath,
      // 			encoding: 'base64',
      // 			success: (base64Res) => {
      // 				let base64 = 'data:image/png;base64,' + base64Res.data
      // 				this.photos.push(base64);
      // 				if(this.photos.length == this.imgList.length){
      // 					uni.hideLoading();
      // 				}
      // 			}
      // 		})
      // 	}
      // })
    })
  },
  methods: {
    // 向父组件传递base64数据
    sendData() {
      this.$emit('sendImagesData', this.photos)
    },
    // 删除
    deleteImage: function (index) {
      this.imgList.splice(index, 1)
      this.photos.splice(index, 1)
    },
    // 添加
    ChooseImage: function () {
      const that = this
      wx.chooseImage({
        count: this.count, // 选择数量
        sizeType: this.sizeType, //原图或压缩图
        sourceType: this.sourceType, // 相册或拍摄
        success: res => {
          var tempFilePaths = res.tempFilePaths[0]

          that.imgList.push(tempFilePaths)
          that.$forceUpdate()
          //#ifdef H5
          TanslateImage.translate(tempFilePaths, url => {
            that.photos.push(url)
          })
          //#endif

          //#ifdef MP-WEIXIN
          factory.base64.urlTobase64(tempFilePaths).then(function (_res) {
            that.photos.push(_res)
          })
          //#endif
        }
      })
    },
    // 预览
    preview: function (index) {
      const urls = this.imgList
      // 空集合 return
      if (urls.length < 1) {
        return
      }
      // domain拼接
      urls.forEach((item, index) => {
        const start = item.indexOf('/callComponent')
        if (start == 0) {
          urls[index] = conf.commonBaseUrl + item
        }
      })
      uni.previewImage({
        current: index,
        urls: urls
      })
    }
  }
}
</script>

<style></style>
