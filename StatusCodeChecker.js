var http = require('http');
var url = require('url');
var async = require('async');
var fs = require('fs');
require('date-utils');

var resultsDir = "results";
var dt = new Date();
var formatted = dt.toFormat("YYYYMMDDHH24");
var nowResultsDir = "./" + resultsDir + "/" + formatted;
fs.mkdir(nowResultsDir, 0777, function(e){
});

var urlData = require("./urls.json");

var tasks = []; 
for(var key in urlData){
	var data = urlData[key];
	for(var i=0;i<data.paths.length;i++){
		var option = {};
		option.hostname = data.hostname;
		option.path = data.paths[i];
		tasks.push(doRequest(option)); 
	}
}

async.series(tasks, function(err, results) {
  if(err) {
    // エラー処理
	console.log(err);
    return;
  }
  console.log('OK');
});
function doRequest(option){
	return function(callback){
		var req = http.request({
			hostname: option.hostname,
			path: option.path,
			port: 80,
			method: 'POST'
		}, doRecive(option));
		req.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});
		req.end();
		setTimeout(
				(function(v1,v2){
					return callback(v1,v2)
			}(null, option.hostname + option.path)), 1000);
	};
}
function doRecive(option){
	return (function (res) {
		if(res.statusCode === 200){
		console.log("OK" + res.statusCode + "： " + option.hostname + option.path);
		}else{
		console.log("NG" + res.statusCode + "： " + option.hostname + option.path);
			var data = option.path + "\n";
			fs.appendFile(nowResultsDir + "/" + option.hostname + '.txt', data , function (err) {
			});
		}
	  //  console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
	  //  res.on('data', function (chunk) {
	  //    console.log('BODY: ' + chunk);
	  //  })
	  });
}


