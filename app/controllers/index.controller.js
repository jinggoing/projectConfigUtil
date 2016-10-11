
/*
* @Author: jinggoing
* @Date:   2016-10-11 10:53:21
* @Last Modified by:   jinxiong.hou
* @Last Modified time: 2016-10-11 16:30:21
*/

var multiparty = require('multiparty');
var http = require('http');
var util = require('util');
var fs = require('fs')
var fr = require('./folderRead.js');
var JSZip = require('jszip');
var zip = JSZip();
var unzip =require('unzip');


module.exports = {
	//上传zip文件
	upload : function(req, res) {
	  if (req.url === '/upload' && req.method === 'POST') {
	  	var count =0;
	    // parse a file upload
	    var form = new multiparty.Form();
	    //设置编辑
	    form.encoding = 'utf-8';
	    //设置文件存储路径
	    form.uploadDir = "uploads/";
	    //设置单文件大小限制 
	    form.maxFilesSize = 2 * 1024 * 1024;
	    //form.maxFields = 1000;  设置所以文件的大小总和

	    form.on('part', function(part) {
		  // You *must* act on the part by reading it 
		  // NOTE: if you want to ignore it, just call "part.resume()" 
		  if (!part.filename) {
		    // filename is not defined when this is a field and not a file 
		    console.log('got field named ' + part.name);
		    // ignore field's content 
		    part.resume();
		  }
		 
		  if (part.filename) {
		    // filename is defined when this is a file 
		    count++;
		    console.log('got file named ' + part.name);
		    // ignore file's content here 
		    part.resume();
		  }
		});
		form.on('close', function() {
		  console.log('Upload completed!');
		  res.writeHead(200, {'content-type': 'text/plain'});
		  res.end('Received ' + count + ' files');
		});
		
	    form.parse(req);
	  }
	},
	//解压
	unZip:function(req, res){
		fs.createReadStream('uploads/m9bV4flflZIQbcfLqEfNv64O.zip').pipe(unzip.Extract({ path: 'unzip/' }));
		res.writeHead(200, {'content-type': 'text/plain'});
		console.log('unzip completed');
  		res.end('unzip completed');
	},
	//读取文件夹结构和文件内容
	readFolder : function(req, res){
		var fileArr = fr.getAllFiles('unzip/',function(){});
		var output = {};
		var wakeup = {};
		var config = {};
		var provision = {};
		for(var i=0;i<fileArr.length;i++){
			var file = fileArr[i];
			var fileExt=file.substring(file.lastIndexOf('.')).toLowerCase();
			var fileSplit = file.split("/");
			var brand = fileSplit[1]+'-'+fileSplit[2];
			if(fileExt==='.param'){
				var data = fs.readFileSync(file,'utf-8');
				wakeup[brand] = data;
			}
			if(fileExt==='.properties'){
				var data = fs.readFileSync(file,'utf-8');
				config[brand] = data;
			}
			if(fileExt==='.provision'){
				provision[brand] = file;
			}
		}
		output.wakeup = wakeup;
		output.config = config;
		output.provision = provision;
		console.log(provision['zsh-V3-6735']);
		res.json(output);
	},
	readZip:function(req, res){
		fs.readFile("uploads/0vzGk6a-9CMy2SOYR8U6U33h.zip", function(err, data) {
		    if (err) throw err;
		    JSZip.loadAsync(data).then(function (files) {
		    	console.log(files);
		    	for(file in files){
		    		console.log(file);
		    	}
		    	res.writeHead(200, {'content-type': 'text/plain'});
		  		res.end('files ' + files);
		        
		    });
		});
	}

}
