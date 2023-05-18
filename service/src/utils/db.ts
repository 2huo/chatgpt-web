import mysql from 'mysql2'

const connection = mysql.createConnection({
  host: '119.91.158.120',
  port: 3306,
  user: 'chatgpt',
  password: 'Pf3fdem3tBaXeihz',
  database: 'chatgpt',
})
connection.connect()

export function db_login(account: string, password: string, callback) {
  connection.query(`SELECT PASSWORD FROM \`users\` WHERE account=${account}`, callback)
}

export default connection
