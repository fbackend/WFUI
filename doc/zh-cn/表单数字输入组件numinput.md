## numinput
---
可对输入数字生成虚拟键盘。并对最大值、最小值、小数位数
---
#### 导入模块
`numinput`
#### 使用方法
```html
<input class="layui-input layui-input-number" min="0" max="100" data-prec="4">
```

```
对input加class“layui-input-number”。input的type必须为text。min为最小值，max为最大值，data-prec为小数位数。都不填默认为整数

默认情况numinput .init({});
全参数
numinput .init({
    // 123：123键置顶, 789：789键置顶
    topBtns: 123,
    // 右侧功能按钮
    rightBtns: true,
    // 监听键盘事件
    listening: true,
    // 批量配置默认小数精确度
    defaultPrec: ''
  });
```

