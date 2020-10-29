import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'
import quiz from './modules/quiz'

import { getDarkMode, setDarkMode, removeDarkMode } from '../localstorage-helper'

Vue.use(Vuex)
const state = {
  darkMode: getDarkMode() || false,
  // showSidebar: false,
  // activePage: ''
}
const mutations = {
  darkMode(state) {
    state.darkMode = !state.darkMode
    setDarkMode(JSON.stringify(state.darkMode))
  }
}

export default new Vuex.Store({
  modules: {
    login,
    quiz

  },
  state,
  mutations
})
