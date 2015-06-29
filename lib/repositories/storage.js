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
