import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  data () {
    return {
      store: null
    }
  },
  methods: {
    defineStore(fn) {
      this.store = fn.call(null, Vuex)
    }
  }
}