<template>
  <div class="login-container">
    <div class="logo-wrapper">
      <div class="logo-img"></div>
    </div>
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">登录</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入您的账号" maxlength="11" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input name="password" :type="pwdType" v-model="loginForm.password" autoComplete="on"
          placeholder="请输入您的登录密码" maxlength="24" @keyup.enter.native="handleLogin"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" v-show="!falg"/><svg-icon icon-class="password-view" v-show="falg"/></span>
      </el-form-item>
      <el-form-item>
        <el-button v-waves class="log-btn" type="primary" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
      </el-form-item>
      <el-form-item class="el-form-find">
        <span>忘记密码请联系管理员：136XXXXXXXX</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from '@/utils/request'
import { checkRegister } from '@/api/api'
import { Message } from 'element-ui'
import waves from '@/directive/waves'
import '@/styles/loginform.scss'

export default {
  name: 'login',
  directives: {
    waves
  },
  data() {
    var validPhone = (rule, value, callback) => {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      if (value === 'admin') {
        callback()
      }
      if (!value) {
        callback(new Error('请输入您的账号'))
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          request.get(checkRegister, { account: value }, function(response) {
            if (response.success) {
              if (response.data === -1) {
                callback(new Error('该账号已停用，请联系管理员'))
              } else if (response.data === 1) {
                callback(new Error('该账号不存在，请检查后重试'))
              } else if (response.data === 0) {
                callback()
              }
            }
          })
        }
      }
    }
    return {
      falg: false,
      imgVcUrl: '',
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validPhone }],
        password: [
          { required: true, message: '请输入您的登录密码', trigger: 'blur' },
          { min: 6, max: 24, message: '密码由6-24个字符组成，区分大小写', trigger: 'blur' }
        ]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd() {
      this.falg = !this.falg
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then((response) => {
            this.loading = false
            if (response.success) {
              if (response.data) {
                this.$router.push({ path: '/' })
              } else {
                Message.error('登录账号与密码不匹配，请检查后重试')
                return
              }
            } else {
              const errorCode = [{
                code: -60005,
                msg: '该账号已停用，请联系管理员'
              }]
              for (let i = 0; i < errorCode.length; i++) {
                if (response.code === errorCode[i].code) {
                  Message.error(errorCode[i].msg)
                  this.changeImgVc()
                  return
                }
              }
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
