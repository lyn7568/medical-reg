<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <el-row type="flex" justify="space-around">
        <el-col :span="12">
          <div class="fiter-tit">用户管理</div>
        </el-col>
        <el-col :span="12" align="right">
          <el-button v-waves class="filter-item" @click="handleCreate" type="primary">添加</el-button>
        </el-col>
      </el-row> 
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width:100%;min-height:550px;">
      <el-table-column align="center" width="200" label="账号" prop="account">
        <template slot-scope="scope">
          <span :class="{ 'table-tr-del': !scope.row.active}">{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户姓名" prop="name">
        <template slot-scope="scope">
          <span :class="{ 'table-tr-del': !scope.row.active}">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属医院" prop="hospital">
        <template slot-scope="scope">
          <span :class="{ 'table-tr-del': !scope.row.active}">{{scope.row.hospital}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属科室" prop="department">
        <template slot-scope="scope">
          <span :class="{ 'table-tr-del': !scope.row.active}">{{scope.row.department}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="260" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope"> 
          <el-button v-waves :type="((!scope.row.active) ? 'info' : 'primary')" size="mini" @click="handleUpdate(scope.row)" :disabled='!scope.row.active'>修改</el-button> 
          <el-button v-if="scope.row.active" v-waves size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">停用
          </el-button>
          <el-button v-if="!scope.row.active" v-waves size="mini" type="primary" @click="handleRebackStatus(scope.row)">恢复
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <editUser :dialog="dialogTableVisible" @chilF='chilF' :id='edit'></editUser>
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
import { deleteUser, pageQueryUser, rebackUser } from '@/api/api'
import waves from '@/directive/waves'
import editUser from './editUser'

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      edit: '',
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogTableVisible: false,
      listQuery: {
        pageSize: 10,
        pageNo: 1
      }
    }
  },
  created() {
    this.getList()
  },
  components: {
    editUser
  },
  methods: {
    getList() {
      var that = this
      this.listLoading = true
      request.get(pageQueryUser, that.listQuery, function(response) {
        if (response.success) {
          if (response.data === null) {
            that.list = []
            that.total = 0
            setTimeout(() => {
              that.listLoading = false
            }, 1.5 * 1000)
            return
          }
          that.list = response.data.data
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
    chilF(val) {
      if (!val) {
        this.getList()
      }
      this.edit = ''
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      var that = this
      this.$confirm('确定要停用:用户' + row.name + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          if (action === 'confirm') {
            request.get(deleteUser, { id: row.id }, function(response) {
              if (response.success) {
                that.getList()
              }
            })
          }
        }
      })
    },
    handleRebackStatus(row) {
      var that = this
      this.$confirm('确定恢复该用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          if (action === 'confirm') {
            request.get(rebackUser, { id: row.id }, function(response) {
              if (response.success) {
                that.getList()
              }
            })
          }
        }
      })
    },
    handleCreate() {
      this.dialogTableVisible = !this.dialogTableVisible
    },
    handleUpdate(row) {
      this.edit = row.id
      this.dialogTableVisible = !this.dialogTableVisible
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .fiter-tit{
    font-size: 20px;
    line-height: 40px;
  }
  .el-autocomplete{
    display: block
  }
  .el-btn-col{
    margin-top: 45px
  }
  .table-tr-del{
    color: #f56c6c;
  }
</style>
