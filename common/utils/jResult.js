import { getUserTel } from '@/api/user/userApi.js'
import { getOwnerCommunitys } from '@/api/community/communityApi.js'
import { hasLogin } from '@/lib/proprietor/page/Page.js'
import { userRegisterAlias } from '@/api/user/userApi.js'
import jPush from '@/common/utils/jpush.js'
import { readNotification } from "@/api/message/messageApi.js"
import { getUserId } from '../../api/user/userApi.js'
import { getCurOwner } from '@/api/owner/ownerApi.js'

// 点击消息
async function notificationResult(result) {
  const { notificationEventType, extras } = result
  if (notificationEventType === 'notificationOpened') {
    try {
      const { communityId } = await getCurOwner()
      
      // 不是同一个小区的消息
      if (communityId !== extras.communityId) {
        const list = await getOwnerCommunitys({
          communityId: extras.communityId,
          link: getUserTel()
        })
        
        // 设置选中小区
        uni.setStorageSync('currentCommunityInfo', list[0])
        uni.setStorageSync('ownerInfo', {
          memberId: list[0].memberId,
          ownerName: list[0].name,
          ownerId: list[0].ownerId,
          ownerTel: list[0].link,
          communityId: list[0].communityId,
          link: list[0].link,
          ownerTypeCd: list[0].ownerTypeCd
        })
        
        // 存储二维码数据
        // const data = await getOpenQr({
        //   iotApiCode: 'getOwnerAccessControlQRCodeInfoBmoImpl',
        //   communityId: extras.communityId,
        //   personId: list[0].memberId
        // })
        
        // // 保存二维码相关数据
        // uni.setStorageSync('qrData', { ...data, link: list[0].link })
      }
      
      // 把消息置为已读
      readNotification({
        communityId: list[0].communityId,
        userId: getUserId(),
        id: list[0].id
      })
      
      uni.navigateTo({
        url: extras.pageUrl
      })
    } catch (e) {
      // 删除二维码数据
      uni.removeStorageSync('qrData')
      console.log(e, 'notificationResult')
    }
  }
}

function tagAliasResult(result) {
  if (result.code === 0 && hasLogin()) {
    jPush.getRegistrationID(v => {
      if (v.code === 0) {
        // 注册
        const platform = uni.getSystemInfoSync().platform
        userRegisterAlias({ userId: result.alias, registrationId: v.registerID, platform })
      }
    })
  }
}

module.exports = {
  notificationResult,
  tagAliasResult
}