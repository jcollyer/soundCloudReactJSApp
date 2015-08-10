var React = require('react');
var AppStore = require('../stores/app-store.js');
var AppActions = require('../actions/app-actions.js');

var PlaylistsMenu =
  React.createClass({
    getInitialState: function() {
      var userPlaylists = AppStore.getUserPlaylists();
      return {
        userPlaylists: userPlaylists
      }
    },
    render: function(){
      return (
        <div>
          {
            this.state.userPlaylists.map(function(playlist){
              return (
                <div>{playlist}</div>
              )
            })
          }
        </div>
      )
    }
  });
module.exports = PlaylistsMenu;
