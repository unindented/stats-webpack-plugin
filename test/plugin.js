var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var StatsPlugin = require('../');

var inputFolder = path.join(__dirname, 'fixtures');
var inputFile = path.join(inputFolder, 'entry.js');
var outputFolder = path.join(__dirname, 'output');
var outputFile = path.join(outputFolder, 'stats.json');

var options = {
  chunkModules: true,
  exclude: [/node_modules[\\\/]/]
};

var compiler = webpack({
  entry: inputFile,

  output: {
    path: outputFolder,
    filename: 'bundle.js'
  },

  plugins: [
    new StatsPlugin(outputFile, options)
  ]
});

module.exports.test = {

  'generates `stats.json` file': function (test) {
    compiler.run(function (err, stats) {
      var expected = JSON.stringify(stats.toJson(options));
      var actual = fs.readFileSync(outputFile);
      test.equal(actual, expected);
      test.done();
    });
  }

};
