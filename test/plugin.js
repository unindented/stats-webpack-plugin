var clone = require('lodash/lang/clone');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var webpack = require('webpack');
var StatsPlugin = require('../');
var chai = require('chai');

var inputFolder = path.join(__dirname, 'fixtures');
var inputFile = path.join(inputFolder, 'entry.js');
var outputFolder = path.join(__dirname, 'output');
var outputFile = path.join(outputFolder, 'stats.json');

var expect = chai.expect;

var options = {
  chunkModules: true,
  exclude: [/node_modules[\\\/]/]
};

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
};

describe('StatsWebpackPlugin', function() {
    beforeEach(function() {
        // Ensure the output folder does not exist
        rimraf.sync(outputFolder);
    });

    it('generates `stats.json` file', function(done) {
        var compiler = webpack(defaultCompilerOptions);
        compiler.run(function (err, stats) {
          var expected = stats.toJson(options);
          var actual = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
          delete expected.time;
          for (var i = 0; i < expected.assets.length; ++i) {
              if (expected.assets[i].name === 'stats.json') {
                  delete expected.assets[i].emitted;
                  break;
              }
          }
          expect(actual).to.deep.equal(expected);
          done();
        });
    });
})
