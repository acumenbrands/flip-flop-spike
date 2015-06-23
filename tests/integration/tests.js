describe('Instance of Notifier', function() {

  before(function() {
    var mockWindow = {
      location: {
        pathname: '/bag'
      },
      document: {
        cookie: 'foo=bar; coupon_code=COUPONCODE; biz=baz'
      }
    };

    var loaderOptions = {
      environment: mockWindow
    };

    this.subject = new Loader(loaderOptions);
  });

  it('has a context', function() {
    expect(this.subject.context).to.be.an.instanceof(Context);
  });
  it('is aware of existing coupons', function() {
    expect(this.subject.application.coupon).to.be.a('string');
  });
  it('is aware of the present location', function() {
    expect(this.subject.application.route).to.be.a('string');
  });
});
