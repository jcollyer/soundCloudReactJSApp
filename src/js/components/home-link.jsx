var React = require('react');
var AppActions = require('../actions/app-actions.js');
var GenreStore = require('../stores/genre-store.js');

var Home =
  React.createClass({
    getInitialState: function() {
      return {active: true};
    },
    handleClick: function(){
      AppActions.showHome(true);
      window.location.hash = "";

      // de-active other side nav elements. active home link
      [].slice.call(document.getElementsByClassName("side-nav-link")).forEach(function(d){d.classList.remove("active-side-nav-button")});
      [].slice.call(document.getElementsByClassName("panel-box")).forEach(function(d){d.classList.remove("active-panel")});
      document.getElementById('home-side-nav-link').classList.add("active-side-nav-button");
    },
    update: function(){
      this.setState({active: false});
    },
    componentDidMount: function(){
      GenreStore.on('change', this.update);
    },
    componentWillUnmount: function() {
      GenreStore.removeListener('change', this.update);
    },
    render: function() {
      return (
        <div onClick={this.handleClick}  id="home-side-nav-link" className={this.state.active ? "side-nav-link active-side-nav-button" : "side-nav-link"}>
          <i className="side-nav-icon icon-circle-cross"></i>
          <p>Home</p>
        </div>
      );
    }
  });
module.exports = Home;
