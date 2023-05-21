import { fetch_getChatStorage, fetch_updateChatStorage } from '@/api'
import { ss } from '@/utils/storage'

const LOCAL_NAME = 'chatStorage'

export function defaultState(): Chat.ChatState {
  const uuid = 1002
  return {
    active: uuid,
    usingContext: true,
    history: [{ uuid, title: 'New Chat', isEdit: false }],
    chat: [{ uuid, data: [] }],
  }
}

export function getLocalState(): Chat.ChatState {
  const localState = ss.get(LOCAL_NAME)
  return { ...defaultState(), ...localState }
}

export function setLocalState(state: Chat.ChatState) {
  fetch_updateChatStorage(JSON.stringify(state)).then(() => {
    ss.set(LOCAL_NAME, state)
  })
}

export async function initLocalState() {
  const data = await fetch_getChatStorage<any>()
  const chatStorage = JSON.parse(data.data.chatStorage)
  ss.set(LOCAL_NAME, chatStorage)
}
