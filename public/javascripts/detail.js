document.addEventListener('DOMContentLoaded', function(){
    starResizing()
    window.addEventListener('resize', function(){
        starResizing()
    })

    //   auto resize text area
    const textArea = document.querySelector('.news-detail-left-comment-input textarea')
    textArea.addEventListener('input', function(){
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    })

    // star bar
    const stars = document.querySelectorAll('.news-detail-left-comment-input-top-comment-box-rate-star i')
    stars.forEach(function(star, index){
        star.addEventListener('click', function(){
            const selectedStars = document.querySelectorAll('.news-detail-left-comment-input-top-comment-box-rate-star i.fas')

            // xóa lựa chọn trước đó
            selectedStars.forEach(function(s, i){
                s.classList.remove('fas')
                s.classList.add('far')
            })

            // chọn lại sao
            for(let i = 0; i <= index; i++){
                stars[i].classList.remove('far')
                stars[i].classList.add('fas')
            }
        })
    })

    // Đặt lại các lựa chọn username
    if (window.location.pathname.split('/')[2]=="1"){
        // Nếu đăng nhập tài khoản khách thì bỏ lựa chọn username
        document.querySelectorAll('#name option')[0].remove()
    }
    else {
        // nếu đăng nhập tài khoản không phải khách thì bỏ dòng cần đăng nhập
        document.querySelector(".news-detail-left-comment-input-button p").innerHTML = ""
    }

    // Đặt thông số các giá trị rate sao
    setRateValue()
})

// Hàm thay đổi số sao đánh giá
function starResizing(){
    if(window.innerWidth <= 800){
        const stars = document.querySelectorAll('.news-detail-left-comment-input-top-comment-box-rate i.fa-star')
        stars.forEach(function(star){
            star.classList.remove('fa-2x')
        })
    }
    else{
        const stars = document.querySelectorAll('.news-detail-left-comment-input-top-comment-box-rate i.fa-star')
        stars.forEach(function(star){
            star.classList.add('fa-2x')
        })
    }
}

// hàm thêm comment mới
function addComment(){
    // lấy input
    var name = document.querySelector('.news-detail-left-comment-input-top-comment-box-name select').value
    var email = document.querySelector('.news-detail-left-comment-input-top-comment-box-email input')
    var comment = document.querySelector('.news-detail-left-comment-input textarea')
    const rate = document.querySelectorAll('.news-detail-left-comment-input-top-comment-box-rate-star .fas.fa-star.fa-2x').length
    const btnAddCmt = document.querySelector('.news-detail-left-comment-input-button button').checked

    const arr = window.location.pathname.split('/')
    var userid = arr[2]
    const baibaoid = arr[4]

    // nếu đã đăng nhập mà muốn cmt ẩn danh thì set userid = 1
    if (name=="anomymous"){
        userid = "1"
    }

    // kiểm tra email va comment
    if (!checkCmt(email.value, comment.value)){
        console.log("không cho comment")
        return
    }

    // Nếu nút bình luận được ấn
    if (!btnAddCmt){
        // Gửi thông tin tới server
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                const res = JSON.parse(this.responseText)
    
                // query thành công
                if(res['status'] == 'Success'){
                    
                    console.log(res['message'])
                    updateComment(baibaoid)

                    // xóa trường email và comment box
                    email.value= ""
                    comment.value= ""
                }
                else{
                    console.log("Failed")
                    alert(res.message)
                }
            }
        }

        xhttp.open("POST",  `/user/addComment`, true)
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(`baibaoid=${baibaoid}&userid=${userid}&noidung=${comment.value}&email=${email.value}&rate=${rate}`)

    }
}

// Cập nhật các comment khi thêm mới comment
function updateComment(baibaoid){
    // gửi POST request tới server bằng AJAX
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const res = JSON.parse(this.responseText)

            // thành công
            if(res['status'] == 'Success'){
                comments = res['comments']

                // ẩn thẻ thông báo
                const announce = document.querySelector('.comment-announcement')
                if(announce != null)
                    announce.style.display = 'none'
                    
                // update số rate
                var count = [0,0,0,0,0]
                comments.forEach(function(item){
                    tmp = item.rate
                    if (tmp==1) count[0]++
                    else if (tmp==2) count[1]++
                    else if (tmp==3) count[2]++
                    else if (tmp==4) count[3]++
                    else count[4]++

                })
                document.querySelectorAll(".news-detail-left-comment-user-rating-content td:nth-child(3)").forEach(function(item, index){
                    item.innerHTML = count[4-index]
                })

                // update các thanh rate và số liệu
                setRateValue()

                const parent = document.querySelector(".news-detail-left-comment-list-items")
                const listCmt = document.querySelectorAll(".news-detail-left-comment-item")

                // remove all cmt
                listCmt.forEach(function(cmt){
                    cmt.remove()
                })

                // load lại 5 cmt đầu
                var i
                for (i=0; i< Math.min(comments.length, 5); i++) {

                    var username = comments[i]['username']
                    var noidung = comments[i]['noidung']

                    const date = new Date(comments[i]['thoigian'])
                    const thoigian = getDateString(date)


                    var div = document.createElement("div")
                    var att = document.createAttribute("class")
                    att.value = ("news-detail-left-comment-item")
                    div.setAttributeNode(att)

                    div.innerHTML = `
                    <div class="news-detail-left-comment-item-user">
                        <h1><i class="fas fa-user"></i>${username}</h1>
                    </div>
                    <div class="news-detail-left-comment-item-content">
                        <p>${noidung}</p>
                        <p>${thoigian}</p>
                    </div>
                    `
                    parent.appendChild(div)
                }
                
            }
            else{
                console.log("Failed")
            }
        }
    }

    xhttp.open("POST",  `/user/getAllCmt`, true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`baibaoid=${baibaoid}`)
}

// định dạnh số hiển thị của thời gian
function formatDateTime(t){
    return ('0' + t).slice(-2)
}


// hàm chuyển từ định dạng DATETIME sang chuỗi định dạng thời gian HH:MM:SS DD-MM-YYYY
function getDateString(date){
    return `${formatDateTime(date.getHours())}:${formatDateTime(date.getMinutes())}:${formatDateTime(date.getSeconds())} ${formatDateTime(date.getDate())}-${formatDateTime(date.getMonth()+1)}-${formatDateTime(date.getFullYear())}`
}

// Hàm tải thêm các comment
function showMore(){
    // lấy id bai bao
    const baibaoid = window.location.pathname.split('/')[4]

    const btnShowMore = document.querySelector(".news-detail-left-comment-more a").checked

    // Sự kiện ấn nút Thêm bình luận
    if (!btnShowMore){
        // Gửi thông tin tới server
        var xhttp = new XMLHttpRequest()

        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                const res = JSON.parse(this.responseText)

                // Xử lý thành công
                if(res['status'] == 'Success'){
                    comments = res['comments']

                    const parent = document.querySelector(".news-detail-left-comment-list-items")
                    const listCmt = document.querySelectorAll(".news-detail-left-comment-item")
                    const newLen = listCmt.length + 10
                    
                    parent.innerHTML = ''

                    // load tiếp 10 cmt
                    for (let i = 0; i< Math.min(comments.length, newLen); i++) {

                        var username = comments[i]['username']
                        var noidung = comments[i]['noidung']
                        
                        const date = new Date(comments[i]['thoigian'])
                        const thoigian = getDateString(date)


                        var div = document.createElement("div")
                        var att = document.createAttribute("class")
                        att.value = ("news-detail-left-comment-item")
                        div.setAttributeNode(att)

                        div.innerHTML = `
                        <div class="news-detail-left-comment-item-user">
                            <h1><i class="fas fa-user"></i>${username}</h1>
                        </div>
                        <div class="news-detail-left-comment-item-content">
                            <p>${noidung}</p>
                            <p>${thoigian}</p>
                        </div>
                        `
                        parent.appendChild(div)
                    }
                    
                }
                else{
                    console.log("Failed")
                }
            }
        }

        xhttp.open("POST",  `/user/getAllCmt`, true)
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(`baibaoid=${baibaoid}`)

    }
    
}

// Hàm đặt lại giá trị số sao trung bình và các thanh rate
function setRateValue(){
    var rate = [0,0,0,0,0]  //số lượng rate từ 5->1 sao
    var count = 0
    var sum = 0
    document.querySelectorAll(".news-detail-left-comment-user-rating-content td:nth-child(3)").forEach(function(item, index){
        num = Number(item.textContent)
        rate[index] = num
        count += num
        sum += num*(5-index)
    })

    rateSlide = document.querySelectorAll(".rate-value")
    if (!count){
        // trường hợp chưa có đánh giá sao nào
        document.getElementById('avarage').innerHTML = 0
        document.getElementById('countCmt').innerHTML = 0

        rateSlide.forEach(function(item){
            item.style.width = "0%"
        })
    }
    else {
        // Thay đổi giá trị trung bình và số sao rate
        document.getElementById('avarage').innerHTML = (sum/count).toFixed(2)
        document.getElementById('countCmt').innerHTML = count

        rateSlide.forEach(function(item, index){
            item.style.width = `${rate[index]/count*100}%`
        })
    }

}

// Hàm kiểm tra email và nội dung bình luận
function checkCmt(email, noidung){
    // check có dữ liệu ko
    if (email.length==0 || noidung.length==0){ 
        alert('Hãy nhập đủ nội dung bình luận');
        return false; 
    }

    // check email
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
    if (!filter.test(email)) { 
        alert('Hãy nhập địa chỉ email hợp lệ.\nExample@gmail.com');
        return false; 
    }
    
    return true
}