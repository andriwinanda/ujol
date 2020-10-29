// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/style.scss'
import Buefy from 'buefy'

import myAxios from './axiosBackend.js'
import store from './store/store.js'
import i18n from './translate.js';
import CKEditor from '@ckeditor/ckeditor5-vue';


Vue.use( CKEditor );
Vue.use(require('vue-moment'));

Vue.config.productionTip = false

Vue.use(Buefy)
// Agar bisa menggunakan this.axios di dalam components
Object.defineProperties(Vue.prototype, {
  // Custom header axios
  axios: {
    get() { return myAxios }
  },
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
