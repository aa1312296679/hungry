<template>
  <div class="tab">
   <!--tab切换的头部信息-->
    <cube-tab-bar
      :useTransition=false
      :showSlider=true
      v-model="selectedLabel"
      :data="tabs"
      ref="tabBar"
      class="border-bottom-1px"
    >
    </cube-tab-bar>
    <!--tab切换的面板部分-->
    <div class="slide-wrapper">
      <cube-slide
        :loop=false
        :auto-play=false
        :show-dots=false
        :initial-index="index"
        ref="slide"
        :options="slideOptions"
        @scroll="onScroll"
        @change="onChange"
      >
        <cube-slide-item v-for="(tab,index) in tabs" :key="index">
          <component ref="component" :is="tab.component" :data="tab.data"></component>
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tab',
    props: {
      // 所有切换页
      tabs: {
        type: Array,
        default() {
          return []
        }
      },
      // 初始化时被选中的tab选项卡的选项卡索引
      initialIndex: {
        type: Number,
        // 默认初始选中第一页
        default: 0
      }
    },
    data() {
      return {
        // 被选中的tab选项卡的选项卡索引
        index: this.initialIndex,
        // tab切换的轮播视图配置
        slideOptions: {
          listenScroll: true,
          probeType: 3,
          directionLockThreshold: 0
        }
      }
    },
    computed: {
      selectedLabel: {
        // 获取被选中的tab选项卡的选项名
        get() {
          return this.tabs[this.index].label
        },
        // 根据选项卡名更新被选中的tab选项卡的选项卡索引
        set(newVal) {
          this.index = this.tabs.findIndex((value) => {
            return value.label === newVal
          })
        }
      }
    },
    mounted() {
      // 对初始化时默认选中选项进行视图切换处理
      this.onChange(this.index)
    },
    methods: {
      // tab选项页的与tab选项卡的联动处理
      onScroll(pos) {
        const tabBarWidth = this.$refs.tabBar.$el.clientWidth
        const slideWidth = this.$refs.slide.slide.scrollerWidth
        const transform = -pos.x / slideWidth * tabBarWidth
        this.$refs.tabBar.setSliderTransform(transform)
      },
      // 选项卡的视图切换处理
      onChange(current) {
        this.index = current
        const component = this.$refs.component[current]
        // 将选中的atb选项卡对应的视图页组件显示
        component.showStatus = true
        // 将未选中的tab选项卡的视图页组件隐藏
        for (let i in this.$refs.component) {
          if (parseInt(i) !== current) {
            this.$refs.component[i].showStatus = false
          }
        }
        component.fetch && component.fetch()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .tab
    display: flex
    flex-direction: column
    height: 100%
    >>> .cube-tab
      padding: 10px 0
    .slide-wrapper
      flex: 1
      overflow: hidden
</style>
