// 引用方式
var jpushModule = uni.requireNativePlugin("JG-JPushGoogle");
console.log('【sk】【引用方式】【jpushModule】【requireNativePlugin】')

// 开启 debug 模式，默认是关闭
function openDebug() {
  jpushModule.setLoggerEnable(true);
}

// 关闭 debug 模式，默认是关闭
function closeDebug() {
  jpushModule.setLoggerEnable(false);
}

// 获取 RegistrationID，只有当应用程序成功注册到 JPush 的服务器时才返回对应的值，否则返回空字符串
function getRegistrationID(skBack) {
  jpushModule.getRegistrationID(result => {
    // code number  状态码 0 - 成功， 1011 - iOS模拟器调用会报此错误
    // registerID   string  返回的 registrationID
    console.log('【sk】获取 RegistrationID=>', result)
    skBack(result)
  })
}

// 跳转至系统设置页面，0 - 成功 1 - 失败
function openSettingsForNotification() {
  jpushModule.openSettingsForNotification((result) => {
    // code number  0 - 成功 1 - 失败
    console.log('【sk】跳转至系统设置页面result=>', result.code)
  })
}

// 初始化SDK iOS 说明:如果在mainfest.json里 将JPUSH_DEFAULTINITJPUSH_IOS值配置为"true"，插件内部将默认初始化JPush，用户则不需要调用该初始化方法。
function initJPushService() {
  jpushModule.initJPushService()
}

// 连接状态回调，true - 已连接, false - 未连接
function addConnectEventListener(skBack) {
  jpushModule.addConnectEventListener(result => {
    // connectEnable    boolean true - 已连接, false - 未连接
    console.log('【sk】连接状态回调=>', result.connectEnable)
    skBack(result.connectEnable);
  })
}

// 通知事件回调
function addNotificationListener(skBack) {
  jpushModule.addNotificationListener(result => {
    // messageID    string  唯一标识通知消息的 ID
    // title    string  对应 Portal 推送通知界面上的“通知标题”字段
    // content  string  对应 Portal 推送通知界面上的“通知内容”字段
    // badge    string  对应 Portal 推送通知界面上的可选设置里面的“badge”字段 (ios only)
    // ring string  推送通知界面上的可选设置里面的“sound”字段 (ios only)
    // extras   dictionary  对应 Portal 推送消息界面上的“可选设置”里的附加字段
    // iOS  dictionary  对应原生返回的通知内容，如需要更多字段请查看该字段内容
    // android  dictionary  对应原生返回的通知内容，如需要更多字段请查看该字段内容
    // notificationEventType    string  分为notificationArrived和notificationOpened两种
    console.log('【sk】通知事件回调result=>', result)
    skBack(result);
  })
}

// 自定义消息事件回调
function addCustomMessageListener(skBack) {
  jpushModule.addCustomMessageListener(result => {
    // messageID    string  唯一标识通知消息的 ID
    // content  string  对应 Portal 推送通知界面上的“通知内容”字段
    // extras   dictionary  对应 Portal 推送消息界面上的“可选设置”里的附加字段
    console.log('【sk】自定义消息事件回调result=>', result)
    skBack(result);
  })
}

// 应用内消息回调
function addInMessageListener(skBack) {
  jpushModule.addInMessageListener(result => {
    // eventType    string  show - 应用内消息展示 disappear - 应用内消息已消失 click - 应用内消息点击
    // messageType  string  消息类型, eventType 不为 disappear时返回, inMessageNoti - 通知类型的inMessage
    // content  dictionary  应用内消息内容, eventType 不为 disappear 时返回
    console.log('【sk】应用内消息回调result=>', result)
    skBack(result);
  })
}

// 本地通知事件回调
function addLocalNotificationListener(skBack) {
  jpushModule.addLocalNotificationListener(result => {
    // messageID    string  唯一标识通知消息的ID
    // title    string  对应“通知标题”字段
    // content  string  对应“通知内容”字段
    // extras   dictionary  对应“附加内容”字段
    console.log('【sk】本地通知事件回调result=>', result)
    skBack(result);
  })
}

// 添加一个本地通知
function addLocalNotification(e) {
  jpushModule.addLocalNotification({
    messageID: e.messageID ? e.messageID : '', // 唯一标识通知消息的ID
    title: e.title ? e.title : '', // 对应“通知标题”字段
    content: e.content ? e.content : '', // 对应“通知内容”字段
    extras: e.extras ? e.extras : { name: '', age: '' } // 对应“附加内容”字段
  })
}

// 移除指定的本地通知
function removeLocalNotification(e) {
  jpushModule.removeLocalNotification({
    messageID: e.messageID ? e.messageID : '' // 唯一标识通知消息的ID
  })
}

// 移除所有的本地通知
function clearLocalNotifications() {
  jpushModule.clearLocalNotifications()
}

// 标签别名事件回调
function addTagAliasListener(skBack) {
  jpushModule.addTagAliasListener(result => {
    // code number  请求状态码 0 - 成功
    // sequence number  请求时传入的序列号,会在回调时原样返回
    // tags StringArray 执行tag数组操作时返回
    // tag  string  执行查询指定tag(queryTag)操作时会返回
    // tagEnable    boolean 执行查询指定tag(queryTag)操作时会返回是否可用
    // alias    string  对alias进行操作时返回
    console.log('【sk】标签别名事件回调result=>', result)
    skBack(result);
  })
}

// 新增标签
function addTags(e) {
  jpushModule.addTags({
    'tags': e.tags ? e.tags : [], // StringArray  string类型的数组
    'sequence': e.sequence ? e.sequence : 1 // number  请求时传入的序列号，会在回调时原样返回
  })
}

// 覆盖标签
function updateTags(e) {
  jpushModule.updateTags({
    'tags': e.tags ? e.tags : [], // StringArray  string类型的数组
    'sequence': e.sequence ? e.sequence : 1 // number  请求时传入的序列号，会在回调时原样返回
  })
}

// 删除指定标签
function deleteTags(e) {
  jpushModule.deleteTags({
    'tags': e.tags ? e.tags : [], // StringArray  string类型的数组
    'sequence': e.sequence ? e.sequence : 1 // number  请求时传入的序列号，会在回调时原样返回
  })
}

// 清除所有标签
function cleanTags(e) {
  jpushModule.cleanTags({
    'sequence': e.sequence ? e.sequence : 1 // number  请求时传入的序列号，会在回调时原样返回
  })
}

// 查询指定 tag 与当前用户绑定的状态
function queryTag(e) {
  jpushModule.queryTag({
    'tag': e.tag ? e.tag : '', // string  需要查询的标签
    'sequence': e.sequence ? sequence : 1 // number  请求时传入的序列号，会在回调时原样返回
  })
}

// 查询所有标签
function getAllTags(e) {
  jpushModule.getAllTags({
    'sequence': e.sequence ? e.sequence : 1 // number  请求时传入的序列号，会在回调时原样返回
  })
}

// 设置别名
function setAlias(e) {
  jpushModule.setAlias({
    'alias': e.alias ? e.alias : '', // string  有效的别名组成：字母（区分大小写）、数字、下划线、汉字、特殊字符@!#$&*+=.|
    'sequence': e.sequence ? e.sequence : 1 // number  请求时传入的序列号，会在回调时原样返回
  })
}

// 删除别名
function deleteAlias(e) {
  jpushModule.deleteAlias({
    'sequence': e.sequence ? e.sequence : 1 // number  请求时传入的序列号，会在回调时原样返回
  })
}

// 查询别名
function queryAlias(e) {
  jpushModule.queryAlias({
    'sequence': e.sequence ? e.sequence : 1 // number  请求时传入的序列号，会在回调时原样返回
  })
}

// 开启 CrashLog 上报
function initCrashHandler() {
  jpushModule.initCrashHandler()
}

// 设置地理围栏的最大个数
function setMaxGeofenceNumber(e) {
  jpushModule.setMaxGeofenceNumber(e.geofenceNumber ? e.geofenceNumber : 10) // 默认值为 10 ，iOS系统默认地理围栏最大个数为20
}

// 删除指定id的地理围栏
function deleteGeofence(e) {
  jpushModule.deleteGeofence(e.geofence ? e.geofence : '') // 删除指定id的地理围栏
}

// 设置 Badge
function setBadge(e) {
  plus.runtime.setBadgeNumber(e.badge)
  jpushModule.setBadge(e.badge ? e.badge : 0) // number
}

// 设置手机号码
function setMobileNumber(e) {
  jpushModule.setMobileNumber({
    sequence: e.sequence ? e.sequence : 1, // number  请求时传入的序列号,会在回调时原样返回
    mobileNumber: e.mobileNumber ? e.mobileNumber : '' // string  手机号码 会与用户信息一一对应。可为空，为空则清除号码。
  })
}

// 设置手机号码回调
function addMobileNumberListener(skBack) {
  jpushModule.addMobileNumberListener(result => {
    // code number  状态码 0 - 成功
    // sequence number  请求时传入的序列号,会在回调时原样返回
    console.log('【sk】设置手机号码回调result=>', result)
    skBack(result);
  })
}


module.exports = {
  openDebug,
  closeDebug,
  getRegistrationID,
  openSettingsForNotification,
  initJPushService,
  addConnectEventListener,
  addNotificationListener,
  addCustomMessageListener,
  addInMessageListener,
  addLocalNotificationListener,
  addLocalNotification,
  removeLocalNotification,
  clearLocalNotifications,
  addTagAliasListener,
  addTags,
  updateTags,
  deleteTags,
  cleanTags,
  queryTag,
  getAllTags,
  setAlias,
  deleteAlias,
  queryAlias,
  initCrashHandler,
  setMaxGeofenceNumber,
  deleteGeofence,
  setBadge,
  setMobileNumber,
  addMobileNumberListener
}