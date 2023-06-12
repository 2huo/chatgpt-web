<script setup lang="ts">
import {
  NButton, NCard, NForm, NFormItem, NInput, useMessage,
} from 'naive-ui'
import { ref } from 'vue'
import { Md5 } from 'ts-md5'
import { useAuthStoreWithout } from '@/store/modules/auth'
import { router } from '@/router'
import { fetchLogin, fetchRegister } from '@/api'
import type { Response } from '@/utils/request'
import { initLocalState } from '@/store/modules/chat/helper'
import { useUserStore } from '@/store'

const authStore = useAuthStoreWithout()
const password = ref<string>('')
const account = ref<string>('')
const r_account = ref<string>('')
const r_password = ref<string>('')
const r_password_2 = ref<string>('')
const message = useMessage()
const isLogin = ref<boolean>(true)
const userStore = useUserStore()

interface IloginData {
  token: string
}

async function loginHandle() {
  const md5_pwd = Md5.hashStr(password.value).toUpperCase()
  try {
    const loginResult = await fetchLogin<IloginData>(account.value, md5_pwd)
    // console.log(loginResult)
    loginResult.message && message.success(loginResult.message)
    authStore.setJWT(loginResult.data.token)
    authStore.loginAuth = false
    userStore.updateUserInfo({ name: account.value })
    await initLocalState()
    await router.push({ name: 'Root' })
  }
  catch (error) {
    message.error((error as Response).message as string)
  }
}

function rotate2register() {
  isLogin.value = false
  r_account.value = ''
  r_password.value = ''
  r_password_2.value = ''
}

function rotate2Login() {
  isLogin.value = true
  account.value = ''
  password.value = ''
}

async function registerHandle() {
  if (r_password.value === '' || r_password_2.value === '') {
    message.error('请输入密码')
  }
  else if (r_password.value === r_password_2.value) {
    const md5_pwd = Md5.hashStr(r_password.value).toUpperCase()
    try {
      const registerResult = await fetchRegister(r_account.value, md5_pwd)
      registerResult.message && message.success(registerResult.message)
      rotate2Login()
    }
    catch (error) {
      message.error((error as Response).message as string)
    }
  }
  else {
    message.error('两次密码输入不相同')
  }
}

function findPWDHandle() {
  message.warning('暂未开放')
}
</script>

<template>
  <div class="flex justify-center h-1/2 w-full sm:w-2/5 sm:h-1/4 items-center flex-col card-filp" :class="isLogin ? 'no-flip' : 'filp'">
    <div class="front">
      <NCard title="登录" embedded>
        <NForm label-placement="top">
          <NFormItem label="账号">
            <NInput v-model:value="account" placeholder="请输入账号/邮箱/电话" />
          </NFormItem>
          <NFormItem label="密码">
            <NInput v-model:value="password" placeholder="请输入密码" type="password" />
          </NFormItem>
        </NForm>
        <div class="flex justify-center">
          <NButton type="primary" @click="loginHandle">
            登录账号
          </NButton>
          <div class="ml-4">
            <NButton tertiary type="info" @click="rotate2register">
              我要注册
            </NButton>
          </div>
          <div class="ml-10">
            <NButton quaternary type="error" @click="findPWDHandle">
              忘记密码
            </NButton>
          </div>
        </div>
      </NCard>
    </div>
    <div class="back">
      <NCard title="注册账号" embedded>
        <NForm label-placement="top">
          <NFormItem label="账号">
            <NInput v-model:value="r_account" placeholder="请输入账号" />
          </NFormItem>
          <NFormItem label="密码">
            <NInput v-model:value="r_password" placeholder="请输入密码" type="password" />
          </NFormItem>
          <NFormItem label="确认密码">
            <NInput v-model:value="r_password_2" placeholder="请再输入一次密码" type="password" />
          </NFormItem>
        </NForm>
        <div class="flex justify-center">
          <NButton type="primary" @click="registerHandle">
            注册账号
          </NButton>
          <div class="ml-4">
            <NButton tertiary type="info" @click="rotate2Login">
              我要登录
            </NButton>
          </div>
        </div>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.card-filp {
  /* height: 300px; */
  /* width: 500px; */
  position: relative;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  transition: 1s;
}

.front,
.back {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  backface-visibility: hidden
}

.back {
  transform: rotateY(180deg);
}
.no-flip{
  transform:translate(-50%, -50%);
}

.filp {
  transform:translate(-50%, -50%) rotateY(180deg) ;
}
</style>
