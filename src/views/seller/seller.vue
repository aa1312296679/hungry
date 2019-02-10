<template>
    <div>
     <!--商家页头部-->
      <h-header :seller="seller"></h-header>
      <!--商家页tab切换-->
      <div class="tab-wrapper">
        <tab :tabs="tabs"></tab>
      </div>
    </div>
</template>

<script>
  import qs from 'query-string'
  import { getSeller } from 'api'
  import HHeader from 'components/h-header/h-header'
  import Goods from 'components/goods/goods'
  import Ratings from 'components/ratings/ratings'
  import Seller from 'components/seller/seller'
  import Tab from 'components/tab/tab'

  export default {
    data() {
      return {
        // 商家页面的信息
        seller: {
          // 商家页面的请求参数
          id: qs.parse(location.search).id
        }
      }
    },
    computed: {
      // 当前商家页的所有tab页的页面信息
      tabs() {
        return [
          {
            // 选项卡名
            label: '商品',
            // 组件类
            component: Goods,
            // tab页所需的商家信息
            data: {
              seller: this.seller
            }
          },
          {
            label: '评论',
            component: Ratings,
            data: {
              seller: this.seller
            }
          },
          {
            label: '商家',
            component: Seller,
            data: {
              seller: this.seller
            }
          }
        ]
      }
    },
    created() {
      // 跨域请求商家信息
      this._getSeller()
    },
    methods: {
      // 跨域请求商家信息
      _getSeller() {
        getSeller({
          id: this.seller.id
        }).then((seller) => {
          // 将请求的商家信息更新到当前商家页的商家信息中
          this.seller = seller
        })
      }
    },
    components: {
      Tab,
      HHeader
    }
  }
</script>

<style lang="stylus" scoped>
  #app
    .tab-wrapper
      position: fixed
      top: 136px
      left: 0
      right: 0
      bottom: 0
</style>

