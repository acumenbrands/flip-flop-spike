(function() {
  var Notifier = (function() {
    function Notifier(_args) {
      this.application = _args.application;
      this.coupon      = _normalizeCoupon(_args);
      this.contexts    = _args.contexts;
      this.context     = this.getContext();

      this.context.performOnce();
    }

    Notifier.prototype.getContext = function() {
      var contextOptions = {
        application: this.application,
        specialURL:  this.specialURL,
        coupon:      this.coupon
      };

      for (var i=0, len=this.contexts.length; i<len; i++) {
        var contextClass = this.contexts[i];
        var context      = new contextClass(contextOptions);

        if (context.isApplicable()) {
          return context;
        }
      }
    };

    var _normalizeCoupon = function(args) {
      var coupon = "";
      if (args && 'coupon' in args) {
        coupon = args.coupon;
      }
      return coupon.toLowerCase();
    };

    var _noop = function() {};

    return Notifier;
  })();

  module.exports = Notifier;
}).call(this);
