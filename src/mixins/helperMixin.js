export default {
  methods: {
    checkParent (parentList) {
      const isValidParent = parentList.some(parentName => this.$parent.$options.name.startsWith(parentName))

      if (!isValidParent) {
        const parentListJoined = parentList
          .map(parentName => `<${parentName}__*.*>`)
          .join(', ')
        throw new Error(`${this.$options.name} is required to be a direct child of ${parentListJoined}`)
      }
    },
    generatePostalPayload (otherPayload) {
      const basePayload = {}

      if (this.store) {
        basePayload.store = this.store
      }

      if (this.schema) {
        basePayload.schema = this.schema
      }

      return Object.assign({}, otherPayload, basePayload)
    }
  }
}