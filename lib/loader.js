(function() {
  var Notifier             = require('./notifier');
  var ApplicationAdapter   = require('./adapters/application_adapter');
  var CartHasOtherCoupon   = require('./contexts/cart_has_other_coupon');
  var CartQualifies        = require('./contexts/cart_qualifies');
  var CartWithQualifier    = require('./contexts/cart_with_qualifier');
  var CartWithoutQualifier = require('./contexts/cart_without_qualifier');
  var ViewsHome            = require('./contexts/views_home');
  var ViewsSpecialCategory = require('./contexts/views_special_category');
  var ViewsCategory        = require('./contexts/views_category');
  var ViewsSpecialProduct  = require('./contexts/views_special_product');
  var ViewsProduct         = require('./contexts/views_product');
  var DefaultContext       = require('./contexts/default');

  var Loader = (function() {
    var contexts = [
      CartHasOtherCoupon,
      CartQualifies,
      CartWithQualifier,
      CartWithoutQualifier,
      ViewsHome,
      ViewsSpecialCategory,
      ViewsCategory,
      ViewsSpecialProduct,
      ViewsProduct,
      DefaultContext
    ];

    function Loader(_args) {
      var appOptions = {
        environment:         _args.environment,
        specialURL:          _args.specialURL,
        settingsKey:         _args.settingsKey || 'FlipFlopSpike',
        tagMatch:            _args.tagMatch || new RegExp('not likely to match anything'),
        qualifyingCartValue: _args.qualifyingCartValue || 100
      };

      var appAdapter = new ApplicationAdapter(appOptions);

      var notifierOptions = {
        application: appAdapter,
        contexts:    contexts,
        coupon:      _args.coupon
      };

      return (new Notifier(notifierOptions));
    }

    return Loader;
  })();

  module.exports = Loader;
}).call(this);
