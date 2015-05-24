/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-store.js');
var AppActions = require('../actions/app-actions.js');
var Track = require('./track.js');

TrackList =
  React.createClass({
    getInitialState: function() {
      return {tracks: []};
    },
    getTracks: function(genre) {
      var url = 'http://api.soundcloud.com/tracks?'+genre+'&client_id=51b52c948e268a19b58f87f3d47861ad';
      $.ajax({
        // url: this.props.url,
        url: url,
        dataType: 'json',
        success: function(tracks) {
          this.setState({tracks: tracks});
          console.log("success! tracks: ",tracks);
        }.bind(this),
        error: function(xhr, status, err) {
          // console.error(this.props.url, status, err.toString());
          console.error(xhr, status, err.toString());
        }.bind(this)
      });
    },
    componentWillReceiveProps: function(){
      this.getTracks(AppStore.getGenre());
    },
    render: function() {
      return (
        <div>
          {this.state.tracks.map(function(track){
            return (
              <div>
                <Track title={track.title} artwork={track.artwork_url} id={track.id} />
              </div>
            )
          })}
        </div>
      );
    }
  });
module.exports = TrackList;
