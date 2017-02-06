try {
  module.exports = require('./out/index')
} catch (e) {
  console.error(
      'Space watch backend module could not be found, has it been built?')
  throw e
}
