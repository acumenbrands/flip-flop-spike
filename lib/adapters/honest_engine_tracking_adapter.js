(function() {
  var HonestEngineTrackingAdapter = (function() {
    function HonestEngineTrackingAdapter(_application) {
      this.dataLayer = _getDataLayer(_application.environment);
    }

    HonestEngineTrackingAdapter.prototype.trackContext = function(_context) {
      var trackingEvent = {
        "event":       "flip-flop-spike-context",
        "contextType": _context.type
      };
      this.dataLayer.push(trackingEvent);
    };

    var _getDataLayer = function(env) {
      if (!('dataLayer' in env)) {
        env.dataLayer = [];
      }
      return env.dataLayer;
    };

    return HonestEngineTrackingAdapter;
  })();

  module.exports = HonestEngineTrackingAdapter;
}).call(this);
