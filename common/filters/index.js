/**
 * 站内信 时间过滤器
*/
import { i18n } from "@/main";

export function formatMessageDate (dateString) {
  // 将给定的日期字符串转换为 Date 对象
  const givenDate = new Date(dateString);
  // 获取今天的日期
  const today = new Date();
  // 年份
  const isYear = givenDate.getFullYear() === today.getFullYear()
  // 月份
  const isMonth = givenDate.getMonth() === today.getMonth()
  // 同一天
  const isToday = isYear && isMonth && givenDate.getDate() === today.getDate();
  // 昨天
  const isYesterday = isYear && isMonth && givenDate.getDate() === today.getDate() - 1;
  
  // 判断是否同一天
  if (isToday && dateString.length >= 8) {
    return dateString.substring(dateString.length - 8)
  } else if (isYesterday) {
    // 判断是否 昨天
    return `${i18n.t('昨天')} ${dateString.substring(dateString.length - 8)}`
  } else if (isYear) {
    // 判断是否 今年
    return dateString.substring(5)
  }
  
  return dateString
}