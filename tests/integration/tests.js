/* jshint expr:true */

describe('Loader instance of Notifier', function() {
  before(function() {
    var mockWindow = new MockWindow();
    mockWindow.location.pathname = '/bag';

    var loaderOptions = {
      coupon:      'THECOUPON',
      environment: mockWindow
    };

    this.subject = new Loader(loaderOptions);
    this.performContextSpy = sinon.spy(this.subject.context, 'perform');
  });

  it('has a context', function() {
    expect(this.subject.context).to.be.an.instanceof(Context);
  });
  it('has a coupon', function() {
    expect(this.subject.coupon).to.be.a('string');
  });
  it('is aware of existing coupons', function() {
    expect(this.subject.application.coupon).to.be.a('string');
  });
  it('is aware of the present location', function() {
    expect(this.subject.application.route).to.be.a('string');
  });
  it('is aware of the window environment', function() {
    expect(this.subject.application.environment).to.have.property('dataLayer');
  });
});

describe('Application', function() {
  before(function() {
    var mockWindow = new MockWindow();
    mockWindow.location.pathname = '/bag';

    var loaderOptions = {
      coupon:      'THECOUPON',
      environment: mockWindow
    };

    this.subject = new Loader(loaderOptions);
  });

  it('has a settings interface', function() {
    expect(this.subject.application.settings).to.be.a('object');
  });

  describe('Application:settings', function() {
    it('has a Qualified settings setter', function() {
      expect(this.subject.application.settings.setQualified).to.be.a('function');
    });
    it('has a Qualified settings unsetter', function() {
      expect(this.subject.application.settings.unsetQualified).to.be.a('function');
    });
    it('has a Qualified settings reader', function() {
      expect(this.subject.application.settings.isQualified).to.be.a('function');
    });
  });

  it('has a coupon interface', function() {
    expect(this.subject.application.setCoupon).to.be.a('function');
  });
});

describe('Context: Cart has other coupon', function() {
  before(function() {
    var mockWindow = new MockWindow();

    mockWindow.location.pathname = '/bag';

    var loaderOptions = {
      coupon:      'THECOUPON',
      environment: mockWindow
    };

    this.subject = new Loader(loaderOptions);
  });

  it('performs when another coupon cookie is present', function() {
    expect(this.subject.context.type).to.equal('cart_has_other_coupon');
  });
  it('does nothing', function() {
    // How do we test for the presence of THE NOTHING?
    expect(false).to.equal(false);
  });
});

describe('Context: Cart qualifies', function() {
  before(function() {
    var qualifyingTag      = 'redneck-riviera-collection';
    var qualifyingTagMatch = /^redneck\-riviera\-collection/i;
    var qualifyingValue    = 100;
    var mockWindow         = new MockWindow();

    mockWindow.location.pathname = '/bag';
    mockWindow.document.cookie   = 'foo=bar; biz=baz';
    mockWindow.dataLayer         = [{
      behavioralIntent: {
        line_items: [{
          tags: [
            qualifyingTag
          ]
        }]
      },
      conversionAttributes: [{
        value: qualifyingValue
      }]
    }];

    var loaderOptions = {
      tagMatch:            qualifyingTagMatch,
      qualifyingCartValue: qualifyingValue,
      coupon:              'THECOUPON',
      settingsKey:         'FlipFlopSpike',
      environment:         mockWindow
    };

    this.subject                = new Loader(loaderOptions);
    this.settingsIsQualifiedSpy = sinon.spy(this.subject.context.application.settings, 'setQualified');
  });

  it('performs when route is cart, cart has a qualifying product and net total', function() {
    expect(this.subject.context.type).to.equal('cart_qualifies');
  });
  it('sets a session-is-qualified indicator', function() {
    this.subject.context.perform();
    expect(this.settingsIsQualifiedSpy.called).to.equal(true);
  });
});

describe('Context: Cart with qualifier', function() {
  before(function() {
    var qualifyingTag      = 'redneck-riviera-collection';
    var qualifyingTagMatch = /^redneck\-riviera\-collection/i;
    var qualifyingValue    = 100;
    var mockWindow         = new MockWindow();

    mockWindow.location.pathname = '/bag';
    mockWindow.document.cookie   = 'foo=bar; biz=baz';
    mockWindow.dataLayer         = [{
      behavioralIntent: {
        line_items: [{
          tags: [
            qualifyingTag
          ]
        }]
      },
      conversionAttributes: [{
        value: (qualifyingValue - 10)
      }]
    }];

    var loaderOptions = {
      tagMatch:            qualifyingTagMatch,
      qualifyingCartValue: qualifyingValue,
      coupon:              'THECOUPON',
      settingsKey:         'FlipFlopSpike',
      environment:         mockWindow
    };

    this.subject = new Loader(loaderOptions);
    this.unsetQualifiedSpy = sinon.spy(this.subject.context.application.settings, 'unsetQualified');
    this.placeNoticeSpy = sinon.spy(this.subject.context.application.document, 'placeNotice');
  });

  it('performs when route is cart, cart has a qualifying product, but not a qualifying net total', function() {
    expect(this.subject.context.type).to.equal('cart_with_qualifier');
  });
  it('sets a session-is-not-qualified indicator', function() {
    this.subject.context.perform();
    expect(this.unsetQualifiedSpy.called).to.equal(true);
  });
  it('places a notification', function() {
    this.subject.context.perform();
    expect(this.placeNoticeSpy.called).to.equal(true);
  });
});

describe('Context: Cart without qualifier', function() {
  before(function() {
    var qualifyingTag      = 'redneck-riviera-collection';
    var qualifyingTagMatch = /^redneck\-riviera\-collection/i;
    var notQualifyingTag   = 'snake-kickers';
    var qualifyingValue    = 100;
    var mockWindow         = new MockWindow();

    mockWindow.location.pathname = '/bag';
    mockWindow.document.cookie   = 'foo=bar; biz=baz';
    mockWindow.dataLayer         = [{
      behavioralIntent: {
        line_items: [{
          tags: [
            notQualifyingTag
          ]
        }]
      },
      conversionAttributes: [{
        value: qualifyingValue
      }]
    }];

    var loaderOptions = {
      tagMatch:            qualifyingTagMatch,
      qualifyingCartValue: qualifyingValue,
      coupon:              'THECOUPON',
      settingsKey:         'FlipFlopSpike',
      environment:         mockWindow
    };

    this.subject = new Loader(loaderOptions);
    this.unsetQualifiedSpy = sinon.spy(this.subject.context.application.settings, 'unsetQualified');
    this.placeNoticeSpy = sinon.spy(this.subject.context.application.document, 'placeNotice');
  });

  it('performs when route is cart, cart has a qualifying net total, but not a qualifying product', function() {
    expect(this.subject.context.type).to.equal('cart_without_qualifier');
  });
  it('sets a session-is-not-qualified indicator', function() {
    this.subject.context.perform();
    expect(this.unsetQualifiedSpy.called).to.equal(true);
  });
  it('places a notification', function() {
    this.subject.context.perform();
    expect(this.placeNoticeSpy.called).to.equal(true);
  });
});

describe('Context: Home page view', function() {
  before(function() {
    var mockWindow               = new MockWindow();
    mockWindow.location.pathname = '/';
    mockWindow.document.cookie   = 'foo=bar; biz=baz';

    var loaderOptions = {
      coupon:      'THECOUPON',
      environment: mockWindow
    };

    this.subject        = new Loader(loaderOptions);
    this.placeNoticeSpy = sinon.spy(this.subject.context.application.document, 'placeNotice');
    this.setCouponSpy   = sinon.spy(this.subject.context.application, 'setCoupon');
  });

  it('performs when route is home', function() {
    expect(this.subject.context.type).to.equal('views_home');
  });
  it('places a notification', function() {
    this.subject.context.perform();
    expect(this.placeNoticeSpy.called).to.equal(true);
  });
  it('sets a coupon', function() {
    this.subject.context.perform();
    expect(this.setCouponSpy.called).to.equal(true);
  });
});

describe('Context: Special category view', function() {
  before(function() {
    var specialURL    = '/redneck-riviera-collection/sandals';
    var mockWindow    = new MockWindow();
    var loaderOptions = {
      coupon:      'THECOUPON',
      specialURL:  specialURL,
      environment: mockWindow
    };

    mockWindow.location.pathname = specialURL;
    mockWindow.document.cookie   = 'foo=bar; biz=baz';

    this.subject        = new Loader(loaderOptions);
    this.placeNoticeSpy = sinon.spy(this.subject.context.application.document, 'placeNotice');
    this.setCouponSpy   = sinon.spy(this.subject.context.application, 'setCoupon');
  });

  it('performs when route is special category route', function() {
    expect(this.subject.context.type).to.equal('views_special_category');
  });
  it('places a notification', function() {
    this.subject.context.perform();
    expect(this.placeNoticeSpy.called).to.equal(true);
  });
  it('sets a coupon', function() {
    this.subject.context.perform();
    expect(this.setCouponSpy.called).to.equal(true);
  });
});

describe('Context: Special category view', function() {
  before(function() {
    var specialURL    = '/redneck-riviera-collection/sandals';
    var mockWindow    = new MockWindow();
    var loaderOptions = {
      coupon:      'THECOUPON',
      specialURL:  specialURL,
      environment: mockWindow
    };

    mockWindow.location.pathname = specialURL;
    mockWindow.document.cookie   = 'foo=bar; biz=baz';

    this.subject        = new Loader(loaderOptions);
    this.placeNoticeSpy = sinon.spy(this.subject.context.application.document, 'placeNotice');
    this.setCouponSpy   = sinon.spy(this.subject.context.application, 'setCoupon');
  });

  it('performs when route is special category route', function() {
    expect(this.subject.context.type).to.equal('views_special_category');
  });
  it('places a notification', function() {
    this.subject.context.perform();
    expect(this.placeNoticeSpy.called).to.equal(true);
  });
  it('sets a coupon', function() {
    this.subject.context.perform();
    expect(this.setCouponSpy.called).to.equal(true);
  });
});

describe('Context: Category view', function() {
  before(function() {
    var specialURL    = '/redneck-riviera-collection/sandals';
    var mockWindow    = new MockWindow();
    var loaderOptions = {
      coupon:      'THECOUPON',
      specialURL:  specialURL,
      environment: mockWindow
    };

    mockWindow.location.pathname        = '/bewts';
    mockWindow.document.cookie          = 'foo=bar; biz=baz';
    mockWindow.dataLayer[0].conversionType = "Viewed Catalog";

    this.subject        = new Loader(loaderOptions);
    this.placeNoticeSpy = sinon.spy(this.subject.context.application.document, 'placeNotice');
    this.setCouponSpy   = sinon.spy(this.subject.context.application, 'setCoupon');
  });

  it('performs when conversionType is "Viewed Catalog"', function() {
    expect(this.subject.context.type).to.equal('views_category');
  });
  it('places a notification', function() {
    this.subject.context.perform();
    expect(this.placeNoticeSpy.called).to.equal(true);
  });
  it('sets a coupon', function() {
    this.subject.context.perform();
    expect(this.setCouponSpy.called).to.equal(true);
  });
});

describe('Context: Product view', function() {
  before(function() {
    var specialURL    = '/redneck-riviera-collection/sandals';
    var mockWindow    = new MockWindow();
    var loaderOptions = {
      coupon:      'THECOUPON',
      specialURL:  specialURL,
      environment: mockWindow
    };

    mockWindow.location.pathname        = '/products/1-scruffy-bewt';
    mockWindow.document.cookie          = 'foo=bar; biz=baz';

    this.subject = new Loader(loaderOptions);
    this.placeNoticeSpy = sinon.spy(this.subject.context.application.document, 'placeNotice');
    this.setCouponSpy   = sinon.spy(this.subject.context.application, 'setCoupon');
  });

  it('performs when route is product route', function() {
    expect(this.subject.context.type).to.equal('views_product');
  });
  it('places a notification', function() {
    this.subject.context.perform();
    expect(this.placeNoticeSpy.called).to.equal(true);
  });
  it('sets a coupon', function() {
    this.subject.context.perform();
    expect(this.setCouponSpy.called).to.equal(true);
  });
});
