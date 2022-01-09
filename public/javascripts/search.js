document.addEventListener('DOMContentLoaded', function(){
    
    // xử lý select
    const sortSelect = document.querySelector('.categorical-news-items-title-sort-time select')
    const colSelect = document.querySelector('.categorical-news-items-title-col-number select')
    const newsSelect = document.querySelector('.categorical-news-items-title-news-number select')
    const defaultMargin = 12
    

    sortSelect.addEventListener('change', function(){
        const currentSortType = sortSelect.value
        const currentNumNews = newsSelect.value
        
        sendChangeDisplayRequest(currentSortType, currentNumNews, 1) // trở về page 1
        setCurrentPage(1)
    })

    newsSelect.addEventListener('change', function(){
        const currentSortType = sortSelect.value
        const currentNumNews = newsSelect.value
        
        sendChangeDisplayRequest(currentSortType, currentNumNews, 1) // trở về page 1
        setCurrentPage(1)
    })

    // Xử lý thay đổi số cột
    function changeColNumberHandler(numCol) {
        const defaultHeight = document.querySelector('.categorical-news-item-image img').height
        const newsWidth = 100 / numCol
        const preValue = colSelect.getAttribute('data-prev')
        colSelect.setAttribute('data-prev', numCol)
        const items = document.querySelectorAll('.categorical-news-item')
        items.forEach(function(item){
            item.style.width = 'calc(' + newsWidth + '% - 12px)'
            item.style.marginBottom = (defaultMargin * preValue / numCol) + 'px'
            const image = item.querySelector('img')
            image.style.height = (defaultHeight * preValue / numCol) + 'px'
            if(numCol === 4){
                item.querySelector('p').style.display = 'none'
            }
            else{
                item.querySelector('p').style.display = 'block'
            }
        })
    }

    colSelect.addEventListener('change', function(){
      const numCol = +this.value
      changeColNumberHandler(numCol)
    })

    // xử lý resize window
    window.addEventListener('resize', function(){
        if(window.innerWidth <= 800){
            const images = document.querySelectorAll('.categorical-news-item-image img')
            const preValue = colSelect.getAttribute('data-prev')

            images.forEach(function(image){
                image.style.height = 36 * 2 / preValue + 'px'
            })
        }
        else{
            const images = document.querySelectorAll('.categorical-news-item-image img')
            const preValue = colSelect.getAttribute('data-prev')

            images.forEach(function(image){
                image.style.height = 60 * 2 / preValue + 'px'
            })
        }
    })
    
}, false);

// Về trang trước
function prevPage(){
    const currentPage = + document.querySelector('.current-page').innerHTML
    const currentSortType = document.querySelector('.categorical-news-items-title-sort-time select').value
    const currentNumNews = document.querySelector('.categorical-news-items-title-news-number select').value
    if(currentPage == 1) return
    else{
        sendChangeDisplayRequest(currentSortType, currentNumNews, currentPage - 1)
        setCurrentPage(currentPage - 1)
    }
}

// tới trang sau
function nextPage(){
    const currentPage = + document.querySelector('.current-page').innerHTML
    const currentSortType = document.querySelector('.categorical-news-items-title-sort-time select').value
    const currentNumNews = document.querySelector('.categorical-news-items-title-news-number select').value

    const maxPage = Math.ceil((+ document.querySelector('.num-result').innerHTML) / currentNumNews)
    if(currentPage >= maxPage) return
    else{
        sendChangeDisplayRequest(currentSortType, currentNumNews, currentPage + 1)
        setCurrentPage(currentPage + 1)
    }
}

function sendChangeDisplayRequest(sortType, numNews, pages){
    const xhttp = new XMLHttpRequest()

    // lấy key word
    const keyWord = document.querySelector('.key-word').innerHTML

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
                        <p>${item.noidung.split(' ').splice(0, 30).join(' ') + ((item.noidung.split(' ').length  > 30)? ' ...': '')}</p>
                    </div>
                </div>

                `
            })

            listItemsTag.innerHTML = str
            console.log('Done!');
        }
    }


    const url = new URL('http://' + window.location.host + `/queryNews`)
    url.searchParams.append('keyword', keyWord)
    url.searchParams.append('sortType', sortType)
    url.searchParams.append('numNews', numNews)
    url.searchParams.append('pages', pages)

    xhttp.open('GET', url, true)
    xhttp.send()
}

// Hàm thay đổi hiển thị trang hiện tại
function setCurrentPage(page){
    const pageDisplay = document.querySelector('.categorical-news-items-bottom p')
    
    // Tính max page
    const currentNumNews = document.querySelector('.categorical-news-items-title-news-number select').value
    const maxPage = Math.ceil((+ document.querySelector('.num-result').innerHTML) / currentNumNews)

    var str = ''

    for(let i = 1; i < page; i++){
        str += i + ' '
    }

    str += `<span class="current-page">${page}</span>`

    for(let i = page + 1; i < maxPage; i++){
        str += i + ' '
    }

    pageDisplay.innerHTML = `
    <i onclick="prevPage()" class="fas fa-angle-double-left prev-button"></i>${str}<i onclick="nextPage()" class="fas fa-angle-double-right next-button"></i>
    `
}