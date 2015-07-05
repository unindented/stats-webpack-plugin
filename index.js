function StatsPlugin(output, options) {
  this.output = output;
  this.options = options;
}

StatsPlugin.prototype.apply = function apply(compiler) {
  var output = this.output;
  var options = this.options;

  compiler.plugin('emit', function onEmit(compilation, done) {
    compilation.assets[output] = {
      size: function getSize() {
        return 0;
      },
      source: function getSource() {
        return JSON.stringify(compilation.getStats().toJson(options));
      }
    };
    done();
  });
};

module.exports = StatsPlugin;
