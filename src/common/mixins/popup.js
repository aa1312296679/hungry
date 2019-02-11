const EVENT_SHOW = 'show'
const EVENT_HIDE = 'hide'

export default {
  data() {
    return {
      visible: false
    }
  },
  methods: {
    // 显示组件
    show() {
      this.visible = true
      this.$emit(EVENT_SHOW)
    },
    // 隐藏组件
    hide() {
      this.visible = false
      this.$emit(EVENT_HIDE)
    }
  }
}
