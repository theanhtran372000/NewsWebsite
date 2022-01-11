document.addEventListener('DOMContentLoaded', function () {
  // Auto-resize text area
  const textAreas = document.querySelectorAll('textarea')
  textAreas.forEach(function (ta, i) {
    ta.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 6 + 'px';
    })
  })

  //lấy dữ liệu form thêm admin
  var hotenadminnew = document.getElementById('hotenadminnew')
  var usernameadminnew = document.getElementById('usernameadminnew')
  var passwordadminnew = document.getElementById('passwordadminnew')
  var repasswordadminnew = document.getElementById('repasswordadminnew')
  var file = document.getElementById('avataradminnew')

  //xử lý thêm admin
  const buttonaddadmin = document.getElementById('button-addadmin')
  buttonaddadmin.addEventListener('click', function () {
    if (hotenadminnew.value !== "" && usernameadminnew !== "" && passwordadminnew !== ""
      && repasswordadminnew !== "" && file.value !== "" && passwordadminnew.value === repasswordadminnew.value) {
      let fileavatar = file.files[0]
      var formData = new FormData()
      formData.append('hoten', hotenadminnew.value)
      formData.append('username', usernameadminnew.value)
      formData.append('password', passwordadminnew.value)
      formData.append('file', fileavatar, fileavatar.name)

      console.log(formData)
      console.log(window.location)
      var xhttp = new XMLHttpRequest()
      xhttp.open('GET', `${window.location}/checkadmin?hoten=${hotenadminnew.value}&username=${usernameadminnew.value}`, true)
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          const res = JSON.parse(this.responseText)
          console.log(res)
          if (res.status === 'success') {
            uploadfile("admin", formData, xhttp)
          } else {
            var textResult = document.getElementById('post-announcement-admin')
            textResult.innerHTML = "Đã tồn tại tài khoản như vậy!"
            textResult.setAttribute('style', 'color: red; font-size: 14px; margin-bottom: 12px; display: block; ')
            setTimeout(() => {
              textResult.setAttribute('style', 'display: none')
            }, 5000)
          }
        } else {
          var textResult = document.getElementById('post-announcement-admin')
          textResult.innerHTML = "Đã xảy ra lỗi mời nhập lại!"
          textResult.setAttribute('style', 'color: red; font-size: 14px; margin-bottom: 12px; display: block; ')
          setTimeout(() => {
            textResult.setAttribute('style', 'display: none')
          }, 5000)
        }
      }
      xhttp.send()
    } else if (hotenadminnew.value !== "" && usernameadminnew !== "" && passwordadminnew !== ""
      && repasswordadminnew !== "" && file.value !== "" && passwordadminnew.value !== repasswordadminnew.value) {
      
      var textResult = document.getElementById('post-announcement-admin')
      textResult.innerHTML = "Mật khẩu nhập lại không khớp!"
      textResult.setAttribute('style', 'color: red; font-size: 14px; margin-bottom: 12px; display: block; ')
      setTimeout(() => {
        textResult.setAttribute('style', 'display: none')
      }, 5000)
    }
  })

  function uploadfile(type, formData, xhttp) {
    if (type === "admin") {
      xhttp.open('POST', '/admin/uploadfile', true);
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status === 200) {
          const res = JSON.parse(this.responseText)
          if (res.status === 'success') {
            console.log(hotenadminnew.value)
            hotenadminnew.value = ''
            usernameadminnew.value = ''
            passwordadminnew.value = ''
            repasswordadminnew.value = ''
            file.value = ""
            
            var textResult = document.getElementById('post-announcement-admin')
            textResult.innerHTML = "Thêm thành công!"
            textResult.setAttribute('style', 'color: red; font-size: 14px; margin-bottom: 12px; display: block; ')
            setTimeout(() => {
              textResult.setAttribute('style', 'display: none')
            }, 5000)
          } else {
            var textResult = document.getElementById('post-announcement-admin')
            textResult.innerHTML = "Thêm thất bại, mời nhập lại!"
            textResult.setAttribute('style', 'color: red; font-size: 14px; margin-bottom: 12px; display: block; ')
            setTimeout(() => {
              textResult.setAttribute('style', 'display: none')
            }, 5000)
          }
        } else {
          var textResult = document.getElementById('post-announcement-admin')
          textResult.innerHTML = "Đã xảy ra lỗi, mời nhập lại!"
          textResult.setAttribute('style', 'color: red; font-size: 14px; margin-bottom: 12px; display: block; ')
          setTimeout(() => {
            textResult.setAttribute('style', 'display: none')
          }, 5000)
        }
      };
      xhttp.send(formData)
    } else {
      var link = window.location.pathname
      link = link.split('/home').join('')
      console.log(link)
      xhttp.open('POST', `${link}/adnews`, true)
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status === 200) {
          const res = JSON.parse(this.responseText)
          if (res.status === 'success') {
            
            titleNews.value = ''
            contentNews.value = ''
            fileNews.value = ''
            nguonNews.value = ''
            
            var textResult = document.getElementById('post-announcement-news')
            textResult.innerHTML = "Bạn đã thêm bài báo mới thành công!"
            textResult.setAttribute('style', 'color: red; font-size: 14px; margin-bottom: 12px; display: block; ')

            // Reset style
            contentNews.style.height = 'auto'
            titleNews.style.height = 'auto'
            setTimeout(() => {
              textResult.setAttribute('style', 'display: none')
            }, 5000)


            callloadnew()
          }
        }
      }
      xhttp.send(formData)
    }

  }

  //xử lý thêm bài báo
  var titleNews = document.getElementById('title-news')
  var categoryNews = document.getElementById('category-add-item')
  var contentNews = document.getElementById('content-news')
  var fileNews = document.getElementById('image-news')
  var nguonNews = document.getElementById('nguon-news')
  var categoryNewOfNews = document.getElementById('category-news-new')

  document.getElementById('button-add-news').addEventListener('click', function () {
    console.log(contentNews)
    console.log(titleNews.value, categoryNews.value, fileNews.value, nguonNews.value)
    if (titleNews.value !== '' && contentNews.value !== '' && fileNews.value !== '' && nguonNews.value !== '') {
      if (categoryNewOfNews.value === '') {
        var avatarNew = fileNews.files[0]
        var formData = new FormData()
        formData.append('file', avatarNew, avatarNew.name)
        formData.append('title', titleNews.value)
        formData.append('content', contentNews.value)
        formData.append('category', categoryNews.value)
        formData.append('nguon', nguonNews.value)

        var xhttp = new XMLHttpRequest()
        uploadfile('news', formData, xhttp)
      } else {
        var avatarNew = fileNews.files[0]
        var formData = new FormData()
        formData.append('file', avatarNew, avatarNew.name)
        formData.append('title', titleNews.value)
        formData.append('content', contentNews.value)
        formData.append('categorynew', categoryNewOfNews.value)
        formData.append('nguon', nguonNews.value)

        var xhttp = new XMLHttpRequest()
        uploadfile('news', formData, xhttp)
      }


    } else {
      // alert('Thêm dữ liệu vào các trường tương ứng')
      var textResult = document.getElementById('post-announcement-news')
      textResult.innerHTML = "Thêm dữ liệu vào các trường tương ứng"
      textResult.setAttribute('style', 'color: red; font-size: 14px; margin-bottom: 12px; display: block; ')
      setTimeout(() => {
        textResult.setAttribute('style', 'display: none')
      }, 5000)
    }
  })

  // sự kiện nút làm mới
  document.getElementById('button-reset').addEventListener('click', function () {
    titleNews.value = ''
    contentNews.value = ''
    fileNews.value = ''
    nguonNews.value = ''
    categoryNewOfNews.value = ''
  })

})
// đồng ý chỉnh sửa bài báo
function confirmeditnew(element) {
  var link = window.location.pathname
  link = link.split('/home').join('')
  const id = element.parentNode.parentNode.parentNode.children[0].innerHTML
  const newTitle = element.parentNode.parentNode.parentNode.querySelector('.admin-management-right-modify-header > input').value
  const newContent = element.parentNode.parentNode.parentNode.querySelector('.admin-management-right-modify-body-content > textarea').value
  const newavatar = element.parentNode.parentNode.parentNode.querySelector('#file-edit-news')
  console.log(id)
  console.log(newavatar.files[0])
  var formData = new FormData()
  formData.append('id', id)
  formData.append('newtitle', newTitle)
  formData.append('newcontent', newContent)
  if (newavatar.value !== '') {
    formData.append('file', newavatar.files[0], newavatar.files[0].name)
  }

  var xhttp = new XMLHttpRequest()
  xhttp.open('PUT', '/admin/editnews', true)
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      if (this.responseText === 'success') {
        callloadnew()
      }
    }
  }
  xhttp.send(formData)

}
// hủy không thay đổi bài báo nữa
function canceleditnews() {
  callloadnew()
}
// hàm khi thay bấm nút chỉnh sửa bài báo
function modifyNews(element) {
  const id = element.parentNode.parentNode.parentNode.children[0].innerHTML
  const oldTitle = element.parentNode.parentNode.parentNode.querySelector('.admin-management-right-modify-header > p').innerHTML
  const oldContent = element.parentNode.parentNode.parentNode.querySelector('.admin-management-right-modify-body-content> p').innerHTML
  const oldavatar = element.parentNode.parentNode.parentNode.querySelector('.admin-management-right-modify-body-image > img').src
  console.log(oldavatar)

  element.parentNode.parentNode.parentNode.innerHTML = `
        <p style="display: none;" >${id}</p>
        <div class="admin-management-right-modify-header">
          <input type="text" value='${oldTitle}'>
          <div class="admin-management-right-modify-option">
            <i class="fas fa-check confirm" onclick="confirmeditnew(this)" ></i>
            <i class="fas fa-times cancel" onclick="canceleditnews()" ></i>
          </div>
        </div>
        <div class="admin-management-right-modify-body">
          <div class="admin-management-right-modify-body-image">
            <img src="${oldavatar}" alt="">
            <input type="file" id="file-edit-news" accept="image/png, image/jpeg" >
          </div>
          <div class="admin-management-right-modify-body-content">
            <textarea>${oldContent}</textarea>
          </div>
        </div>
        `
}

function deleteNews(element) {
  console.log(element.parentNode.parentNode.parentNode.children[0].innerHTML)
  var id = element.parentNode.parentNode.parentNode.children[0].innerHTML
  var xhttp = new XMLHttpRequest()
  xhttp.open('delete', `/admin/delete/${id}`, true)
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const res = JSON.parse(this.responseText)
      console.log(res)
      if (res.status === 'success') {
        callloadnew()
      }
    }
  }
  xhttp.send()
}

function callloadnew() {
  var link = window.location.pathname
  link = link.split('/home').join('')
  console.log(link)
  var xhttp = new XMLHttpRequest()
  xhttp.open('get', link + '/loadnews', true)
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const ress = JSON.parse(this.responseText)
      if (ress.status === 'success') {
        var parentNews = document.getElementsByClassName('admin-management-right-modify-list')[0]
        parentNews.innerHTML = ''
        var x = ``;
        ress.listnews.forEach(element => {
          x += `<div class="admin-management-right-modify-news">
                <p style="display: none;" >${element.id}</p>
                <div class="admin-management-right-modify-header">
                  <p>${element.tieude}</p>
                  <div class="admin-management-right-modify-option">
                    <i class="fas fa-pen modify" ondblclick="modifyNews(this)" ></i>
                    <i class="fas fa-trash delete" ondblclick="deleteNews(this)" ></i>
                  </div>
                </div>
                <div class="admin-management-right-modify-body">
                  <div class="admin-management-right-modify-body-image">
                    <img src='${element.anh}' alt="">
                    <p>Hình ảnh minh họa <span style="color: red;">*</span></p>
                  </div>
                  <div class="admin-management-right-modify-body-content">
                    <p>${element.noidung}</p>
                  </div>
                </div>
              </div>`
        })
        parentNews.innerHTML = x
      
        // Cập nhật số lượng
        const numNews = ress.listnews.length
        const numNewsView = document.querySelector('.admin-management-web-info-item:last-child h1')
        numNewsView.innerHTML = numNews
        console.log(ress.listNews);
        console.log(numNews)
      }
      
    }
  }
  xhttp.send()
}