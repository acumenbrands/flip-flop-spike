(function() {
  var Context = require('../factories/context');
  var Notice  = require('../factories/notice');

  var ViewsProduct = (function(){
    function ViewsProduct(_args) {
      this.application   = _args.application;
      this.type        = 'views_product';

      var _context       = this;
      var contextOptions = {
        type:        _context.type,
        application: _context.application,
        coupon:      _args.coupon,
        strategy:    function() {
          return _context.application.routeIsProduct();
        },
        perform: function() {
          // var noticeOptions = {
          //   context:     _context,
          //   environment: _context.application.environment,
          //   style:       'small-banner',
          //   headline:    'Get your free pair of flip<br>flops with a $' + _context.application.qualifyingCartValue + ' purchase',
          //   buttonText:  '',
          //   href:        _context.application.specialURL
          // };
          //
          // var placementOptions = {
          //   nextElementSelector: '#mainWrapper .main_content,#view',
          //   noticeElement:       new Notice(noticeOptions)
          // };
          //
          // _context.application.document.placeNotice(placementOptions);
          _context.application.settings.unsetQualified();
          _context.application.setCoupon(_args.coupon);
          // _context.application.tracking.trackContext(this);
        }
      };

      return (new Context(contextOptions));
    }

    return ViewsProduct;
  })();

  module.exports = ViewsProduct;
}).call(this);
