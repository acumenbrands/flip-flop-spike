(function() {
  var MockDomElement = require('./dom_element');

  var MockWindow = (function(){
    function MockWindow(_args) {
      var mockDocumentOptions = {
        tagName: undefined,
        cookie:  'foo=bar; coupon_code=COUPONCODE; biz=baz',
        body:    new MockDomElement({tagName: 'body'})
      };

      var mockWindow = {
        location: { pathname: '/', hostname: 'webhost.fu' },
        localStorage: {
          setItem:    function(a,b) { return undefined; },
          getItem:    function(a) { return "true"; },
          removeItem: function(a) { return undefined; }
        },
        document:  new MockDomElement(mockDocumentOptions),
        dataLayer: [{}, {}]
      };

      for(var arg in _args){
        mockWindow[arg] = _args[arg];
      }

      mockWindow.document.createElement = function(name){
        return new MockDomElement({tagName: name});
      };

      return mockWindow;
    }

    return MockWindow;
  })();

  module.exports = MockWindow;
}).call(this);
