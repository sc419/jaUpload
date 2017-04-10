
# jaUplaod.js

文件异步上传后路径回填表单

服务端可以是使用自己熟悉的语言写的客户端 或 其它第三方， 如: 七牛。

代码使用 `JavaScript` 编写，未使用 `jQuery` `Zepto` 等其它第三方的额 JS 库。



## 使用

引入

```html
<script src="ja.upload.js"></script>
````


HTML 代码结构

```html
<div class="form-group">
	<label>图片</label>

	<!-- 使用 data-upload 定义 配置 -->
	<input type="text" class="form-control" data-upload='{"type":"image"}'/>
</div>
````

JS 调用代码

```js
jaUpload('.form-control', {/* 公用配置 会被 input data-upload 覆盖 */});
```


## 可用参数

| 名称 | 类型 | 默认值 | 描述
| ---- | ---- | ------ | ----
| name | string | 'file' | 后台接收文件上传代码的 文件字段名称
| url |  string | `''` | 文件上传路径，默认空 当前网址
| type | bool string | false | 文件类型 可填 `'image'`
| btn_name | string | '上传文件' | 按钮显示的文字
| btn_uploading | string | '上传 ...' | 上传中 按钮显示的文字
| btn_class | string | 'btn btn-sm btn-success' | 按钮 class
| value | function bool string | false | 默认 false 直接填入上传文件后的返回值，可以是 返回值的键名 如: `file.path` 代表返回数据的 `r['file']['path']`，也可以是 处理函数
| max_size | number | 1024 * 1024 * 2 | 文件大小限制
| data | object | {} | 附加数据  字段可以使用 {date} {time} {U} {name} {size} 代表变量
| bottom | number | 0 | 按钮定位
| right | number | 0 | 按钮定位
| margin | number | 0 | 边距
| readonly | bool | true | 是否设定 input 只读




## DEMO


Yii2 框架使用 yiidoc/yii2-redactor 上传的配置

```js
{
	url: '*****', // 上传地址
	value: 'filelink'
}
```



使用 七牛 上传的配置

```js
{
	// 上传地址
	url: 'http://up-z2.qiniu.com/',

	// 表单附加数据 这里 用作 七牛认证
	data: {
		key: '{date}-{U}-{name}',
		token: '' // 七牛 token
	},

	// 上传完成后返回数据的处理
	value: function(a, d){
		var _u = 'http://oo5fdwvf6.bkt.clouddn.com/'+a.key;
		if(_img = d.parentNode.querySelector('img')){
			_img.src = _u;
		}
		return _u;
	}
});
```

