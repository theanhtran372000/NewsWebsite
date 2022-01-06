// import module
var express = require('express');
var database = require('../database')

var router = express.Router();


// Trang đăng nhập
router.get('/', function(req, res) {
  res.render('index');
});

// Đăng nhập với tài khoản khách
router.get('/home', function(req, res) {
  
  // Dữ liệu người dùng
  const username = 'Khách'
  const conn = database.createConnection()
  conn.query('SELECT * from chude', (err, rows) => {
    if(err) throw err
    
    const arr = []
    rows.forEach(function(item){
      arr.push(item.tenchude)
    })

    res.render('home', {
      username: username,
      listTopic: arr
    });
  })
});

router.get('/category', function(req, res) {
  res.render('category');
});

router.get('/detail', function(req, res) {
  res.render('detail');
});

module.exports = router;
