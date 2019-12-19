export const parseComponents = (dataComponents) => {
  try {
    const escaped = dataComponents.replace(/'/g, '"')
    const components = JSON.parse(escaped)

    if (!Array.isArray(components)) {
      throw new Error('data-components must be an array')
    }

    return components
  }
  catch (error) {
    throw error
  }
}

export const getComponentScriptFile = (componentName) => {
  return `http://js.idle-component.local/${componentName}.vue.min.js`
}

export const getRemoteScript = (src) => new Promise((resolve, reject) => {
  const script = document.createElement('script')
  document.body.appendChild(script)
  script.onload = resolve
  script.onerror = reject
  script.async = true
  script.src = src
})

export const getErrorObjectFromYup = (yupError) => {
  const errors = {}

  for (const e of yupError.inner) {
    errors[e.path] = e.message
  }

  return errors
}