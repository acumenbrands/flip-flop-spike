(function() {
  var Context = require('../factories/context');

  var DefaultContext = (function(){
    function DefaultContext(_args) {
      var _context       = this;
      var contextOptions = {
        type:        'default',
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
