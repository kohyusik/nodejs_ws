var socket = io.connect();
$("#msgbox").keyup(function(event) {
  if (event.which === 13 && $('#msgbox').val() !== '') {
    socket.emit('fromclient',{msg:$('#msgbox').val()});
    $('#msgbox').val('');
  }
});
socket.on('toclient',function(data){
  if (data.coin) {
    coinoneSetData(data.coin);
  } else {

    var chatBox = document.querySelector('#chatbox');

    var msg = document.createElement('span');
    msg.innerText = data.msg;

    var br = document.createElement('br');

    var date = document.createElement('span');
    date.innerText = '[' + moment().format('MM/DD/YYYY HH:mm:ss') + ']';
    date.style['font-size'] = 'xx-small';


    chatBox.appendChild(msg);
    chatBox.appendChild(br.cloneNode());
    chatBox.appendChild(date);
    chatBox.appendChild(br.cloneNode());
    chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
  }
});

socket.on('bithumb',function(data){
  if (data.coin) {
    bithumbSetData(data.coin);
  }
});

socket.on('bittrex',function(data){
  if (data.coin) {
    bittrexSetData(data.coin);
  }
});

function coinoneSetData(data) {

  if (!data) return;
  var coinList = ['btc', 'bch', 'eth', 'etc', 'xrp', 'qtum', 'ltc'];

  //console.log(data);

  var divCoinone = document.querySelector('#coinone'),
  divCoins = divCoinone.querySelector('.coins'),
  divDate = divCoinone.querySelector('.date');

  // set date
  // UNIX_timestamp
  var currDate = moment(new Date(parseInt(data.timestamp) * 1000)).format('YY/MM/DD HH:mm:ss');
  divDate.innerText = currDate;

  // set data
  empty(divCoinone, '.cloneTmp');
  for (var i = 0; i < coinList.length; i++) {
    var divCoinsClone = divCoins.cloneNode(true);
    divCoinsClone.querySelector('.currency').innerText = data[coinList[i]].currency.toUpperCase();
    divCoinsClone.querySelector('.last').innerText = addComma(data[coinList[i]].last);
    divCoinsClone.className = 'cloneTmp';
    divCoinsClone.style.display = 'block';

    divCoinone.appendChild(divCoinsClone);
  }
}

function bithumbSetData(data) {

  var data = data['data'];
  if (!data) return;

  var coinList = ['BTC', 'BCH', 'ETH', 'ETC', 'XRP', 'QTUM', 'LTC'];

  //console.log(data);

  var divBithumb = document.querySelector('#bithumb'),
  divCoins = divBithumb.querySelector('.coins'),
  divDate = divBithumb.querySelector('.date');

  // set date
  var currDate = moment(new Date(parseInt(data.date))).format('YY/MM/DD HH:mm:ss');
  divDate.innerText = currDate;

  // set data
  empty(divBithumb, '.cloneTmp');
  for (var i = 0; i < coinList.length; i++) {
    var divCoinsClone = divCoins.cloneNode(true);
    divCoinsClone.querySelector('.currency').innerText = coinList[i];
    divCoinsClone.querySelector('.last').innerText = addComma(data[coinList[i]]['closing_price']);
    divCoinsClone.className = 'cloneTmp';
    divCoinsClone.style.display = 'block';

    divBithumb.appendChild(divCoinsClone);
  }
}

function bittrexSetData(data) {

  var data = data['result'];
  if (!data) return;

  // var coinList = ['BTC', 'BCH', 'ETH', 'ETC', 'XRP', 'QTUM', 'LTC'];
  var coinList = ['BTC'];

  //console.log(data);

  var divBittrex = document.querySelector('#bittrex'),
  divCoins = divBittrex.querySelector('.coins'),
  divDate = divBittrex.querySelector('.date');

  // set date
  var currDate = moment(new Date()).format('YY/MM/DD HH:mm:ss');
  divDate.innerText = currDate;

  // set data
  empty(divBittrex, '.cloneTmp');
  for (var i = 0; i < coinList.length; i++) {
    var divCoinsClone = divCoins.cloneNode(true);
    divCoinsClone.querySelector('.currency').innerText = coinList[i];
    divCoinsClone.querySelector('.last').innerText = data['Last'] + ' USDT';
    divCoinsClone.className = 'cloneTmp';
    divCoinsClone.style.display = 'block';

    divBittrex.appendChild(divCoinsClone);
  }
}

function empty(parentElement, selector) {
  var tmpList = parentElement.querySelectorAll(selector);
  for (var i = 0; i < tmpList.length; i++) {
    tmpList[i].remove();
  }
}

function addComma(data_value) {

  var txtNumber = '' + data_value;

  if (isNaN(txtNumber) || txtNumber == "") {
    return data_value;
  }
  else {
    var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
    var arrNumber = txtNumber.split('.');
    arrNumber[0] += '.';

    do {
      arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
    } while (rxSplit.test(arrNumber[0]));

    if (arrNumber.length > 1) {
      return arrNumber.join('');
    }
    else {
      return arrNumber[0].split('.')[0];
    }
  }
}
