<template>
  <div>
    <ul v-if="isNotRedirecting">
      <li v-for="p in pagesToDisplay" :key="p">
        <button type="button" @click="setPage(p)">
          <span :style="{ 'background-color': p === options.currentPage ? 'green' : 'inherit' }">{{ p }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    armLength: {
      type: Number,
      required: false,
      default: () => 2
    }
  },
  computed: {
    isNotRedirecting () {
      return this.options.mode === 'inline' || this.options.mode === 'sessionStorage'
    },
    options () {
      return this.$parent.options
    },
    pagesToDisplay () {
      const minPage = Math.max(this.options.currentPage - this.armLength, 1)
      const maxPage = Math.min(this.options.totalPage, this.options.currentPage + this.armLength)

      const pages = []
      for (let i = minPage; i <= maxPage; ++i) {
        pages.push(i)
      }

      return pages
    }
  },
  methods: {
    setPage (p) {
      if (typeof this.$parent.setPage === 'function') {
        this.$parent.setPage(p)
      }
    }
  }
}
</script>