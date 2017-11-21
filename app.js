/**
* Module dependencies.
*/

var express = require('express');
var routes = require('./routes/coinRoute');
var http = require('http');
var path = require('path');

// coinone
var request = require('request');

var coinoneUrl = 'https://api.coinone.co.kr/ticker?currency=all';
var bithumbUrl = 'https://api.bithumb.com/public/ticker/all';
var bittrexUrl = 'https://bittrex.com/api/v1.1/public/getticker?market=USDT-BTC';

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

var httpServer = http.createServer(app).listen(3000, function(req,res){
  console.log('Socket IO server has been started');
});
// upgrade http server to socket.io server
var io = require('socket.io').listen(httpServer);

io.sockets.on('connection',function(socket){

  socket.emit('toclient',{msg:'Welcome !'});

  socket.on('fromclient', function(data){
    socket.broadcast.emit('toclient', data); // 자신을 제외하고 다른 클라이언트에게 보냄
    socket.emit('toclient', data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
    console.log('Message from client :' + data.msg);
  });

  setInterval(function() {
    coinoneTickerApiCall(socket);
  }, 2000);
  setInterval(function() {
    bithumbTickerApiCall(socket);
  }, 5000);
  setInterval(function() {
    bittrexTickerApiCall(socket);
  }, 3000);

});

function coinoneTickerApiCall(socket) {
  request.get(coinoneUrl, function(error, response, body) {
    var body = JSON.parse(body);
    socket.emit('toclient', {coin : body});
  });
}

function bithumbTickerApiCall(socket) {
  request.get(bithumbUrl, function(error, response, body) {
    var body = JSON.parse(body);
    if (body.status === '0000') {
      socket.emit('bithumb', {coin : body});
    }else {
      console.log('bithumb error : ' + JSON.stringify(body));
    }
  });
}

function bittrexTickerApiCall(socket) {
  request.get(bittrexUrl, function(error, response, body) {
    var body = JSON.parse(body);
    if (body.success === true) {
      socket.emit('bittrex', {coin : body});
    } else {
      // console.log(moment().format('YYYY/MM/DD HH:mm:ss') + ' : ' +  body);
      console.log('bittrex error : ' + JSON.stringify(body));
    }
  });
}
