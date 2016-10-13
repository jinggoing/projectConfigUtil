/*
* @Author: jinggoing
* @Date:   2016-10-11 10:42:52
* @Last Modified by:   jinxiong.hou
* @Last Modified time: 2016-10-13 18:35:28
*/

var bodyParser = require('body-parser');
var indexController = require('../controllers/index.controller');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	
	app.route('/upload').post(indexController.upload);
	//app.route('/deleteFolder').post(indexController.deleteFolder);
	//app.route('/readZip').get(indexController.readZip);
	app.route('/unzip').post(indexController.unzip);
	app.route('/readFolder').post(indexController.readFolder);
	app.route('/readProperties').post(indexController.readProperties);
	app.route('/writeFile').post(indexController.writeFile);
	app.route('/zipFolder').get(indexController.zipFolder);

	

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