var React = require('react');
var AppStore = require('../stores/app-store.js');
var AppActions = require('../actions/app-actions.js');
require('../../style/playlists-menu.less');

var PlaylistsMenu =
  React.createClass({
    getInitialState: function() {
      var userPlaylists = AppStore.getUserPlaylists();
      return {
        userPlaylists: userPlaylists
      }
    },
    handleClick: function() {
      debugger;
    },
    render: function(){

      return (
        <div id="playlist-select-menu">
          {
            this.state.userPlaylists.map(function(playlist){
              return (
                <button onClick={this.handleClick}>{playlist}</button>
              )
            })
          }
        </div>
      )
    }
  });
module.exports = PlaylistsMenu;
