<template>
  <el-dialog title="用户管理" ref="ruleForm" :visible.sync="dialogTableVisible" width="640px" @close='closed'>
     <el-form class="form-main" :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position='left' label-width="80px" status-icon>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="账 号" prop='account'>
              <el-input v-if="!edit" placeholder="请输入账号" v-model="ruleForm2.account" maxlength=11></el-input>
              <span v-if="edit">{{ruleForm2.account}}</span>
            </el-form-item>
            <el-form-item label="用户姓名" prop='name'>
              <el-input placeholder="请输入用户姓名" v-model="ruleForm2.name" maxlength=20></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="edit">
            <el-form-item label-width="20px">
              <el-button style="margin-top:35px" type="primary" @click="resetUserPw">重置密码</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属医院" prop='hospital'>
              <el-input placeholder="请输入用户所属医院" v-model="ruleForm2.hospital" maxlength=100></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属科室" prop='department'>
              <el-input placeholder="请输入用户所属科室" v-model="ruleForm2.department" maxlength=200></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="el-btn-col">
            <div class="el-btn-col-box">
              <el-button type="primary" @click="submitForm('ruleForm2')">确认</el-button>
              <el-button  @click="resetForm()">返回</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
</template>

<script>
import request from '@/utils/request'
import { checkRegister,
  addRegister,
  updateRegister,
  queryRegister,
  resetPw } from '@/api/api'
export default {
  props: ['dialog', 'id'],
  data() {
    var account = (rule, value, callback) => {
      const regTel = /^1[3|4|5|7|8][0-9]\d{8}$/
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        if (!regTel.test(value)) {
          callback(new Error('账号为手机号格式'))
        } else {
          if (this.edit) {
            callback()
          } else {
            request.get(checkRegister, { account: value }, function(response) {
              if (response.success) {
                if (response.data === -1) {
                  callback(new Error('该账号已停用，请恢复使用'))
                } else if (response.data === 0) {
                  callback(new Error('该账号已存在，请重新输入'))
                } else if (response.data === 1) {
                  callback()
                }
              }
            })
          }
        }
      }
    }
    return {
      dialogTableVisible: false,
      edit: '',
      readAccount: false,
      ruleForm2: {
        account: '',
        name: '',
        hospital: '',
        department: ''
      },
      rules2: {
        account: [
          { required: true, validator: account, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        hospital: [
          { required: true, message: '请输入用户所属医院', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入用户所属科室', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialog() {
      var that = this
      this.dialogTableVisible = true
      this.edit = this.id
      if (this.edit) {
        this.readAccount = true
        request.get(queryRegister, { id: that.edit }, function(response) {
          if (response.success) {
            const $data = response.data
            that.ruleForm2 = {
              account: $data.account,
              name: $data.name,
              hospital: $data.hospital,
              department: $data.department
            }
          }
        })
      }
    }
  },
  methods: {
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.edit) {
            request.post(addRegister, that.ruleForm2, function(response) {
              if (response.success) {
                that.$emit('chilF')
                setTimeout(function() {
                  that.pop('已成功添加')
                }, 1000)
                that.resetForm(that.ruleForm2)
                that.dialogTableVisible = false
              }
            })
          } else {
            const par = that.ruleForm2
            par.id = that.edit
            request.post(updateRegister, par, function(response) {
              if (response.success) {
                setTimeout(function() {
                  that.pop('已成功更新用户信息')
                }, 1000)
                that.resetForm('ruleForm2')
                that.$emit('chilF')
                that.dialogTableVisible = false
                that.edit = ''
                that.ruleForm2 = {
                  account: '',
                  name: '',
                  hospital: '',
                  department: ''
                }
              }
            })
          }
        }
      })
    },
    resetUserPw() {
      var that = this
      this.$confirm('确定重置该用户密码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        showCancelButton: false,
        callback: action => {
          if (action === 'confirm') {
            request.post(resetPw, { id: that.id }, function(response) {
              this.$alert('该用户的密码重置成功', '提示', {
                confirmButtonText: '确定',
                type: 'success'
              })
            })
          }
        }
      })
    },
    resetForm() {
      this.dialogTableVisible = false
      this.$refs.ruleForm2.resetFields()
      this.edit = ''
      this.$emit('chilF', true)
    },
    closed() {
      this.$refs['ruleForm2'].resetFields()
      this.edit = ''
      this.$emit('chilF', true)
    },
    pop($par) {
      this.$confirm($par, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        showCancelButton: false
      }).then(() => {

      }).catch(() => {

      })
    },
    resetTemp(row) {
      this.ruleForm2 = {
        account: row.account,
        name: row.name,
        comp: row.comp,
        job: row.job,
        phone: row.phone,
        email: row.email,
        remark: row.remark,
        type: row.type
      }
      this.edit = row.id
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-form-item{
    margin:0 10px 30px
  }
  .el-select{
    width: 100%
  }
  .el-form--label-top .el-form-item__label {
    padding: 0
  }
</style>