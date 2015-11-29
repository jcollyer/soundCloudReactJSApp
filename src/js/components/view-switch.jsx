var React = require('react');
var TrackList = require('./tracklist.jsx');
var Home = require('./home.jsx');
var AppStore = require('../stores/app-store.js');

var ViewSwitch =
  React.createClass({
    getInitialState:function() {
      var singleTrackView = window.location.hash.indexOf("/tracks/") > -1;
      if (singleTrackView) {
        return {showHome: false};
      } else {
        return {showHome: true};
      }
    },
    showHome: function() {
      var showHome = AppStore.shouldShowHome();
      this.setState({showHome: showHome});
    },
    componentDidMount: function(){
      AppStore.on('change', this.showHome);
    },
    componentWillUnmount: function() {
      AppStore.removeListener('change', this.showHome);
    },
    render:function(){
      return (
        <div>
          <div id="home-wrapper" className={this.state.showHome ? 'show' : ''}>
            <Home />
          </div>
          <TrackList />
        </div>
      )
    }
  });
module.exports = ViewSwitch;
