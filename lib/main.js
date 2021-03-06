(function() {
  var FlipFlopSpike = require('./loader');
  var _environment  = (typeof window != 'undefined') ? window : global;

  var _initFlipFlopSpike = function() {
    if (!('flipFlopSpike' in _environment)) {
      _environment.flipFlopSpike = new FlipFlopSpike({
        environment:         _environment,
        qualifyingCartValue: 75,
        settingsKey:         'FlipFlopSpike',
        coupon:              'RNRGIFT',
        specialURL:          '/rnr-flip-flops',
        tagMatch:            /^rnr\-flip\-flops/i
      });
    }
  };

  var css    = _environment.document.createElement('link');
  css.href   = "http://assets.countryoutfitter.com.s3.amazonaws.com/libs/flip-flop-spike/1.0.1/css/flip-flop-spike.min.css";
  css.href   = "http://d3v17ilp3z8t74.cloudfront.net/libs/flip-flop-spike/1.0.1/css/flip-flop-spike.min.css";
  css.media  = "all";
  css.rel    = "stylesheet";
  css.type   = "text/css";
  css.onload = _initFlipFlopSpike;
  _environment.document.head.appendChild(css);

}).call(this);
