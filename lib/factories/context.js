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
