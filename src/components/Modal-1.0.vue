<template>
  <div class="ic-modal" :class="{ 'ic-modal--is-showing': isShowing }">
    <div class="ic-modal-backdrop" v-if="isShowing" @click.self="handleBackdropClick"></div>

    <div class="ic-modal-content" v-if="isShowing">
      <div class="ic-modal-content-inner">
        <div class="ic-modal-header flex">
          <slot name="header" v-bind="scopedSlots">
            <div class="flex-1">
              {{ title }}
            </div>
            <div class="flex-none">
              <button type="button" class="ic-modal-close" @click="closeModal">
                <close-icon width="20" height="20" />
              </button>
            </div>
          </slot>
        </div>

        <slot v-bind="scopedSlots" />

        <div class="ic-modal-footer flex">
          <slot name="footer" v-bind="scopedSlots">
            <button type="button" class="button">OK</button>
            <button type="button" class="button">Close</button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import externalControllerMixin from '../mixins/externalControllerMixin'
import vuexMixin from '../mixins/vuexMixin'
import postalMixin from '../mixins/postalMixin'
import helperMixin from '../mixins/helperMixin'
import CloseIcon from './core/icons/CloseIcon.vue'

export default {
  components: {
    CloseIcon
  },
  props: {
    init: {
      type: String,
      required: false
    },
    backdropDismiss: {
      type: Boolean,
      required: false,
      default: () => true
    },
    title: {
      type: String,
      required: false,
      default: () => 'Default Header'
    }
  },
  mixins: [externalControllerMixin, vuexMixin, postalMixin, helperMixin],
  data () {
    return {
      isShowing: false
    }
  },
  computed: {
    scopedSlots () {
      return {
        isShowing: this.isShowing,
        closeModal: this.closeModal.bind(this),
        openModal: this.openModal.bind(this),
        ...this.defaultScopedSlots
      }
    }
  },
  methods: {
    closeModal () {
      this.isShowing = false
    },
    openModal () {
      this.isShowing = true
    },
    handleBackdropClick () {
      if (this.backdropDismiss === true) {
        this.isShowing = false
      }
    }
  },
  watch: {
    isShowing (value) {
      if (value) {
        this.publish('open')
      }
      else {
        this.publish('close')
      }
    }
  }
}
</script>

<style src="../styles/core.css"></style>
<style>
.ic-modal {
  position: relative;
}

.ic-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0000006b;
}

.ic-modal-close {
  padding: 0;
  border: none;
}

.ic-modal-content {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  bottom: 0;
  display: inline-block;
  min-width: 300px;
}

.ic-modal-content-inner {
  margin: auto;
  background: white;
  padding: 20px;
  border-radius: 5px;
}

.ic-modal-header {
  margin-bottom: 20px;
}

.ic-modal-footer {
  margin-top: 20px;
}
</style>