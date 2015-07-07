(function() {
  var Context = require('../factories/context');

  var CartQualifies = (function(){
    function CartQualifies(_args) {
      this.application   = _args.application;
      var _context       = this;
      var contextOptions = {
        type:        'cart_qualifies',
        application: _context.application,
        coupon:      _args.coupon,
        strategy:    function() {
          return (
            _context.application.routeIsCart() &&
            _context.application.cartHasQualifyingProduct() &&
            _context.application.cartHasQualifyingNetTotal()
          );
        },
        perform: function() {
          _context.application.settings.setQualified();
          _context.application.tracking.trackContext(this);
        }
      };

      return (new Context(contextOptions));
    }

    return CartQualifies;
  })();

  module.exports = CartQualifies;
}).call(this);
