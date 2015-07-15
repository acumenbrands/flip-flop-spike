(function() {
  var MockDomElement = (function(){
    function MockDomElement(_args) {
      for(var arg in _args) {
        this[arg] = _args[arg];
      }
      this.childNodes    = this.childNodes || [];
      this.className     = this.className || 'class-name';
      this.classList     = this.className.split(' ');
      this.parentElement = {
        insertBefore: function(p, n) {
          return new MockDomElement({tagName: 'div'});
        },
        appendChild: function(t) {
          return new MockDomElement({tagName: 'div'});
        }
      };
    }

    MockDomElement.prototype.appendChild = function(element) {
      this.childNodes[element] = new MockDomElement({tagName: element});
      return this.childNodes[element];
    };

    MockDomElement.prototype.addEventListener = _noop;

    MockDomElement.prototype.querySelector = function(selector) {
      var params = {};

      if (/^\./.test(selector)){
        match = selector.match(/\.([^ ]+)/) || [""];
        params = {
          tagName:   'div',
          className: match.reverse[0]
        };
      } else if (/^#/.test(selector)){
        var match = selector.match(/#([^ ]+)/) || [""];
        params = {
          tagName: 'div',
          id:      match.reverse[0]
        };
      } else {
        params = {tagName: selector};
      }
      return new MockDomElement(params);
    };

    MockDomElement.prototype.querySelectorAll = function(selector) {
      return [ this.querySelector(selector) ];
    };

    var _noop = function(){};

    return MockDomElement;
  })();

  module.exports = MockDomElement;
}).call(this);
