## uploads
---
本插件是基于官方upload插件改造版的二次封装。所以，你也可以使用官方的upload插件的属性。（部分属性将与本插件的属性互斥）

适用于单/多图片上传，可随意控制上传大小，个数限制，展现方式。

## 使用方法
---
#### 导入模块
`imports:"uploads"`

#### 初始化
`uploads.render(props)`

#### 可配置项
| 属性名称  | 说明  | 类型  | 是否必须  | 默认值 |
| ------------ | ------------ | ------------ | ------------ |------------ |
|container|初始化的容器el表达式|string|√||
|height|图片预览的高度|int|×|150|
|width|图片预览的宽度|int|×|150|
|upBG|图片底图|string|×|/fastboot/imgs/img-up-cover.png|
|debug|是否打开调试模式(控制台显示上传信息)|bool|×|false|
|input|表单元素配置,定制每个img所对应的name|object|×|{ name: ""}|
|maxCount|最大上传个数|int|×|1|
|src|初始图片|string[]|×|[]|
|upStyle|上传按钮样式类型(可选按钮型btn或img图片类型)|string|×|img|
|tokenInfo|上传的凭证信息|object|×|{}|
|scene|本地上传场景值|string|×|images|
|keyGenerator|上传的key生成策略|function(fileName):string|×||
|border|是否显示上传容器边框|bool|×|false|
|accept|允许上传的文件类型|string|x|'img','video','file'注：默认图片，修改后影响回显效果|
|data|追加额外的参数|object|×|{}|



