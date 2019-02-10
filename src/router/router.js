import Vue from 'vue'
import Router from 'vue-router'
import Seller from 'views/seller/seller.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect:'/seller'
    }
    ,{
      path: '/seller',
      name: 'Seller',
      component: Seller
    }
  ]
})
