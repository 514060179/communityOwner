<template>
  <view class="popup-container" @tap="closePopup">
    <view class="popup-content" :class="{'open': open }">
      <view class="popup-card" :class="{ 'active-card': selectArea.id === item.id }" v-for="(item) in areaList" :key="item.id" @tap.stop="changeItem(item)">
        <text>{{ item.desc }}</text>
        <text>{{ item.title }}</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "VcAreaPopup",
    props: {
      selectArea: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        open: false
      }
    },
    computed: {
      // 区号列表
      areaList() {
        return [{
            id: 1,
            title: '+853',
            desc: this.$t('中国澳门-NCE')
          },
          {
            id: 2,
            title: '+852',
            desc: this.$t('中国香港-18S')
          },
          {
            id: 3,
            title: '+86',
            desc: this.$t('中国大陆-vi7')
          },
          {
            id: 4,
            title: '+886',
            desc: this.$t('中国台湾-3Uu')
          }
        ]
      }
    },
    mounted() {
      setTimeout(() => {
        this.open = true
      }, 0)

    },
    methods: {
      changeItem(e) {
        this.open = false
        setTimeout(() => {
          this.$emit('selectArae', e)
        },200)
      },
      closePopup() {
        this.open = false
        setTimeout(() => {
          this.$emit('close')
        }, 200)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .popup-container {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(64, 64, 64, 0.1);
    backdrop-filter: blur(6rpx);
    z-index: 100;

    .popup-content {
      position: absolute;
      left: 0;
      bottom: -480rpx;
      width: 100%;
      background-color: #fff;
      padding: 40rpx 30rpx;
      border-radius: 20rpx 20rpx 0 0;
      transition: bottom 0.3s;
    }

    .popup-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #2E3845;
      width: 100%;
      height: 100rpx;
      padding: 0 30rpx;
      border-radius: 20rpx;
    }

    .active-card {
      color: #ffffff;
      background-color: #C21DA0;
    }

    .open {
      bottom: 0;
      transition: bottom 0.3s;
    }
  }
</style>