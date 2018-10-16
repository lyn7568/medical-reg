import request from '@/utils/request'
import { login, logout, getInfo } from '@/api/api'
import { getCookiesName, setCookiesName, removeCookiesName } from '@/utils/auth'

const user = {
  state: {
    account: '',
    userid: '',
    name: '',
    roles: [],
    hospital: '',
    department: '',
    session: getCookiesName()
  },
  mutations: {
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_USERID: (state, userid) => {
      state.userid = userid
    },
    SET_HOSPITAL: (state, hospital) => {
      state.hospital = hospital
    },
    SET_DEPART: (state, department) => {
      state.department = department
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_SESSION: (state, session) => {
      state.session = session
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const account = userInfo.username.trim()
      const pw = userInfo.password
      return new Promise((resolve, reject) => {
        request.post(login, { account, pw }, function(response) {
          if (response.success) {
            if (response.data) {
              const dataS = response.data
              if (dataS.active) {
                if (dataS.account === 'admin') {
                  commit('SET_ROLES', ['1'])
                } else {
                  commit('SET_ROLES', ['0'])
                }
                commit('SET_USERID', dataS.id)
                commit('SET_NAME', dataS.name)
                commit('SET_HOSPITAL', dataS.hospital)
                commit('SET_DEPART', dataS.department)
                setCookiesName(dataS.name)
              }
            }
          }
          resolve(response)
        }, function(error) {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        request.get(getInfo, { }, function(response) {
          if (response.success) {
            if (response.data) {
              const dataS = response.data
              if (dataS.active) {
                if (dataS.account === 'admin') {
                  commit('SET_ROLES', ['1'])
                } else {
                  commit('SET_ROLES', ['0'])
                }
                commit('SET_USERID', dataS.id)
                commit('SET_NAME', dataS.name)
                commit('SET_HOSPITAL', dataS.hospital)
                commit('SET_DEPART', dataS.department)
                setCookiesName(dataS.name)
              }
            }
          }
          resolve(response)
        }, function(error) {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        request.get(logout, { }, function(response) {
          commit('SET_ROLES', [])
          commit('SET_NAME', '')
          commit('SET_HOSPITAL', '')
          commit('SET_DEPART', '')
          removeCookiesName()
          resolve(response)
        }, function(error) {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_SESSION', '')
        removeCookiesName()
        resolve()
      })
    }
  }
}

export default user
