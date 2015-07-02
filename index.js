var path = require('path');

var StatsPlugin = function (output, options) {
  this.output  = output;
  this.options = options;
};

StatsPlugin.prototype.apply = function (compiler) {
  var output  = this.output;
  var options = this.options;

  compiler.plugin('after-emit', function (compilation, done) {
    var fs = compiler.outputFileSystem;
    var data = JSON.stringify(compilation.getStats().toJson(options));
    fs.mkdirp(path.dirname(output), function(err) {
      if (err) {
        done(err);
      } else {
        fs.writeFile(output, data, done);
      }
    });
  });
};

module.exports = StatsPlugin;
