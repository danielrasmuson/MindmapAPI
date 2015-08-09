var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the map page');
});

router.get('/drive/folder', function(req, res, next) {
  res.json([{id: 'sljdflasjdf2343'}]);
});

module.exports = router;
