(function() {
  var Context = require('../factories/context');
  var Notice  = require('../factories/notice');

  var CartWithoutQualifier = (function(){
    function CartWithoutQualifier(_args) {
      this.application   = _args.application;
      var _context       = this;
      var contextOptions = {
        type:        'cart_without_qualifier',
        application: _context.application,
        coupon:      _args.coupon,
        strategy:    function() {
          return (
            _context.application.routeIsCart() &&
            !_context.application.cartHasQualifyingProduct()
          );
        },
        perform: function() {
          var noticeOptions = {
            environment: _context.application.environment,
            style:       'back',
            headline:    'Get a free pair <br class="mobile-only"> of flip flops <br class="desktop-only"> with <br class="mobile-only"> $100 purchase',
            buttonText:  '',
            href:        _context.application.specialURL
          };

          var placementOptions = {
            nextElementSelector: '#order_form .cart_summary,#bag_freeshipping',
            noticeElement:       new Notice(noticeOptions)
          };

          _context.application.document.placeNotice(placementOptions);
          _context.application.settings.unsetQualified();
        }
      };

      return (new Context(contextOptions));
    }

    return CartWithoutQualifier;
  })();

  module.exports = CartWithoutQualifier;
}).call(this);
