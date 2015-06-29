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
