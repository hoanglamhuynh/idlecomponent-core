<template>
  <div>
    <slot name="top" v-bind="scopedSlots" />

    <table>
      <thead>
        <slot name="thead" v-bind="scopedSlots">
          <tr>
            <th v-for="(field, index) in headers" :key="index">{{ field }}</th>
          </tr>
        </slot>
      </thead>

      <tbody>
        <slot name="tbody" v-bind="scopedSlots">
          <tr v-for="(item, rowIndex) in items" :key="rowIndex">
            <td v-for="(field, value, colIndex) in item" :key="colIndex">
              {{ value }}
            </td>
          </tr>
        </slot>
      </tbody>

      <tfoot>
        <slot name="tfoot" v-bind="scopedSlots" />
      </tfoot>
    </table>

    <slot name="bottom" v-bind="scopedSlots" />
  </div>
</template>

<script>
import externalControllerMixin from '../mixins/externalControllerMixin'
import vuexMixin from '../mixins/vuexMixin'
import helperMixin from '../mixins/helperMixin'
import postalMixin from '../mixins/postalMixin'
import dataGridPostalMixin from '../mixins/dataGridPostalMixin'

export default {
  mixins: [externalControllerMixin, vuexMixin, postalMixin, dataGridPostalMixin, helperMixin],
  props: {
    init: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      items: [],
      options: {
        mode: 'inline',
        perPage: 10,
        currentSortedField: null,
        currentSortedDir: null,
        totalPage: 0,
        currentPage: 0  
      }
    }
  },
  computed: {
    headers () {
      const firstItem = this.items[0]
        ? Object.keys(this.items[0])
        : null
    },
    scopedSlots () {
      return {
        isCurrentSort: this.isCurrentSort,
        setSort: this.setSort,
        getNextSortDirection: this.getNextSortDirection,
        setPerPage: this.setPerPage,
        setPage: this.setPage,
        options: this.options,
        items: this.items,
        store: this.store
      }
    }
  },
  created () {
    this.fetchFn = () => null
  },
  methods: {
    defineData (fn) {
      this.items = fn.call(null, this.options)
    },
    defineOptions (fn) {
      this.options = fn.call(null, this.options)
    },
    defineFetchFn (fn) {
      this.fetchFn = fn
    },
    isCurrentSort (field, dir) {
      return this.options.currentSortedField === field && this.options.currentSortedDir === dir
    },
    setPage (p) {
      this.options.currentPage = p

      this.postal.publish('refresh')
    },
    getNextSortDirection (field) {
      if (this.options.currentSortedField === field) {
        if (this.options.currentSortedDir === 'desc') {
          return 'asc'
        }
        else if (this.options.currentSortedDir === 'asc') {
          return null
        }
        else if (this.options.currentSortedDir === null) {
          return 'desc'
        }
      }
      else {
        return 'desc'
      }
    },
    setSort (field, dir) {
      this.doFetch({
        options: {
          ...this.options,
          currentSortedField: field,
          currentSortedDir: dir
        }
      })
      .then(({ items, total, currentPage }) => {
        this.items = items

        this.options.currentSortedField = field
        this.options.currentSortedDir = dir
        this.options.totalPage = total || 0
        this.options.currentPage = currentPage || 0
      })
    },
    setPerPage (e) {
      if (Number.isNaN(Number(e.target.value))) {
        return
      }

      this.doFetch({
        options: {
          ...this.options,
          perPage: Number(e.target.value)
        }
      })
      .then(({ items, total, currentPage }) => {
        this.items = items

        this.options.perPage = Number(e.target.value)
        this.options.totalPage = total || 0
        this.options.currentPage = currentPage || 0
      })
    },
    doFetch (pendingData) {
      return new Promise(async resolve => {
        this.fetchFn.call(
          null,
          {
            items: this.items,
            options: this.options,
            ...pendingData,
            store: this.store
          },
          resolve
        )
      })
    }
  }
}
</script>