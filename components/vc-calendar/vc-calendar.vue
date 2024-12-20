<template>
  <view>
    <!-- 日期选择器 -->
    <view class="content">
      <view class="calendar-wrapper">
        <!-- 选择月份 -->
        <view class="header" v-if="headerBar">
          <view class="pre" @click="changeMonth('pre')"></view>
          <view>{{ y }} / {{ formatNum(m) }}</view>
          <view class="next" @click="changeMonth('next')"></view>
        </view>
        <!-- 星期栏 -->
        <view class="week">
          <view class="week-day" v-for="(item, index) in weekDay" :key="index">{{ item }}</view>
        </view>
        <!-- 日历数字 -->
        <view class="content" :style="{ height: height }">
          <view :style="{ top: positionTop + 'rpx' }" class="days">
            <view class="item" v-for="(item, index) in dates" :key="index">
              <view
                class="day"
                @click="selectOne(item, $event)"
                :class="{
                  choose: getActday(`${item.year}-${item.month}-${item.date}`) && item.isCurM, //选中的日期
                  chooseMarkDay: getChoose(`${item.year}-${item.month}-${item.date}`),
                  nolm: !item.isCurM, //不在本月的日
                  today: isToday(item.year, item.month, item.date), //当日日期
                  isWorkDay: isWorkDay(item.year, item.month, item.date), //周一至周五
                  disableDate: getDisableDate(`${item.year}-${item.month}-${item.date}`)
                }"
              >
                {{ Number(item.date) }}
              </view>
              <view
                class="iconyixuanzhong"
                :class="{ markDays: getChoose(`${item.year}-${item.month}-${item.date}`) }"
                v-if="getChoose(`${item.year}-${item.month}-${item.date}`) && !isMarkDay(item.year, item.month, item.date) && item.isCurM"
              >
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { compareDate } from '@/lib/proprietor/utils/DateUtil.js'
export default {
  name: 'VcCalendar',
  props: {
    // 星期几为第一天(0为星期日)
    weekstart: {
      type: Number,
      default: 1
    },
    // 标记的日期
    markDays: {
      type: Array,
      default: () => {
        return []
      }
    },
    //是否展示月份切换按钮
    headerBar: {
      type: Boolean,
      default: true
    },
    //过去日期是否不可点击
    disabledAfter: {
      type: Boolean,
      default: false
    },
    //接收用户选择的参数
    actDay: {
      type: Array,
      default: () => []
    },
    //接受已经被选择的参数
    chooseDay: {
      type: Array,
      default: () => []
    },
    disabledDate: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      weektext: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      y: new Date().getFullYear(), // 年
      m: new Date().getMonth() + 1, // 月
      d: new Date().getDate(), //日
      dates: [], // 当前月的日期数据
      positionTop: 0,
      choose: '',
      chooseArr: []
    }
  },
  created() {
    this.dates = this.monthDay(this.y, this.m)
  },
  mounted() {
    // this.choose = this.getToday().date;
  },
  computed: {
    // 顶部星期栏
    weekDay() {
      return this.weektext.slice(this.weekstart).concat(this.weektext.slice(0, this.weekstart))
    },
    height() {
      return (this.dates.length / 7) * 82 + 'rpx'
    }
  },
  methods: {
    // 禁用日期
    getDisableDate(day) {
      if (this.disabledAfter) {
        const now = new Date()
        const curDay = new Date(day)
        return (compareDate(now, curDay) && now.toDateString() !== curDay.toDateString()) || this.disabledDate.includes(day)
      }

      return false
    },
    //已被投标的日期
    getChoose(day) {
      for (let i = 0; i < this.chooseDay.length; i++) {
        if (day == this.chooseDay[i]) {
          return true
        }
      }
    },
    //用户选择的日期
    getActday(day) {
      for (let i = 0; i < this.actDay.length; i++) {
        if (day == this.actDay[i] && !this.getChoose(day)) {
          // console.log("选中了", this.actDay);
          return true
        }
      }
    },
    formatNum(num) {
      const res = Number(num)
      return res < 10 ? '0' + res : res
    },
    getToday() {
      const date = new Date()
      const y = date.getFullYear()
      const m = date.getMonth()
      const d = date.getDate()
      const week = new Date().getDay()
      const weekText = ['日', '一', '二', '三', '四', '五', '六']
      const formatWeek = '星期' + weekText[week]
      const today = {
        date: y + '-' + this.formatNum(m + 1) + '-' + this.formatNum(d),
        week: formatWeek
      }
      return today
    },
    // 获取当前月份数据
    monthDay(y, month) {
      const dates = []
      const m = Number(month)
      const firstDayOfMonth = new Date(y, m - 1, 1).getDay() // 当月第一天星期几
      const lastDateOfMonth = new Date(y, m, 0).getDate() // 当月最后一天
      const lastDayOfLastMonth = new Date(y, m - 2, 0).getDate() // 上一月的最后一天
      const weekstart = this.weekstart == 7 ? 0 : this.weekstart
      const startDay = (() => {
        // 周初有几天是上个月的
        if (firstDayOfMonth == weekstart) {
          return 0
        } else if (firstDayOfMonth > weekstart) {
          return firstDayOfMonth - weekstart
        } else {
          return 7 - weekstart + firstDayOfMonth
        }
      })()
      const endDay = 7 - ((startDay + lastDateOfMonth) % 7) // 结束还有几天是下个月的
      for (let i = 1; i <= startDay; i++) {
        dates.push({
          date: this.formatNum(lastDayOfLastMonth - startDay + i),
          day: weekstart + i - 1 || 7,
          month: m - 1 >= 0 ? this.formatNum(m - 1) : 12,
          year: m - 1 >= 0 ? y : y - 1
        })
      }
      for (let j = 1; j <= lastDateOfMonth; j++) {
        dates.push({
          date: this.formatNum(j),
          day: (j % 7) + firstDayOfMonth - 1 || 7,
          month: this.formatNum(m),
          year: y,
          isCurM: true //是否当前月份
        })
      }
      if (endDay < 7) {
        for (let k = 1; k <= endDay; k++) {
          dates.push({
            date: this.formatNum(k),
            day: (lastDateOfMonth + startDay + weekstart + k - 1) % 7 || 7,
            month: m + 1 <= 11 ? this.formatNum(m + 1) : 0,
            year: m + 1 <= 11 ? y : y + 1
          })
        }
      }
      // console.log(dates); //日期
      return dates
    },
    isWorkDay(y, m, d) {
      //是否工作日
      const ymd = `${y}/${m}/${d}`
      const formatDY = new Date(ymd.replace(/-/g, '/'))
      const week = formatDY.getDay()
      if (week == 0 || week == 6) {
        return false
      } else {
        return true
      }
    },
    isFutureDay(y, m, d) {
      //是否未来日期
      const ymd = `${y}/${m}/${d}`
      const formatDY = new Date(ymd.replace(/-/g, '/'))
      const showTime = formatDY.getTime()
      const curTime = new Date().getTime()
      if (showTime > curTime) {
        return true
      } else {
        return false
      }
    },
    // 标记日期
    isMarkDay(y, m, d) {
      let flag = false
      for (let i = 0; i < this.markDays.length; i++) {
        const dy = `${y}-${m}-${d}`
        if (this.markDays[i] == dy) {
          flag = true
          break
        }
      }
      return flag
    },
    isToday(y, m, d) {
      const checkD = y + '-' + m + '-' + d
      const today = this.getToday().date
      if (checkD == today) {
        return true
      } else {
        return false
      }
    },
    // 点击回调
    selectOne(i, event) {
      const date = `${i.year}-${i.month}-${i.date}`
      const selectD = new Date(date).getTime()
      const curTime = new Date().getTime()
      const week = new Date(date).getDay()
      const weekText = ['日', '一', '二', '三', '四', '五', '六']
      const formatWeek = '星期' + weekText[week]
      const response = {
        date: date,
        week: formatWeek
      }
      if (!i.isCurM) {
        console.log('不在当前月范围内')
        return false
      }
      if (this.disabledDate.includes(date)) {
        uni.showToast({
          icon: 'none',
          title: '当前日期不可选'
        })
        return false
      }
      if (selectD < curTime) {
        if (this.disabledAfter && new Date().toDateString() !== new Date(date).toDateString()) {
          console.log('过去日期不可选')
          uni.showToast({
            icon: 'none',
            title: '过去日期不可选'
          })
          return false
        } else {
          this.choose = date
          this.$emit('onDayClick', response)
        }
      } else {
        this.choose = date
        this.chooseArr.push(date)
        this.$emit('onDayClick', response)
      }
      // console.log(response);
    },
    //改变年月
    changYearMonth(y, m) {
      this.dates = this.monthDay(y, m)
      this.y = y
      this.m = m
    },
    changeMonth(type) {
      if (type == 'pre') {
        if (this.m + 1 == 2) {
          this.m = 12
          this.y = this.y - 1
        } else {
          this.m = this.m - 1
        }
      } else {
        if (this.m + 1 == 13) {
          this.m = 1
          this.y = this.y + 1
        } else {
          this.m = this.m + 1
        }
      }
      this.dates = this.monthDay(this.y, this.m)
    }
  }
}
</script>
<style lang="scss">
.content {
  .calendar-wrapper {
    color: #6f6d6d;
    font-size: 28rpx;
    text-align: center;
    background-color: #fff;
    padding-bottom: 10rpx;
    border-radius: 20rpx;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 88rpx;
      color: #bfbfbf;
      font-size: 32rpx;
      font-weight: normal;
      padding: 0 20rpx;
      margin-bottom: 20rpx;

      .pre,
      .next {
        display: inline-block;
        width: 20rpx;
        height: 20rpx;
        border-color: #c21da0;
        border-width: 0 0 4rpx 4rpx;
        border-style: solid;
      }

      .pre {
        transform: rotateZ(45deg);
      }

      .next {
        transform: rotateZ(-135deg);
      }
    }

    .week {
      display: flex;
      align-items: center;
      height: 34rpx;

      view {
        font-size: 24rpx;
        color: #767676;
        flex: 1;
      }
    }

    .content {
      position: relative;
      overflow: hidden;
      transition: height 0.4s ease;

      .days {
        transition: top 0.3s;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        position: relative;

        .item {
          position: relative;
          display: block;
          height: 80rpx;
          line-height: 80rpx;
          width: calc(100% / 7);
          color: #1a1a1a;

          .day {
            width: 80rpx;
            height: 80rpx;
            font-style: normal;
            display: inline-block;
            vertical-align: middle;
            line-height: 80rpx;
            overflow: hidden;
            border-radius: 60rpx;
            font-size: 32rpx;
            font-weight: normal;

            &.choose {
              background-color: #c21da0;
              color: #fff;
            }

            &.chooseMarkDay {
              color: #5b5b5b;
            }

            &.nolm {
              color: #bfbfbf;
            }

            &.disableDate {
              color: #bfbfbf;
            }
          }

          .isWorkDay {
            color: #25272a;
          }

          .notSigned {
            font-style: normal;
            width: 8rpx;
            height: 8rpx;
            background: #fa7268;
            border-radius: 10rpx;
            position: absolute;
            left: 50%;
            bottom: 0;
            pointer-events: none;
          }

          .today {
            // color: #fff;
            // background-color: #a0eac1;
          }

          .workDay {
            font-style: normal;
            width: 8rpx;
            height: 8rpx;
            background: #4d7df9;
            border-radius: 10rpx;
            position: absolute;
            left: 50%;
            bottom: 0;
            pointer-events: none;
          }

          .markDays {
            font-style: normal;
            position: absolute;
            top: 2rpx;
            right: 11rpx;
            pointer-events: none;
            font-size: 80rpx;
            color: rgba(160, 234, 193, 0.5);
          }
        }
      }
    }
  }
}
</style>
