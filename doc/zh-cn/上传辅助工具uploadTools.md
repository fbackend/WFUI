一般来讲 uploadTools 不会单独去引，因为要用到上传辅助模块，就必然会用到上传模块，除非你想自己去扩展额外的上传模块。

### 获取系统上传配置

通过调用`uploadTools.configure(TOKEN_INFO,OUTER_PARAM_OBJECT)`，可获取系统相关的上传参数。
- TOKEN_INFO ：上传凭证信息
- OUTER_PARAM_OBJECT ：外部参数

| 属性名  | 说明  | 类型  |
| ------------ | ------------ | ------------ |
| type  | 上传配置类型：Oss/Local/Qiniu  | string  |
| headers  | 上传的请求头  |  object |
| params  | 上传的参数（包含外部参数）  | object  |


### 获取系统上传信息

调用方法：`uploadTools.getSysUploadInfo();`

返回参数：

| 属性名  | 说明  | 类型  |
| ------------ | ------------ | ------------ |
| tokenInfo  | 上传凭证信息  | object  |
| upgradeURL  | 上传的地址  |  string |

