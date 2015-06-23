(function() {
  var Context = require('../factories/context');

  var CartHasCoupon = (function(){
    function CartHasCoupon(_args) {
      this.application = _args.application;
      var _context = this;

      var contextOptions = {
        type:        'cart_has_coupon',
        application: _args.application,
        strategy: function() {
          return (_context.application.cart.hasCoupon());
        }
      };

      return (new Context(contextOptions));
    }

    return CartHasCoupon;
  })();

  module.exports = CartHasCoupon;
}).call(this);
