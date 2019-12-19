<template>
  <div></div>
</template>

<script>
import helperMixin from '../mixins/helperMixin'

export default {
  props: ['field', 'value'],
  mixins: [helperMixin],
  mounted () {
    this.checkParent([
      'IC__Public__Form',
      'IC__Public__Wizard'
    ])

    if (this.field) {
      this.$parent.initField(this.field, this.value)
    }
  }
}
</script>