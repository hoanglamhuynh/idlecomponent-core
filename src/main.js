import Vue from 'vue/dist/vue.js'
import {
  parseComponents,
  getComponentScriptFile,
  getRemoteScript
} from './helpers'

setTimeout(async () => {
  const scriptTag = document.querySelector('script[data-idle-component]')
  const components = parseComponents(scriptTag.getAttribute('data-components'))

  await Promise.all(
    components.map(component => {
      const path = getComponentScriptFile(component)

      return getRemoteScript(path)
    })
  )

  components.forEach(component => {
    const componentObjectKey = `__IC__${component.replace(/-/g, '_').replace(/\./g, '_')}`

    Vue.component(component, window[componentObjectKey].default)
  })

  const templates = document.querySelectorAll('template[data-idle-component]')

  Array.from(templates).forEach(domEl => {
    const html = domEl.innerHTML

    new Vue({
      el: domEl,
      template: `<div>${html}</div>`
    })
  })
})