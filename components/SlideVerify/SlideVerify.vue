<template>
    <view class="cu-modal text-center" :class="[{ 'show': modalShow }]">
        <view class="cu-dialog" style="max-width: 280px;min-height: 285px;">
            <view class="slider">
                <view class="content">
                    <view v-show="getDisabled"
                        style="width: 280px;height: 159px;display: flex;justify-content: center;align-items: center;z-index: 1;position: absolute;">
                        <button :loading="true"></button>
                    </view>
                    <view class="bg-img-view">
                        <image :style="getDisabled ? 'opacity: 0' : ''" mode="widthFix" id="bg-img" :src="bgcImg" alt=""
                            style="width: 100%;max-height: 159px;" />
                    </view>
                    <view class="slider-img-view" id="slider-img-div"
                        style="transform: translate(0px, 0px);height: 100%;max-height: 159px;">
                        <image :style="getDisabled ? 'opacity: 0' : ''" mode="heightFix" id="slider-img"
                            :src="sliderImg" alt="" style="height: 100%;max-height: 159px;" />
                    </view>
                </view>
                <view class="slider-move">
                    <view class="slider-move-track">
                        拖动滑块完成拼图
                    </view>
                    <!-- 移动 -->
                    <view v-if="!isPc" class="slider-move-btn" id="slider-move-btn"
                        style="background-position: -5px 11.7963%; transform: translate(0px, 0px);"
                        @touchstart.prevent="touchtStarEvent" @touchmove.prevent="touchMoveEvent"
                        @touchend.prevent="touchEndEvent">
                    </view>
                    <!-- pc端 -->
                    <view v-else class="slider-move-btn" id="slider-move-btn"
                        style="background-position: -5px 11.7963%; transform: translate(0px, 0px);"
                        @mousedown.prevent="touchtStarEvent" @mousemove.prevent="touchMoveEvent"
                        @mouseup.prevent="touchEndEvent">
                    </view>
                </view>
                <view class="bottom">
                    <view class="close-btn" id="slider-close-btn" @tap="closeFn({})"></view>
                    <view @tap="refreshCaptcha" class="refresh-btn" id="slider-refresh-btn"></view>
                </view>
            </view>
        </view>
        <!-- <ndmall-loading isFullScreen :active="getDisabled" /> -->
    </view>
</template>

<script>
import { mapGetters } from 'vuex';
import { sliderInfo, checkSlider } from '@/api/user/userApi';
import { toast ,isPC} from '@/utils/uniHelper';

export default {
    name: "slider-verification-code",
    props: {
        modalShow: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            bgcImg: '',
            sliderImg: '',
            currentCaptchaId: null,
            isMove: false,
            ClientX: 0,
            ClientY: 0,
            startTime: '',
            Distance: 0,
            currentCaptchaConfig: {
                startTime: new Date(),
                trackArr: [],
                movePercent: 0,
                bgImageWidth: '',
                bgImageHeight: '',
                sliderImageWidth: '',
                sliderImageHeight: '',
                end: 248
            },
            getDisabled: false,
            canPost: 0,
            times: 0,
			isPc:isPC()
        }
    },
    computed: {
        ...mapGetters(["channelId"]),
    },
    mounted() {
        this.refreshCaptcha()
    },
    methods: {
        //获取当前坐标
        getCurrentCoordinate(event) {
            let startX, startY;
            if (event.pageX) {
                startX = event.pageX;
                startY = event.pageY;
            }
            let targetTouches;
            if (event.changedTouches) {
                // 抬起事件
                targetTouches = event.changedTouches;
            } else if (event.targetTouches) {
                // pc 按下事件
                targetTouches = event.targetTouches;
            } else if (event.originalEvent && event.originalEvent.targetTouches) {
                // 鼠标触摸事件
                targetTouches = event.originalEvent.targetTouches;
            }
            if (!startX && targetTouches[0].pageX) {
                startX = targetTouches[0].pageX;
                startY = targetTouches[0].pageY;
            }
            if (!startX && targetTouches[0].clientX) {
                startX = targetTouches[0].clientX;
                startY = targetTouches[0].clientY;
            }
            if (startX && startY) {
                startX = Math.round(startX);
                startY = Math.round(startY);
            }
            // console.log(startX, startY);
            return { startX, startY }
        },
        //开始事件
        touchtStarEvent(event) {
            if (this.getDisabled) return
            if (this.canPost == 1) return
            const coordinate = this.getCurrentCoordinate(event);
            this.ClientX = coordinate.startX;
            this.ClientY = coordinate.startY;
            this.currentCaptchaConfig.startX = coordinate.startX;
            this.currentCaptchaConfig.startY = coordinate.startY;
            // console.log(this.ClientX, coordinate.startX, this.currentCaptchaConfig.startX);
            this.startTime = new Date()
            this.currentCaptchaConfig.trackArr.push({
                x: this.currentCaptchaConfig.startX - this.ClientX,
                y: this.currentCaptchaConfig.startY - this.ClientY,
                type: "down",
                t: (new Date().getTime() - this.currentCaptchaConfig.startTime.getTime())
            });
            this.isMove = true;
            window.document.getElementById("slider-move-btn").style.backgroundPosition = "-5px 31.0092%"
        },
        //移动事件
        touchMoveEvent(event) {
            if (this.getDisabled) return
            if (this.canPost == 1) return
            if (!this.isMove) {
                return false
            }
            if (event.touches && event.touches.length > 0) {
                event = event.touches[0];
            }
            const coordinate = this.getCurrentCoordinate(event);
            let pageX = coordinate.startX;
            let pageY = coordinate.startY;
            const startX = this.currentCaptchaConfig.startX;
            const startY = this.currentCaptchaConfig.startY;
            const startTime = this.currentCaptchaConfig.startTime;//
            const end = this.currentCaptchaConfig.end;
            const bgImageWidth = this.currentCaptchaConfig.bgImageWidth;
            const trackArr = this.currentCaptchaConfig.trackArr;
            let moveX = pageX - startX;
            console.log(pageX, startX);
            console.log(pageY, startY, pageY - startY);
            console.log('moveX', moveX);
            const track = {
                x: pageX - startX,
                y: pageY - startY,
                type: "move",
                t: (new Date().getTime() - startTime.getTime())
            };
            trackArr.push(track);
            if (moveX < 0) {
                moveX = 0;
            } else if (moveX > end) {
                moveX = end;
            }
            this.currentCaptchaConfig.moveX = moveX;
            this.currentCaptchaConfig.movePercent = moveX / bgImageWidth;
            if (this.isMove == true && moveX >= 0) {
                this.Distance = moveX;
                window.document.getElementById("slider-move-btn").style.transform = "translate(" + moveX + "px, 0px)"
                window.document.getElementById("slider-img-div").style.transform = "translate(" + moveX + "px, 0px)"
            }
        },
        //结束事件
        touchEndEvent(event) {
            if (this.getDisabled) return
            if (this.canPost == 1) return
            const coordinate = this.getCurrentCoordinate(event);
            this.currentCaptchaConfig.stopTime = new Date();
            console.log(new Date());
            let pageX = coordinate.startX;
            let pageY = coordinate.startY;
            const startX = this.currentCaptchaConfig.startX;
            const startY = this.currentCaptchaConfig.startY;
            const startTime = this.currentCaptchaConfig.startTime;//
            const trackArr = this.currentCaptchaConfig.trackArr;
            const track = {
                x: pageX - startX,
                y: pageY - startY,
                type: "up",
                t: (new Date().getTime() - startTime.getTime())
            }
            trackArr.push(track);
            window.document.getElementById("slider-move-btn").style.backgroundPosition = "-5px 11.79625%"
            if (this.isMove) {
                this.Distance = 0;
                this.ClientX = 0;
                this.ClientY = 0;
                this.isMove = false;
                this.valid(this.currentCaptchaConfig)
            }
        },
        // 闭
        closeFn(bool) {
            // this.refreshCaptcha();
            // 通知父组件关闭页面
            this.$emit('closeModal', bool)
        },
        // 验证
        showToast(msg) {
            this.$nextTick(() => {
                toast(msg);
            });
        },
        valid(captchaConfig) {
            let data = {
                bgImageWidth: captchaConfig.bgImageWidth,
                bgImageHeight: captchaConfig.bgImageHeight,
                sliderImageWidth: captchaConfig.sliderImageWidth,
                sliderImageHeight: captchaConfig.sliderImageHeight,
                startSlidingTime: this.startTime,
                endSlidingTime: captchaConfig.stopTime,
                trackList: captchaConfig.trackArr
            };
            console.log("valid", data);
            if (this.canPost == 1) return
            this.canPost = 1
            // this.$http.post("checkSlider", {id: this.currentCaptchaId,captcha: JSON.stringify(data)})
            checkSlider({ id: this.currentCaptchaId, captcha: JSON.stringify(data) }).then(res => {
                if (res.errorCode == '000' && res.data == 1) {
                    this.canPost = 0
                    // 关闭弹窗
                    this.closeFn({ captcha: data, id: this.currentCaptchaId })
                } else {
                    this.showToast('验证失败，请重新尝试');
                    this.canPost = 0
                    this.refreshCaptcha();
                }
            }).catch((err) => {
                // 修改: 处理错误信息
                const errMsg = err?.message || '验证失败，请重试';
                this.showToast(errMsg);
                this.canPost = 0
            })
        },
        // 获取
        refreshCaptcha() {
            if (this.getDisabled) return
            if (this.canPost == 1) return
            if (this.times == 3) {
                // 异常情况处理
                this.showToast("验证码获取失败，请稍后重试");
                this.closeFn({})
                this.getDisabled = false;
                this.canPost = 0
                this.times = 0
                return
            }
            this.getDisabled = true

            // this.$http.post("sliderInfo").then(res => {
            sliderInfo().then(res => {
                this.reset();
                if (res.errorCode == '000') {
                    console.log(res.data);
                    this.currentCaptchaId = res.data.id;
                    const bgImg = window.document.getElementById("bg-img");
                    const sliderImg = window.document.getElementById("slider-img");
                    // bgImg.src = res.data.captcha.backgroundImage;
                    // sliderImg.src = res.data.captcha.sliderImage;
                    this.sliderImg = res.data.captcha.sliderImage
                    this.bgcImg = res.data.captcha.backgroundImage
                    // bgImg.attr("src", data.data.captcha.backgroundImage);
                    // sliderImg.attr("src", data.data.captcha.sliderImage);
                    this.initConfig(bgImg.offsetWidth, bgImg.offsetHeight, sliderImg.offsetWidth, sliderImg.offsetHeight, 248);
                    this.getDisabled = false;
                    this.times = 0
                } else {
                    this.showToast(res.errorMessage);
                    this.closeFn({})
                }
            }).catch((e) => {
                this.times += 1
                this.getDisabled = false;
                this.showToast(e);
                this.refreshCaptcha()
                console.log("验证码请求错误", e);
            }).finally(() => {
                // this.getDisabled = false;
				 console.log(res);
            })
        },
        initConfig(bgImageWidth, bgImageHeight, sliderImageWidth, sliderImageHeight, end) {
            this.currentCaptchaConfig = {
                startTime: new Date(),
                trackArr: [],
                movePercent: 0,
                bgImageWidth: bgImageWidth,
                bgImageHeight: bgImageHeight,
                sliderImageWidth: sliderImageWidth,
                sliderImageHeight: sliderImageHeight,
                end: end
            }
        },
        reset() {
            window.document.getElementById("slider-move-btn").style.backgroundPosition = "-5px 11.79625%"
            window.document.getElementById("slider-move-btn").style.transform = "translate(0px, 0px)"
            window.document.getElementById("slider-img-div").style.transform = "translate(0px, 0px)"
            this.sliderImg = ''
            this.bgcImg = ''
            // $("#slider-move-btn").css("background-position", "-5px 11.79625%")
            // $("#slider-move-btn").css("transform", "translate(0px, 0px)")
            // $("#slider-img-div").css("transform", "translate(0px, 0px)")
            this.currentCaptchaId = null;
        }
    },

}
</script>
<style lang="scss" scoped>
.slider {
    background-color: #fff;
    width: 278px;
    height: 285px;
    z-index: 999;
    box-sizing: border-box;
    padding: 9px;
    border-radius: 6px;
    box-shadow: 0 0 11px 0 #848FA1;

    .refresh-btn,
    .close-btn,
    .slider-move-track,
    .slider-move-btn {
        cursor: pointer;
        background: url(../../static/sprite.png) no-repeat;
    }

    .content {
        width: 100%;
        height: 159px;
        position: relative;

        .bg-img-view {
            width: 100%;
            max-height: 159px;
            position: absolute;
            transform: translate(0px, 0px);
        }

        .slider-img-view {
            height: 100%;
            max-height: 159px;
            position: absolute;
            transform: translate(0px, 0px);
        }
    }

    .slider-move {
        height: 60px;
        width: 100%;
        margin: 11px 0;
        position: relative;

        .slider-move-track {
            line-height: 38px;
            font-size: 14px;
            text-align: center;
            white-space: nowrap;
            color: #88949d;
            -moz-user-select: none;
            -webkit-user-select: none;
            user-select: none;
        }

        .slider-move-btn {
            transform: translate(0px, 0px);
            background-position: -5px 11.79625%;
            position: absolute;
            top: -12px;
            left: 0;
            width: 66px;
            height: 66px;
        }
    }

    .bottom {
        height: 19px;
        width: 100%;
        display: flex;
        justify-content: center;

        .close-btn {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            background-position: 0 44.86874%;
        }

        .refresh-btn {
            width: 20px;
            height: 20px;
            background-position: 0 81.38425%;
        }
    }
}

.cu-modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 500;
    opacity: 0;
    outline: 0;
    width: 100%;
    transform: scale(1);
    backface-visibility: hidden;
    perspective: 2000upx;
    background: rgba(0, 0, 0, 0.6);
    transition: all 0.3s ease-in-out 0s;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cu-modal.show {
    opacity: 1;
    transition-duration: 0.3s;
    transform: scale(1);
    overflow-x: hidden;
    overflow-y: auto;
    pointer-events: auto;
}

.cu-dialog {
    position: relative;
    margin: auto;
    width: auto;
    background-color: #f8f8f8;
    border-radius: 20upx;
    overflow: hidden;
    border: 1px solid #ddd;
}
</style>