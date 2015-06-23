(function() {
  var ApplicationAdapter = (function() {
    function ApplicationAdapter(_args) {
      this.environment  = _args.environment; // window
      this.cookieString = _getCookie(this.environment);
      this.route        = _getRoute(this.environment);
      this.coupon       = _getCoupon(this.cookieString);
    }

    var _getCoupon = function(cookieString) {
      var couponRE      = /coupon_code=([^\s;]*)/gi;
      var couponResults = couponRE.exec(cookieString) || [null];
      var couponCode    = couponResults.reverse()[0];

      return couponCode;
    };

    var _getCookie = function(env) {
      return env.document.cookie;
    };

    var _getRoute = function(env) {
      return env.location.pathname;
    };

    return ApplicationAdapter;
  })();

  module.exports = ApplicationAdapter;
}).call(this);
