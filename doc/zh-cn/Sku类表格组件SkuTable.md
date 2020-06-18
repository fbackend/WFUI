## SkuTable
SkuTable模块用于渲染类Sku等树结构表格，具有跨行合并展示的特点。
使用SkuTable，你必须要导入该模块：

`imports: ['SkuTable']`

除此之外，如果包含图片上传，还需要确保工程内拥有**uploads，uploadTools**模块(无需依赖)

## 使用方法
和大多数模块不同，由于渲染逻辑的特殊性，SkuTable的使用方法包括**定义**和**渲染**两个核心部分。


### 术语
- 数据单元 参与SkuTable渲染的数据最小单元，也称之为**节点**
- 父节点 每个数据单元所属的大类

### 声明

```javascript
vars.sku = new SkuTable({
                    el: "skuDemo",//ID （不带#号）
                    childrenNodeName: "children",//子节点集合的属性名
                    nodeName: "fullName",//节点名称的属性名
                    source: vars.source,//节点源
                    order: "id",//排序编号字段
                    expand: [
                        {
                            title: "SKU图片",
                            name: "img",
                            require: true,
                            width: 200,
                            height: 120,
                            disabled: true,
                            type: "img",
                        },
                        {
                            title: "SKU编码",
                            name: "sku_no",
                            type: "text",
                            require: true,
                            disabled: false
                        },
                        {
                            title: "售价",
                            name: "sales_price",
                            type: "number",
                            require: true,
                            disabled: false
                        },
                        {
                            title: "吊牌价",
                            name: "market_price",
                            type: "number",
                            require: true,
                            disabled: false
                        },
                        {
                            title: "当前库存",
                            name: "stock",
                            type: "number",
                            require: false,
                            disabled: true
                        },
                        {
                            title: "库存增/减",
                            name: "modified_stock",
                            type: "number",
                            require: true,
                            disabled: false
                        },
                        {
                            title: "当前销量",
                            name: "actual_sales",
                            type: "number",
                            require: false,
                            disabled: true
                        },
                        {
                            title: "起始销量",
                            name: "custom_start_sales",
                            type: "number",
                            require: true,
                            disabled: false
                        },
                        {
                            title: "体积",
                            name: "volume",
                            type: "number",
                            require: true,
                            disabled: false
                        },
                        {
                            title: "重量",
                            name: "weight",
                            type: "number",
                            require: false,
                            disabled: false
                        },
                        {
                            title: "状态",
                            name: "is_enabled",
                            type: "checkbox",
                            require: true,
                            disabled: false,
                            text: "开启|禁用",
                            onclick: function (currentDom, rowDom) {
                                rowDom.querySelectorAll("[name]").forEach(e => {
                                    e.readOnly = !currentDom.checked;
                                });
                            },
                            props: [
                                {
                                    name: "lay-prop",
                                    value: "asfa"
                                },
                            ]
                        }
                    ],

                })
```

### 渲染

```
//demo
var sku = new SkuTable({...});
sku.render(节点);
```

## 可配置项

| 属性名称  | 说明  | 类型  | 是否必须 |默认值  | 示例 |
| :------------: | :------------: | :------------: | :------------: | :------------: | :------: |
| debug  | 是否打开调试模式  | bool  | false  |   |   |
| el  | 渲染的容器ID（不要写“#”号）| string  | √  | treeTable | |
| source  | 具有两级树结构的数据单元/节点源  | array  | √  | []  |   |
| nodeName  | 节点名称的属性名  | string  |   | specName  |   |
| childrenNodeName  | 子节点集合的属性名  | string  |   | specList  |   |
| sort  | 排序字段名，控制节点的列展示先后顺序  | string  |   | sort  |   |
| pid  | 父节点关联字段  | string  |   | pid  |   |
| expand  | 扩展列定义  | array  |   | []  |   |
| expand.[i].title  | 列标题  | string  | √  |   |   |
| expand.[i].name  | 扩展列对应的属性名称  | string  |   |   |   |
| expand.[i].type  | 展示的类型：img,number,text,checkbox,select,datetime,year,month,date,time,custom  | string  |   | text  |   |
| expand.[i].require  | 是否展示必填标识  | bool  |   | false  |   |
| expand.[i].width  | 宽度  | bool  |   | 80  |   |
| expand.[i].height  | 高度( type为img有效 )  | int  |   | 50  |   |
| expand.[i].keyGenerator  | 上传的key生成策略( type为img有效 )  | function(fileName):string  |   |   |   |
| expand.[i].disabled  | 是否禁用  | bool  |   | false  |   |
| expand.[i].text  | 显示的文本（ type为checkbox有效 ）  | string  |   | ON\OFF  |   |
| expand.[i].default  | 默认值（ type为checkbox有效 ）  | bool  |   | false  |   |
| expand.[i].onclick  | 扩展单元格点击事件  | function(?)  |   |   |   |
| expand.[i].domGenerator  | 自定义返回dom,type为custom时有效  | function(定义,数据详情,行对象,历史行对象,td,tr)  |   |   |   |
| expand.[i].source  | select类型的数据源对象  | array  |   | []  |   |
| expand.[i].sourceValueName  | select类型的数据源对象内value属性名称  | string  |   | id  |   |
| expand.[i].sourceDisplayName  | select类型的数据源对象内展示属性名称  | string  |   | name  |   |
| expand.[i].source[j].default  | 是否默认选中  | bool  |   | false  |   |
| expand.[i].props  | 自定义属性，每个属性对象包含name和value  | array  |   |   |   |
| details  | 数据详情数组  | array  |   | []  |   |
| groupIdNames  | 详情里的规格组合ID属性名称  | string  |   | specIds  |   |
| groupNames  | 详情里的规格组合属性名称  | string  |   | specNames  |   |
| groupSeparator  | 组合名默认分割字段  | string  |   | ,  |   ||



## 提供的方法

#### 获取SKU表格全部数据
`sku.getRows()`

#### 更新节点源数据
`sku.updateSource(sourceArray)`



