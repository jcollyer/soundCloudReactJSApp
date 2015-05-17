/** @jsx React.DOM */
var React = require('react');
var Catalog = require('../components/app-catalog.js');
var Cart = require('../components/app-cart');
var Login = require('../components/app-login');
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
                </div>
            )
        }
    });
module.exports = APP;
