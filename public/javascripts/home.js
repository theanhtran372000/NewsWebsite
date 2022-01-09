document.addEventListener('DOMContentLoaded', function(){
    /* ------  Hiệu ứng chuyển ảnh khi click trên ảnh nhỏ ----- */
    const bigImage = document.querySelector('.latest-news-big-image img')
    const smallImages = document.querySelectorAll('.latest-news-small-image img')
    var selectedIndex = 0
    const contentLimit = 200 // hiển thị 30 từ

    // Sự kiện click lên ảnh nhỏ
    smallImages.forEach(function(smallImage, index){
      smallImage.addEventListener('click', function(){
        selectedIndex = index

        // cập nhật ảnh
        var oldSrc = bigImage.src
        bigImage.src = smallImage.src
        smallImage.src = oldSrc

        // cập nhật nội dung
        changeNews(bigImage.src, contentLimit)
      })
    })

    // Tự động chuyển ảnh sau 5s
    setInterval(function(){
        const bigImage = document.querySelector('.latest-news-big-image img')
        const smallImages = document.querySelectorAll('.latest-news-small-image img')

        // chuyển sang ảnh tiếp theo
        selectedIndex ++ 
        if(selectedIndex >= smallImages.length) 
            selectedIndex = 0

        // cập nhật ảnh
        var oldSrc = bigImage.src
        bigImage.src = smallImages[selectedIndex].src
        smallImages[selectedIndex].src = oldSrc

        // cập nhật nội dung
        changeNews(bigImage.src, contentLimit)
    }, 10000)
})

// Thay đổi nội dung tin cũ bằng tin mới
function changeNews(src, limit){
    const url = new URL(src)
    const xhttp = new XMLHttpRequest()
    xhttp.open('GET', `/findNewsByImageSrc?src=${url.pathname}`)
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const res = JSON.parse(this.responseText)
            const title = document.querySelector('.latest-news-content-box h1')
            const content = document.querySelector('.latest-news-content-box p')
            const xemThem = document.querySelector('.latest-news-content-more a')

            // Tìm thấy nội dung bản tin
            if(res['status'] == 'Success'){
                // Đổi tiêu đề
                title.innerHTML = res['tieude']

                // Đổi nội dung
                if(res['noidung'].split(' ').length > limit)
                    content.innerHTML = res['noidung'].split(' ').splice(0, limit).join(' ') + ' ...'
                else
                    content.innerHTML = res['noidung']

                // Đổi đường dẫn của button xem thêm
                const id = res['id'] // id bản tin
                xemThem.setAttribute('href', window.location.pathname.split('/').splice(0, 3).join('/') +  `/news/${id}`) // Đường dẫn tới bản tin

            }

            // Xảy ra lỗi
            else{
                title.innerHTML = res['message']
                content.innerHTML = res['message']
            }
        }
    }

    xhttp.send()
}