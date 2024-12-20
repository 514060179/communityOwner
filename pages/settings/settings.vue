<template>
  <view>
    <view>
      <view class="cu-list menu">
        <view class="cu-item arrow" @click="settingHeadImg()">
          <view class="content">
            <text class="cuIcon-emojiflashfill text-pink"></text>
            <text class="text-grey">{{ $t('我的头像-pq4') }}</text>
          </view>
          <view class="action">
            <view class="cu-avatar round" :style="{ backgroundImage: 'url(' + headerImg + ')' }"></view>
          </view>
        </view>
        <!-- <view class="cu-item arrow" @click="_toPage('/pages/settings/changeOwnerPhone')">
          <view class="content">
            <text class="cuIcon-mobilefill text-pink"></text>
            <text class="text-grey">{{ $t('手机号-9dl') }}</text>
          </view>
          <view class="action"> </view>
        </view> -->
        <view class="cu-item arrow" @click="_toPage('/pages/settings/changePassword')">
          <view class="content">
            <text class="cuIcon-warnfill text-pink"></text>
            <text class="text-grey">{{ $t('密码-J8X') }}</text>
          </view>
        </view>
      </view>
      <view class="cu-list menu">
        <view class="cu-item arrow" @click="_toPage('/pages/my/viewAdmin')">
          <view class="content">
            <text class="cuIcon-questionfill text-pink"></text>
            <text class="text-grey">{{ $t('技术支持-Uvg') }}</text>
          </view>
        </view>
        <view class="cu-item arrow" @click="updateVersion">
          <view class="content">
            <text class="cuIcon-warn text-green"></text>
            <text class="text-grey">{{ $t('版本号-UgV') }} ({{ $t('点击获取最新版本-8Oc') }})</text>
          </view>
          <view class="action">
            <text class="text-grey text-sm">V{{ version }}</text>
          </view>
        </view>
      </view>

      <view v-if="login" class="margin-top">
        <view class="cu-list menu">
          <view class="cu-item" @tap="_logout()">
            <view class="content text-center">
              <text class="text-red">{{ $t('退出-Bnt') }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="cu-modal" :class="logoutUser == true ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">{{ $t('退出系统-j2p') }}</view>
          <view class="action" @tap="_cancleLogout()">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl"> 您确认退出系统吗？ </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action margin-0 flex-sub solid-left" @tap="_cancleLogout()">{{ $t('取消-KvD') }}</view>
          <view class="action margin-0 flex-sub text-green solid-left" @tap="_doLogoutUser()">{{ $t('确定-vdT') }}</view>
        </view>
      </view>
    </view>
    <!-- app更新弹窗 -->
    <app-update-popup v-if="isShowPopup" @close="isShowPopup=false"></app-update-popup>
  </view>
</template>

<script>
  import context from '../../lib/proprietor/proprietorContext.js'
  import * as TanslateImage from '../../lib/proprietor/utils/translate-image.js'
  import { getCommunityId } from '../../api/community/communityApi.js'
  import { refreshOwner, getMemberId, loadLoginOwner } from '@/api/owner/ownerApi.js'
  import { getAppVersion } from '@/api/index/indexApi.js'
  import appUpdatePopup from '@/components/app-update-popup/app-update-popup.vue'
  import conf from '@/conf/config.js'
  // #ifdef APP
  import jPush from '@/common/utils/jpush.js'
  // #endif
  const constant = context.constant
  const factory = context.factory

  export default {
    components: { appUpdatePopup },
    data() {
      return {
        headerImg: conf.imgUrl + '/h5/images/serve/head.png',
        imageList: [],
        logoutUser: false,
        login: true,
        version: '1.0.0',
        isShowPopup: false
      }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      const { appVersion } = uni.getSystemInfoSync()
      this.version = appVersion
      

      context.onLoad(options)
      const userInfo = uni.getStorageSync(constant.mapping.OWNER_INFO)

      if (userInfo == null || userInfo == '') {
        this.login = false
        return
      }
      this.loadOwnerHeaderImg()
    },
    methods: {
      async updateVersion() {
        // #ifdef H5
        uni.showToast({
          icon: 'none',
          title: this.$t('当前是最新版本，无需更新！-VOI')
        })
        // #endif
        // #ifdef APP
          try {
            const { data } = await getAppVersion(true)
            this.isShowPopup = data.data.isOpenTip === 1
          } catch (e) {
            console.log(e)
          }
        // #endif
      },
      settingHeadImg: function() {
        var _that = this
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: function(res) {
            // console.log(res)
            wx.showToast({
              title: _that.$t('正在上传-eAf'),
              icon: 'loading',
              mask: true,
              duration: 1000
            })
            var tempFilePaths = res.tempFilePaths
            // #ifdef H5            
              TanslateImage.translate(tempFilePaths, _baseInfo => {
                _that.headerImg = _baseInfo
                _that._uploadOwnerHeaderImg()
                wx.hideLoading()
              })
            // #endif
            // #ifdef APP
            factory.base64.urlTobase64(tempFilePaths[0]).then(function(_baseInfo) {
            	_that.headerImg = _baseInfo;
            		_that._uploadOwnerHeaderImg();
            	wx.hideLoading()
            });
            // #endif
          }
        })
      },
      /**
       * 查询业主头像
       */
      // loadOwnerHeaderImg: function () {
      //   console.log('loadOwnerHeaderImg')
      //   const _that = this
      //   refreshOwner().then(
      //     _owner => {
      //       console.log(_owner,'ppp')
      //       if (_owner.headImgUrl) {
      //         _that.headerImg = _owner.headImgUrl
      //       } else {
      //         _that.headerImg = conf.imgUrl + '/h5/images/serve/head.png'
      //       }
      //     },
      //     err => {
      //       console.log(err, 'err')
      //     }
      //   )
      // },
      /**
       * 查询业主头像
       */
      loadOwnerHeaderImg: function() {
        const _that = this
        loadLoginOwner({
          memberId: getMemberId(),
          communityId: getCommunityId()
        }).then(_data => {
          if (_data.url) {
            _that.headerImg = _data.url
          } else {
            _that.headerImg = conf.imgUrl + '/h5/images/serve/head.png'
          }
        })
      },
      _uploadOwnerHeaderImg: function() {
        const _that = this
        context.getOwner(function(_owner) {
          const _memberId = _owner.memberId
          const _communityId = _owner.communityId
          const obj = {
            memberId: _memberId,
            communityId: _communityId,
            photo: _that.headerImg
          }
          context.request({
            url: constant.url.uploadOwnerPhoto,
            header: context.getHeaders(),
            method: 'POST',
            data: obj, //动态数据
            success: function(res) {
              if (res.statusCode != 200) {
                wx.showToast({
                  title: _that.$t('头像上传失败-zfu'),
                  icon: 'none',
                  duration: 2000
                })
                return
              }

              _that.loadOwnerHeaderImg()
            },
            fail: function(e) {
              wx.showToast({
                title: _that.$t('服务器异常了-eja'),
                icon: 'none',
                duration: 2000
              })
            }
          })
        })
      },
      //退出系统
      _logout: function() {
        this.logoutUser = true
      },
      _cancleLogout: function() {
        this.logoutUser = false
      },
      _toPage: function(_url) {
        this.vc.navigateTo({
          url: _url
        })
      },
      _doLogoutUser: function() {
        const _data = {
          token: wx.getStorageSync('token')
        }
        const that = this
        context.request({
          url: constant.url.userLogout,
          header: context.getHeaders(),
          method: 'POST',
          data: _data,
          success: function(res) {
            if (res.statusCode != 200) {
              uni.showToast({
                icon: 'none',
                title: res.data
              })
              return
            }
            // #ifdef APP
            jPush.deleteAlias({ sequence: 1 })
            // #endif
            const wAppId = uni.getStorageSync(constant.mapping.W_APP_ID)
            // 清除所有缓存
            context.clearStorage()
            if (wAppId != null && wAppId != undefined && wAppId != '') {
              uni.setStorageSync(constant.mapping.W_APP_ID, wAppId)
            }
            that.vc.navigateTo({
              url: '/pages/login/login'
            })
          },
          fail: function(error) {
            // 调用服务端登录接口失败
            uni.showToast({
              title: that.$t('调用接口失败-L5P')
            })
            console.log(error)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  
</style>
