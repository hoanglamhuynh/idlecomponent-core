<template>
  <div>
    <slot name="loading" v-if="ajaxState === 'loading'">
    </slot>
    <slot name="loaded" v-if="ajaxState === 'loaded'" :data="data">
    </slot>
    <slot name="error" v-if="ajaxState === 'error'" :error="error">
    </slot>
  </div>
</template>

<script>
import helperMixin from '../mixins/helperMixin'
import vuexMixin from '../mixins/vuexMixin'
import externalControllerMixin from '../mixins/externalControllerMixin'
import postalMixin from '../mixins/postalMixin'

export default {
  props: {
    init: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: true
    },
    headers: {
      type: String,
      required: false,
      validator: (headers) => {
        try {
          JSON.parse(headers)

          return true
        } catch (error) {
          return false
        }
      }
    }
  },
  mixins: [externalControllerMixin, postalMixin, vuexMixin, helperMixin],
  data () {
    return {
      ajaxState: 'loading',
      transformationFn: (response) => {
        return response
          .json()
          .then(body => body)
      },
      data: null,
      error: null
    }
  },
  async mounted () {
    try {
      const response = await fetch(this.url, {
        method: 'GET',
        headers: JSON.parse(this.headers)
      })

      const transformed = await this.transformationFn.call(null, response)
      this.data = transformed

      if (response.status >= 400) {
        throw response
      }

      this.publish('success', {
        response
      })
      this.ajaxState = 'loaded'
    }
    catch (error) {
      this.publish('error', {
        error
      })
      this.ajaxState = 'error'
      this.error = error
    }
  },
  methods: {
    defineTransformation(fn) {
      this.transformationFn = fn
    }
  }
}
</script>