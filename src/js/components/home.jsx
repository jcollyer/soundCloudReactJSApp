var React = require('react');
var Genre = require('./genre.jsx');

var Home =
  React.createClass({
    render: function() {
      return (
        <div id="home-page">
          <div id="image-placeholder"></div>
          <h1>Click to get started...</h1>
          <Genre />
        </div>
      );
    }
  });
module.exports = Home;
