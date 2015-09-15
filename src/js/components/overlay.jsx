var React = require('react');

var Overlay =
  React.createClass({
    render:function(){
      return (
        <div id="overlay">
          <div className="spinner"></div>
        </div>
      )
    }
  });
module.exports = Overlay;
