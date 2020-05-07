var fs = require('fs')
var path = require('path')
var _ = require('lodash')

/**
 * Create a new StatsPlugin that causes webpack to generate a stats file as
 * part of the emitted assets.
 * @constructor
 * @param {String} output Path to output file.
 * @param {Object} options Options passed to the stats' `.toJson()`.
 */

function StatsPlugin (output, options, cache) {
  this.output = output
  this.options = options
  this.cache = cache
}

function onEmit (output, options, cache) {
  return function (compilation, done) {
    var result

    compilation.assets[output] = {
      size: function getSize () {
        return result ? result.length : 0
      },
      source: function getSource () {
        var stats = compilation.getStats().toJson(options)
        var files = options.merge
        var result

        if (cache) {
          cache = _.merge(cache, stats)
          if (stats.errors) cache.errors = stats.errors
          if (stats.warnings) cache.warnings = stats.warnings
          result = cache
        } else {
          result = stats
        }

        if (files) {
          files = typeof files === 'string' ? [files] : files
          files.forEach(function (file) {
            var targetPath = path.resolve(compilation.options.output.path, file)
            var otherStats = fs.readFileSync(targetPath, 'utf8')

            result = _.merge(JSON.parse(otherStats), result)
          })
        }
        return JSON.stringify(result)
      }
    }
    done()
  }
}

StatsPlugin.prototype.apply = function apply (compiler) {
  var output = this.output
  var options = this.options
  var cache = this.cache

  var onEmitCallback = onEmit(output, options, cache)

  if (compiler.hooks) {
    compiler.hooks.emit.tapAsync('StatsPlugin', onEmitCallback)
  } else {
    compiler.plugin('emit', onEmitCallback)
  }
}

module.exports = StatsPlugin
