// import module
var express = require('express');
const { set } = require('express/lib/application');
var database = require('../database')

var router = express.Router();


// Trang đăng nhập
router.get('/', function(req, res) {
  res.render('index');
});

// // Đăng nhập với tài khoản khách
// router.get('/home', function(req, res) {
  
//   // Dữ liệu người dùng
//   const username = 'Khách'

//   // Tạo kết nối db
//   const conn = database.createConnection()

//   // Danh sách query
//   queryList = []
//   queryList.push('SELECT * from chude') // Lấy dữ liệu header
//   queryList.push('SELECT id, tieude, noidung, anh FROM baibao ORDER BY thoigian DESC LIMIT 5') // Lấy danh sách tin mới nhất
//   queryList.push('SELECT tieude, noidung, anh, tenchude from baibao, chude where baibao.chudeid = chude.id') // Lấy danh sách bài báo
//   conn.query(queryList.join('; '), (err, results) => {
//     if(err) throw err

//     const topics = []
//     results[0].forEach(function(item){
//       topics.push(item.tenchude)
//     })

//     const latestNews = []
//     results[1].forEach(function (item){
//       latestNews.push({
//         id: item.id,
//         tieude: item.tieude,
//         noidung: item.noidung,
//         anh: item.anh
//       })
//     })

//     const categoricalNews = {}
//     const availableTopics = []
//     results[2].forEach(function(item){
//       if(!availableTopics.includes(item.tenchude))
//         availableTopics.push(item.tenchude)
//     })
    
//     availableTopics.forEach(function(topic){
//       const newsList = []
//       results[2].forEach(function(news){
//         if(news.tenchude === topic){
//           newsList.push({
//             tieude: news.tieude,
//             noidung: news.noidung,
//             anh: news.anh
//           })
//         }
//       })

//       categoricalNews[topic] = newsList
//     })

//     res.render('home', {
//       username: username,
//       listTopic: topics,
//       latestNews: latestNews,
//       categoricalNews: categoricalNews
//     });
//   }) 

//   conn.end()
// });

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

// router.get('/category', function(req, res) {
//   res.render('category');
// });

router.get('/detail', function(req, res) {
  res.render('detail');
});

router.get('/search', function(req, res) {


});

module.exports = router;
