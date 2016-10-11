
/*
* @Author: jinggoing
* @Date:   2016-10-11 10:53:21
* @Last Modified by:   jinxiong.hou
* @Last Modified time: 2016-10-11 17:07:06
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

	    form.parse(req, function(err, fields, files) {
	      var filesTmp = JSON.stringify(files,null,2);
	  
	      if(err){
	        console.log('parse error: ' + err);
	      } else {
	        console.log(files);
	        var inputFile = files.upload[0];
	        var uploadedPath = inputFile.path;
	        var dstPath = './uploads/' + inputFile.originalFilename;
	        //重命名为真实文件名
	        fs.rename(uploadedPath, dstPath, function(err) {
	          if(err){
	            console.log('rename error: ' + err);
	          } else {
	            console.log('rename ok');
	          }
	        });
	      }
	      res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
	      res.write('received upload:\n\n');
	      res.end(util.inspect({fields: fields, files: filesTmp}));
	   });
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
