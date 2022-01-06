const config = require('./config.json')
const mysql = require('mysql')

module.exports = {
    createConnection: function (){
        const connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        })
        connection.connect()

        return connection
    }
}