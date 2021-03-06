// --------------------- Phạm Xuân Lộc --------------------------------- //

var express = require('express');
var router = express.Router();
var database = require('../database')
const fs = require('fs')

var multer = require('multer');
const e = require('express');
const { route } = require('express/lib/application');

// Tạo chuỗi ngẫu nhiên gồm 6 ký tự
function generateRandomString(){
  return Array.from(Math.random().toString(16)).splice(3, 6).join("")
}

// Hiển thị số 2 ký tự
function formatDateString(dateString){
  return ("0" + dateString).slice(-2)
}

// Định nghĩa lại tên file
function getSaveString(date){
  return `${date.getFullYear()}_${formatDateString(date.getMonth() + 1)}_${formatDateString(date.getDate())}_${formatDateString(date.getHours())}_${formatDateString(date.getMinutes())}_${formatDateString(date.getSeconds())}_${generateRandomString()}.png` 
}

// lưu trữ file ảnh của admin
var storageadmin = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null,'public/upload/admin')
  },  
  filename: function(req, file, cb){
    var date = new Date()
    var datestring = getSaveString(date)
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
    var datestring = getSaveString(date)
    cb(null, datestring)
  }
})

// Filter file
const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    cb(null, true)
  else
    cb(null, false)  
}

// khai báo thuộc tính khi upload ảnh của admin
var uploadadmin = multer({
  storage: storageadmin,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
}).single('file')

// khai báo thuộc tính khi upload ảnh của news
var uploadnews = multer({
  storage: storagenews,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
}).single('file')

// Đăng nhập với quyền là admin
router.post('/login', function(req, res){
  // Tạo connection
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
    }
    // Đăng nhâp thất bại
    else{ 
      res.send({
        status: 'Fail',
        message: 'Tài khoản hoặc mật khẩu không chính xác.'
      })
    }
  })
  // Ngắt kết nối 
  conn.end()
})

// Lấy dữ liệu admin
router.get('/:id/home', function(req, res){
  // Tạo connection
  const conn = database.createConnection()

  // Đọc file config
  const editJsonFile = require("edit-json-file")
  const dirList = __dirname.replace(/\\/g, '/').split('/')
  const accessInfo = editJsonFile(`${dirList.splice(0, dirList.length - 1).join('/')}/config.json`)

  conn.query('SELECT * from chude; SELECT * from admin where id = ?; select * from baibao where adminid = ? order by thoigian desc ; select count(*) as count from user; select count(*) as count from baibao where adminid = ? ',[req.params.id, req.params.id, req.params.id], (err, result) => {
    if(err) throw err

    row = result[0]
    //thông tin admin
    var admin = result[1][0]
    const date = new Date(admin.ngaybatdau)
    var dateString = `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`
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

    console.log(accessInfo.get('accessNumber'))

    res.render('admin', {
      username: admin.username,
      listTopic: arr,
      listTopics : listTopics,
      admin: admin,
      accessNumber: accessInfo.get('accessNumber'),
      news: news,
      countUser: countUser,
      countNews: countNews
    })
  })
  // Ngắt kết nối
  conn.end()
})

// Check tài khoản 
router.get('/:id/home/checkadmin', function(req, res){
  var conn = database.createConnection()
  conn.query('select * from admin where username = ?',[req.query.username], function(err, result){
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
  conn.end()
})

// thêm người admin mới
  router.post('/uploadfile', function(req, res){
    var conn = database.createConnection()
    uploadadmin(req, res, function(err){
      // Xảy ra lỗi
      if(err){
        res.send("err")
      }
      // upload thành công
      else{
        var date = new Date()
        var datastring = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
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
              // Thêm thất bại
              if(err){
                console.log(err)
                res.send({
                  status: 'fail'
                })
                conn.end()
              }
              // Thêm thành công
              else{
                res.send({
                  status: 'success'
                })
                conn.end()
              }
            })
      }
    })

  })

// Thêm bài báo mới
  router.post('/:id/adnews', function(req, res){
    var conn = database.createConnection()
    uploadnews(req, res, function(err){
      //Xảy ra lỗi
      if(err){
        res.send({status: 'err'})
      }
      //Upload thành công
      else{
        // Định nghĩa lại path của file
        var pathfile = '/' + req.file.path.toString().replace(/\\/g, '/')
        var date = new Date()
        var datastring = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        console.log("date : " + date )
        console.log(req.file)

        // Xảy ra lỗi khi upfile
          if(err) throw err
          console.log(req.body.categorynew)
        
        // Thêm bài báo với chủ đề đã có
          if(req.body.categorynew === undefined){
            conn.query('insert into baibao ( tieude, noidung, anh, nguongoc, thoigian , adminid, chudeid ) values (?, ?, ?, ?,?, ?, ?)', [req.body.title, req.body.content, pathfile, req.body.nguon, datastring ,req.params.id, req.body.category ], function(err, result){
              if(err) throw err
              console.log(result.insertId)
              res.send({
                status: 'success'
              })
              conn.end()
            })
          }
          // Thêm bài báo với chủ đề mới
          else{
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
  router.delete('/delete/:id', function(req, res){
    var conn = database.createConnection()
    
    // Xóa các comment liên quan và xóa ảnh trong server
    conn.query('delete from comment where baibaoid = ?; select anh, chudeid from baibao where id = ?; select count(*) as soluong from baibao b1, baibao b2 where b1.id = ? and b1.chudeid = b2.chudeid and b1.id != b2.id;', [req.params.id, req.params.id, req.params.id], function(err, result){
      // Xóa lỗi
      if(err){
        console.log('Fail 1');
        res.send({
          status: "fail"
        })
        conn.end()
        return
      }

      // Xóa ảnh trong server
      const anh = result[1][0].anh // đường dẫn ảnh trong server
      const chudeid = result[1][0].chudeid // id chủ đề bài báo
      const soluong = result[2][0].soluong // số lượng tin cùng chủ đề

      console.log(anh, chudeid, soluong);

      fs.unlink('.' + anh, function(err, data){
        if(err){
          console.log("Không xóa được ảnh", result[1][0].anh);
          res.send({
            status: "fail"
          })
          conn.end()
          return
        }

        // xóa bài báo
        conn.query('delete from baibao where id = ?', [req.params.id], function(err, result){
          if(err){
            console.log('Fail 3');
            res.send({
              status: 'fail'
            })
            conn.end()
          }

          // Đó là bài báo cuối cùng của chủ đề
          if(soluong == 0){

            // Xóa chủ đề
            conn.query('delete from chude where id = ?', [chudeid], function(err, result){
              if(err){
                console.log('Fail 4');
                res.send({
                  status: 'fail'
                })
                conn.end()
              }
              else{
                res.send({
                  status: 'success'
                })
                conn.end()
              }
            })
          }
          else{
            res.send({
              status: 'success'
            })
            conn.end()
          }
        })
      })
    })
  })

// Chỉnh sửa bài báo
  router.put('/editnews', function(req, res, next){
    var conn = database.createConnection()
    uploadnews(req, res, function(err){
      // Xảy ra lỗi
      if(err) throw err
      console.log(req.body.newtitle, req.body.newcontent, req.file)
      
      //Chỉnh sửa bài viết với ảnh cũ
      if(req.file === undefined){
        conn.query('update baibao set tieude = ?, noidung = ? where id = ?', [req.body.newtitle, req.body.newcontent, req.body.id], function(err, result){
          if(err) throw err
          console.log(result)
          res.send('success')
          conn.end()
        })
      }
      // Chỉnh sửa bài viết với ảnh mới
      else{
        var pathfile = '/' + req.file.path.toString().replace(/\\/g, '/')
        conn.query('update baibao set tieude = ?, noidung = ?, anh = ? where id = ?', [req.body.newtitle, req.body.newcontent, pathfile, req.body.id], function(err, result){
          if(err) throw err
          res.send('success')
        })
      }
    })
  })

// Load bài báo 
  router.get('/:id/loadnews', function(req, res){
    var conn = database.createConnection()
    conn.query("select * from baibao where adminid = ? order by thoigian desc; select * from chude", [req.params.id], function(err,result){
      if(err){
        res.send({
          status: "fail"
        })
      }

      // load dữ liệu các bài báo
      var listnews = []
      result[0].forEach(element =>{
        listnews.push(element)
      })

      //load list chủ đề
      const listTopic = []
      result[1].forEach((topic) => {
        listTopic.push({
          topicId: topic.id,
          topicName: topic.tenchude
        })
      })


      res.send({
        status : 'success',
        listnews : listnews,
        listTopic: listTopic
      })
    })
  })

module.exports = router;
