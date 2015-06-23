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
