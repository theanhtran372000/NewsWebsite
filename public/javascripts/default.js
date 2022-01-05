document.addEventListener('DOMContentLoaded', function(){
    // Responsive cho header
    resizeHandler()
    window.onresize = resizeHandler
}, false);

// Hàm xử lý responsive cho header
function resizeHandler (){
    if(window.innerWidth <= 1200 && window.innerWidth > 800){
        const menu = document.querySelector('.menu')
        menu.innerHTML = `
        <li><a href="">Danh sách chủ đề <i class="fas fa-caret-down"></i></a>
            <ul class="sub-menu">
                <li><a href="">Chính trị</a></li>
                <li><a href="">Dân sinh</a></li>
                <li><a href="">Giao thông</a></li>
                <li><a href="">Mekong</a></li>
                <li><a href="">Quỹ hi vọng</a></li>
                <li><a href="">Tết yêu thương</a></li>
                <li><a href="">Du lịch</a></li>
                <li><a href="">Thời sự</a></li>
                <li><a href="">Góc nhìn</a></li>
                <li><a href="">Thế giới</a></li>
                <li><a href="">Kinh doanh</a></li>
                <li><a href="">Khoa học</a></li>
                <li><a href="">Thể thao</a></li>
                <li><a href="">Sức khỏe</a></li>
                <li><a href="">Pháp luật</a></li>
                <li><a href="">Đời sống</a></li>
            </ul>
        </li>
        `
    }
    else if(window.innerWidth < 800){
        const menu = document.querySelector('.menu')
        menu.innerHTML = `
        <li><a href=""><i class="fas fa-bars fa-2x"></i></a>
            <ul class="sub-menu">
                <li><a href="">Chính trị</a></li>
                <li><a href="">Dân sinh</a></li>
                <li><a href="">Giao thông</a></li>
                <li><a href="">Mekong</a></li>
                <li><a href="">Quỹ hi vọng</a></li>
                <li><a href="">Tết yêu thương</a></li>
                <li><a href="">Du lịch</a></li>
                <li><a href="">Thời sự</a></li>
                <li><a href="">Góc nhìn</a></li>
                <li><a href="">Thế giới</a></li>
                <li><a href="">Kinh doanh</a></li>
                <li><a href="">Khoa học</a></li>
                <li><a href="">Thể thao</a></li>
                <li><a href="">Sức khỏe</a></li>
                <li><a href="">Pháp luật</a></li>
                <li><a href="">Đời sống</a></li>
            </ul>
        </li>
        `
    }
    else{
        const menu = document.querySelector('.menu')
        menu.innerHTML = `
        <li><a href="">Thời sự</a></li>
        <li><a href="">Góc nhìn</a></li>
        <li><a href="">Thế giới</a></li>
        <li><a href="">Kinh doanh</a></li>
        <li><a href="">Khoa học</a></li>
        <li><a href="">Thể thao</a></li>
        <li><a href="">Sức khỏe</a></li>
        <li><a href="">Thêm <i class="fas fa-caret-down"></i></a>
            <ul class="sub-menu">
                <li><a href="">Chính trị</a></li>
                <li><a href="">Dân sinh</a></li>
                <li><a href="">Giao thông</a></li>
                <li><a href="">Mekong</a></li>
                <li><a href="">Quỹ hi vọng</a></li>
                <li><a href="">Tết yêu thương</a></li>
                <li><a href="">Du lịch</a></li>
                <li><a href="">Đời sống</a></li>
                <li><a href="">Pháp luật</a></li>
            </ul>
        </li>
        `
    }
}