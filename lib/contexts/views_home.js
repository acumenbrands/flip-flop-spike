(function() {
  var Context = require('../factories/context');
  var Notice  = require('../factories/notice');

  var ViewsHome = (function(){
    function ViewsHome(_args) {
      this.application = _args.application;
      this.type        = 'views_home';

      var _context       = this;
      var contextOptions = {
        type:        _context.type,
        application: _context.application,
        coupon:      _args.coupon,
        strategy:    function() {
          return _context.application.routeIsHome();
        },
        perform: function() {
          var noticeOptions = {
            context:     _context,
            environment: _context.application.environment,
            headline:    'Get your free pair of flip<br>flops with a $' + _context.application.qualifyingCartValue + ' purchase',
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
          _context.application.tracking.trackContext(this);
        }
      };

      return (new Context(contextOptions));
    }

    return ViewsHome;
  })();

  module.exports = ViewsHome;
}).call(this);
