
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , config = require('./config.js');

var app = express();

// all environments
app.set('port', config.port || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket) {
  socket.on('join', function(nick) {
    console.log('seeing stuff0', nick);
    socket.set('nick', nick.name, function() {
      socket.join('chat');
      socket.broadcast.to('chat').emit('message', {message: 'Welcome, ' + nick.name + '!', nick: 'Server'});
      socket.broadcast.in('chat').emit('join', {nick: nick.name});
    })
  });
  socket.on('message', function(data) {
    socket.get('nick', function(err, nick) {
      console.log(data.message + ' sent by ' + nick);
      socket.broadcast.to('chat').emit('message', {message: data.message, nick: nick});
      console.log(io.sockets.clients().length);
      console.log(io.sockets.clients('chat').length);
      console.log(io.sockets.clients()[0]);
    });
  });
});
