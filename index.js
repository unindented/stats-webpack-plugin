var fs   = require('fs');
var path = require('path');

var StatsPlugin = function (output, options) {
  this.output  = output;
  this.options = options;
};

StatsPlugin.prototype.apply = function (compiler) {
  var output  = this.output;
  var options = this.options;

  compiler.plugin('done', function (stats) {
    fs.writeFileSync(output, JSON.stringify(stats.toJson(options)));
  });
};

module.exports = StatsPlugin;
