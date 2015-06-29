(function() {
  var Storage = require('../repositories/storage');

  var ApplicationSettingsAdapter = (function() {
    function ApplicationSettingsAdapter(_application) {
      this.environment = _application.environment; // window
      this.settingsKey = _application.settingsKey;

      var storageOptions = {
        strategy: _application.environment.localStorage
      };

      this.storage = new Storage(storageOptions);
    }

    ApplicationSettingsAdapter.prototype.isQualified = function() {
      this.storage.find(this.settingsKey + ":qualified");
    };

    ApplicationSettingsAdapter.prototype.setQualified = function() {
      this.storage.save(this.settingsKey + ":qualified", 'true');
    };

    ApplicationSettingsAdapter.prototype.unsetQualified = function() {
      this.storage.delete(this.settingsKey + ":qualified");
    };

    return ApplicationSettingsAdapter;
  })();

  module.exports = ApplicationSettingsAdapter;
}).call(this);
