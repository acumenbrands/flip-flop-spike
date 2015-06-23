(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var ApplicationAdapter = (function() {
    function ApplicationAdapter(_args) {
      this.environment  = _args.environment; // window
      this.cookieString = _getCookie(this.environment);
      this.route        = _getRoute(this.environment);
      this.coupon       = _getCoupon(this.cookieString);
    }

    var _getCoupon = function(cookieString) {
      var couponRE      = /coupon_code=([^\s;]*)/gi;
      var couponResults = couponRE.exec(cookieString) || [null];
      var couponCode    = couponResults.reverse()[0];

      return couponCode;
    };

    var _getCookie = function(env) {
      return env.document.cookie;
    };

    var _getRoute = function(env) {
      return env.location.pathname;
    };

    return ApplicationAdapter;
  })();

  module.exports = ApplicationAdapter;
}).call(this);

},{}],2:[function(require,module,exports){
(function() {
  var Context = require('../factories/context');

  var CartHasCoupon = (function(){
    function CartHasCoupon(_args) {
      this.application = _args.application;
      var _context = this;

      var contextOptions = {
        type:        'cart_has_coupon',
        application: _args.application,
        strategy: function() {
          return (_context.application.cart.hasCoupon());
        }
      };

      return (new Context(contextOptions));
    }

    return CartHasCoupon;
  })();

  module.exports = CartHasCoupon;
}).call(this);

},{"../factories/context":4}],3:[function(require,module,exports){
(function() {
  var Context = require('../factories/context');

  var CartQualifies = (function(){
    function CartQualifies(_args) {
      this.application = _args.application;
      var _context = this;

      var contextOptions = {
        type:        'cart_has_coupon',
        application: _args.application,
        strategy: function() {
          return (
            _context.application.route.isCart() &&
            _context.application.cart.hasQualifyingProduct() &&
            _context.application.cart.hasQualifyingNet()
          );
        }
      };

      return (new Context(contextOptions));
    }

    return CartQualifies;
  })();

  module.exports = CartQualifies;
}).call(this);

},{"../factories/context":4}],4:[function(require,module,exports){
(function() {
  var Context = (function(){
    function Context(_args) {
      this.type        = _args.type;
      this.application = _args.application;
      this.strategy    = _args.strategy;
      this.perform     = _args.perform || _noop;
    }

    Context.prototype.isApplicable = function() {
      return (this.strategy);
    };

    var _noop = function() {};

    return Context;
  })();

  module.exports = Context;
}).call(this);

},{}],5:[function(require,module,exports){
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

},{"./adapters/application_adapter":1,"./contexts/cart_has_coupon":2,"./contexts/cart_qualifies":3,"./notifier":7}],6:[function(require,module,exports){
(function (global){
(function() {
  var FlipFlopSpike = require('./loader');

  var _environment = (typeof window != 'undefined') ? window : global;

  _environment.FlipFlopSpike = new FlipFlopSpike({
    environment: _environment
  });

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./loader":5}],7:[function(require,module,exports){
(function() {
  var Notifier = (function() {
    function Notifier(_args) {
      this.application = _args.application;
      this.contexts    = _args.contexts;
      this.context     = this.getContext();
    }

    Notifier.prototype.getContext = function() {
      var getContextOptions = {
        application: this.application,
        environment: this.application.environment
      };

      for (var i=0, len=this.contexts.length; i<len; i++) {
        var contextClass = this.contexts[i];
        var context = new contextClass(getContextOptions);

        if (context.isApplicable()) {
          return context;
        }
      }
    };

    var _noop = function() {};

    return Notifier;
  })();

  module.exports = Notifier;
}).call(this);

},{}]},{},[1,2,3,4,5,6,7]);
