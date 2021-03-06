// import module
var express = require('express');
const { set } = require('express/lib/application');
var database = require('../database')
var router = express.Router();

// --------------------- Trần Thế Anh --------------------------------- //

// Trang đăng nhập
router.get('/', function(req, res) {
  res.render('index');
});

// Tìm tin tức dựa trên ảnh
router.get('/findNewsByImageSrc', function(req, res){
  const src = req.query.src
  console.log(src);

  // Tạo connection tới db
  const conn = database.createConnection()

  // Tìm bản tin ứng với ảnh
  conn.query(`SELECT id, tieude, noidung FROM baibao WHERE anh = "${src}"`, function(err, result) {
    if(err) throw err

    // Có tìm thấy
    if(result.length > 0){
      res.send({
        status: 'Success',
        id: result[0].id,
        tieude: result[0].tieude,
        noidung: result[0].noidung
      })
    }
    else{
      res.send({
        status: 'Fail',
        message: 'Không tìm thấy nội dung'
      })
    }
  })

  conn.end()
})

// Tìm tin tức theo từ khóa có thông tin về số lượng và vị trí
router.get('/queryNews', function(req, res){
  // Thông tin được gửi lên
  const keyword = req.query.keyword
  const sortType = req.query.sortType
  const numNews = req.query.numNews
  const pages = req.query.pages

  const conn = database.createConnection()

  // `SELECT * FROM baibao WHERE (tieude LIKE "%${searchString}%") OR (noidung LIKE "%${searchString}%") ORDER BY thoigian DESC LIMIT 20`
  var queryStatement = `SELECT * FROM baibao WHERE (tieude LIKE "%${keyword}%") OR (noidung LIKE "%${keyword}%") `

  // Trình tự sắp xếp
  // Tin gần nhất
  if(sortType == 'latest'){
    queryStatement += 'ORDER BY thoigian DESC '
  }

  // Tin xa nhất
  else if(sortType == 'oldest'){
    queryStatement += 'ORDER BY thoigian ASC '
  }

  // Số tin trả về và số trang thứ bao nhiêu
  queryStatement += `LIMIT ${numNews} OFFSET ${(parseInt(pages) - 1) * parseInt(numNews)}`

  conn.query(queryStatement, function(err, result){
    if (err) throw err

    const ans = []
    result.forEach(function(item){
      ans.push({
        id: item.id,
        tieude: item.tieude,
        noidung: item.noidung,
        anh: item.anh,
      })
    })

    res.send({
      result: ans
    })
  })

  conn.end()
})

// --------------------- Nguyễn Huy Hiếu --------------------------------- //

// Tìm tin tức theo từ khóa có thông tin về số lượng và vị trí
router.get('/filterNews', function(req, res){
  // Thông tin được gửi lên
  const categoryId = req.query.categoryId
  const sortType = req.query.sortType
  const numNews = req.query.numNews
  const pages = req.query.pages

  const conn = database.createConnection()

  var queryStatement = `SELECT id, tieude, noidung, anh FROM baibao WHERE chudeid = ${categoryId} `

  // Trình tự sắp xếp
  // Tin gần nhất
  if(sortType == 'latest'){
    queryStatement += 'ORDER BY thoigian DESC '
  }

  // Tin xa nhất
  else if(sortType == 'oldest'){
    queryStatement += 'ORDER BY thoigian ASC '
  }

  // Số tin trả về và số trang thứ bao nhiêu
  queryStatement += `LIMIT ${numNews} OFFSET ${(parseInt(pages) - 1) * parseInt(numNews)}`

  conn.query(queryStatement, function(err, result){
    if (err) throw err

    const ans = []
    result.forEach(function(item){
      ans.push({
        id: item.id,
        tieude: item.tieude,
        noidung: item.noidung,
        anh: item.anh,
      })
    })

    res.send({
      result: ans
    })
  })

  conn.end()
})

module.exports = router;
