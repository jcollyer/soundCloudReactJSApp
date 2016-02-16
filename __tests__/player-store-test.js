jest.dontMock('../src/js/constants/player-constants.js');
jest.dontMock('../src/js/stores/player-store.js');
jest.dontMock('object-assign');

describe('PlayerStore', function() {
  var PlayerConstant = require('../src/js/constants/player-constants.js');
  var PlayerDispatcher;
  var PlayerStore;
  var callback;

  beforeEach(function() {
    PlayerDispatcher = require('../src/js/dispatchers/player-dispatcher.js');
    PlayerStore = require('../src/js/stores/player-store.js');
    callback = PlayerDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(PlayerDispatcher.register.mock.calls.length).toBe(1);
  });
});
