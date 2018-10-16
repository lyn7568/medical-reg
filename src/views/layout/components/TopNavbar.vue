<template>
  <div class="topnavbar">
    <div class="logo-container">
      <div class="logo-wrapper" @click="toHome"><div class="logo-img"></div></div>
    </div>
    <div class="name-box">
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <span v-if="roles.indexOf('1')>=0">您好，管理员</span>
          <span v-else>您好，来自 {{department}} 的 {{name}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <router-link to="resetPwd" v-if="roles.indexOf('1')<0">
            <el-dropdown-item>重置密码</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <div class="exit-btn" @click="logout">退出登录</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      bridgeId: '',
      showName: '',
      dataList: ''
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'department'
    ])
  },
  methods: {
    toHome() {
      this.$router.replace({ path: '/' })
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$confirm('您确认要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      }).catch(() => {
        console.log('已取消退出')
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "./src/styles/loginform.scss";
.topnavbar {
  position: fixed;
  font-size: 0px;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  line-height: 50px;
  z-index:1002;
  border-radius: 0px !important;
  background-color: $bg;
  border-bottom: 1px solid #e6e6e6;
  .logo-container {
    display: inline-block;
    position: absolute;
    left:10px;
    overflow: hidden;
    .logo-wrapper {
      float:left;
      width:300px;
      padding: 0;
      margin:10px 12px;
      cursor: pointer;
    }
  }
  .name-box{
    display: inline-block;
    position: absolute;
    right: 20px;
    font-size:14px;
    overflow: hidden;
    color:#fff;
    .avatar-wrapper {
      color:#fff;
      cursor:pointer;
    }
    .exit-btn {
      margin-left:30px;
      cursor: pointer;
    }
  }
}
.drop-menu-list{
  .el-dropdown-menu__item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    &.is-disabled{
      background: #f3f5f7;
    }
    .el-icon-check{
      font-weight: bold;
    }
  }
}
</style>

