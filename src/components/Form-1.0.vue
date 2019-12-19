<template>
  <form @submit.prevent="handleSubmit">
    <div class="ic-form-content" ref="formContent">
      <slot v-if="isFinishInit" v-bind="scopedSlots" />
    </div>
  </form>
</template>

<script>
import helperMixin from '../mixins/helperMixin'
import vuexMixin from '../mixins/vuexMixin'
import validationMixin from '../mixins/validationMixin'
import externalControllerMixin from '../mixins/externalControllerMixin'
import postalMixin from '../mixins/postalMixin'
import { getErrorObjectFromYup } from '../helpers'

export default {
  props: ['init'],
  props: {
    init: {
      type: String,
      required: false
    }
  },
  mixins: [externalControllerMixin, vuexMixin, validationMixin, postalMixin, helperMixin],
  name: 'IC__Public__Form__1.0',
  data () {
    return {
      formData: {},
      errors: {}
    }
  },
  computed: {
    scopedSlots () {
      return {
        formData: this.formData,
        errors: this.errors,
        store: this.store
      }
    }
  },
  methods: {
    getSchema () {
      return this.schema
    },
    initField (name, defaultValue) {
      this.$set(this.formData, name, defaultValue)
    },
    async handleSubmit () {
      const rawData = JSON.parse(JSON.stringify(this.formData))

      try {
        const validationResult = await this.schema.validate(this.formData, {
          abortEarly: false
        })

        this.publish('submit', {
          yupError: null,
          data: rawData
        })
      }
      catch (yupError) {
        if (yupError.name === 'ValidationError') {
          this.publish('submit', {
            yupError,
            data: rawData
          })
        }
      }
    }
  }
}
</script>