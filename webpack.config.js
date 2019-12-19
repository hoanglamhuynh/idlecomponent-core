const fs = require('fs')
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const normalizeLibraryName = (componentName) => {
  return componentName
    .replace(/-/g, '_')
    .replace(/\./g, '_')
    .slice(0, componentName.length - 4)
}

const baseConfig = {
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' },
      { test: /\.vue$/, use: 'vue-loader' },
      { test: /\.css$/, use: ['vue-style-loader', 'css-loader']}
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}

module.exports = () => new Promise((resolve, reject) => {
  fs.readdir('./src/components', (err, objects) => {
    if (err) {
      return reject(err)
    }

    const files = objects.filter(file => file.endsWith('.vue'))

    const mainConfig = Object.assign({}, baseConfig, {
      name: 'main',
      entry: './src/main.js',
      output: {
        path: path.join(__dirname, './dist'),
        filename: 'main.min.js'
      }
    })

    const componentConfigs = []
    for (const file of files) {
      const config = Object.assign({}, baseConfig, {
        name: file,
        entry: `./src/components/${file}`,
        output: {
          path: path.join(__dirname, './dist'),
          filename: `${file}.min.js`,
          library: `__IC__${normalizeLibraryName(file).toLowerCase()}`
        }
      })

      componentConfigs.push(config)
    }

    resolve(
      [mainConfig].concat(componentConfigs)
    )
  })
})