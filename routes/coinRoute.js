var express = require('express');
var router = express.Router();

// middleware specific to this router
/*
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
*/

router.get('/', function(req, res) {
	console.log(1111);
  //res.render('coin_index');
});

module.exports = router;
