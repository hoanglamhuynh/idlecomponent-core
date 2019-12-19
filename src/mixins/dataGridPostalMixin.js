export default {
  created () {
    this.postal.subscribe('refresh', () => {
      this.doFetch({ ...this.$data })
        .then(({ items, total, currentPage }) => {
          this.items = items

          this.options.totalPage = total || 0
          this.options.currentPage = currentPage || 0
        })
    })
  }
}