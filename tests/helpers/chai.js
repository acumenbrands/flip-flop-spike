var chai = require('chai');

chai.config.includeStack = true;

global.expect         = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion      = chai.Assertion;
global.Loader         = require('../../lib/loader');
global.Notifier       = require('../../lib/notifier');
global.Context        = require('../../lib/factories/context');
