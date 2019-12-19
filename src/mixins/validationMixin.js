import * as yup from 'yup'

export default {
  data () {
    return {
      schema: null
    }
  },
  methods: {
    defineValidation (fn) {
      this.schema = fn.call(null, yup)
    }
  }
}