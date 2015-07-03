var StatsPlugin = function (output, options) {
  this.output  = output;
  this.options = options;
};

StatsPlugin.prototype.apply = function (compiler) {
  var output  = this.output;
  var options = this.options;

  compiler.plugin('emit', function (compilation, done) {
    compilation.assets[output] = {
        size: function() { return 0 },
        source: function() {
            return JSON.stringify(compilation.getStats().toJson(options));
        }
    };
    done();
  });
};

module.exports = StatsPlugin;
