
/*
* @Author: jinggoing
* @Date:   2016-10-11 10:53:21
* @Last Modified by:   jinxiong.hou
* @Last Modified time: 2016-10-13 18:22:20
*/

var multiparty = require('multiparty');
var http = require('http');
var util = require('util');
var fs = require('fs');
var iconv = require('iconv-lite');
var unzip =require('unzip');
var zip = require("node-native-zip");
var archive = new zip();
var df = require('./deleteFolder.js')
var fr = require('./folderRead.js');
var unzipPath = 'src/unzip/';


module.exports = {
	//上传zip文件
	upload : function(req, res) {
		//req.setEncoding('utf-8');
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
	      	res.json({'success':false,'msg':'upload fail'});
	        console.log('parse error: ' + err);
	      } else {
	        var inputFile = files.upload[0];
	        var uploadedPath = inputFile.path;
	        var dstPath = './uploads/' + inputFile.originalFilename;
	        //重命名为真实文件名
	        fs.rename(uploadedPath, dstPath, function(err) {
	          if(err){
	            console.log('rename error: ' + err);
	          } else {
	            console.log('rename ok'+dstPath);
	            res.json({'success':true,'msg':'upload completed','filePath':dstPath});
	          }
	        });
	        
	      }	      
	   });
	  }
	},
	//解压
	unzip:function(req, res){		
		df.deleteFolder(unzipPath);
		fs.createReadStream(req.body.filePath).pipe(unzip.Extract({ path: unzipPath }));		
		console.log('unzip completed');
  		res.json({'success':true,'msg':'unzip completed'});
	},
	//读取文件夹结构和文件内容
	readFolder1 : function(req, res){
		var fileArr = fr.getAllFiles(unzipPath,function(){});
		var output = {};
		var wakeup = {};
		var config = {};
		var provision = {};
		for(var i=0;i<fileArr.length;i++){
			var file = fileArr[i];
			var fileExt=file.substring(file.lastIndexOf('.')).toLowerCase();
			var fileSplit = file.split("/");
			var brand = fileSplit[2]+'-'+fileSplit[3];
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
		output.success = true;
		output.msg = 'readFolder completed';
		//console.log(provision['zsh-V3-6735']);
		res.json(output);
	},
	//读取文件夹结构和文件内容
	readFolder : function(req, res){
		var fileArr = fr.getAllFiles(unzipPath,function(){});
		var output = {};
		var dataArr = [];
		var obj = {};
		var brand1 ='',brand2='';
		for(var i=0;i<fileArr.length;i++){
			var file = fileArr[i];
			var fileExt=file.substring(file.lastIndexOf('.')).toLowerCase();
			var fileSplit = file.split("/");
			if(i==0){
				obj.brand1 = fileSplit[2];
				obj.brand2 = fileSplit[3];
			}
			if(!(obj.brand1===fileSplit[2]&&obj.brand2 === fileSplit[3])){
				dataArr.push(obj);
				obj = {};
				obj.brand1 = fileSplit[2];
				obj.brand2 = fileSplit[3];
			}
			if(fileExt==='.param'){
				obj.wakeup = file;
			}
			if(fileExt==='.properties'){
				obj.properties = file;
			}
			if(fileExt==='.provision'){
				obj.provision = file;
			}
			if(i==fileArr.length-1){
				dataArr.push(obj);
			}

			
			
		}
		
		output.data = dataArr;
		output.success = true;
		output.msg = 'readFolder completed';
		//console.log(provision['zsh-V3-6735']);
		res.json(output);
	},

	readProperties:function(req, res){
		var filePath = req.body.filePath;
		var output = {};
		var data = fs.readFileSync(filePath,'utf-8');
		output.data = data;
		output.success = true;
		output.msg = 'readFile completed';
		res.json(output);
	},
	//压缩目录文件夹
	zipFolder:function(req, res){
		var fileArr = fr.getAllFiles(unzipPath,function(){});
		var files = [];
		for(var i=0;i<fileArr.length;i++){
			var file = fileArr[i];
			fileObj = {};
			fileObj.name = file.replace('src/unzip','');
			fileObj.path = './'+file;
			files.push(fileObj);
		}
		archive.addFiles(files, function (err) {
	        if (err){
	        	res.json({'success':false,'msg':'zip fail'});
	        	return console.log("err while adding files", err);
	    	}
	        var buff = archive.toBuffer();
	        fs.writeFile("./src/config.zip", buff, function () {
	            console.log("zip completed");
	            res.json({'success':true,'msg':'zip completed',file:'config.zip'});
	        });
	    });
		
	},

	writeFile : function(req, res){
	    // 测试用的中文  
	    var str = req.body.str;
	    var filePath = req.body.filePath;  
	    // 把中文转换成字节数组  
	    var arr = iconv.encode(str, 'utf-8');  

	    // appendFile，如果文件不存在，会自动创建新文件  
	    // 如果用writeFile，那么会删除旧文件，直接写新文件  
	    fs.writeFile(filePath, arr, function(err){  
	        if(err){
	            console.log("fail " + err);  
	    	}
	        else{
	            console.log("写入文件ok");  
	            res.json({'success':true,'msg':'writeFile completed'});
	    	}
	    });  
	}

}
