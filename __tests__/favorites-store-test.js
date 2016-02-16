jest.dontMock('../src/js/constants/favorites-constants.js');
jest.dontMock('../src/js/stores/favorites-store.js');
jest.dontMock('object-assign');

describe('FavoritesStore', function() {
  var FavoriteConstants = require('../src/js/constants/favorites-constants.js');
  var FavoritesDispatcher;
  var FavoritesStore;
  var callback;

  // mock actions
  var actionFavoriteAddFavorites = {
    actionType: FavoriteConstants.ADD_FAVORITE,
    id: 123
  };

  beforeEach(function() {
    FavoritesDispatcher = require('../src/js/dispatchers/favorites-dispatcher.js');
    FavoritesStore = require('../src/js/stores/favorites-store.js');
    callback = FavoritesDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(FavoritesDispatcher.register.mock.calls.length).toBe(1);
  });

  it('adds a favorite id', function() {
    console.log(actionFavoriteAddFavorites);
    callback({ actionType: 'ADD_FAVORITE'});
    var all = TodoStore.getAll();
    var keys = Object.keys(all);
    expect(keys.length).toBe(1);
    expect(all[keys[0]].id).toEqual(123);
  });
});
