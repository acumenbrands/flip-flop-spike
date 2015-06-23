(function() {
  var FlipFlopSpike = require('./loader');

  var _environment = (typeof window != 'undefined') ? window : global;

  _environment.FlipFlopSpike = new FlipFlopSpike({
    environment: _environment
  });

}).call(this);
