(function() {
  var Context = require('../factories/context');

  var CartHasOtherCoupon = (function(){
    function CartHasOtherCoupon(_args) {
      this.application   = _args.application;
      var _context       = this;
      var contextOptions = {
        type:        'cart_has_other_coupon',
        application: _context.application,
        coupon:      _args.coupon,
        strategy:    function() {
          return (
            (_context.application.coupon) &&
            (_context.application.coupon != _args.coupon)
          );
        },
        perform: function() {
          _context.application.settings.unsetQualified();
        }
      };

      return (new Context(contextOptions));
    }

    return CartHasOtherCoupon;
  })();

  module.exports = CartHasOtherCoupon;
}).call(this);
