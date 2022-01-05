document.addEventListener('DOMContentLoaded', function(){
    // Auto-resize text area
    const textAreas = document.querySelectorAll('textarea')
    textAreas.forEach(function(ta, i){
      ta.addEventListener('input', function(){
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 6 + 'px';
      })
    })

    // xử lý sự kiện ấn nút chỉnh sửa
    const modifyButtons = document.querySelectorAll('.modify')
    modifyButtons.forEach(function(button, index){
      button.addEventListener('dblclick', function(){
        const oldTitle = this.parentNode.parentNode.parentNode.querySelector('.admin-management-right-modify-header > p').innerHTML
        const oldContent = this.parentNode.parentNode.parentNode.querySelector('.admin-management-right-modify-body-content> p').innerHTML

        this.parentNode.parentNode.parentNode.innerHTML = `
        <div class="admin-management-right-modify-header">
          <input type="text" value='${oldTitle}'>
          <div class="admin-management-right-modify-option">
            <i class="fas fa-check confirm"></i>
            <i class="fas fa-times cancel"></i>
          </div>
        </div>
        <div class="admin-management-right-modify-body">
          <div class="admin-management-right-modify-body-image">
            <img src="/public/images/slide3.jpg" alt="">
            <input type="file">
          </div>
          <div class="admin-management-right-modify-body-content">
            <textarea>${oldContent}</textarea>
          </div>
        </div>
        `

        // thêm lại sự kiện cho mục text area
        // chưa thực hiện

        // thêm sự kiện cho 2 button
        const confirmButton = this.parentNode.parentNode.parentNode.querySelector('.confirm')
        const cancelButton = this.parentNode.parentNode.parentNode.querySelector('.cancel')
        // chưa thực hiện
        
      })
    })

    // xử lý sự kiện ấn nút xóa
    const deleteButtons = document.querySelectorAll('.delete')
    deleteButtons.forEach(function(button, index){
      button.addEventListener('dblclick', function(){
        this.parentNode.parentNode.parentNode.style.display = 'none'

      // xử lý phía cơ sở dữ liệu
      })
    })
})