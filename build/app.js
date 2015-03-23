/**
 * @jsx React.DOM
 */

var React = require('react');

var Row = require('react-bootstrap').Row;
var Grid = require('react-bootstrap').Grid;
var Col = require('react-bootstrap').Col;
var ModalTrigger = require('react-bootstrap').ModalTrigger;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Button = require('react-bootstrap').Button;

var OverlayMixin = require('react-bootstrap').OverlayMixin;
var Modal = require('react-bootstrap').Modal;
var Badge = require('react-bootstrap').Badge;
var Label = require('react-bootstrap').Label;
var TabbedArea = require('react-bootstrap').TabbedArea;
var TabPane = require('react-bootstrap').TabPane;
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;
var Table = require('react-bootstrap').Table;
var DateTimePicker = require('react-widgets').DateTimePicker;
var Promise = require('es6-promise').Promise;

var $ = require('jquery');
var moment = require('moment');

var debug = require('debug');
var bootstrapDebug = debug('ModelCreatorApp:bootstrap');

var Map = require('./components/Map');

debug.enable('*');

React.initializeTouchEvents(true);

window.React = React; // React DevTools won't work without this


var App = React.createClass({

  
  render: function () {
    return (
      <Map/>
    );
  }
});


React.render(<App/>, document.getElementById('modelcreator-app'));
