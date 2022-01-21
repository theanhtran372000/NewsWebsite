document.addEventListener('DOMContentLoaded', function(){
    
    // Chuyển đổi giữa tab đăng nhập và đăng ký
    const loginTitle = document.querySelector('.login-content-left-title-login')
    const registerTitle = document.querySelector('.login-content-left-title-register')
    const loginBody = document.querySelector('.login-content-left-body-login')
    const registerBody = document.querySelector('.login-content-left-body-register')

    loginTitle.addEventListener('click', function(){
        loginBody.style.display = 'block'
        registerBody.style.display = 'none'
        loginTitle.classList.add('login-title-chose')
        registerTitle.classList.remove('login-title-chose')
    })

    registerTitle.addEventListener('click', function(){
        loginBody.style.display = 'none'
        registerBody.style.display = 'block'
        loginTitle.classList.remove('login-title-chose')
        registerTitle.classList.add('login-title-chose')
    })
})

// Hàm đăng nhập
function login(){
    // lấy dữ liệu input
    const username = document.querySelector('.login-username').value
    const password = document.querySelector('.login-password').value
    const admin = document.querySelector('.login-admin').checked

    console.log(username, password, admin);

    // Đăng nhập dưới quyền admin
    if(admin){
        // phần đăng nhập admin lộc làm 
        console.log("admin")
        sendPostRequestAdmin(username, password)
    }
    // Đăng nhập dưới quyền user
    else{
        sendLoginRequest(username, password)
    }
}

// Hàm đăng nhập dành cho khách
function guestLogin(){
    sendLoginRequest("guest", "guest")
}

// Hàm gửi POST request bằng AJAX
function sendLoginRequest(username, password){
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const res = JSON.parse(this.responseText)

            // Đăng nhập thành công
            if(res['status'] == 'Success'){
                const userid = res['userid']
                console.log(userid);
                window.location = `./user/${userid}/home`
            }
            else{
                document.querySelector('.login-announcement').innerHTML = res['message']
            }
        }
    }

    xhttp.open("POST",  `/user/login`, true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`username=${username}&password=${password}`)
}

// Hàm gửi POST request bằng AJAX vs đăng nhập bằng admin
function sendPostRequestAdmin(username, password){
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            const res = JSON.parse(this.responseText)
            // đăng nhập thành công
            if(res['status'] == 'Success'){
                console.log("success")
                const adminid = res['adminid']
                window.location = `admin/${adminid}/home`
            }
            //đăng nhập thất bại
            else{
                document.querySelector('.login-announcement').innerHTML = res['message']
            }
        }
    }
    xhttp.open("POST", `/admin/login`, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`username=${username}&password=${password}`)
}

// Hàm đăng ký
function register(){
    // lấy dữ liệu input
    const username = document.querySelector('.register-username').value
    const password1 = document.querySelector('.register-password-1').value
    const password2 = document.querySelector('.register-password-2').value
    const accept = document.querySelector('.register-accept').checked
    const announcement = document.querySelector('.register-announcement')

    console.log(username, password1, password2, accept)

    // Không đồng ý với điều khoản
    if(! accept){
        announcement.innerHTML = 'Bạn chưa đồng ý với điều khoản.'
    }

    // Đồng ý với điều khoản
    else{
        // Kiểm tra trường nhập lại mật khẩu
        if(password1 != password2){
            announcement.innerHTML = 'Mật khẩu nhập lại không chính xác.'
        }
        else{
            // Các trường thông tin đã chính xác
            // Gửi thông tin tới server

            var xhttp = new XMLHttpRequest()

            xhttp.open("POST",  `/user/register`, true)
            xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            // Xử lý dữ liệu trả về
            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    const res = JSON.parse(this.responseText)
                    announcement.innerHTML = res['message']
                }
            }

            xhttp.send(`username=${username}&password=${password1}`)
        }
    }
}