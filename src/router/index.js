import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard'),
      name: 'dashboard',
      meta: { title: '首页' }
    }]
  },
  {
    path: '',
    component: Layout,
    hidden: true,
    children: [{
      path: 'resetPwd',
      name: 'resetPwd',
      meta: { title: '重置密码' },
      component: () => import('@/views/resetPwd/index')
    }]
  },
  {
    path: '',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'dataBase',
        name: 'dataBase',
        meta: { title: '医疗影像数据库' },
        component: () => import('@/views/dataInfo/dataBase/index')
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'infoManage',
        name: 'infoManage',
        meta: {
          title: '用户管理',
          icon: 'peoples'
        },
        component: () => import('@/views/peoplesManage/infoManage/index')
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dataManage',
        name: 'dataManage',
        meta: {
          title: '数据管理',
          icon: 'list'
        },
        component: () => import('@/views/peoplesManage/dataManage/index')
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// 异步挂载的路由
// 动态需要根据权限加载的路由表

export const asyncRouterMap = [
]
