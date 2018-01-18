var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')
var webpack = require('webpack')
var StatsPlugin = require('../')

var chai = require('chai')
var expect = chai.expect

var inputFolder = path.resolve(__dirname, 'fixtures')
var inputFile = path.resolve(inputFolder, 'entry.js')
var outputFolder = path.resolve(__dirname, 'output')
var outputFile = path.resolve(outputFolder, 'stats.json')

var options = {
  chunkModules: true,
  exclude: [/node_modules[\\/]/]
}

var defaultCompilerOptions = {
  entry: inputFile,

  output: {
    path: outputFolder,
    filename: 'bundle.js'
  },

  profile: true,

  plugins: [
    new StatsPlugin('stats.json', options)
  ]
}

var multiCompilerOptions = (cache) => [{
  entry: {
    file1: inputFile
  },

  output: {
    path: outputFolder,
    filename: 'bundle1.js'
  },

  profile: true,

  plugins: [
    new StatsPlugin('stats.json', options, cache)
  ]
}, {
  entry: {
    file2: inputFile
  },

  output: {
    path: outputFolder,
    filename: 'bundle2.js'
  },

  profile: true,

  plugins: [
    new StatsPlugin('stats.json', options, cache)
  ]
}]

describe('StatsWebpackPlugin', function () {
  beforeEach(function () {
    rimraf.sync(outputFolder)
  })

  it('generates `stats.json` file', function (done) {
    var compiler = webpack(defaultCompilerOptions)
    compiler.run(function (err, stats) {
      if (err) {
        return done(err)
      }

      var actual = JSON.parse(fs.readFileSync(outputFile, 'utf8'))
      var expected = stats.toJson(options)

      expect(actual.assets.length).to.equal(expected.assets.length)
      done()
    })
  })

  it('supports multi-compile mode and outputs one `stats.json` file', function (done) {
    var cache = {}
    var compiler = webpack(multiCompilerOptions(cache))
    compiler.run(function (err, stats) {
      if (err) {
        return done(err)
      }

      var actual = JSON.parse(fs.readFileSync(outputFile, 'utf8'))

      var expectedAssetsByChunkName = {
        file1: 'bundle1.js',
        file2: 'bundle2.js'
      }
      expect(actual.assetsByChunkName).to.deep.equal(expectedAssetsByChunkName)
      done()
    })
  })
})
