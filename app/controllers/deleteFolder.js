/*
* @Author: jinxiong.hou
* @Date:   2016-10-11 17:29:21
* @Last Modified by:   jinxiong.hou
* @Last Modified time: 2016-10-11 17:31:06
*/
var fs = require('fs')
var deleteFolder = module.exports.deleteFolder= function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};