/*
* @Author: jinxiong.hou
* @Date:   2016-10-11 10:57:26
* @Last Modified by:   jinxiong.hou
* @Last Modified time: 2016-10-11 10:57:29
*/

/**
 * 获取文件夹下面的所有的文件(包括子文件夹)
 * @param {String} dir
 * @param {Function} callback
 * @returns {Array}
 */
 var fs = require('fs');
exports.getAllFiles = function (dir, callback) {

  function async (arr, callback1, callback2) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        return callback2(new Error('第一个参数必须为数组'));
    }
    if (arr.length === 0)
        return callback2(null);
    (function walk(i) {
        if (i >= arr.length) {
            return callback2(null);
        }
        callback1(arr[i], function () {
            walk(++i);
        });
    })(0);
}

  var filesArr = [];
  dir = ///$/.test(dir) ? dir : dir + '/';
  (function dir(dirpath, fn) {
    var files = fs.readdirSync(dirpath);
    async(files, function (item, next) {
      var info = fs.statSync(dirpath + item);
      if (info.isDirectory()) {
        dir(dirpath + item + '/', function () {
          next();
        });
      } else {
        filesArr.push(dirpath + item);
        callback && callback(dirpath + item);
        next();
      }
    }, function (err) {
      !err && fn && fn();
    });
  })(dir);
  return filesArr;
}