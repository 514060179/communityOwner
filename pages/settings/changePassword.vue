<template>
  <view>
    <form>
      <view class="cu-form-group margin-top">
        <view class="title">{{ $t('密码-J8X') }}</view>
        <input :placeholder="$t('请输入密码-8j6')" type="password" name="input" v-model="oldPwd" />
      </view>
      <view class="cu-form-group">
        <view class="title">{{ $t('新密码-mgQ') }}</view>
        <input :placeholder="$t('请输入新密码-R1Z')" type="password" name="input" v-model="pwd" />
      </view>
      <view class="cu-form-group">
        <view class="title">{{ $t('确认密码-NGn') }}</view>
        <input :placeholder="$t('请输入确认密码-SzS')" type="password" name="input" v-model="newPwd" />
      </view>
    </form>

    <view class="padding flex flex-direction">
      <button class="cu-btn bg-green lg" @tap="_doChangePwd()">{{ $t('提交-4TX') }}</button>
    </view>
  </view>
</template>

<script>
import context from '../../lib/proprietor/proprietorContext.js'
const constant = context.constant
// const factory = context.factory;
export default {
  data() {
    return {
      oldPwd: '',
      pwd: '',
      newPwd: ''
    }
  },
  methods: {
    _doChangePwd: function () {
      if (this.oldPwd == '') {
        uni.showToast({
          icon: 'none',
          title: this.$t('密码不能为空-LxV')
        })
        return
      }

      if (this.pwd == '') {
        uni.showToast({
          icon: 'none',
          title: this.$t('新密码不能为空-fKC')
        })
        return
      }

      if (this.newPwd == '') {
        uni.showToast({
          icon: 'none',
          title: this.$t('确认密码不能为空-8xN')
        })
        return
      }

      if (this.newPwd != this.pwd) {
        uni.showToast({
          icon: 'none',
          title: this.$t('确认密码和新密码不一致-JCr')
        })
        return
      }

      const userInfo = uni.getStorageSync(constant.mapping.OWNER_INFO)

      const _userInfo = {
        userId: userInfo.userId,
        oldPwd: this.oldPwd,
        newPwd: this.newPwd
      }

      context.request({
        url: constant.url.changeStaffPwd,
        header: context.getHeaders(),
        method: 'POST',
        data: _userInfo,
        success: function (res) {
          uni.showToast({
            icon: 'none',
            title: res.data.msg
          })
          if (res.data.code == 0) {
            const wAppId = uni.getStorageSync(constant.mapping.W_APP_ID)
            // 清除所有缓存
            context.clearStorage()
            if (wAppId != null && wAppId != undefined && wAppId != '') {
              uni.setStorageSync(constant.mapping.W_APP_ID, wAppId)
            }
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/login/login'
              })
            }, 1000)
            return
          }
        },
        fail: function (error) {
          // 调用服务端登录接口失败
          uni.showToast({
            title: this.$t('调用接口失败-L5P')
          })
          console.log(error)
        }
      })
    }
  }
}
</script>

<style></style>
