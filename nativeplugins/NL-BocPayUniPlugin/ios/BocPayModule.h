//
//  BocPayModule.h
//  NLBocPayUniPlugin
//
//  Created by 范文华 on 2024/5/21.
//

#import <Foundation/Foundation.h>
// 引入 DCUniModule.h 头文件
#import "DCUniModule.h"

NS_ASSUME_NONNULL_BEGIN

@interface BocPayModule : DCUniModule

#pragma mark - 注册
/**
 *  注册微信
 *
 *  @param appid           商户在微信开放平台申请开发APP应用后，微信开放平台会生成APP的唯一标识APPID
 *  @param universalLink 微信开发者Universal Link
 *  @return 成功返回YES，失败返回NO
 */
- (NSString *)registerWechatPay:(NSString *)appid universalLink:(NSString *)universalLink;

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


/**
 *   支付结果状态码
 *
 *   200：成功；
 *   201：正常唤起中行APP(不代表支付结果)；
 *   202：未安装中行的APP；
 *   203：支付SDK没有初始化；
 *   204：中行APP拉起其他错误；
 *   205：用户取消支付；
 *   206：处理中；
 *   207：失败；
 *   208：网络错误；
 *   209：渠道信息错误；
 *   210：参数信息错误；
 *   211：未安装微信；
 *   212：微信不支持；
 *   213：微信未知错误
 */
#pragma mark - 拉起支付
/**
 *   SDK拉起支付
 *
 *   @param  options对象  ["type": "", "payOrderString": "", "appid": ""]
 *   @param  type  支付宝支付：BocAasPayWayTypeAliPay；微信支付：BocAasPayWayTypeWeChatPay；澳中行支付：BocAasPayWayTypeBocPay
 *   @param  payOrderString  支付要素
 *   @param  appid  调用支付的app注册在info.plist中的appid
 *   @param  completionBlock  支付结果回调block
 */
- (void)pay:(NSDictionary *)options withCompletion:(UniModuleKeepAliveCallback)completionBlock;

/**
 *   SDK拉起支付
 *
 *   @param  type  支付宝支付：BocAasPayWayTypeAliPay；微信支付：BocAasPayWayTypeWeChatPay；澳中行支付：BocAasPayWayTypeBocPay
 *   @param  payOrderString  支付要素
 *   @param  appid  调用支付的app注册在info.plist中的appid
 *   @param  completionBlock  支付结果回调block
 */
- (void)pay:(NSString *)type
payOrderString:(NSString *)payOrderString
      appid:(NSString *)appid
withCompletion:(UniModuleKeepAliveCallback)completionBlock;

#pragma mark - 显示收银台界面
/**
 *  显示收银台界面
 *
 *  @param  options对象  @{@"payToken": @"", @"publishKey": @"", @"envirType": @"", @"marketInfo": @"", @"language": @"", @"payMethods": @[@""]}
 *  @param  payToken  令牌
 *  @param  publishKey  公钥
 *  @param  envirType  环境(若不设置环境,默认生产环境)  生产环境：BocAasEnviromentTypeBU；测试环境：BocAasEnviromentTypeCU、BocAasEnviromentTypeQU
 *  @param  marketInfo  营销信息
 *  @param  language  语言  繁体:TC  英文:EN
 *  @param  payMethods  ----微信:WECHATPAY,支付宝:ALIPAY,直销:BOCPAY
 *  @param  completionBlock  支付结果回调block
 */
- (void)showPayView:(NSDictionary *)options withCompletion:(UniModuleKeepAliveCallback)completionBlock;

/**
 *  显示收银台界面
 *
 *  @param  payToken  令牌
 *  @param  publishKey  公钥
 *  @param  envirType  环境(若不设置环境,默认生产环境)  生产环境：BocAasEnviromentTypeBU；测试环境：BocAasEnviromentTypeCU、BocAasEnviromentTypeQU
 *  @param  marketInfo  营销信息
 *  @param  language  语言  繁体:TC  英文:EN
 *  @param  payMethods  ----微信:WECHATPAY,支付宝:ALIPAY,直销:BOCPAY
 *  @param  completionBlock  支付结果回调block
 */
- (void)showPayView:(NSString *)payToken
         publishKey:(NSString *)publishKey
          envirType:(NSString *)envirType
         marketInfo:(NSString *)marketInfo
           language:(NSString *)language
         payMethods:(NSArray *)payMethods
     withCompletion:(UniModuleKeepAliveCallback)completionBlock;

@end

NS_ASSUME_NONNULL_END
