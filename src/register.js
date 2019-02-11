//导入cube-UI的createAPI
import { createAPI } from 'cube-ui'
import Vue from 'vue'
//导入组件
import ShopCartList from 'components/shop-cart-list/shop-cart-list'
import ShopCartStikcy from 'components/shop-cart-sticky/shop-cart-sticky'
import Food from 'components/food/food'

//创建购物列表组件的API
createAPI(Vue, ShopCartList)
//创建克隆版购物车的克隆版本购物车管理组件的API
createAPI(Vue, ShopCartStikcy)
createAPI(Vue, Food)
