<template>
  <div>
    <slot :realtime-errors="realtimeErrors" />
  </div>
</template>

<script>
import helperMixin from '../mixins/helperMixin'
import { getErrorObjectFromYup } from '../helpers'

export default {
  props: {
    formData: {
      type: Object,
      required: true
    },
    immediate: {
      type: Boolean,
      required: false,
      default: () => true
    }
  },
  mixins: [helperMixin],
  data () {
    return {
      realtimeErrors: null
    }
  },
  async mounted () {
    this.checkParent([
      'IC__Public__Form'
    ])

    if (this.$parent.getSchema) {
      const schema = this.$parent.getSchema()

      this.setupWatcher(schema)
    }
  },
  methods: {
    setupWatcher (schema) {
      this.$watch('formData', async (v) => {
        try {
          await schema.validate(v, {
            abortEarly: false
          })

          this.realtimeErrors = null
        }
        catch (yupError) {
          if (yupError.name === 'ValidationError') {
            this.realtimeErrors = getErrorObjectFromYup(yupError)
          }
        }
      }, { deep: true, immediate: this.immediate })
    }
  }
}
</script>