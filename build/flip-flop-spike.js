(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var ApplicationSettingsAdapter = require('./application_settings_adapter');
  var ApplicationDocumentAdapter = require('./application_document_adapter');

  var ApplicationAdapter = (function() {
    function ApplicationAdapter(_args) {
      this.environment         = _args.environment; // window
      this.cookieString        = _getCookie(this.environment);
      this.cookieDomain        = _getCookieDomain(this.environment);
      this.coupon              = _getCoupon(this.cookieString);
      this.route               = _getRoute(this.environment);
      this.settingsKey         = _args.settingsKey;
      this.specialURL          = _args.specialURL;
      this.tagMatch            = _args.tagMatch;
      this.qualifyingCartValue = _args.qualifyingCartValue;

      var _applicationAdapter  = this;

      this.document            = new ApplicationDocumentAdapter(_applicationAdapter);
      this.settings            = new ApplicationSettingsAdapter(_applicationAdapter);
    }

    ApplicationAdapter.prototype.setCoupon = function (code) {
      if (code){
        this.environment.document.cookie = "coupon_code=" + code + ";path=/;domain=" + this.cookieDomain;
      }
    };

    ApplicationAdapter.prototype.routeIsHome = function () {
      return (this.route == '/');
    };

    ApplicationAdapter.prototype.routeIsCart = function () {
      return (this.route == '/bag');
    };

    ApplicationAdapter.prototype.routeIsSpecial = function () {
      return (this.route == this.specialURL);
    };

    ApplicationAdapter.prototype.routeIsCatalog = function () {
      var intent = _getDataLayerObject('conversionType', this.environment);
      return (intent == "Viewed Catalog");
    };

    ApplicationAdapter.prototype.routeIsProduct = function () {
      var productMatch = /^\/products\/[0-9]/i;
      return productMatch.test(this.route);
    };

    ApplicationAdapter.prototype.cartHasQualifyingProduct = function () {
      var behavior = _getDataLayerObject('behavioralIntent', this.environment);

      if (behavior && _hasQualifyingLineItems(behavior.line_items, this.tagMatch)) {
        return true;
      } else {
        return false;
      }
    };

    ApplicationAdapter.prototype.cartHasQualifyingNetTotal = function () {
      var conversion = _getDataLayerObject('conversionAttributes', this.environment);

      for (var j=0; j<conversion.length; j++) {
        if (conversion[j].value >= this.qualifyingCartValue) {
          return true;
        }
      }
      return false;
    };

    var _hasQualifyingLineItems = function(line_items, tagMatch) {
      for (var j=0; j<line_items.length; j++) {
        for (var k=0; k<line_items[j].tags.length; k++) {
          if (tagMatch.test(line_items[j].tags[k])) {
            return true;
          }
        }
      }
      return false;
    };

    var _getDataLayerObject = function (objName, env) {
      for (var i=0; i<env.dataLayer.length; i++) {
        if (objName in env.dataLayer[i]) {
          return env.dataLayer[i][objName];
        }
      }
      return null;
    };

    var _getCookieDomain = function(env) {
      var hostArray = env.location.hostname.split('.').reverse();
      hostArray     = hostArray.splice(0,2).reverse();

      return hostArray.join('.');
    };

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

    var _getDataLayer = function(env) {
      return env.dataLayer || [];
    };

    return ApplicationAdapter;
  })();

  module.exports = ApplicationAdapter;
}).call(this);

},{"./application_document_adapter":2,"./application_settings_adapter":3}],2:[function(require,module,exports){
(function() {
  var ApplicationDocumentAdapter = (function() {
    function ApplicationDocumentAdapter(_application) {
      this.environment = _application.environment; // window
    }

    ApplicationDocumentAdapter.prototype.placeNotice = function(noticeOptions) {
      if('nextElementSelector' in noticeOptions) {
        var nextElement = this.environment.document.querySelectorAll(noticeOptions.nextElementSelector)[0];
        if (nextElement) {
          return nextElement.parentElement.insertBefore(noticeOptions.noticeElement, nextElement);
        }

      } else {
        var parentElement = this.environment.document.querySelectorAll(noticeOptions.parentElementSelector)[0];
        if (parentElement) {
          return parentElement.appendChild(noticeOptions.noticeElement);
        }
      }
    };

    return ApplicationDocumentAdapter;
  })();

  module.exports = ApplicationDocumentAdapter;
}).call(this);

},{}],3:[function(require,module,exports){
(function() {
  var Storage = require('../repositories/storage');

  var ApplicationSettingsAdapter = (function() {
    function ApplicationSettingsAdapter(_application) {
      this.environment = _application.environment; // window
      this.settingsKey = _application.settingsKey;

      var storageOptions = {
        strategy: _application.environment.localStorage
      };

      this.storage = new Storage(storageOptions);
    }

    ApplicationSettingsAdapter.prototype.isQualified = function() {
      this.storage.find(this.settingsKey + ":qualified");
    };

    ApplicationSettingsAdapter.prototype.setQualified = function() {
      this.storage.save(this.settingsKey + ":qualified", 'true');
    };

    ApplicationSettingsAdapter.prototype.unsetQualified = function() {
      this.storage.delete(this.settingsKey + ":qualified");
    };

    return ApplicationSettingsAdapter;
  })();

  module.exports = ApplicationSettingsAdapter;
}).call(this);

},{"../repositories/storage":18}],4:[function(require,module,exports){
(function() {
  var Context = require('../factories/context');

  var CartHasOtherCoupon = (function(){
    function CartHasOtherCoupon(_args) {
      this.application   = _args.application;
      var _context       = this;
      var contextOptions = {
        type:        'cart_has_other_coupon',
        application: _context.application,
        coupon:      _args.coupon,
        strategy:    function() {
          return (
            (_context.application.coupon !== null) &&
            (_context.application.coupon != _args.coupon)
          );
        },
        perform: function() {
          _context.application.settings.unsetQualified();
        }
      };

      return (new Context(contextOptions));
    }

    return CartHasOtherCoupon;
  })();

  module.exports = CartHasOtherCoupon;
}).call(this);

},{"../factories/context":13}],5:[function(require,module,exports){
(function() {
  var Context = require('../factories/context');

  var CartQualifies = (function(){
    function CartQualifies(_args) {
      this.application   = _args.application;
      var _context       = this;
      var contextOptions = {
        type:        'cart_qualifies',
        application: _context.application,
        coupon:      _args.coupon,
        strategy:    function() {
          return (
            _context.application.routeIsCart() &&
            _context.application.cartHasQualifyingProduct() &&
            _context.application.cartHasQualifyingNetTotal()
          );
        },
        perform: function() {
          _context.application.settings.setQualified();
        }
      };

      return (new Context(contextOptions));
    }

    return CartQualifies;
  })();

  module.exports = CartQualifies;
}).call(this);

},{"../factories/context":13}],6:[function(require,module,exports){
(function() {
  var Context = require('../factories/context');
  var Notice  = require('../factories/notice');

  var CartQualifies = (function(){
    function CartQualifies(_args) {
      this.application   = _args.application;
      var _context       = this;
      var contextOptions = {
        type:        'cart_with_qualifier',
        application: _context.application,
        coupon:      _args.coupon,
        strategy:    function() {
          return (
            _context.application.routeIsCart() &&
            _context.application.cartHasQualifyingProduct()
          );
        },
        perform: function() {
          var noticeOptions = {
            environment: _context.application.environment,
            style:       'back',
            headline:    'Get your pair of<br>flip flops Free with<br>$100 purchase',
            buttonText:  '',
            href:        '/footwear'
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

    return CartQualifies;
  })();

  module.exports = CartQualifies;
}).call(this);

},{"../factories/context":13,"../factories/notice":14}],7:[function(require,module,exports){
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

},{"../factories/context":13,"../factories/notice":14}],8:[function(require,module,exports){
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

},{"../factories/context":13}],9:[function(require,module,exports){
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

},{"../factories/context":13,"../factories/notice":14}],10:[function(require,module,exports){
(function() {
  var Context = require('../factories/context');
  var Notice  = require('../factories/notice');

  var ViewsHome = (function(){
    function ViewsHome(_args) {
      this.application   = _args.application;
      var _context       = this;
      var contextOptions = {
        type:        'views_home',
        application: _context.application,
        coupon:      _args.coupon,
        strategy:    function() {
          return _context.application.routeIsHome();
        },
        perform: function() {
          var noticeOptions = {
            environment: _context.application.environment,
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

    return ViewsHome;
  })();

  module.exports = ViewsHome;
}).call(this);

},{"../factories/context":13,"../factories/notice":14}],11:[function(require,module,exports){
(function() {
  var Context = require('../factories/context');
  var Notice  = require('../factories/notice');

  var ViewsProduct = (function(){
    function ViewsProduct(_args) {
      this.application   = _args.application;
      var _context       = this;
      var contextOptions = {
        type:        'views_product',
        application: _context.application,
        coupon:      _args.coupon,
        strategy:    function() {
          return _context.application.routeIsProduct();
        },
        perform: function() {
          var noticeOptions = {
            environment: _context.application.environment,
            style:       'small-banner',
            headline:    'Get your free pair of flip<br>flops with a $100 purchase',
            buttonText:  '',
            href:        _context.application.specialURL
          };

          var placementOptions = {
            nextElementSelector: '#mainWrapper .main_content,#view',
            noticeElement:       new Notice(noticeOptions)
          };

          _context.application.document.placeNotice(placementOptions);
          _context.application.settings.unsetQualified();
          _context.application.setCoupon(_args.coupon);
        }
      };

      return (new Context(contextOptions));
    }

    return ViewsProduct;
  })();

  module.exports = ViewsProduct;
}).call(this);

},{"../factories/context":13,"../factories/notice":14}],12:[function(require,module,exports){
(function() {
  var Context = require('../factories/context');
  var Notice  = require('../factories/notice');

  var ViewsSpecialCategory = (function(){
    function ViewsSpecialCategory(_args) {
      this.application   = _args.application;
      var _context       = this;
      var contextOptions = {
        type:        'views_special_category',
        application: _context.application,
        coupon:      _args.coupon,
        strategy:    function() {
          return _context.application.routeIsSpecial();
        },
        perform: function() {
          var noticeOptions = {
            environment: _context.application.environment,
            style:       'anchor-banner',
            headline:    'Get your free pair of flip<br>flops with a $100 purchase',
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
        }
      };

      return (new Context(contextOptions));
    }

    return ViewsSpecialCategory;
  })();

  module.exports = ViewsSpecialCategory;
}).call(this);

},{"../factories/context":13,"../factories/notice":14}],13:[function(require,module,exports){
(function() {
  var ContextFactory = (function(){
    function ContextFactory(_args) {
      this.type        = _args.type;
      this.application = _args.application;
      this.strategy    = _args.strategy;
      this.coupon      = _args.coupon;
      this.specialURL  = _args.application.specialURL;
      this.perform     = _args.perform || _noop;
      this.performed   = false;
    }

    ContextFactory.prototype.isApplicable = function() {
      return (this.strategy());
    };

    ContextFactory.prototype.performOnce = function() {
      if(!this.performed){
        this.perform();
        this.performed = true;
      }
    };

    var _noop = function() {};

    return ContextFactory;
  })();

  module.exports = ContextFactory;
}).call(this);

},{}],14:[function(require,module,exports){
(function() {
  var NoticeFactory = (function(){
    function NoticeFactory(_args) {
      this.environment    = _args.environment;
      this.style          = _args.style || '';
      this.headline       = _args.headline;
      this.buttonText     = _args.buttonText;
      this.href           = _args.href;
      var noticeContainer = _createNoticeContainer(this);
      var noticeLink      = _createNoticeLink(this);
      var noticeHeadline  = _createNoticeHeadline(this);
      var noticeButton    = _createNoticeButton(this);

      noticeLink.appendChild(noticeHeadline);
      noticeLink.appendChild(noticeButton);
      noticeContainer.appendChild(noticeLink);

      return noticeContainer;
    }

    var _createNoticeContainer = function(_args) {
      var noticeContainer       = _args.environment.document.createElement('div');
      noticeContainer.className = 'flip-flop-notice-container ' + _args.style;
      return noticeContainer;
    };

    var _createNoticeLink = function(_args) {
      var noticeLink       = _args.environment.document.createElement('a');
      noticeLink.className = 'flip-flop-notice-link';
      noticeLink.href      = _args.href;
      return noticeLink;
    };

    var _createNoticeHeadline = function(_args) {
      var noticeHeadline       = _args.environment.document.createElement('div');
      noticeHeadline.innerHTML = _args.headline;
      noticeHeadline.className = 'flip-flop-notice-headline';
      return noticeHeadline;
    };

    var _createNoticeButton = function(_args) {
      var noticeButton       = _args.environment.document.createElement('div');
      noticeButton.innerHTML = _args.buttonText;
      noticeButton.className = 'flip-flop-notice-button';
      return noticeButton;
    };

    return NoticeFactory;
  })();

  module.exports = NoticeFactory;
}).call(this);

},{}],15:[function(require,module,exports){
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

},{"./adapters/application_adapter":1,"./contexts/cart_has_other_coupon":4,"./contexts/cart_qualifies":5,"./contexts/cart_with_qualifier":6,"./contexts/cart_without_qualifier":7,"./contexts/default":8,"./contexts/views_category":9,"./contexts/views_home":10,"./contexts/views_product":11,"./contexts/views_special_category":12,"./notifier":17}],16:[function(require,module,exports){
(function (global){
(function() {
  var FlipFlopSpike = require('./loader');
  var _environment  = (typeof window != 'undefined') ? window : global;

  var _initFlipFlopSpike = function() {
    if (!('flipFlopSpike' in _environment)) {
      _environment.flipFlopSpike = new FlipFlopSpike({
        environment:         _environment,
        qualifyingCartValue: 100,
        settingsKey:         'FlipFlopSpike',
        coupon:              'SPIKECOUPON',
        specialURL:          '/redneck-riviera-collection/sandals',
        tagMatch:            /^redneck\-riviera\-collection/i
      });
    }
  };

  var css    = _environment.document.createElement('link');
  css.href   = "http://d3v17ilp3z8t74.cloudfront.net/libs/flip-flop-spike/0.1.0b/css/flip-flop-spike.min.css";
  css.href   = "http://assets.countryoutfitter.com.s3.amazonaws.com/libs/flip-flop-spike/0.1.0b/css/flip-flop-spike.min.css";
  css.media  = "all";
  css.rel    = "stylesheet";
  css.type   = "text/css";
  css.onload = _initFlipFlopSpike;
  _environment.document.head.appendChild(css);

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./loader":15}],17:[function(require,module,exports){
(function() {
  var Notifier = (function() {
    function Notifier(_args) {
      this.application = _args.application;
      this.coupon      = _args.coupon || '';
      this.contexts    = _args.contexts;
      this.context     = this.getContext();

      this.context.performOnce();
    }

    Notifier.prototype.getContext = function() {
      var contextOptions = {
        application: this.application,
        specialURL:  this.specialURL,
        coupon:      this.coupon
      };

      for (var i=0, len=this.contexts.length; i<len; i++) {
        var contextClass = this.contexts[i];
        var context = new contextClass(contextOptions);

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

},{}],18:[function(require,module,exports){
(function() {
  var Storage = (function() {
    function Storage(_args) {
      this.strategy = _args.strategy;
    }

    Storage.prototype.delete = function(key) {
      this.strategy.removeItem(key);
    };

    Storage.prototype.find = function(key) {
      JSON.parse(this.strategy.getItem(key));
    };

    Storage.prototype.save = function(key, value) {
      this.strategy.setItem(key, JSON.stringify(value));
    };

    return Storage;
  })();

  module.exports = Storage;
}).call(this);

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]);
