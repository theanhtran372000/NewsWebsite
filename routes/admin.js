var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('admin', {
    userid: '1',
    username: 'Admin'
  });
});

module.exports = router;
