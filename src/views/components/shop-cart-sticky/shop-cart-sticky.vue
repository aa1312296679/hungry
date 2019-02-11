<template>
  <!--
    克隆版购物车默认隐藏
  -->
  <div class="shop-cart-sticky" v-show="visible">
    <shop-cart
      ref="shopCart"
      :selectGoods="selectFoods"
      :deliveryPrice="deliveryPrice"
      :minPrice="minPrice"
      :fold="fold"
      :sticky=true
    >
    </shop-cart>
  </div>
</template>

<script>
  import ShopCart from 'components/shop-cart/shop-cart'
  import popupMixin from 'common/mixins/popup'

  export default {
    name: 'shop-cart-sticky',
    mixins: [popupMixin],
    props: {
      // 克隆版购物车的所有选中商品
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      },
      // 商品配送费
      deliveryPrice: {
        type: Number,
        default: 0
      },
      // 商品起步价
      minPrice: {
        type: Number,
        default: 0
      },
      // 克隆版购物车的显隐状态
      fold: {
        type: Boolean,
        default: true
      },
      // 购物车的购物列表
      list: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      drop(el) {
        this.$refs.shopCart.drop(el)
      }
    },
    components: {
      ShopCart
    }
  }
</script>

<style lang="stylus" scoped>
  .shop-cart-sticky
    position: absolute
    left: 0
    bottom: 0
    z-index: 999
    width: 100%
    height: 48px
</style>
