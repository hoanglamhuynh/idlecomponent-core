export default {
  data () {
    return {
      isFinishInit: false
    }
  },
  async mounted () {
    if (this.init && window[this.init]) {
      await window[this.init](this)
      this.isFinishInit = true
    }
  }
}