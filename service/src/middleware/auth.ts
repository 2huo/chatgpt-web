import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import { isNotEmptyString } from '../utils/is'

const auth = async (req, res, next) => {
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  // console.log('auth_secret_key', AUTH_SECRET_KEY)
  if (isNotEmptyString(AUTH_SECRET_KEY)) {
    try {
      // const Authorization = req.header('Authorization')
      // if (!Authorization || Authorization.replace('Bearer ', '').trim() !== AUTH_SECRET_KEY.trim())
      //   throw new Error('Error: 无访问权限 | No access rights')
      const Authorization = req.headers.authorization
      // console.log('auth rawToken', rawToken, Authorization)
      if (Authorization !== undefined) {
        const rawToken = String(Authorization).split(' ').pop()
        const tokenData = jwt.verify(rawToken, AUTH_SECRET_KEY)
        const user_account = (tokenData as JwtPayload).id
        // console.log('user_account', user_account)
        req.user_account = user_account
        next()
      }
      else {
        throw new Error('Error: 无访问权限 | No access rights')
      }
    }
    catch (error) {
      // console.log('auth error', error)
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }
  }
  else {
    next()
  }
}

export { auth }
