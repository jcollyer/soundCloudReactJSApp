var React = require('react');
var TrackList = require('./tracklist.jsx');
var Home = require('./home.jsx');
var AppStore = require('../stores/app-store.js');

var ViewSwitch =
  React.createClass({
    getInitialState:function() {
      return {showHome: true};
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
      if (this.state.showHome) {
        return (
          <Home />
        )
      } else {
        return (
          <TrackList />
        )
      }
    }
  });
module.exports = ViewSwitch;
