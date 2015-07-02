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
var newOutputFolder = path.join(__dirname, 'new-output');
var newOutputFile = path.join(newOutputFolder, 'stats.json');

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
    new StatsPlugin(outputFile, options)
  ]
};

it('generates `stats.json` file', function(done) {
    var compiler = webpack(defaultCompilerOptions);
    compiler.run(function (err, stats) {
      var expected = stats.toJson(options);
      var actual = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
      delete expected.time;
      expect(actual).to.deep.equal(expected);
      done();
    });
});

it('creates directories if they do not exist', function(done) {
    // Ensure the output folder does not exist
    rimraf.sync(newOutputFolder);

    var compilerOptions = clone(defaultCompilerOptions, true);
    compilerOptions.output.path = newOutputFolder;
    compilerOptions.plugins = [
      new StatsPlugin(newOutputFile, options)
    ];

    var compiler = webpack(compilerOptions);
    compiler.run(function (err, stats) {
      var expected = stats.toJson(options);
      var actual = JSON.parse(fs.readFileSync(newOutputFile, 'utf8'));
      delete expected.time;
      expect(actual).to.deep.equal(expected);
      done();
    });
});
