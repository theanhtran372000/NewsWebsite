const express = require('express')
const router = express.Router()
const database = require('../database')
const editJsonFile = require("edit-json-file")
const dirList = __dirname.replace(/\\/g, '/').split('/')
const accessInfo = editJsonFile(`${dirList.splice(0, dirList.length - 1).join('/')}/config.json`)
const badWords = require('../config.json').badwords
const e = require('express')

// --------------------- Trần Thế Anh --------------------------------- //

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
  // Tăng số lượt truy cập trang web  
  const newAccessNumber = + accessInfo.get('accessNumber') + 1
  accessInfo.set("accessNumber", newAccessNumber); // Tăng số lượt truy cập
  accessInfo.save() // Lưu dữ liệu
  
  console.log('Acess number: ', accessInfo.get("accessNumber"));

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
        noidung: item.noidung,
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


// --------------------- Nguyễn Quang Hưng --------------------------------- //

// Page News Detail
router.get('/:uid/news/:newsid', function(req, res) {
  // Tạo kết nối db
  const conn = database.createConnection()

  var userid = req.params.uid
  var newsid = req.params.newsid

  // Danh sách query
  queryList = []
  queryList.push('SELECT * from chude') // Lấy dữ liệu header
  queryList.push(`SELECT id, username FROM user WHERE id = ${userid}`) // Lấy username
  queryList.push(`SELECT * FROM baibao WHERE id = ${newsid}`) // Lấy bài báo theo id
  queryList.push(`SELECT admin.hoten FROM admin, baibao WHERE admin.id=baibao.adminid AND baibao.id=${newsid}`)
  queryList.push(`SELECT b2.* FROM baibao b1, baibao b2 WHERE b1.id=${newsid} AND b1.chudeid=b2.chudeid AND b1.id != b2.id ORDER BY thoigian DESC LIMIT 10`)
  queryList.push(`SELECT u.username, c.noidung, c.rate, c.thoigian FROM user u, comment c WHERE c.baibaoid=${newsid} AND c.userid=u.id ORDER BY c.thoigian DESC`)
  conn.query(queryList.join('; '), (err, results) => {
    if(err) throw err

    // lấy topic
    const topics = []
    results[0].forEach(function(item){
      topics.push({
        chudeid: item.id,
        tenchude: item.tenchude
      })
    })

    //lấy id, username
    const userid = results[1][0].id
    const username = results[1][0].username


    // lấy bài viết
    const news = results[2][0]

    // lấy tác giả
    author = results[3][0].hoten

    // lấy bài viết liên quan
    relatedNews = results[4]

    // lấy comments
    comments = results[5]

    // xử lý rate
    var starCount = [0,0,0,0,0]
    comments.forEach(function(item){
        tmp = item.rate
        if (tmp==1) starCount[0]++
        else if (tmp==2) starCount[1]++
        else if (tmp==3) starCount[2]++
        else if (tmp==4) starCount[3]++
        else starCount[4]++

    })

    res.render('detail', {
      userid: userid,
      username: username,
      listTopic: topics,
      news: news,
      relatedNews: relatedNews,
      author: author,
      starCount: starCount,
      comments: comments
    });
  }) 

  conn.end()
});

function checkCmt(noidung){
  // check cmt
  lowerWord = noidung.toLowerCase()
  const wordCheck = badWords
  for (var i=0; i<wordCheck.length; i++){
      if (lowerWord.search(wordCheck[i]) >= 0) {
          return false; 
      }
  }
  
  return true
}

// api add comment
router.post('/addComment', function(req, res){

  var noidung = req.body.noidung
  var rate = req.body.rate
  var email = req.body.email
  var baibaoid = req.body.baibaoid
  var userid = req.body.userid

  var date = new Date()
  var thoigian = date.getFullYear() + "-" + date.getMonth()+1 + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

  var isValid = checkCmt(noidung)
  if(! isValid){
    res.send({
      status: 'Fail',
      message: 'Bình luận chứa từ không hợp lệ!'
    })
  }
  else{
    // Tạo kết nối db
    const conn = database.createConnection()

    // chen comment moi
    conn.query(`INSERT INTO comment(baibaoid, userid, noidung, rate, email, thoigian) VALUES (?, ?, ?, ?, ?, ?);`, [baibaoid, userid, noidung, rate, email, thoigian], function(err, result){
      if(err) throw err
      
      res.send({
        status: 'Success',
        message: 'Comment thành công'
      })
    })
    conn.end()
  } 
})

// api add comment
router.post('/getAllCmt', function(req, res){
  baibaoid = req.body.baibaoid

  // Tạo kết nối db
  const conn = database.createConnection()
  conn.query(`SELECT u.username, c.noidung, c.rate, c.thoigian FROM user u, comment c WHERE c.baibaoid=${baibaoid} AND c.userid=u.id ORDER BY c.thoigian DESC`, function(err, result){
    if(err) throw err

    res.send({
      status: 'Success',
      comments: result
    })

  })
  conn.end()
})

// --------------------- Nguyễn Huy Hiếu --------------------------------- //

// tìm kiếm tin tức theo yêu cầu user
router.get('/:uid/category/:categoryid', function(req, res){
  const categoryid = req.params.categoryid
  const userid = req.params.uid

  // Kết nối database
  const conn = database.createConnection()

  // Danh sách query
  queryList = []
  queryList.push('SELECT * FROM chude') // Lấy dữ liệu header
  queryList.push(`SELECT id, username FROM user WHERE id = ${req.params.uid}`) // Lấy username
  queryList.push(`SELECT tenchude FROM chude WHERE id = ${categoryid}`) // Lấy tên chủ đề
  queryList.push(`SELECT id, tieude, noidung, anh FROM baibao WHERE chudeid = ${categoryid} ORDER BY thoigian DESC LIMIT 20`) // Lấy danh sách tin
  queryList.push(`SELECT COUNT(*) AS soluong FROM baibao WHERE chudeid = ${categoryid}`) // Lấy danh sách tin
  conn.query(queryList.join('; '), (err, results) => {
    if(err) throw err

    // Lấy thông tin cho Header
    const topics = []
    results[0].forEach(function(item){
      topics.push({
        chudeid: item.id,
        tenchude: item.tenchude
      })
    })

    // Lấy thông tin user
    const username = results[1][0].username
    const userid = results[1][0].id

    // Tên chủ đề
    const tenchude = results[2][0].tenchude
    
    // Lấy tin thuộc chủ đề trên
    const listNews = []
    results[3].forEach(function(news){
      listNews.push({
        id: news.id,
        tieude: news.tieude,
        noidung: news.noidung,
        anh: news.anh
      })
    })

    // Lấy số lượng
    const soluong = results[4][0].soluong

    res.render('category', {
      userid: userid,
      username: username,
      listNews: listNews,
      tenchude: tenchude,
      listTopic: topics,
      numNews: soluong
    });

  })

  conn.end()
})

module.exports = router;