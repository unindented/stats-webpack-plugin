var clone = require('lodash/lang/clone');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var webpack = require('webpack');
var StatsPlugin = require('../');

var inputFolder = path.join(__dirname, 'fixtures');
var inputFile = path.join(inputFolder, 'entry.js');
var outputFolder = path.join(__dirname, 'output');
var outputFile = path.join(outputFolder, 'stats.json');
var newOutputFolder = path.join(__dirname, 'new-output');
var newOutputFile = path.join(newOutputFolder, 'stats.json');

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

  plugins: [
    new StatsPlugin(outputFile, options)
  ]
};

module.exports.test = {

  'generates `stats.json` file': function (test) {
    var compiler = webpack(defaultCompilerOptions);
    compiler.run(function (err, stats) {
      var expected = JSON.stringify(stats.toJson(options));
      var actual = fs.readFileSync(outputFile);
      test.equal(actual, expected);
      test.done();
    });
  },

  'creates directories if they do not exist': function (test) {
    // Ensure the output folder does not exist
    rimraf.sync(newOutputFolder);

    var compilerOptions = clone(defaultCompilerOptions, true);
    compilerOptions.output.path = newOutputFolder;
    compilerOptions.plugins = [
      new StatsPlugin(newOutputFile, options)
    ];

    var compiler = webpack(compilerOptions);
    compiler.run(function (err, stats) {
      var expected = JSON.stringify(stats.toJson(options));
      var actual = fs.readFileSync(newOutputFile);
      test.equal(actual, expected);
      test.done();
    });
  }

};
