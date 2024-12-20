//
//  ZGBankPayManager.h
//  payMoneyDemo
//
//  Created by 潘鹏飞 on 2019/10/31.
//  Copyright © 2019 潘鹏飞. All rights reserved.
//

#import <Foundation/Foundation.h>
//#import "ZGBankPayManager.h"

NS_ASSUME_NONNULL_BEGIN

//支付方式枚举值
typedef enum : NSUInteger {
    BocAasPayWayTypeWeChatPay,   //微信支付
    BocAasPayWayTypeAliPay,    //支付宝支付
    BocAasPayWayTypeBocPay,  //银行支付
} BocAasPayWayType;

//result错误码
typedef enum : NSUInteger {
    BocAasPayResultType_Success = 2000,    /**成功*/
    BocAasPayResultType_BOC_PullSuccess = 3000,    /**正常唤起中行APP(不代表支付结果)*/
    BocAasPayResultType_BOC_NotInstall = 3001,  /**未安装中行的APP*/
    BocAasPayResultType_BOC_NotInit = 3002,    /**支付SDK没有初始化*/
    BocAasPayResultType_BOC_PullError = 3003,  /**中行APP拉起其他错误*/
    BocAasPayResultType_Fail_Cancle = 4004,    /**用户取消支付*/
    BocAasPayResultType_Dealing = 4201,    /**处理中*/
    BocAasPayResultType_Failure = 4005,    /**失败*/
    BocAasPayResultType_Error_Unconnect = 4202,    /**网络错误*/
    BocAasPayResultType_Channel_Wrong = 4003,    /**渠道信息错误*/
    BocAasPayResultType_Error_Change_Paramter = 4002,    /**参数信息错误*/
    BocAasPayResultType_Error_WeChat_NotInstall = 4101,    /**未安装微信*/
    BocAasPayResultType_Error_WeChat_NotSupport = 4102,    /**微信不支持*/
    BocAasPayResultType_Error_WeChat_UnknowWrong = 4103,    /**微信未知错误*/
} BocAasPayResultType;

//环境信息
typedef enum : NSUInteger {
    BocAasEnviromentTypeCU = 800, /**CU环境*/
    BocAasEnviromentTypeQU = 801,  /**QU环境*/
    BocAasEnviromentTypeBU = 802,  /**BU环境(生产环境)*/
} BocAasEnviromentType;

@interface BocAasPayManager : NSObject

+ (instancetype)shareManager;

#pragma mark - 注册

/**
 *  注册微信:在appdelegate里的- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions方法里注册
 *
 *  @param appid           商户在微信开放平台申请开发APP应用后，微信开放平台会生成APP的唯一标识APPID
 *  @param universalLink 微信开发者Universal Link
 *  @return 成功返回YES，失败返回NO
 */
- (BOOL)registerWechatPay:(NSString *)appid universalLink:(NSString *)universalLink;

/**
 *  注册BOC
 *
 *  @param  appid  根据应用名称和应用包名生成的appid
 */
- (void)registerBocPay:(NSString *)appid;

/**
 *  注册支付宝
 *
 *  @param  schemes  可以自定义,建议起名稍复杂一些，尽量避免与其他程序冲突。
 *                  允许英文字母和数字，首字母必须是英文字母，不允许特殊字符
 */
- (void)registerAliPaySchemes:(NSString *)schemes;

/**
 *  设置环境信息(非必须,若不设置,默认生产环境)
 *
 *  @param  isProduction  生产环境:YES  测试环境:NO
 */
- (void)setEnvironmentWithProduction:(BOOL)isProduction;

#pragma mark - 拉起支付

/**
 *  SDK拉起支付
 *
 *   @param  type  支付宝支付、微信支付、澳中行支付
 *   @param  payOrderString  支付要素
 *   @param  appid  调用支付的app注册在info.plist中的appid
 *   @param  completionBlock  支付结果回调block
 */
- (void)pay:(BocAasPayWayType)type payOrderString:(NSString *)payOrderString appid:(NSString *)appid withCompletion:(void(^)(BocAasPayResultType result))completionBlock;


#pragma mark - 回调信息

/**
 * 支付宝、BOC----接受并处理支付结果
 *需要在 application:openURL:中调用
 *
 *  @param  url  跳转的url
 *  @param  completionBlock 支付结果回调block
 */
- (void)BocAasHandleUrl:(NSURL *)url options:(NSDictionary<NSString *,id> *)options withCompletion:(void(^)(BocAasPayResultType result))completionBlock;

/**
 * 微信支付----接受并处理支付结果
 * 需要在 application:continueUserActivity:restorationHandler:中调用
 *
 *  @param  userActivity  微信启动第三方应用时系统API传递过来的userActivity
 *  @param  completionBlock 支付结果回调block
 *  @return  成功返回YES 失败返回NO
*/
- (BOOL)HandleOpenUniversalLink:(NSUserActivity *)userActivity withCompletion:(void(^)(BocAasPayResultType result))completionBlock;

#pragma mark - 显示收银台界面
/**
 *  显示收银台界面
 *
 *  @param  payToken  令牌
 *  @param  publishKey  公钥
 *  @param  envirType  环境(若不设置环境,默认生产环境)
 *  @param  marketInfo  营销信息
 *  @param  language  语言  繁体:TC  英文:EN
 *  @param  payMethods  ----微信:WECHATPAY,支付宝:ALIPAY,直销:BOCPAY
 *  @param  completionBlock  支付结果回调block
*/
+ (void)showPayView:(NSString *)payToken
                  publishKey:(NSString *)publishKey envirType:(BocAasEnviromentType)envirType
                  marketInfo:(NSString *)marketInfo
                    language:(NSString *)language
                  payMethods:(NSArray *)payMethods
              withCompletion:(void(^)(BocAasPayResultType result))completionBlock;

@end

NS_ASSUME_NONNULL_END
