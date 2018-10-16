<template>
  <div class="dashboard-editor-container">
    <div class="defaut-container">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="demo-ruleForm" label-width="80px" label-position="left">
        <el-form-item label-width="0">
          <h1 class="title">重置密码</h1>
        </el-form-item>
        <el-form-item prop="pass" label="设置密码">
          <el-input type="password" v-model="ruleForm2.pass" placeholder="请设置您的新密码" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass" label="确认密码">
          <el-input type="password" v-model="ruleForm2.checkPass" placeholder="请再次输入密码确认" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="el-btn-col" label-width="0">
          <div class="el-btn-col-box">
            <el-button type="primary" class="log-btn" @click.native.prevent="resetPwd('ruleForm2')">下一步</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@/styles/roleuser.scss'
import request from '@/utils/request'
import { changePw } from '@/api/api'

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请设置您的新密码'))
      } else if (value.length < 6 || value.length > 24) {
        callback(new Error('密码由6-24个字符组成，区分大小写'))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码确认'))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致，请重新输入!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm2: {
        pass: '',
        checkPass: ''
      },
      rules2: {
        pass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetPwd(formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const newPw = that.ruleForm2.checkPass
          request.post(changePw, { newPw }, function(response) {
            if (response.success) {
              this.$alert('密码已重置，快去登录吧！', '重置密码', {
                confirmButtonText: '确 定',
                type: 'success',
                callback: action => {
                  that.$refs[formName].resetFields()
                  that.$store.dispatch('LogOut').then(() => {
                    location.reload()
                  })
                }
              })
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.defaut-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  height: 100%;
  padding: 10% 0;
  background: #fff;
  .demo-ruleForm{
    width: 360px;
  }
  .log-btn{
    margin-top:50px;
    width: 100%;
  }
}
</style>
