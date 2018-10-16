<template>
  <div class="dashboard-editor-container">
    <div>
      <p class="plat-tit">欢迎管理员使用医学影像管理与通讯后台系统</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dashboard-admin'
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  margin: 20px;
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
}
</style>
