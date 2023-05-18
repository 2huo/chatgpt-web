<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput } from 'naive-ui'
import { ref } from 'vue'
import { useAuthStoreWithout } from '@/store/modules/auth'

const authStore = useAuthStoreWithout()
const password = ref<string>('')
const account = ref<string>('')

async function loginHandle() {
  console.log('login', account, password)
  // authStore.setJWT('123')
  // authStore.loginAuth = false
  // await router.push({ name: 'Root' })
}
</script>

<template>
  <div class="flex justify-center items-center h-full flex-col">
    <NForm>
      <NFormItem label="账号/邮箱">
        <NInput v-model:value="account" />
      </NFormItem>
      <NFormItem label="密码">
        <NInput v-model:value="password" />
      </NFormItem>
    </NForm>
    <div class="flex">
      <NButton type="primary" @click="loginHandle">
        登录
      </NButton>
      <NButton secondary type="info" @click="loginHandle">
        注册
      </NButton>
    </div>
  </div>
</template>
