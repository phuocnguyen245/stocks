import path from 'path'

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      '@/*': path.resolve(__dirname, 'src/*')
    }
  }
}
