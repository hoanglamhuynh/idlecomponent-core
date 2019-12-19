<template>
  <div>
    <span v-if="isCurrentSort('desc')">⇩</span>
    <span v-else-if="isCurrentSort('asc')">⇧</span>
    
    <template>
      <span @click="setSort">
        <slot>{{ field }}</slot>
      </span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    field: {
      type: String,
      required: true
    }
  },
  methods: {
    isCurrentSort (dir) {
      return this.$parent.isCurrentSort(this.field, dir)
    },
    setSort () {
      const nextSortDirection = this.$parent.getNextSortDirection(this.field)

      return this.$parent.setSort(this.field, nextSortDirection)
    }
  }
}
</script>