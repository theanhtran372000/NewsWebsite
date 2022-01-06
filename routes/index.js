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

  // Tạo kết nối db
  const conn = database.createConnection()

  // Lấy dữ liệu header ---------> anh em thêm truy vấn vào sau dấu ; nhé
  conn.query('SELECT * from chude; SELECT * from chude', (err, results) => {
    if(err) throw err

    rows = results[0]
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
