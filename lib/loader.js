(function() {
  var Notifier           = require('./notifier');
  var ApplicationAdapter = require('./adapters/application_adapter');
  var CartHasCoupon      = require('./contexts/cart_has_coupon');
  var CartQualifies      = require('./contexts/cart_qualifies');
  /*
  var CartWithQualifier = require('./contexts/cart_has_coupon');
  var CartWithoutQualifier = require('./contexts/cart_has_coupon');
  var LandingHome = require('./contexts/cart_has_coupon');
  var LandingCategory = require('./contexts/cart_has_coupon');
  var LandingSpecialCategory = require('./contexts/cart_has_coupon');
  var BrowsingCategory = require('./contexts/cart_has_coupon');
  var BrowsingSpecialCategory = require('./contexts/cart_has_coupon');
  var BrowsingPDP = require('./contexts/cart_has_coupon');
  */

  var Loader = (function() {
    var contexts = [
      CartHasCoupon,
      CartQualifies
    ];

    function Loader(_args) {
      var appOptions = {
        environment: _args.environment
      };

      var appAdapter = new ApplicationAdapter(appOptions);

      var notifierOptions = {
        contexts:    contexts,
        application: appAdapter
      };

      return (new Notifier(notifierOptions));
    }

    return Loader;
  })();

  module.exports = Loader;
}).call(this);
