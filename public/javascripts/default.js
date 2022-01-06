document.addEventListener('DOMContentLoaded', function(){
    // Responsive cho header
    resizeHandler()
    window.onresize = resizeHandler
}, false);

// Hàm xử lý responsive cho header
function resizeHandler (){
    // Lấy danh sách tiêu đề
    const menu = document.querySelector('.menu')
    const aTags = menu.querySelectorAll('.topic')

    const topicList = []
    aTags.forEach((a) => {
        topicList.push(a.innerHTML)
    })

    // Hiển thị lại theo kích thước màn hình
    if(window.innerWidth <= 1200 && window.innerWidth > 800){
        str = `
        <li><a href="">Danh sách chủ đề <i class="fas fa-caret-down"></i></a>
            <ul class="sub-menu">
        `
        
        topicList.forEach(function(topic){
            str += `<li><a href="#" class="topic">${topic}</a></li>`
        })

        str += '</ul></li>'

        menu.innerHTML = str
    }
    else if(window.innerWidth < 800){
        str = `
        <li><a href=""><i class="fas fa-bars fa-2x"></i></a>
            <ul class="sub-menu">
        `
        
        topicList.forEach(function(topic){
            str += `<li><a href="#" class="topic">${topic}</a></li>`
        })

        str += '</ul></li>'

        menu.innerHTML = str
    }
    else{
        str = ''
        const limit = 9

        if(topicList.length < limit){
            for (let i = 0; i < topicList.length; i++){
                str += `<li><a href="" class="topic">${topicList[i]}</a></li>`
            }
        }
        else{
            for (let i = 0; i < limit - 1; i++){
                str += `<li><a href="" class="topic">${topicList[i]}</a></li>`
            }

            str += `
            <li><a href="">Thêm <i class="fas fa-caret-down"></i></a>
                <ul class="sub-menu">
            `

            for (let i = limit - 1; i < topicList.length; i++){
                str += `<li><a href="" class="topic">${topicList[i]}</a></li>`
            }

            str += `</ul></li>`
        }
        
        menu.innerHTML = str
    }
}