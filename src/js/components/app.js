/** @jsx React.DOM */
var React = require('react');
var Catalog = require('../components/app-catalog.js');
var Cart = require('../components/app-cart');
var Login = require('../components/login');
var Genre = require('../components/genre-buttons');
var Player = require('../components/player');

var APP =
    React.createClass({
        render: function () {
            return (
                <div>
                    <h1>Lets shop</h1>
                    <Catalog />
                    <h1>Cart</h1>
                    <Cart />
                    <Login />
                    <Player />
                    <Genre />
                </div>
            )
        }
    });
module.exports = APP;
