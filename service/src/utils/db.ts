import type { RowDataPacket } from 'mysql2'
import mysql from 'mysql2'

const connection = mysql.createConnection({
  host: '119.91.158.120',
  port: 3306,
  user: 'chatgpt',
  password: 'Pf3fdem3tBaXeihz',
  database: 'chatgpt',
})
connection.connect()

export async function db_login(account: string, password: string) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT PASSWORD FROM \`users\` WHERE account="${account}"`, (err, result) => {
      if (err)
        reject(new Error('账号不存在或密码错误'))
      if (result) {
        const pwd = (result as RowDataPacket[])[0]?.PASSWORD
        if (!pwd || password !== pwd)
          reject(new Error('账号不存在或密码错误'))

        resolve('登录成功')
      }
      else {
        reject(new Error('登录错误'))
      }
    })
  })
}

export async function db_register_user(account: string, password: string, email: string, tel: string) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT COUNT(*) as COUNT FROM \`users\` WHERE account="${account}"`, (_, select_result) => {
      const count_user = (select_result as RowDataPacket[])[0]?.COUNT
      if (count_user === 0) {
        connection.query(`INSERT INTO \`users\` (\`account\`, \`password\`, \`email\`, \`tel\`) VALUES ("${account}", "${password}", "${email}", "${tel}");`, (insert_err, result) => {
          if (insert_err) {
            console.log(insert_err)
            reject(new Error('注册失败'))
          }

          resolve('注册成功')
        })
      }
      else {
        reject(new Error('账号已存在'))
      }
    })
  })
}

export async function db_update_chatStorage(account: string, chatStorage: string) {
  // console.log('db_update_chatStorage')
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE `users` SET `chatStorage`= ? WHERE account= ?'
    // console.log(sql)
    connection.query({ sql, values: [chatStorage, account] }, () => {
      // console.log('db_update_chatStorage - err', err)
      // console.log('db_update_chatStorage - update_result', update_result)
      resolve('修改成功')
    })
  })
}

export async function db_get_chatStorage(account: string) {
  console.log('db_get_chatStorage')
  return new Promise((resolve, reject) => {
    connection.query(`SELECT chatStorage FROM \`users\` WHERE account=${account}`, (_, select_result) => {
      const chatStorage: string = (select_result as RowDataPacket[])[0]?.chatStorage
      resolve(chatStorage)
    })
  })
}

export default connection
