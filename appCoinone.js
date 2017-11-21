/**
* Module dependencies.
*/

var express = require('express');
var routes = require('./routes/coinRoute');
var http = require('http');
var path = require('path');

// coinone
var crypto = require('crypto');
var request = require('request');
var ACCESS_TOKEN = '';
var SECRET_KEY = '';

var coinoneUrl = 'https://api.coinone.co.kr/ticker?currency=all';
var bithumbUrl = 'https://api.bithumb.com/public/ticker/all';


var payload = {
  "access_token": ACCESS_TOKEN,
  "type": "btc",
  "nonce": Date.now()
};

payload = new Buffer(JSON.stringify(payload)).toString('base64');

var signature = crypto
.createHmac("sha512", SECRET_KEY.toUpperCase())
.update(payload)
.digest('hex');

var headers = {
  'content-type':'application/json',
  'X-COINONE-PAYLOAD': payload,
  'X-COINONE-SIGNATURE': signature
};

var options = {
  url: coinoneUrl,
  headers: headers,
  body: payload
};



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

  socket.on('fromclient',function(data){
    socket.broadcast.emit('toclient',data); // 자신을 제외하고 다른 클라이언트에게 보냄
    socket.emit('toclient',data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
    console.log('Message from client :'+data.msg);
  });

  setInterval(function() {
    coinoneTickerApiCall(socket);
  }, 2000);
  setInterval(function() {
    bithumbTickerApiCall(socket);
  }, 2000);

});

function coinoneTickerApiCall(socket) {
  // request.get(options, function(error, response, body) {
  request.get(coinoneUrl, function(error, response, body) {
    socket.emit('toclient', {coin : body});
  });
}

function bithumbTickerApiCall(socket) {
  request.get(bithumbUrl, function(error, response, body) {
    socket.emit('bithumb', {coin : body});
  });
}
