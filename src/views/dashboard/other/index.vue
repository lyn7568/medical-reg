<template>
  <div class="dashboard-editor-container">
    <div class="defaut-container">
      <div>
        <p class="plat-tit">欢迎 {{hospital}} {{department}}</p>
        <p class="plat-tit">{{name}} 医生 使用医学影像管理与通讯系统</p>
        <router-link to="dataBase">
          <el-button class="plat-tip" type="primary">进入医疗影像数据库</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import '@/styles/roleuser.scss'
import { mapGetters } from 'vuex'

export default {
  data() {
    return { }
  },
  computed: {
    ...mapGetters([
      'name',
      'department',
      'hospital'
    ])
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
  padding: 12% 0;
  background: #fff;
  .plat-pic{
    margin: 40px auto 0;
  }
  .plat-tit{
    font-size: 34px;
    line-height: 40px;
    letter-spacing: 2px;
    span{
      color: #0f76c4;
    }
  }
  .plat-tip{
    font-size: 20px;
    padding: 12px 26px;
    letter-spacing: 2px;
  }
}
</style>
