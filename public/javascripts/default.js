document.addEventListener('DOMContentLoaded', function(){
    // Responsive cho header
    resizeHandler()
    window.onresize = resizeHandler
}, false);

// Tìm kiếm tin theo từ khóa
function searchNews(){
    const input = document.querySelector('.others input').value

    // Gửi request tới backend
    const url = new URL('http://' + window.location.host + window.location.pathname.split('/').splice(0, 3).join('/') + '/search')
    url.searchParams.append('q', input)
    
    window.location = url
}

// Hàm xử lý responsive cho header
function resizeHandler (){
    // Lấy danh sách tiêu đề
    const menu = document.querySelector('.menu')
    const aTags = menu.querySelectorAll('.topic')
    const hostUrl = window.location.pathname.split('/').splice(0, 3).join('/')

    const topicList = []
    aTags.forEach((a) => {
        topicList.push({
            chudeid: a.getAttribute('data-id'),
            tenchude: a.innerHTML
        })
    })

    // Hiển thị lại theo kích thước màn hình (responsive header)
    if(window.innerWidth <= 1200 && window.innerWidth > 800){
        str = `
        <li><a href="#">Danh sách chủ đề <i class="fas fa-caret-down"></i></a>
            <ul class="sub-menu">
        `
        
        topicList.forEach(function(topic){
            str += `<li><a href="${hostUrl}/category/${topic.chudeid}" data-id="${topic.chudeid}" class="topic">${topic.tenchude}</a></li>`
        })

        str += '</ul></li>'

        menu.innerHTML = str
    }
    else if(window.innerWidth < 800){
        str = `
        <li><a href="#"><i class="fas fa-bars fa-2x"></i></a>
            <ul class="sub-menu">
        `
        
        topicList.forEach(function(topic){
            str += `<li><a href="${hostUrl}/category/${topic.chudeid}" data-id="${topic.chudeid}" class="topic">${topic.tenchude}</a></li>`
        })

        str += '</ul></li>'

        menu.innerHTML = str
    }
    else{
        str = ''
        const limit = 8

        if(topicList.length < limit){
            for (let i = 0; i < topicList.length; i++){
                str += `<li><a href="${hostUrl}/category/${topicList[i].chudeid}" data-id="${topicList[i].chudeid}" class="topic">${topicList[i].tenchude}</a></li>`
            }
        }
        else{
            for (let i = 0; i < limit - 1; i++){
                str += `<li><a href="${hostUrl}/category/${topicList[i].chudeid}" data-id="${topicList[i].chudeid}" class="topic">${topicList[i].tenchude}</a></li>`
            }

            str += `
            <li><a href="#">Thêm <i class="fas fa-caret-down"></i></a>
                <ul class="sub-menu">
            `

            for (let i = limit - 1; i < topicList.length; i++){
                str += `<li><a href="${hostUrl}/category/${topicList[i].chudeid}" data-id="${topicList[i].chudeid}" class="topic">${topicList[i].tenchude}</a></li>`
            }

            str += `</ul></li>`
        }
        
        menu.innerHTML = str
    }
}