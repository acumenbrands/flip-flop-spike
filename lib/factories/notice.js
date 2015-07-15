(function() {
  var NoticeFactory = (function(){
    function NoticeFactory(_args) {
      this.environment    = _args.environment;
      this.context        = _args.context;
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

    var _createNoticeContainer = function(notice) {
      var noticeContainer       = notice.environment.document.createElement('div');
      noticeContainer.className = 'flip-flop-notice-container ' + notice.style + ' ' + notice.context.type;
      return noticeContainer;
    };

    var _createNoticeLink = function(noice) {
      var noticeLink       = noice.environment.document.createElement('a');
      noticeLink.className = 'flip-flop-notice-link';
      noticeLink.href      = noice.href;
      return noticeLink;
    };

    var _createNoticeHeadline = function(noice) {
      var noticeHeadline       = noice.environment.document.createElement('div');
      noticeHeadline.innerHTML = noice.headline;
      noticeHeadline.className = 'flip-flop-notice-headline';
      return noticeHeadline;
    };

    var _createNoticeButton = function(noice) {
      var noticeButton       = noice.environment.document.createElement('div');
      noticeButton.innerHTML = noice.buttonText;
      noticeButton.className = 'flip-flop-notice-button';
      return noticeButton;
    };

    return NoticeFactory;
  })();

  module.exports = NoticeFactory;
}).call(this);
