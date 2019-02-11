<template>
  <div class="goods" v-show="showStatus">
    <div class="scroll-nav-wrapper">
      <!--
        生成滚动侧边栏容器
      -->
      <cube-scroll-nav
        :side=true
        :data="goods"
        :options="scrollOptions"
        v-if="goods.length"
      >
        <template slot="bar" slot-scope="props">
          <!--
            通过scroll-nav-bar遍历输出滚动侧边栏容器的所有侧边栏导航
          -->
          <cube-scroll-nav-bar
            direction="vertical"
            :labels="props.labels"
            :txts="barTxts"
            :current="props.current"
          >
            <!--
              配置滚动侧边栏导航所输出的商品类文案格式
            -->
            <template slot-scope="props">
              <div class="text">
                <!--
                  如果当前商品类
                -->
                <support-ico
                  v-if="props.txt.type>=1"
                  :size=3
                  :type="props.txt.type"
                ></support-ico>
                <!--
                  当前商品类的商品类名称
                -->
                <span>{{props.txt.name}}</span>
                <!--
                  当前商品类的总数
                -->
                <span class="num" v-if="props.txt.count">
                  <bubble :num="props.txt.count"></bubble>
                </span>
              </div>
            </template>
          </cube-scroll-nav-bar>
        </template>
        <!--
          遍历输出所有的商品类面板
        -->
        <cube-scroll-nav-panel
          v-for="good in goods"
          :key="good.name"
          :label="good.name"
          :title="good.name"
        >
          <ul>
            <!--
              遍历输出当前商品类面板下的所有商品
            -->
            <li
              @click="selectFood(food)"
              v-for="food in good.foods"
              :key="food.name"
              class="food-item"
            >
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <!--
                    商品信息的增减控制按钮
                 -->
                <div class="cart-control-wrapper">
                  <cart-control @add="onAdd" :good="food"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </cube-scroll-nav-panel>
      </cube-scroll-nav>
    </div>
    <!--
        购物车显示购物信息
    -->
    <div class="shop-cart-wrapper">
      <shop-cart
        ref="shopCart"
        :select-goods="selectGoods"
        :delivery-price="seller.deliveryPrice"
        :min-price="seller.minPrice"></shop-cart>
    </div>
  </div>
</template>

<script>
  import { getGoods } from 'api'
  import CartControl from 'components/cart-control/cart-control'
  import ShopCart from 'components/shop-cart/shop-cart'
  import Food from 'components/food/food'
  import SupportIco from 'components/support-ico/support-ico'
  import Bubble from 'components/bubble/bubble'

  export default {
    name: 'goods',
    props: {
      // 商品页的数据源
      data: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        // 所有商品
        goods: [],
        // 商品页的商品列表中被选中的商品
        selectedFood: {},
        // scroll-nav导航的配置信息
        scrollOptions: {
          click: false,
          directionLockThreshold: 0
        },
        // 商品页显示状态
        showStatus:false
      }
    },
    computed: {
      /**
       *  解析商品页的数据源中的商品数据
       * */
      seller() {
        return this.data.seller
      },
      /**
       * 获取所有需要存入购物车商品
      */
      selectGoods() {
        // 购物车商品
        let selectedGoods = []
        // 遍历所有商品类别
        this.goods.forEach((item) => {
          // 遍历当前商品类别下的所有商品
          item.foods.forEach((item) => {
            // 如果当前商品存在商品总数
            if (item.count) {
              // 将当前商品列为需要存入购物车的商品中
              selectedGoods.push(item)
            }
          })
        })
        return selectedGoods
      },
      /**
       * 获取所有商品类别的商品类详情
       * type 商品类的ico状态
       * name 商品类名称
       * count 商品类总数
       */
      barTxts() {
        // 所有的商品类信息
        let ret = []
        // 遍历当前商品页的所有商品
        this.goods.forEach((item) => {
          const {type, name, foods} = item
          // 该商品类的商品总数
          let count = 0
          // 遍历当前商品类的所有商品
          foods.forEach((food) => {
            count += food.count
          })
          // 生成商品类对象并存入商品类信息
          ret.push({
            type,
            name,
            count
          })
        })
        return ret
      }
    },
    methods: {
      /**
       * 跨域请求商品页的商品数据
        */
      fetch() {
        if (!this.fetched) {
          this.fetched = true
          getGoods({
            id: this.seller.id
          }).then((goods) => {
            this.goods = goods
          })
        }
      },
      /**
       * 商品面板的商品信息点击处理
        */
      selectFood(food) {
        // 获取选中商品的商品信息
        this.selectedFood = food
        // 显示商品页信息
        this._showFood()
        this._showShopCartSticky()
      },
      /**
       * 商品增减按钮组件的递增动画处理
       * @param target 触发购物动画的递增按钮
       */
      onAdd(target) {
        this.$refs.shopCart.drop(target)
      },
      // 显示商品页信息
      _showFood() {
        this.foodComp = this.foodComp || this.$createFood({
          $props: {
            food: 'selectedFood'
          },
          $events: {
            add: (target) => {
              this.shopCartStickyComp.drop(target)
            },
            leave: () => {
              this._hideShopCartSticky()
            }
          }
        })
        this.foodComp.show()
      },
      _showShopCartSticky() {
        this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
          $props: {
            selectFoods: 'selectGoods',
            deliveryPrice: this.seller.deliveryPrice,
            minPrice: this.seller.minPrice,
            fold: true
          }
        })
        this.shopCartStickyComp.show()
      },
      _hideShopCartSticky() {
        this.shopCartStickyComp.hide()
      }
    },
    components: {
      Bubble,
      SupportIco,
      CartControl,
      ShopCart,
      Food
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"
  .goods
    position: relative
    text-align: left
    height: 100%
    .scroll-nav-wrapper
      position: absolute
      width: 100%
      top: 0
      left: 0
      bottom: 48px
    >>> .cube-scroll-nav-bar
      width: 80px
      white-space: normal
      overflow: hidden
    >>> .cube-scroll-nav-bar-item
      padding: 0 10px
      display: flex
      align-items: center
      height: 56px
      line-height: 14px
      font-size: $fontsize-small
      background: $color-background-ssss
      .text
        flex: 1
        position: relative
      .num
        position: absolute
        right: -8px
        top: -10px
      .support-ico
        display: inline-block
        vertical-align: top
        margin-right: 4px
    >>> .cube-scroll-nav-bar-item_active
      background: $color-white
      color: $color-dark-grey
    >>> .cube-scroll-nav-panel-title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid $color-col-line
      font-size: $fontsize-small
      color: $color-grey
      background: $color-background-ssss
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      position: relative
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
        img
          height: auto
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: $fontsize-medium
          color: $color-dark-grey
        .desc, .extra
          line-height: 10px
          font-size: $fontsize-small-s
          color: $color-light-grey
        .desc
          line-height: 12px
          margin-bottom: 8px
        .extra
          .count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: $fontsize-medium
            color: $color-red
          .old
            text-decoration: line-through
            font-size: $fontsize-small-s
            color: $color-light-grey
      .cart-control-wrapper
        position: absolute
        right: 0
        bottom: 12px
    .shop-cart-wrapper
      position: absolute
      left: 0
      bottom: 0
      z-index: 50
      width: 100%
      height: 48px
</style>
