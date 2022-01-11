const express = require('express');
const router = express.Router();
const database = require('../database')

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('User');
});

// Trang đăng nhập
router.get('/home', function(req, res) {
  res.render('index');
});

// Đăng nhập với tài khoản user
router.post('/login', function(req, res){
  // Tạo kết nối db
  const conn = database.createConnection()

  // Kiểm tra dữ liệu người dùng
  console.log(req.body.username, req.body.password);
  conn.query(`SELECT id FROM user WHERE username = "${req.body.username}" AND password = "${req.body.password}"`, (err, result) => {
    if(err) throw err

    // Đăng nhập thành công
    if(result.length > 0){
      res.send({
        status: 'Success',
        userid: result[0].id
      })
    }
    else{
      res.send({
        status: 'Fail',
        message: 'Tài khoản hoặc mật khẩu không chính xác.'
      })
    }
  })
  conn.end()
})

// Đăng ký tài khoản user
router.post('/register', function(req, res){
  // Tạo kết nối db
  const conn = database.createConnection()

  // Kiểm tra xem tài khoản đã tồn tại hay chưa
  conn.query(`SELECT id FROM user WHERE username = "${req.body.username}"`, function(err, result){
    if (err) throw err

    // Đã tồn tại tài khoản
    if(result.length > 0){
      res.send({
        status: 'Fail', 
        message: 'Tài khoản đã tồn tại.'
      })
      conn.end()
    }
    else{
      //Thêm tài khoản vào db
      conn.query(`INSERT INTO user(username, password) VALUES ("${req.body.username}", '${req.body.password}')`, function(err, result){
        if(err) throw err
        
        console.log(result)

        res.send({
          status: 'Success',
          message: 'Đăng ký thành công'
        })
      })
      conn.end()
    }
  })

  
})

// Load trang thông tin user
router.get('/:uid/home', function(req, res) {
  // Tạo kết nối db
  const conn = database.createConnection()

  // Danh sách query
  queryList = []
  queryList.push('SELECT * from chude') // Lấy dữ liệu header
  queryList.push('SELECT id, tieude, noidung, anh FROM baibao ORDER BY thoigian DESC LIMIT 5') // Lấy danh sách tin mới nhất
  queryList.push('SELECT baibao.id, tieude, noidung, anh, tenchude, chudeid from baibao, chude where baibao.chudeid = chude.id order by thoigian desc') // Lấy danh sách bài báo (từ gần tới xa)
  queryList.push(`SELECT id, username FROM user WHERE id = ${req.params.uid}`) // Lấy username
  conn.query(queryList.join('; '), (err, results) => {
    if(err) throw err

    const topics = []
    results[0].forEach(function(item){
      topics.push({
        chudeid: item.id,
        tenchude: item.tenchude
      })
    })

    const latestNews = []
    results[1].forEach(function (item){
      latestNews.push({
        id: item.id,
        tieude: item.tieude,
        noidung: item.noidung.split(' ').splice(0, 200).join(' ') + ' ...',
        anh: item.anh
      })
    })

    const categoricalNews = {}
    const availableTopics = []
    const availableIndex = []
    results[2].forEach(function(item){
      if(!availableIndex.includes(item.chudeid))
        availableTopics.push({
          chudeid: item.chudeid,
          tenchude: item.tenchude
        })

        availableIndex.push(item.chudeid)
    })
    
    availableTopics.forEach(function(topic){
      const newsList = []
      results[2].forEach(function(news){
        if(news.tenchude === topic['tenchude']){
          newsList.push({
            tieude: news.tieude,
            noidung: news.noidung,
            anh: news.anh,
            id: news.id
          })
        }
      })

      categoricalNews[topic['tenchude']] = newsList
    })

    const username = results[3][0].username

    res.render('home', {
      userid: results[3][0].id,
      username: username,
      listTopic: topics,
      latestNews: latestNews,
      availableTopics: availableTopics,
      categoricalNews: categoricalNews
    });
  }) 

  conn.end()
});

// tìm kiếm tin tức theo yêu cầu user
router.get('/:uid/search', function(req, res){
  const searchString = req.query.q

  // Kết nối database
  const conn = database.createConnection()

  // Danh sách query
  queryList = []
  queryList.push('SELECT * FROM chude') // Lấy dữ liệu header
  queryList.push(`SELECT * FROM baibao WHERE (tieude LIKE "%${searchString}%") OR (noidung LIKE "%${searchString}%") ORDER BY thoigian DESC LIMIT 20`) // Tìm các bản tin có từ khóa liên quan
  queryList.push(`SELECT id, username FROM user WHERE id = ${req.params.uid}`) // Lấy username
  queryList.push(`SELECT COUNT(*) AS soluong FROM baibao WHERE (tieude LIKE "%${searchString}%") OR (noidung LIKE "%${searchString}%")`) // Lấy tổng số bài báo
  conn.query(queryList.join('; '), (err, results) => {
    if(err) throw err

    const topics = []
    results[0].forEach(function(item){
      topics.push({
        chudeid: item.id,
        tenchude: item.tenchude
      })
    })

    const listNews = []
    results[1].forEach(function(news){
      listNews.push({
        id: news.id,
        tieude: news.tieude,
        noidung: news.noidung,
        anh: news.anh
      })
    })

    const username = results[2][0].username

    res.render('search', {
      searchString:searchString,
      userid: results[2][0].id,
      username: username,
      listTopic: topics,
      listNews: listNews,
      numNews: results[3][0].soluong
    });

  })

  conn.end()
})


module.exports = router;
