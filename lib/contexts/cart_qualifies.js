(function() {
  var Context = require('../factories/context');

  var CartQualifies = (function(){
    function CartQualifies(_args) {
      this.application = _args.application;
      var _context = this;

      var contextOptions = {
        type:        'cart_has_coupon',
        application: _args.application,
        strategy: function() {
          return (
            _context.application.route.isCart() &&
            _context.application.cart.hasQualifyingProduct() &&
            _context.application.cart.hasQualifyingNet()
          );
        }
      };

      return (new Context(contextOptions));
    }

    return CartQualifies;
  })();

  module.exports = CartQualifies;
}).call(this);
