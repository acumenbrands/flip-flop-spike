(function() {
  var Context = require('../factories/context');
  var Notice  = require('../factories/notice');

  var ViewsSpecialCategory = (function(){
    function ViewsSpecialCategory(_args) {
      this.application = _args.application;
      this.type        = 'views_special_category';

      var _context       = this;
      var contextOptions = {
        type:        _context.type,
        application: _context.application,
        coupon:      _args.coupon,
        strategy:    function() {
          return _context.application.routeIsSpecial();
        },
        perform: function() {
          var noticeOptions = {
            context:     _context,
            environment: _context.application.environment,
            style:       'anchor-banner',
            headline:    'Get your free pair of flip<br>flops with a $' + _context.application.qualifyingCartValue + ' purchase',
            buttonText:  'Choose Your Free flip flops<span class="desktop-only"><br>on this page</span>',
            href:        '#'
          };

          var placementOptions = {
            nextElementSelector: '#mainWrapper .main_content,#page',
            noticeElement:       new Notice(noticeOptions)
          };

          _context.application.document.placeNotice(placementOptions);
          _context.application.settings.unsetQualified();
          _context.application.setCoupon(_args.coupon);
          _context.application.tracking.trackContext(this);
        }
      };

      return (new Context(contextOptions));
    }

    return ViewsSpecialCategory;
  })();

  module.exports = ViewsSpecialCategory;
}).call(this);
