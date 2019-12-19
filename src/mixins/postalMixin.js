import postal from 'postal'

export default {
  created () {
    this.postal = postal.channel((new Date().getTime().toString()))
  },
  methods: {
    publish(channel, otherPayload) {
      const payload = this.generatePostalPayload(otherPayload)

      this.postal.publish(channel, payload)
    }
  }
}