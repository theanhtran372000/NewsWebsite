document.addEventListener('DOMContentLoaded', function(){
    
    // xử lý select
    const sortSelect = document.querySelector('.categorical-news-items-title-sort-time select')
    const colSelect = document.querySelector('.categorical-news-items-title-col-number select')
    const newsSelect = document.querySelector('.categorical-news-items-title-news-number select')
    const defaultMargin = 12
    

    sortSelect.addEventListener('change', function(){
      console.log(this.value)

      // chưa xử lý
      // ... 
    })

    newsSelect.addEventListener('change', function(){
      console.log(this.value)

      // Chưa xử lý
      // ...
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

