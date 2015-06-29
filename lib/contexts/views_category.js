(function() {
  var Context = require('../factories/context');
  var Notice  = require('../factories/notice');

  var ViewsCategory = (function(){
    function ViewsCategory(_args) {
      this.application   = _args.application;
      var _context       = this;
      var contextOptions = {
        type:        'views_category',
        application: _context.application,
        coupon:      _args.coupon,
        strategy:    function() {
          return _context.application.routeIsCatalog();
        },
        perform: function() {
          var noticeOptions = {
            environment: _context.application.environment,
            style:       'banner',
            headline:    'Get your free pair of flip<br>flops with a $100 purchase',
            buttonText:  'Free flip flops',
            href:        _context.application.specialURL
          };

          var placementOptions = {
            nextElementSelector: '#mainWrapper .main_content,#page',
            noticeElement:       new Notice(noticeOptions)
          };

          _context.application.document.placeNotice(placementOptions);
          _context.application.settings.unsetQualified();
          _context.application.setCoupon(_args.coupon);
        }
      };

      return (new Context(contextOptions));
    }

    return ViewsCategory;
  })();

  module.exports = ViewsCategory;
}).call(this);