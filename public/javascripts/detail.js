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

            // chọn lại
            for(let i = 0; i <= index; i++){
                stars[i].classList.remove('far')
                stars[i].classList.add('fas')
            }
        })
    })
})

function starResizing(){
    if(window.innerWidth <= 800){
        const stars = document.querySelectorAll('i.fa-star')
        stars.forEach(function(star){
            star.classList.remove('fa-2x')
        })
    }
    else{
        const stars = document.querySelectorAll('i.fa-star')
        stars.forEach(function(star){
            star.classList.add('fa-2x')
        })
    }
}