var fs = require('fs'), url = require('url');
var mimes = '...'.split(",");
module.exports= function (request, response) {  
		// 解析请求，包括文件名
		request.setEncoding("utf-8");
		var pathname = url.parse(request.url).pathname;
		if(!pathname||!pathname.substr(1)){
			pathname="index.html";//如果没有明确请求路径,默认转到主页.
		}
		pathname=decodeURI(pathname);
		if(/.*favicon\.io$/gi.test(pathname)){
			response.writeHead(200, {'Content-Type': 'text'});	
			response.write("No Favicon!");
			response.end();//不处理favicon的请求.
		}else if(/\/.*/.test(pathname)){
			pathname=pathname.substr(1);
		}
			// 输出请求的文件名
			console.log("Request for " + pathname + " received.");
			console.info(request);
			// 从文件系统中读取请求的文件内容
			fs.readFile(pathname, function (err, data) {
				console.info(arguments);
				if (err) {
					console.log(err);
					// HTTP 状态码: 404 : NOT FOUND
					// Content Type: text/plain
					response.writeHead(404, {'Content-Type': 'text/html'});
				}else{	         
					// HTTP 状态码: 200 : OK
					// Content Type: text/plain
					response.writeHead(200, {'Content-Type': 'text/html'});	
					
					// 响应文件内容
					response.write(data.toString());		
				}
				//  发送响应数据
				response.end();
			});  
	};
	