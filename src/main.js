import Vue from 'vue'
import App from './App.vue'
import './cube-ui'
import './register'
import router from 'router/router.js'
import 'common/stylus/index.styl'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
