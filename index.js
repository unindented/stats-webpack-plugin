/**
 * Create a new StatsPlugin that causes webpack to generate a stats file as
 * part of the emitted assets.
 * @constructor
 * @param {String} output Path to output file.
 * @param {Object} options Options passed to the stats' `.toJson()`.
 */
function StatsPlugin (output, options) {
  this.output = output
  this.options = options
}

StatsPlugin.prototype.apply = function apply (compiler) {
  var output = this.output
  var options = this.options

  compiler.plugin('emit', function onEmit (compilation, done) {
    const source = JSON.stringify(compilation.getStats().toJson(options))

    compilation.assets[output] = {
      size: function getSize () {
        return source.length
      },
      source: function getSource () {
        return source
      }
    }
    done()
  })
}

module.exports = StatsPlugin
