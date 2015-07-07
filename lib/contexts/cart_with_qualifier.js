(function() {
  var Context = require('../factories/context');
  var Notice  = require('../factories/notice');

  var CartQualifies = (function(){
    function CartQualifies(_args) {
      this.application   = _args.application;
      var _context       = this;
      var contextOptions = {
        type:        'cart_with_qualifier',
        application: _context.application,
        coupon:      _args.coupon,
        strategy:    function() {
          return (
            _context.application.routeIsCart() &&
            _context.application.cartHasQualifyingProduct()
          );
        },
        perform: function() {
          var noticeOptions = {
            environment: _context.application.environment,
            style:       'back',
            headline:    'Get your pair of<br>flip flops Free with<br>$100 purchase',
            buttonText:  '',
            href:        '/footwear'
          };

          var placementOptions = {
            nextElementSelector: '#order_form .cart_summary,#bag_freeshipping',
            noticeElement:       new Notice(noticeOptions)
          };

          _context.application.document.placeNotice(placementOptions);
          _context.application.settings.unsetQualified();
          _context.application.tracking.trackContext(this);
        }
      };

      return (new Context(contextOptions));
    }

    return CartQualifies;
  })();

  module.exports = CartQualifies;
}).call(this);
