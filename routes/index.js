var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/home', function(req, res) {
  res.render('home');
});

router.get('/category', function(req, res) {
  res.render('category');
});

router.get('/detail', function(req, res) {
  res.render('detail');
});

module.exports = router;
