import { setToken, getToken, removeToken, getDataUser, setDataUser, removeDataUser } from '@/localstorage-helper'
import myAxios from '@/axiosBackend';
import { setBaseUrl } from '../../localstorage-helper';

const LOGIN = "LOGIN"
const LOGOUT = "LOGOUT"
let dataUser = getDataUser()
let user
if(dataUser)  user = JSON.parse(Buffer.from(dataUser, 'base64').toString('ascii'))

const state = {
  isLoggedIn: !!(getToken()),
  token: getToken() || '',
  dataUser: user || null,
}

const mutations = {
  [LOGIN](state) {
    state.isLoggedIn = true
    state.pending = false
  },
  [LOGOUT](state) {
    state.isLoggedIn = false
  },
}
const actions = {
  login({ commit, state }, DATA_LOGIN) {
    state.token = DATA_LOGIN.token
    state.dataUser = DATA_LOGIN.dataUser
    setToken(DATA_LOGIN.token)
    const user = Buffer.from(JSON.stringify(DATA_LOGIN.dataUser), "utf8").toString(
      "base64"
    );
    setDataUser(user)
    commit(LOGIN)
  },
  logout({ commit, state }) {
    removeToken()
    removeDataUser()
    state.token = ''
    state.dataUser = null
    commit(LOGOUT)
  },

}

export default {
  namespaced: true,
  strict: true,
  state,
  mutations,
  actions
}
