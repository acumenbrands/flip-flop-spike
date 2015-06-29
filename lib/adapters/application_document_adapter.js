(function() {
  var ApplicationDocumentAdapter = (function() {
    function ApplicationDocumentAdapter(_application) {
      this.environment = _application.environment; // window
    }

    ApplicationDocumentAdapter.prototype.placeNotice = function(noticeOptions) {
      if('nextElementSelector' in noticeOptions) {
        var nextElement = this.environment.document.querySelectorAll(noticeOptions.nextElementSelector)[0];
        if (nextElement) {
          return nextElement.parentElement.insertBefore(noticeOptions.noticeElement, nextElement);
        }

      } else {
        var parentElement = this.environment.document.querySelectorAll(noticeOptions.parentElementSelector)[0];
        if (parentElement) {
          return parentElement.appendChild(noticeOptions.noticeElement);
        }
      }
    };

    return ApplicationDocumentAdapter;
  })();

  module.exports = ApplicationDocumentAdapter;
}).call(this);
