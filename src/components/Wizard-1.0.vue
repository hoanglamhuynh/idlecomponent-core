<template>
  <div>
    <slot
      :step="currentStep"
      :submit-step="submitStep"
      :submit-final="submitFinal"
      :go-to-step="goToStep"
      :step-data="stepData"
      :step-errors="stepErrors"
    />
  </div>
</template>

<script>
import set from 'lodash/set'
import * as yup from 'yup'
import externalControllerMixin from '../mixins/externalControllerMixin'
import postalMixin from '../mixins/postalMixin'
import vuexMixin from '../mixins/vuexMixin'
import helperMixin from '../mixins/helperMixin'
import { getErrorObjectFromYup } from '../helpers'

export default {
  props: ['steps', 'init'],
  props: {
    steps: {
      type: Array,
      required: true,
      validation: (steps) => {
        return steps.length >= 1
      }
    },
    init: {
      type: String,
      required: false
    }
  },
  mixins: [externalControllerMixin, vuexMixin, postalMixin, helperMixin],
  name: 'IC__Public__Wizard__1.0',
  data () {
    return {
      currentStep: null,
      stepData: {},
      stepErrors: null,
      schema: {},
      stepSubmitFns: {}
    }
  },
  computed: {
    nextStepName () {
      const currentIndex = this.steps.indexOf(this.currentStep)
      const nextStepName = this.steps[currentIndex + 1]

      if (typeof nextStepName === 'undefined') {
        return this.currentStep
      }

      return nextStepName
    },
    previousStepName () {
      const currentIndex = this.steps.indexOf(this.currentStep)
      const prevStepName = this.steps[currentIndex - 1]

      if (typeof prevStepName === 'undefined') {
        return this.currentStep
      }

      return prevStepName
    }
  },
  mounted () {
    this.currentStep = this.nextStepName
  },
  methods: {
    initField (name, defaultValue) {
      const object = set({}, name, defaultValue)

      for (const stepName in object) {
        if (!this.stepData[stepName]) {
          this.$set(this.stepData, stepName, {})
        }

        for (const field in object[stepName]) {
          this.$set(this.stepData[stepName], field, object[stepName][field])
        }
      }
    },
    defineStepSchema (step, fn) {
      this.schema[step] = fn.call(null, yup)
    },
    defineStepSubmit (step, fn) {
      this.stepSubmitFns[step] = fn
    },
    async submitStep () {
      const stepErrors = await this.performValidation()

      this.stepErrors = stepErrors
      this.goToStep(this.nextStepName)
    },
    async submitFinal () {
      const stepErrors = await this.performValidation()

      this.stepErrors = stepErrors
      this.performHook()
        .then(() => {
          this.publish('finalSubmit', {
            stepData: JSON.parse(JSON.stringify(this.stepData))
          })
        })
    },
    async performValidation () {
      const currentSchema = this.schema[this.currentStep]
      const currentStepData = this.stepData[this.currentStep]
      const allStepsData = JSON.parse(JSON.stringify(this.stepData))

      if (currentSchema) {
        try {
          await currentSchema.validate(currentStepData, {
            abortEarly: false
          })

          return null
        }
        catch (yupError) {
          if (yupError.name === 'ValidationError') {
            return getErrorObjectFromYup(yupError)
          }
        }
      }
      else {
        return null
      }
    },
    performHook () {
      if (typeof this.stepSubmitFns[this.currentStep] === 'function') {
        return new Promise(resolve => {
          this.stepSubmitFns[this.currentStep].call(null, {
            stepData: JSON.parse(JSON.stringify(this.stepData)),
            stepErrors: this.stepErrors ? JSON.parse(JSON.stringify(this.stepErrors)) : null
          }, resolve)
        })
      }
      else {
        return Promise.resolve()
      }
    },
    goToStep (step) {
      if (this.steps.indexOf(step) === -1) {
        throw new Error(`Step ${step} is not defined`)
      }

      this.performHook()
        .then(() => {
          this.stepErrors = null
          this.currentStep = step
        })
    }
  },
  watch: {
    isFinishInit (value) {
      if (!value) {
        return
      }

      const stepSchemaKeys = Object.keys(this.schema)

      for (const step in this.schema) {
        if (typeof this.stepSubmitFns[step] === 'undefined') {
          this.stepSubmitFns[step] = (any, next) => {
            if (!any.stepErrors) {
              next()
            }
          }
        }
      }
    }
  }
}
</script>