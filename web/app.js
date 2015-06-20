
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var server = app.listen(8000);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 8000);
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

io.sockets.on('connection', function (socket) {

  socket.on('linesend', function (data) {
  	console.log(data);
    socket.broadcast.emit('linesend_toclient',data);
  });
  
  socket.on('pagesend', function (data) {
	  	console.log(data);
	    socket.broadcast.emit('pagesend_toclient',data);
	  });
    
  socket.on('attention_show', function (data) {
        console.log(data);
        socket.broadcast.emit('attention_show_toclient',data);
  });
    
  socket.on('attention_drop', function (data) {
        console.log(data);
        socket.broadcast.emit('attention_drop_toclient',data);
  });
  
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});
