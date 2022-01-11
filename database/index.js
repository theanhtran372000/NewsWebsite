const config = require('../config.json').DBInfo
const mysql = require('mysql')

module.exports = {
    createConnection: function (){
        const connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            multipleStatements: true
        })
        connection.connect()

        return connection
    }
}