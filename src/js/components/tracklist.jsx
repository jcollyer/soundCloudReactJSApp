var React = require('react');
var AppStore = require('../stores/app-store.js');
var Track = require('./track.jsx');

TrackList =
  React.createClass({
    getInitialState: function() {
      return {tracks: []};
    },
    getTracks: function(genre) {
      that = this;
      var goodTracks = [];
      var url = 'http://api.soundcloud.com/tracks?'+genre+'&client_id=b5e21578d92314bc753b90ea7c971c1e';
      $.ajax({
        url: url,
        dataType: 'json',
        success: function(tracks) {
          tracks.forEach(function(track){
            if (track.artwork_url != null){
              goodTracks.push(track);
            }
            that.setState({tracks: goodTracks});
          });
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(xhr, status, err.toString());
        }.bind(this)
      });
    },
    componentDidMount: function() {
      this.getTracks(AppStore.getGenre());
    },
    componentWillReceiveProps: function(){
      this.getTracks(AppStore.getGenre());
    },
    render: function() {
      return (
        <div>
          {this.state.tracks.map(function(track){
            var bigImage = track.artwork_url? track.artwork_url.replace('large', 't200x200') : "";
            return (
              <div className='col-md-3' key={track.id}>
                <Track
                      title={track.title}
                      artwork={bigImage}
                      id={track.id}
                      duration={track.duration}
                      author={track.user.username}
                />
              </div>
            )
          })}
        </div>
      );
    }
  });
module.exports = TrackList;
