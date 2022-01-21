// Hằng số
const newsPerPage = 20 // số tin hiển thị trên 1 trang
const maxNewsLength = 40 // Độ dài tối đa của một tin

document.addEventListener('DOMContentLoaded', function(){
    
    // xử lý select
    const sortSelect = document.querySelector('.categorical-news-items-title-sort-time select')

    sortSelect.addEventListener('change', function(){
        const currentSortType = sortSelect.value
        
        sendChangeDisplayRequest(currentSortType, newsPerPage, 1) // trở về page 1
        setCurrentPage(1)
    })

}, false);

// Về trang trước
function prevPage(){
    const currentPage = + document.querySelector('.current-page a').innerHTML
    const currentSortType = document.querySelector('.categorical-news-items-title-sort-time select').value

    if(currentPage == 1) return
    else{
        sendChangeDisplayRequest(currentSortType, newsPerPage, currentPage - 1)
        setCurrentPage(currentPage - 1)
    }
}

// tới trang sau
function nextPage(){
    const currentPage = + document.querySelector('.current-page a').innerHTML
    const currentSortType = document.querySelector('.categorical-news-items-title-sort-time select').value

    const maxPage = Math.ceil((+ document.querySelector('.num-result').innerHTML) / newsPerPage)
    if(currentPage >= maxPage) return
    else{
        sendChangeDisplayRequest(currentSortType, newsPerPage, currentPage + 1)
        setCurrentPage(currentPage + 1)
    }
}

// Hàm gửi yêu cầu load dữ liệu trang mới
function sendChangeDisplayRequest(sortType, numNews, pages){
    const xhttp = new XMLHttpRequest()

    // lấy id chủ đề
    const pathSplit = window.location.pathname.split('/')
    const categoryId = pathSplit[pathSplit.length - 1]

    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const res = JSON.parse(this.responseText)

            // Đổ dữ liệu ra màn hình
            const listNews = res['result']
            const listItemsTag = document.querySelector('.categorical-news-items')

            var str = ''

            listNews.forEach(function(item){
                const pathname = window.location.pathname.split('/').splice(0, 3).join('/')
                const path = pathname + `/news/${item.id}`

                str += `
                
                <div class="categorical-news-item">
                    <div class="categorical-news-item-image">
                        <img src="${item.anh}" alt="">
                    </div>
                    <div class="categorical-news-item-content">
                        <a href="${path}"><h2>${item.tieude}</h2></a>
                        <p>${item.noidung.split(' ').splice(0, maxNewsLength).join(' ') + ((item.noidung.split(' ').length  > maxNewsLength)? ' ...': '')}</p>
                    </div>
                </div>

                `
            })

            listItemsTag.innerHTML = str
            console.log('Done!');
        }
    }

    const url = new URL(window.location.protocol + '//' + window.location.host + `/filterNews`)
    url.searchParams.append('categoryId', categoryId)
    url.searchParams.append('sortType', sortType)
    url.searchParams.append('numNews', numNews)
    url.searchParams.append('pages', pages)

    xhttp.open('GET', url, true)
    xhttp.send()
}

// Hàm thay đổi dòng hiển thị trang hiện tại
function setCurrentPage(page){
    const pageDisplay = document.querySelector('.categorical-news-items-bottom p')
    
    // Tính max page
    const maxPage = Math.ceil((+ document.querySelector('.num-result').innerHTML) / newsPerPage)

    var str = ''

    for(let i = 1; i < page; i++){
        str += `<a onclick="changePage(this)">${i}</a>` + '<span>&emsp;</span> '
    }

    str += `<span class="current-page"><a onclick="changePage(this)">${page}</a></span> <span>&emsp;</span> `

    for(let i = page + 1; i <= maxPage; i++){
        str += `<a onclick="changePage(this)">${i}</a>` + '<span>&emsp;</span> '
    }

    pageDisplay.innerHTML = `
    <i onclick="prevPage()" class="fas fa-angle-double-left prev-button"></i> <span>&emsp;</span> ${str} <i onclick="nextPage()" class="fas fa-angle-double-right next-button"></i>
    `
}

// Hàm chuyển trang
function changePage(page){
    const currentPage = + page.innerHTML
    const currentSortType = document.querySelector('.categorical-news-items-title-sort-time select').value

    sendChangeDisplayRequest(currentSortType, newsPerPage, currentPage)
    setCurrentPage(currentPage)
}