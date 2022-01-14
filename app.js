// importl modules
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

// import routers
var indexRouter = require('./routes/index')
var userRouter = require('./routes/user')
var adminRouter = require('./routes/admin')

// variables
var app = express()
var port = process.env.PORT || '8888'

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


// middleware
app.use(express.json())
app.use(logger('tiny'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/public', express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/admin', adminRouter)

// run server
app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
