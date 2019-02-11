<template>
  <div>
    <div class="shopcart">
      <!--
         购物车的购物列表的点击处理
      -->
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">
              <bubble :num="totalCount"></bubble>
            </div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <!--
          购物车的购物动画球容器
      -->
      <div class="ball-container">
        <div v-for="(ball,index) in balls" :key="index">
          <transition
            @before-enter="beforeDrop"
            @enter="dropping"
            @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Bubble from 'components/bubble/bubble'

  // 购物动画球总数
  const BALL_LEN = 10
  const innerClsHook = 'inner-hook'

  export default {
    name: 'shop-cart',
    props: {
      // 所有购物车商品
      selectGoods: {
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
      // 商品配送起步价
      minPrice: {
        type: Number,
        default: 0
      },
      sticky: {
        type: Boolean,
        default: false
      },
      // 当前购物车的购物列表的显隐
      fold: {
        type: Boolean,
        // 默认为显示
        default: true
      }
    },
    data() {
      return {
        balls: null,
        // 当前购物车的购物列表的显隐状态
        listFold: this.fold,
        dropBalls: []
      }
    },
    created() {
      this.balls=this.createBalls();
    },
    computed: {
      /**
       * 计算购物车所有商品的商品总价
      */
      totalPrice() {
        let total = 0
        this.selectGoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      /**
       * 计算购物车所有商品的商品总数
      */
      totalCount() {
        let count = 0
        this.selectGoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      /**
       * 生成当前购物车的购物车提示信息
      */
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        } else {
          return '去结算'
        }
      },
      /**
       * 当前购物车的购物结算按钮的按钮状态
      */
      payClass() {
        if (!this.totalCount || this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      }
    },
    methods: {
      /**
       * 购物车点击处理
       * */
      toggleList() {
        // 当前购物车的购物列表为显示
        if (this.listFold) {
          // 如果当前购物车不存在任何商品中断购物列表的显示
          if (!this.totalCount) {
            return
          }
          // 隐藏购物列表
          this.listFold = false
          // 显示购物车的购物列表
          this._showShopCartList()
          // 显示克隆版本购物车
          this._showShopCartSticky()
        } else {
          // 显示购物列表
          this.listFold = true
          this._hideShopCartList()
        }
      },
      pay(e) {
        if (this.totalPrice < this.minPrice) {
          return
        }
        this.$createDialog({
          title: '支付',
          content: `您需要支付${this.totalPrice}元`
        }).show()
        e.stopPropagation()
      },
      /**
       * 当前购物车的购物动画处理
      */
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          const ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      /**
       * 初始化购物车的所有购物动画球
      */
     createBalls() {
        let balls = []
        for (let i = 0; i < BALL_LEN; i++) {
          balls.push({show: false})
        }
        return balls
      },
      /**
       * 购物动画球的起始动画
      */
      beforeDrop(el) {
        // 计算购物动画球的球体位置
        const ball = this.dropBalls[this.dropBalls.length - 1]
        const rect = ball.el.getBoundingClientRect()
        const x = rect.left - 32
        const y = -(window.innerHeight - rect.top - 22)
        // 通过贝塞尔曲线实现购物动画球的抛物线效果
        el.style.display = ''
        el.style.transform = el.style.webkitTransform = `translate3d(0,${y}px,0)`
        const inner = el.getElementsByClassName(innerClsHook)[0]
        inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px,0,0)`
      },
      /**
       * 购物动画球的执行动画
       * @param el  显示的购物球
       * @param done 结束动画
       */
      dropping(el, done) {
        this._reflow = document.body.offsetHeight
        el.style.transform = el.style.webkitTransform = `translate3d(0,0,0)`
        const inner = el.getElementsByClassName(innerClsHook)[0]
        inner.style.transform = inner.style.webkitTransform = `translate3d(0,0,0)`
        el.addEventListener('transitionend', done)
      },
      /**
       * 购物动画球的结束动画
       * @param el 显示的购物球
       */
      afterDrop(el) {
        // 取出所有动画球中处于显示状态的动画球
        const ball = this.dropBalls.shift()
        // 将购物动画球重置为隐藏
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      /**
       * 购物车的购物列表显示处理
        */
      _showShopCartList() {
        this.shopCartListComp = this.shopCartListComp || this.$createShopCartList({
          // 配置购物车的购物列表的所有购买商品
          $props: {
            selectFoods: 'selectGoods'
          },
          $events: {
            // 配置购物列表的隐藏处理
            leave: () => {
              this._hideShopCartSticky()
            },
            // 配置购物列表的显示处理
            hide: () => {
              this.listFold = true
            },
            // 配置购物列表的新增按钮的购物动画处理
            add: (el) => {
              this.shopCartStickyComp.drop(el)
            }
          }
        })
        // 显示购物列表
        this.shopCartListComp.show()
      },
      /**
       * 显示克隆版购物车
       * @private
       */
      _showShopCartSticky() {
        // 创建克隆版购物车的管理对象
        this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
          $props: {
            selectFoods: 'selectGoods',
            deliveryPrice: 'deliveryPrice',
            minPrice: 'minPrice',
            fold: 'listFold',
            list: this.shopCartListComp
          }
        })
        // 显示克隆版本购物车
        this.shopCartStickyComp.show()
      },
      _hideShopCartList() {
        const list = this.sticky ? this.$parent.list : this.shopCartListComp
        list.hide && list.hide()
      },
      _hideShopCartSticky() {
        this.shopCartStickyComp.hide()
      }
    },
    watch: {
      // 实时更新购物列表显隐状态
      fold(newVal) {
        this.listFold = newVal
      },
      totalCount(count) {
        if (!this.fold && count === 0) {
          this._hideShopCartList()
        }
      }
    },
    components: {
      Bubble
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .shopcart
    height: 100%
    .content
      display: flex
      background: $color-background
      font-size: 0
      color: $color-light-grey
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: $color-background
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: $color-dark-grey
            &.highlight
              background: $color-blue
            .icon-shopping_cart
              line-height: 44px
              font-size: $fontsize-large-xxx
              color: $color-light-grey
              &.highlight
                color: $color-white
          .num
            position: absolute
            top: 0
            right: 0
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-weight: 700
          font-size: $fontsize-large
          &.highlight
            color: $color-white
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: $fontsize-small-s
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-weight: 700
          font-size: $fontsize-small
          &.not-enough
            background: $color-dark-grey
          &.enough
            background: $color-green
            color: $color-white
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: $color-blue
          transition: all 0.4s linear
</style>
