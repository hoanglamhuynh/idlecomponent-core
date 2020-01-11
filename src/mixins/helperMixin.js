export default {
  computed: {
    defaultScopedSlots () {
      const baseScopedSlots = {}

      if (this.store) {
        baseScopedSlots.store = this.store
      }

      if (this.postal) {
        baseScopedSlots.postalPublish = (channel, payload) => {
          this.publish(channel, {
            payload: payload
          })
        }
      }

      return baseScopedSlots
    }
  },
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

      if (this.postal) {
        basePayload.postal = this.postal
      }

      return Object.assign({}, otherPayload, basePayload)
    }
  }
}