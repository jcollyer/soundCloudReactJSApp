// var React = require('react');
// var TestUtils = require('react-addons-test-utils');
jest.dontMock('../src/js/constants/app-constants.js');
jest.dontMock('../src/js/stores/app-store.js');
jest.dontMock('object-assign');

describe('AppStore', function() {
  var AppConstants = require('../src/js/constants/app-constants.js');
  var AppDispatcher;
  var AppStore;
  var callback;

  // mock actions
  var actionAppShowHome = {
    actionType: AppConstants.SHOW_HOME,
    bool: false
  };

  beforeEach(function() {
    AppDispatcher = require('../src/js/dispatchers/app-dispatcher.js');
    AppStore = require('../src/js/stores/app-store.js');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('initializes with no user id', function() {
    var userID = AppStore.getUserId();
    expect(userID).toBe(undefined);
  });

  it('initializes with not being logged in', function() {
    var loggedIn = AppStore.isLoggedInSC();
    expect(loggedIn).toBe(false);
  });

  it('initializes with shouldShowHome true', function() {
    var shouldShowHome = AppStore.shouldShowHome();
    expect(shouldShowHome).toBe(true);
  });

  xit('returns shouldShowHome false', function() {;
    callback(actionAppShowHome);
    var all = AppStore.getAll();
    var keys = Object.keys(all);
    expect(all[keys[0]].bool).toEqual(false);
  });
});
