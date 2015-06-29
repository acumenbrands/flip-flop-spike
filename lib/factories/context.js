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
