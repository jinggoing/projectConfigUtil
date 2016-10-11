/*
* @Author: jinggoing
* @Date:   2016-10-11 10:42:52
* @Last Modified by:   jinxiong.hou
* @Last Modified time: 2016-10-11 17:26:47
*/

var bodyParser = require('body-parser');
var indexController = require('../controllers/index.controller');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	
	app.route('/upload').post(indexController.upload);
	app.route('/deleteFolder').get(indexController.deleteFolder);
	//app.route('/readZip').get(indexController.readZip);
/*	app.route('/unZip').get(indexController.unZip);
	app.route('/readFolder').get(indexController.readFolder);*/

	app.get('/', function(req,res){
        res.sendfile( './src/index.html');
	});
	app.get('/index', function(req,res){
    	res.sendfile( './src/index.html');
	});
	app.get('/upload', function(req,res){
    	res.sendfile( './src/index.html');
	});
}