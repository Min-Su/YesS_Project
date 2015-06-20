
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var fileN;

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
	  	        exec('cp ' + __dirname + "\/public\/lecture.html" + ' ' +  output, 
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

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/upload',function(req, res){
      res.sendfile(__dirname + '/public/upload.html');
});
app.get('/uploadComplete',function(req, res){
      res.sendfile(__dirname + '/public/uploadComplete.html');
});

app.post('/upload', function(req, res){
	
	fs.readFile(req.files.uploadFile.path, function(error, data){
		console.log(req.files.uploadFile.path);
		
		var lastIndex = req.files.uploadFile.name.indexOf(".");
		var fileDir = __dirname + "\/public\/ppt\/"+req.files.uploadFile.name.substring(0,lastIndex);
		var filePath = fileDir +"\/" + req.files.uploadFile.name;	
		var fileName = fileDir +"\/" + req.files.uploadFile.name.substring(0,lastIndex);
		var Board = __dirname + "\/public\/board.html";
		fileN = req.files.uploadFile.name.substring(0,lastIndex);
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

		
		ppt2jpg(filePath, fileName);
		
	});
	res.redirect('/uploadComplete.html');
});

io.sockets.on('connection', function (socket) {

	socket.on('address',function(){
		var data = "54.186.72.92:8000\/ppt\/" + fileN + "\/"+ fileN + "\/lecture.html";
		console.log(data);
		socket.emit('addr_toclient',data);
	});
  
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});