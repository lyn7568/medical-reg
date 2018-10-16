<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <div class="fiter-tit">数据管理</div>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width:100%;min-height:550px">
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
          <el-button v-waves size="mini" type="danger" @click="handleDel(scope.row,'deleted')">删除
          </el-button>
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
  </div>
</template>

<script>
import request from '@/utils/request'
import { pqStorage, delStorage } from '@/api/api'
import waves from '@/directive/waves'
import { parseTime, downFile, formatterSize } from '@/utils'
import queryBase from '@/utils/queryBase'

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
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
          { required: true, message: '请输入文件名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入文件类型', trigger: 'blur' }
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
    handleDel(row, status) {
      var that = this
      this.$confirm('确定删除该数据资料？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          if (action === 'confirm') {
            request.get(delStorage, { id: row.id }, function(response) {
              if (response.success) {
                that.getList()
              }
            })
          }
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
  .el-upload {
    margin:auto;
    .el-upload-dragger {
      width: 560px;
      height: 260px;
    }
  }
  .dialog-footer{
    text-align: center;
    margin-bottom: 20px;
  }
</style>
