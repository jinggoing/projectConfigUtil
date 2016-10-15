
/*
* @Author: jinggoing
* @Date:   2016-10-11 10:53:21
* @Last Modified by:   jinxiong.hou
* @Last Modified time: 2016-10-15 10:49:18
*/

var multiparty = require('multiparty');
var http = require('http');
var util = require('util');
var fs = require('fs');
var iconv = require('iconv-lite');
var unzip =require('unzip');
var zip = require("node-native-zip");
var adm_zip = require('adm-zip');
var df = require('./deleteFolder.js')
var fr = require('./folderRead.js');
var unzipPath = 'src/unzip/';


var configNote = {
	reversed_channel:'#录音通道是否左右反转-默认值为false左外右内',
	interrupt_enable:'#打断功能是否开启-默认值为false关闭打断',
	poicluster_enable:'#POI聚类开关-默认值为true聚类开启',
	tts_audio_track_vol:'#TTS_AudioTrack音量-默认1.0f',
	aios_app_key:'#AIOS应用程序KEY',
	aios_secret_key:'#AIOS密钥',
	aios_user_id:'#AIOS用户标识'
}


function deleteNullInArray(array){
	for(var i = 0 ;i<array.length;i++)
			{
            if(array[i] == "" || typeof(array[i]) == "undefined")
            {
                array.splice(i,1);
                i= i-1;		                  
            }		            
			}
		return array;
}
function dealConfigObj(configObj){
	var configArr = [];
	var reg =/^#/;
	for(var xh in configObj){		
		var str = configObj[xh].data;
		var obj = {};
		var paramArr = deleteNullInArray(str.split('\r\n'));
		for(var i=0;i<paramArr.length;i++){
			var param = paramArr[i].replace(/\s+/g, '');
			if(param.indexOf('=')&&!reg.test(param)){
				var key = param.substring(0,param.indexOf('='));
				var value = param.substring(param.indexOf('=')+1,param.length);
				if(value=='true'){
					value=true;
				}
				if(value=='false'){
					value=false;
				}
				obj[key] = value;	
			}
		}
		obj.xh = xh;
		obj.filePath = configObj[xh].filePath;
		configArr.push(obj); 
	}
	return configArr;
}

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
		//fs.createReadStream(req.body.filePath).pipe(unzip.Extract({ path: unzipPath }));
		var unzip = new adm_zip(req.body.filePath);  
   		unzip.extractAllTo(unzipPath, true);
		console.log('unzip completed');
  		res.json({'success':true,'msg':'unzip completed'});
	},
	//读取文件夹结构和文件内容
	readFolder : function(req, res){
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
				var dataJson = JSON.parse(data);
				dataJson.request.filePath = file;				
				wakeup[brand] = JSON.stringify(dataJson);
			}
			if(fileExt==='.properties'){
				var data = fs.readFileSync(file,'utf-8');
				var obj = {};
				obj.data = data;
				obj.filePath = file;
				config[brand] = obj;
			}
			if(fileExt==='.provision'){
				provision[brand] = file;
			}
		}
		output.wakeup = wakeup;
		output.config = dealConfigObj(config);		
		output.provision = provision;
		output.success = true;
		output.msg = 'readFolder completed';
		//console.log(provision['zsh-V3-6735']);
		res.json(output);
	},
	//读取文件夹结构和文件内容
	readFolder1 : function(req, res){
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
		var archive = new zip();
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
	        fs.writeFile("./src/configFile.zip", buff, function () {
	            console.log("zip completed");
	            res.json({'success':true,'msg':'zip completed',file:'configFile.zip'});
	        });
	    });
		
	},

	saveConfigFile : function(req, res){
		var config = req.body.configFile;
		var filePath = config.filePath;
		var str = '';	
		for (var key in config){
			if(key=='filePath'||key=='xh') continue;
			str += configNote[key]+"\r\n"+key+" = "+config[key]+"\r\n\r\n";
		}
		// 把中文转换成字节数组  
	    var arr = iconv.encode(str, 'utf-8');  
	    // appendFile，如果文件不存在，会自动创建新文件  
	    // 如果用writeFile，那么会删除旧文件，直接写新文件  
	    fs.writeFile(filePath, arr, function(err){  
	        if(err){
	            console.log("fail " + err);  
	    	}
	        else{
	            console.log("写入configFile ok");  
	            res.json({'success':true,'msg':'configFile completed'});
	    	}
	    });
	},
	saveWakeupFile : function(req,res){
		var wakeup = req.body.wakeupFile;
		var filePath = wakeup.filePath;
		var obj = {};
		var request = {};
		var env = 'words='+wakeup.wordsArr.join(",")+';thresh='+wakeup.threshArr.join(",")+';';
		request.env = env;
		request.coreType = wakeup.coreType;
		request.mainword = wakeup.mainword;
		request.nickname = wakeup.nickname;
		obj.request = request;
		var str = JSON.stringify(obj);

		var arr = iconv.encode(str, 'utf-8');  
	    fs.writeFile(filePath, arr, function(err){  
	        if(err){
	            console.log("fail " + err);  
	    	}
	        else{
	            console.log("写入wakeupFile ok");  
	            res.json({'success':true,'msg':'wakeupFile completed'});
	    	}
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
