var React = require('react');
var PlayerActions = require('../actions/player-actions.js');
var AppStore = require('../stores/app-store.js');
require('../../style/track.less');

var Track =
  React.createClass({
    handleClick: function (event) {
      document.getElementById("overlay").classList.add("show");
      PlayerActions.setTags(this.props.tags);
      PlayerActions.setTrack(this.props.id, this.props.duration, this.props.title, this.props.author, this.props.artwork, this.props.user_id);
      window.location.hash = "/tracks/"+this.props.id+"";
      document.getElementById("player-wrapper").classList.remove("hide");
    },
    render: function() {
      return (
        <div className="track" id={this.props.id} onClick={this.handleClick}>
          <div className="track-image">
            <img src={this.props.artwork} />
          </div>
          <div className="track-info">
            <p className="title">{this.props.title}</p>
            <p className="author">{this.props.author}</p>
          </div>
        </div>
      );
    }
  });
module.exports = Track;
