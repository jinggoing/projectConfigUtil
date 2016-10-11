/*
* @Author: jinxiong.hou
* @Date:   2016-10-11 15:54:37
* @Last Modified by:   jinxiong.hou
* @Last Modified time: 2016-10-11 16:06:06
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
	    // parse a file upload
	    var form = new multiparty.Form();
	    //设置编辑
	    form.encoding = 'utf-8';
	    //设置文件存储路径
	    form.uploadDir = "uploads/";
	    //设置单文件大小限制 
	    form.maxFilesSize = 2 * 1024 * 1024;
	    //form.maxFields = 1000;  设置所以文件的大小总和
	    form.parse(req, function(err, fields, files) {		 
		  console.log('Upload completed!');
		  return true;
	    });
	  }
	},
	//解压
	unZip:function(zipFile){
		//zipFile = 'uploads/m9bV4flflZIQbcfLqEfNv64O.zip';
		try{
			fs.createReadStream(zipFile).pipe(unzip.Extract({ path: 'unzip/' }));
			return true;
		}catch(e){
			console(e);
			return false;
		}
	},
	//读取文件夹结构和文件内容
	readFolder : function(){
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
		return output;
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
