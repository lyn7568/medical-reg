<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <el-row type="flex" justify="space-around">
        <el-col :span="12">
          <div class="fiter-tit">医疗影像数据库</div>
        </el-col>
        <el-col :span="12" align="right">
          <el-button v-waves class="filter-item" type="primary" @click="imagecropperShow=true">上传</el-button>
        </el-col>
      </el-row> 
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="min-height:550px">
      <el-table-column label="文件名称" align="center" prop="name"></el-table-column>
      <el-table-column label="文件类型" align="center" prop="type"></el-table-column>
      <el-table-column label="文件大小" align="center" prop="size" :formatter="formSize"></el-table-column>
      <el-table-column label="所属医院" align="center" prop="hospital"></el-table-column>
      <el-table-column label="所属科室" align="center" prop="department"></el-table-column>
      <el-table-column label="备注" width="220" header-align="center">
        <template slot-scope="scope"> 
          <span>上传人员：{{scope.row.publisher}} 医生</span>
          <br />
          <span>上传时间：{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <el-button v-waves type="primary" size="mini" @click="downUrl(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.pageNo"
        :page-size="listQuery.pageSize"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="医疗影像数据" 
      v-loading="upLoading"
      element-loading-text="上传过程中，请耐心等待。"
      element-loading-customClass="loadCss"
      :visible.sync="imagecropperShow" width="600px">
      <el-form :model="upform" :rules="uprules" ref="upform">
        <el-row :gutter="16">
          <el-col :span="24">
            <el-upload
              ref="uploadF"
              class="upload-demo"
              drag
              action="/ajax/storage"
              :before-upload="beforeAvatarUpload"
              :on-progress="handleAvatarProgress"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError"
              :auto-upload="false"
              :data="upform"
              style="margin:0 100px 16px">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件名称" :label-width="formLabelWidth" prop="name">
              <el-input v-model="upform.name" maxlength=20 placeholder="请输入文件名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件类型" :label-width="formLabelWidth" prop="type">
              <el-input v-model="upform.type" maxlength=20 placeholder="请输入文件类型"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('upform')">确 定</el-button>
        <el-button @click="imagecropperShow = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import { pqStorage } from '@/api/api'
import waves from '@/directive/waves'
import { trim, parseTime, downFile, formatterSize } from '@/utils'
import queryBase from '@/utils/queryBase'

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    var trimStrname = (rule, value, callback) => {
      if (trim(value) === '') {
        callback(new Error('请输入文件名称'))
      } else if (trim(value).length > 20) {
        callback(new Error('文件名称不得超过20个字符'))
      } else {
        callback()
      }
    }
    var trimStrtype = (rule, value, callback) => {
      if (trim(value) === '') {
        callback(new Error('请输入文件类型'))
      } else if (trim(value).length > 20) {
        callback(new Error('文件类型不得超过20个字符'))
      } else {
        callback()
      }
    }
    return {
      imagecropperShow: false,
      formLabelWidth: '80px',
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      upLoading: false,
      upform: {
        name: '',
        type: ''
      },
      uprules: {
        name: [
          { required: true, validator: trimStrname, trigger: 'blur' }
        ],
        type: [
          { required: true, validator: trimStrtype, trigger: 'blur' }
        ]
      },
      listQuery: {
        pageSize: 10,
        pageNo: 1,
        active: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    formSize(row) {
      const str = row.size
      return formatterSize(str)
    },
    downUrl(row) {
      const url = `/data${row.url}`
      const file_name = row.fileName
      downFile(url, file_name)
    },
    getList() {
      var that = this
      this.listLoading = true
      request.get(pqStorage, that.listQuery, function(response) {
        if (response.success) {
          if (response.data === null) {
            that.list = []
            that.total = 0
            setTimeout(() => {
              that.listLoading = false
            }, 1.5 * 1000)
            return
          }
          const $data = response.data.data
          var hdata = { num: 1, data: $data }
          for (let i = 0; i < $data.length; i++) {
            hdata.num++
            $data[i].createTime = parseTime($data[i].createTime)
            $data[i].publisher = ''
            queryBase.getUserBase($data[i].owner, function(sc, value) {
              if (sc) {
                $data[i].publisher = value.name
                hdata.num--
                if (hdata.num === 0) {
                  that.list = hdata.data
                }
              }
            })
          }
          hdata.num--
          if (hdata.num === 0) {
            that.list = hdata.data
          }
          that.total = response.data.total
          setTimeout(() => {
            that.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    beforeAvatarUpload(file) {
      const isLt1G = file.size / 1024 / 1024 / 1024 < 1
      if (!isLt1G) {
        this.$message.error('上传文件过大，请重试')
      }
      return isLt1G
    },
    handleAvatarProgress(file) {
      this.upLoading = true
    },
    handleAvatarSuccess(file) {
      this.$alert('上传成功！', '提示', {
        confirmButtonText: '确定',
        type: 'success',
        callback: action => {
          this.upLoading = false
          this.imagecropperShow = false
          this.$refs.uploadF.clearFiles()
          this.$refs.upform.resetFields()
          this.getList()
        }
      })
    },
    handleAvatarError(file) {
      this.$message.error('上传失败！')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs.uploadF.submit()
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .fiter-tit{
    font-size: 20px;
    line-height: 40px;
  }
  .dialog-footer{
    text-align: center;
    margin-bottom: 20px;
  }
  .loadCss{
    font-size: 16px;
    margin-top:15px;
  }
</style>
