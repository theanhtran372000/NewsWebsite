var express = require('express');
var router = express.Router();
var database = require('../database')

var multer = require('multer');
const e = require('express');
const { route } = require('express/lib/application');
// const { send } = require('express/lib/response');

// lưu trữ file ảnh của admin
var storageadmin = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null,'public/upload/admin')
  },  
  filename: function(req, file, cb){
    var date = new Date()
    var datestring = `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_${Math.floor(Math.random() * 100) + 1}.png` 
    cb(null, datestring)
  }
})

// lưu trữ file ảnh của news
var storagenews = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null,'public/upload/news')
  },  
  filename: function(req, file, cb){
    var date = new Date()
    var datestring = `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_${Math.floor(Math.random() * 100) + 1}.png` 
    // date = date.replace(/:/g, '_')
    cb(null, datestring)
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    cb(null, true)
  else
    cb(null, false)  
}

// khai báo thuộc tính
var uploadadmin = multer({
  storage: storageadmin,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
}).single('file')

var uploadnews = multer({
  storage: storagenews,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
}).single('file')

// /* GET users listing. */
// router.get('/', function(req, res) {
//   res.render('admin');
// });

// Đăng nhập với quyền là admin
router.post('/login', function(req, res){
  const conn = database.createConnection()
  var username = req.body.username
  var password = req.body.password
  console.log(username, password)
  conn.query(`select * from admin where username = "${username}" and password = "${password}"`, function(err, result){
    if(err) throw err
    console.log(result)
    // Đăng nhập thành công
    if(result.length > 0){
      res.send({
        status: 'Success',
        adminid: result[0].id
      })
    }else{ 
      res.send({
        status: 'Fail',
        message: 'Tài khoản hoặc mật khẩu không chính xác.'
      })
    }
  })
  conn.end()
})

router.get('/:id/home', function(req, res){
  const conn = database.createConnection()
  conn.query('SELECT * from chude; SELECT * from admin where id = ?; select * from baibao where adminid = ? order by thoigian desc ; select count(*) as count from user; select count(*) as count from baibao where adminid = ? ',[req.params.id, req.params.id, req.params.id], (err, result) => {
    if(err) throw err

    row = result[0]
    //thông tin admin
    var admin = result[1][0]
    const date = new Date(admin.ngaybatdau)
    var dateString = `${date.getFullYear()} - ${date.getMonth() + 1} - ${date.getDate()}`
    admin.ngaybatdau = dateString

    //list chủ đề
    const arr = []
    row.forEach(element => {
      arr.push(element.tenchude)
    });
    //list chủ để bao gồm cả id
    const listTopics = []
    row.forEach(element => {
      listTopics.push(element)
    })
    //list bài báo
    rows = result[2]
    var news = []
    rows.forEach(element => {
      news.push(element)
    })
    // số người dùng
    var countUser = result[3][0].count
    console.log(result[3][0].count)
    // số bài báo của admin
    var countNews = result[4][0].count

    console.log(news)

    res.render('admin', {
      username: admin.username,
      listTopic: arr,
      listTopics : listTopics,
      admin: admin,
      news: news,
      countUser: countUser,
      countNews: countNews
    })
  })
  conn.end()
})

router.get('/:id/home/checkadmin', function(req, res){
  console.log(req.query)
  var conn = database.createConnection()
  conn.query('select * from admin where hoten = ? and username = ?',[req.query.hoten, req.query.username], function(err, result){
    if(err) throw err
    
    if(result.length > 0){
      res.send({
        status: "fail",
        message : "đã tồn tại"
      })
    }else{
      res.send({
        status: "success",
        message : "chưa tồn tại"
      })
    }
  })
})
// thêm người admin mới
  router.post('/uploadfile', function(req, res){
    var conn = database.createConnection()
    uploadadmin(req, res, function(err){
      if(err){
        res.send("err")
      }else{
        var date = new Date()
        var datastring = date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        var pathfile = '/' + req.file.path.toString().replace(/\\/g, '/')
        var date = new Date()
        console.log(req.file)
        var adminnew = {
              hoten : req.body.hoten,
              username : req.body.username,
              password : req.body.password,
              avatar : pathfile,
              ngaybatdau : datastring
            }
            conn.query('insert into admin (username, password, hoten, avatar, ngaybatdau) values (?, ?, ?, ? , ? ) ', [adminnew.username, adminnew.password, adminnew.hoten, adminnew.avatar, adminnew.ngaybatdau], function(err, result){
              if(err){
                console.log(err)
                res.send({
                  status: 'fail'
                })
                conn.end()
              }else{
                res.send({
                  status: 'success'
                })
                conn.end()
              }
            })
      }
    })

  })
// Thêm bài báo m
  router.post('/:id/adnews', function(req, res){
    var conn = database.createConnection()
    uploadnews(req, res, function(err){
      if(err){
        res.send('err')
      }else{
        var pathfile = '/' + req.file.path.toString().replace(/\\/g, '/')
        var date = new Date()
        var datastring = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        console.log("date : " + date )
        console.log(req.file)
          if(err) throw err
          console.log(req.body.categorynew)
          if(req.body.categorynew === undefined){
            conn.query('insert into baibao ( tieude, noidung, anh, nguongoc, thoigian , adminid, chudeid ) values (?, ?, ?, ?,?, ?, ?)', [req.body.title, req.body.content, pathfile, req.body.nguon, datastring ,req.params.id, req.body.category ], function(err, result){
              if(err) throw err
              console.log(result.insertId)
              res.send({
                status: 'success'
              })
              conn.end()
            })
          }else{
            conn.query('insert into chude ( tenchude ) values (?)', [req.body.categorynew], function(err, chude){
              if(err) throw err
              conn.query('insert into baibao ( tieude, noidung, anh, nguongoc, thoigian, adminid, chudeid ) values (?, ?, ?, ?,?, ?, ?)', [req.body.title, req.body.content, pathfile, req.body.nguon, datastring ,req.params.id, chude.insertId ], function(err, result){
                if(err) throw err
              console.log(result.insertId)
              res.send({
                status: 'success'
              })
              conn.end()
              })
            })
          }
          
      }
    })
  })
// Xóa bài báo
  router.delete('/delete/:id', function(req, res, next){
    var conn = database.createConnection()
    conn.query('delete from baibao where id = ?', [req.params.id], function(err, result){
      if(err){
        res.send({
          status: 'fail'
        })
      }
      res.send({
        status : 'success'
      })
      conn.end()
    })
  })
// Chỉnh sửa bài báo
  router.put('/editnews', function(req, res, next){
    var conn = database.createConnection()
    uploadnews(req, res, function(err){
      if(err) throw err
      console.log(req.body.newtitle, req.body.newcontent, req.file)
      if(req.file === undefined){
        conn.query('update baibao set tieude = ?, noidung = ? where id = ?', [req.body.newtitle, req.body.newcontent, req.body.id], function(err, result){
          if(err) throw err
          console.log(result)
          res.send('success')
          conn.end()
        })
      }else{
        var pathfile = '/' + req.file.path.toString().replace(/\\/g, '/')
        conn.query('update baibao set tieude = ?, noidung = ?, anh = ? where id = ?', [req.body.newtitle, req.body.newcontent, pathfile, req.body.id], function(err, result){
          if(err) throw err
          res.send('success')
        })
      }
    })
    // console.log(req)
  })
// Load bài báo 
  router.get('/:id/loadnews', function(req, res){
    var conn = database.createConnection()
    conn.query("select * from baibao where adminid = ? order by thoigian desc", [req.params.id], function(err,result){
      if(err){
        res.send({
          status: "fail"
        })
      }
      // console.log(result)
      var listnews = []
      result.forEach(element =>{
        listnews.push(element)
      })
      // console.log(listnews)
      res.send({
        status : 'success',
        listnews : listnews
      })
    })
  })

module.exports = router;
