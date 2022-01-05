document.addEventListener('DOMContentLoaded', function(){
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