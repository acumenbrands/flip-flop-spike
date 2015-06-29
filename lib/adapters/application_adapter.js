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
