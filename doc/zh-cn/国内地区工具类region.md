
### 导入region模块
```javascript
imports: ['region']
```
` 数据为微信省市区抓取数据`

### 使用方法
```javascript
region((function (city) {
 	data.city=city;  //如果当前页需要调用多次工具，可以先赋值给当前页的全局变量
	city.getSource(); //获取全部省市区数据
	city.getProvince(provinceId);//传入id获取省级信息
	city.getProvinceName(provinceId);//传入id获取省级名称
	city.getSourceByName(name);//根据传入的省或市名称获取信息
	city.getCity(cityId);//获取市级信息
	city.getCityName(cityId);//获取市级名称
	city.getDist(distId);//获取区级信息
	city.getDistName(distId);//获取区级名称
}));

```






