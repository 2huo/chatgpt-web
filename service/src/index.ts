import express from 'express'
import jwt from 'jsonwebtoken'
import type { IUser, RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { db_get_chatStorage, db_login, db_register_user, db_update_chatStorage } from './utils/db'
import { isNotEmptyString } from './utils/is'

const app = express()
const router = express.Router()

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {}, systemMessage, temperature, top_p } = req.body as RequestProps
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
      temperature,
      top_p,
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/update_chatStorage', auth, async (req, res) => {
  try {
    const account = (req as any).user_account
    const {
      chatStorage,
    } = req.body as IUser
    // console.log(account, chatStorage)
    await db_update_chatStorage(account, chatStorage)
    res.send({ status: 'Success', message: '', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.get('/get_chatStorage', auth, async (req, res) => {
  try {
    const account = (req as any).user_account
    const chatStorage = await db_get_chatStorage(account)
    res.send({ status: 'Success', message: '', data: { chatStorage } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    // const { token } = req.body as { token: string }
    // if (!token)
    //   throw new Error('Secret key is empty')

    // if (process.env.AUTH_SECRET_KEY !== token)
    //   throw new Error('密钥无效 | Secret key is invalid')

    res.send({
      status: 'Success',
      message: 'Verify successfully',
      data: null,
    })
  }
  catch (error) {
    res.send({
      status: 'Fail',
      message: error.message,
      data: null,
    })
  }
})

router.post('/login', async (req, res) => {
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  try {
    const {
      account,
      password,
    } = req.body as IUser
    if (!account) {
      throw new Error('请检查账号是否合法')
    }
    else {
      await db_login(account, password)
      const token = jwt.sign({
        id: String(account),
      }, AUTH_SECRET_KEY)
      res.send({
        status: 'Success',
        message: '登录成功',
        data: {
          token,
        },
      })
    }
  }
  catch (error) {
    res.send({
      status: 'Fail',
      message: error.message,
      data: null,
    })
  }
})

router.post('/register', async (req, res) => {
  try {
    const {
      account,
      password,
      email,
      tel,
    } = req.body as IUser
    // console.log(req.body)
    await db_register_user(account, password, email, tel)

    res.send({
      status: 'Success',
      message: '注册成功',
      data: null,
    })
  }
  catch (error) {
    res.send({
      status: 'Fail',
      message: error.message,
      data: null,
    })
  }
})

app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
