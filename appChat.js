/**
 * Module dependencies.
 */
 var serverPort = 3002;

var express = require('express');
var routes = require('./routes/example');
var http = require('http');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use('/example', routes);

var httpServer =http.createServer(app).listen(serverPort, function(req,res){
  console.log('Socket IO server has been started : ' + serverPort);
  console.log(process.env.PORT);
  console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});
// upgrade http server to socket.io server
var io = require('socket.io').listen(httpServer);

io.sockets.on('connection',function(socket){
   socket.emit('toclient',{msg:'hi hi!'});
   socket.on('fromclient',function(data){
       socket.broadcast.emit('toclient',data); // 자신을 제외하고 다른 클라이언트에게 보냄
       socket.emit('toclient',data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
       console.log('Message from client :'+data.msg);
   })
});
