
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var server = app.listen(7000);
var io = require('socket.io').listen(server);
var fs = require('fs');
var exec = require('child_process').exec;
var ppt2jpg = function(input, output) {
	  exec('unoconv -f html -o ' + output + '/ ' + input, 
	      function( error, stdout, stderr) {
	        console.log('unoconv stdout: ', stdout);
	        console.log('unoconv stderr: ', stderr);
	        if (error !== null) {
	          console.log('unoconv err: ', error);
	        } else {
	          exec('rm ' + output + '/*.html ' + output + '/' + output, 
	            function(){
	              if(error !== null) {
	                console.log('rm err: ', error);
	              }
	            });
	          exec('cp ' + __dirname + "\/public\/board.html" + ' ' +  output, 
	  	            function(){
	  	              if(error !== null) {
	  	                console.log('cp err: ', error);
	  	              }
	  	        });
	          exec('cp -r ' + __dirname + "\/public\/js" + ' ' +  output, 
		  	            function(){
		  	              if(error !== null) {
		  	                console.log('cp err: ', error);
		  	              }
		  	        });
	          exec('cp -r ' + __dirname + "\/public\/stylesheets" + ' ' +  output, 
		  	            function(){
		  	              if(error !== null) {
		  	                console.log('cp err: ', error);
		  	              }
		  	        });
	          
	        }
	      });
	  
	}
// all environments
app.set('port', process.env.PORT || 7000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

// upload test start
app.post('/upload', function(req, res){
	
	fs.readFile(req.files.uploadFile.path, function(error, data){
		console.log(req.files.uploadFile.path);
		
		var lastIndex = req.files.uploadFile.name.indexOf(".");
		var fileDir = __dirname + "\/public\/ppt\/"+req.files.uploadFile.name.substring(0,lastIndex);
		var filePath = fileDir +"\/" + req.files.uploadFile.name;	
		var fileName = fileDir +"\/" + req.files.uploadFile.name.substring(0,lastIndex);
		var Board = __dirname + "\/public\/board.html";
		console.log(filePath);
		console.log(fileDir);
		console.log(fileName);
		console.log(Board);
		
		//파일 이름으로 된 디렉터리 생성
		fs.mkdir(fileDir, function(err){
			if(err) throw err;
			console.log('dir was made');
		});
		//해당 디렉터리에 ppt 저장
		fs.writeFile(filePath, data, 'utf8', function(err){
			if(err) throw err;
			console.log('PPT was saved');
		});

		window.location.href=('uploadComplete.html');
		ppt2jpg(filePath, fileName);
		
		
//		//해당 디렉터리에 Board.html 저장
//		fs.writeFile(filePath, Board, function(err){
//			if(err) throw err;
//			console.log('Board was saved');
//		});

	});
});
// upload test end

//ppt 2 png START


//var ppt2png = function(input, output, callback) {
//  exec('unoconv -f pdf -o ' + output + '.pdf ' + input, 
//      function( error, stdout, stderr) {
//        //console.log('unoconv stdout: ', stdout);
//        //console.log('unoconv stderr: ', stderr);
//        if (error !== null) {
//          callback(error);
//        } else {
//          pdf2png(output+'.pdf', output+'.png', callback);
//        }
//      });
//}
//
//var pdf2png = function(input, output, callback) {
//  exec('convert -resize 1800 -colorspace RGB -density 300 ' + input + ' ' + output, 
//      function (error, stdout, stderr) {
//        //console.log('convert stdout: ', stdout);
//        //console.log('convert stderr: ', stderr);
//        if (error !== null) {
//          callback(error);
//        } else {
//          callback(null);
//        }
//      });
//}
//ppt 2 png END

io.sockets.on('connection', function (socket) {

//  socket.on('linesend', function (data) {
//  	console.log(data);
//    socket.broadcast.emit('linesend_toclient',data);
//  });
//  
//  socket.on('pagesend', function (data) {
//	  	console.log(data);
//	    socket.broadcast.emit('pagesend_toclient',data);
//	  });
//  
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});