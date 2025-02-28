import { ss } from '@/utils/storage'

const LOCAL_NAME = 'SECRET_TOKEN'
const LOGIN_JWT = 'CHAT_JWT'

export function getToken() {
  return ss.get(LOCAL_NAME)
}

export function setToken(token: string) {
  return ss.set(LOCAL_NAME, token)
}

export function removeToken() {
  return ss.remove(LOCAL_NAME)
}

export function getJWT() {
  return ss.get(LOGIN_JWT)
}

export function setJWT(token: string) {
  return ss.set(LOGIN_JWT, token)
}

export function clearAll() {
  ss.clear()
}
