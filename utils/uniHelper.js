export const toast = (title, duration = 1500) => {
    // 确保 title 是字符串
    const message = String(title || '');
    
    // 直接调用 showToast，不需要 nextTick
    uni.showToast({
        title: message,
        icon: 'none',
        duration: duration,
        mask: false,
        position: 'top',
    });
} 

/** 是否是pc端 */
export const isPC = ()=>{
  if (["windows", "mac"].some((v) => v === uni.getStorageSync("platform"))) {
    return true;
  }
  if (Number(uni.getStorageSync("windowWidth")) > 1000) {
    return true;
  }
  return false;
}

