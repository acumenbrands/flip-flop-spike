(function() {
  var Context = require('../factories/context');

  var DefaultContext = (function(){
    function DefaultContext(_args) {
      this.application = _args.application;
      this.type        = 'default';

      var _context       = this;
      var contextOptions = {
        type:        _context.type,
        application: _args.application,
        coupon:      _args.coupon,
        strategy: function() {
          var applies = true;
          return applies;
        },
        perform: function() {}
      };

      return (new Context(contextOptions));
    }

    return DefaultContext;
  })();

  module.exports = DefaultContext;
}).call(this);
