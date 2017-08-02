/**
 * input 保存文件路径的解决方法
 *
 *
**/

function jaUpload(selector, options){
	var selector = selector || '[data-upload]';
	var def_opt = {
		name: 'file',                              // 表单名
		url: '',                                  // 表单提交地址 默认(空: 当前页面地址)
		type: false,                             // 可填 image
		btn_name: '上传文件',                   // 按钮显示的文字
		btn_uploading: '上传 ...',             // 上传中 按钮显示的文字
		btn_class: 'btn btn-sm btn-success',  // 按钮 class
		value: false,                        // 默认 false 直接填入上传文件后的返回值，可以是 返回值的键名 `file.path` 代表返回数据的 `r['file']['path']`，也可以是 处理函数
		max_size: 1024 * 1024 * 2,          // 文件大小限制
		data: {},                          // 附加数据  字段可以使用 {date} {time} {U} {name} {size} 代表变量
		// image: '.ja-uplaod',           // 当 type=image 的时候 设置 src <img> 选择器 
		bottom: 0,                       // 位置 top bottom 二选一 left right 二选一,覆盖默认的 请填写 false
		right: 0,
		margin: 2,                     // 边距
		hidden: false,                // 是否隐藏原 input
		// position: 'relative',
		readonly: true                     // 是否设定 input 只读
	};

	// 创建指定元素
	var newDom = function(n){return document.createElement(n);};

	// 获取日期时间
	var getTime = function(){
		var t = new Date(),
		pad = function (value) {
			value = String(value);
			while (value.length < 2)  { value = '0' + value; }
			return value;
		},
		Y = t.getFullYear(),
		m = pad(t.getMonth() + 1),
		d = pad(t.getDay()),
		H = pad(t.getHours()),
		i = t.getMinutes(),
		s = t.getSeconds();
		return {date: [Y,m,d].join('-'), time: [H,i,s].join(':'), U: Math.floor(t / 1000)};
	};
	var after = function (n, t){
		var parent = t.parentNode;
		if( parent.lastChild == t){
			parent.appendChild(n, t);
		}else{
			parent.insertBefore(n, t.nextSibling);
		};
	};

	// 模板解析 {{key}}
	var _tpl = function(t, obj) {
		return t.replace(/\{[a-z]+\}/gi, function(matchs) {
			var returns = obj[matchs.replace(/[\{\}-]/g, "")];
			return (returns + "") == "undefined" ? "": returns;
		});
	};

	if('object' == typeof options)
		for(k in options) def_opt[k] = options[k];

	// 获取元素
	var doms = document.querySelectorAll(selector);

	[].forEach.call(doms, function(dom) {
		if(dom.jaUpload) return;
		var opt = [];
		for(k in def_opt) opt[k] = def_opt[k];

		dom.jaUpload = 1;

		// 获取配置
		try{
			data = JSON.parse(dom.getAttribute('data-upload'));
		} catch(err) {
			data = dom.getAttribute('data-upload');
		}

		data = data && typeof data == 'object' ? data : (data ? {type: data} : {});

		// 单个配置 获取追加 不建议使用 建议使用 `data-upload='{"url":"","max_size":1024}'` 代替
		['url', 'type', 'name', 'max_size', 'btn_name', 'btn_class', 'top', 'left', 'right', 'bottom', 'margin', 'padding'].forEach(function(k){
			var a;
			if(a = dom.getAttribute('data-upload-'+ k)){
				data[k] = a;
			}
		});
		// 追加配置
		for(k in data) opt[k] = data[k];

		// 父元素 定位方式
		if(!opt.hidden) dom.parentNode.style.position = 'relative'; // opt.position;

		opt.readonly && dom.setAttribute('readonly', 1);

		// 创建 `label`
		var label = newDom('label')
		if(!opt.hidden) label.style.position = 'absolute';
		['top', 'left', 'right', 'bottom', 'margin', 'padding'].forEach(function(k){
			if('undefined' != typeof opt[k] && opt[k] !== false){
				label.style[k] = opt[k] + (/^\d+$/.test(opt[k]) ? 'px' : '');
			}
		});

		// 创建 `botton`
		var botton = newDom('botton');
		botton.className = opt.btn_class;
		botton.innerText = opt.btn_name;
		label.appendChild(botton);

		// 创建 `input[type=file]`
		var input = newDom('input');
		input.style.display = 'none';
		input.type = 'file';

		// 文件选择后的处理
		input.onchange = function(){
			if(!this.files.length){return;}
			botton.innerText = opt.btn_uploading;
			
			var fd = new FormData(), d = getTime();
			d.name = this.files[0].name;
			d.size = this.files[0].size;
			fd.append(opt.name, this.files[0]);
			for(k in opt.data){
				fd.append(k, _tpl(opt.data[k], d));
			}

			// 文件上传
			var xhr = new XMLHttpRequest();
			xhr.open('POST', opt.url, true);
			xhr.onload = function(e) {
				botton.innerText = opt.btn_name;
				// 上传返回数据处理
				// console.log(xhr.status);
				if (xhr.status == 200 && xhr.responseText) {
					try{
						data = JSON.parse(xhr.responseText);
					} catch(err) {
						data = xhr.responseText;
					}
					if(typeof opt.value == 'function'){
						return dom.value = opt.value(data, dom);
					}else if(typeof opt.value == 'string'){
						var p = opt.value.split('.');
						if(p && data){
							try{
								return eval('dom.value = data["'+ p.join('"]["') +'"]');
							} catch(err) {}
						}
					}
					dom.value = xhr.responseText;
				}
			}
			xhr.send(fd);
		};
		if(opt.type == 'image') input.accept = 'image/*';
		label.appendChild(input);

		// 插入新建元素
		// dom.after(label); // 360、QQ 浏览器不可用
		after(label, dom);
		if(opt.hidden) dom.type = 'hidden';
	});

}
