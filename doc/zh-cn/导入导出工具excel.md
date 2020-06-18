### 导入导出excel模块

```javascript
imports: ['excel']
```
### 使用方法
```javascript
//导出数据格式示例
var ret=[{
	"cityName": "北京市",
	"communityName": "复地国际公寓",
	"gmtCreate": 1537498638000,
	"id": 87913,
	"relativeUserName": "/",
	"relativeUserPhone": "13601064904",
	"roomNum": "2-1001"
}, {
	"cityName": "北京市",
	"communityName": "复地国际公寓",
	"gmtCreate": 1537498639000,
	"id": 87915,
	"relativeUserName": "/",
	"relativeUserPhone": "13811008344",
	"roomNum": "2-1017"
}]
```
### 导出数据处理方法
```javascript
//处理后台返回数据
ret=excel.filterExportData(ret,
{
  id: function(value){
    return{
	 //t代表单元格格式 b 布尔值, n 数字, e 错误, s 字符, d 日期
      t: 'n',
	  //v代表单元格的值
      v: value*10
    };
  },
  communityName: 'communityName',
  roomNum: function(value,line,data){
    return{
	 //v代表单元格的值
      v: line[  'cityName']+'~'+line[ 'communityName']+value,
	  //s代表样式alignment:
	  s: {
	   {
          horizontal: 'center',
          vertical: 'center',
        },
        font: {
          sz: 14,
          bold: true,
          color: {
            rgb: "FFFFFF"
          }
        },
        fill: {
          bgColor: {
            indexed: 64
          },
          fgColor: {
            rgb: "FF0000"
          }
        }
      },
    };
  },
  relativeUserName: 'relativeUserName',
  relativeUserPhone: 'relativeUserName',
  isIdentificated: function(value,line,data){
    return{
	 //v代表单元格的值
      v: value?"是": "否",
    };
  },
  gmtCreate: function(value){
    return{
	//v代表单元格的值  utils需要导入
     v: utils.formatDate(newDate(value),"yyyy-MM-dd HH:mm")
    };
  }
});
//导出数据加入表头
ret.unshift({
  id: 'id',
  cityName: '城市名',
  communityName: '小区名',
  roomNum: '房屋号',
  relativeUserName: '姓名',
  relativeUserPhone: '手机号',
  isIdentificated: '认证状态',
  gmtCreate: "时间"
  });
```
```javascript
//导出
excel.exportExcel(
    {"用户表":ret},//{sheet表名:数据}，数据为后台返回的list
	"用户管理表",//excel文件名
    'xlsx'//excel表格类型 xlsx;.xls
    );
```

```javascript
//导入
excel.importExcel(files,//上传文件
  {
  // 读取数据的同时梳理数据
  fields: {
	'username': 'B'
	, 'experience': 'C'
	, 'score': 'E'
  },
  //读取B2至E3区间的数据
  // range : "B2:E3"
  //从表格第二行开始读取
  range: 1,
}, function (data) {
  //导入数据提交后台
  fb.req.post("/test/excel", data,
	function (ret) {
	 layer.alert('success');
   }, function (ret) {
	 layer.alert('fail');
  });
});
```