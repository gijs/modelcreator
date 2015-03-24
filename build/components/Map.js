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

var swal = require('sweetalert');

require("!style!css!./Map.css");
require("!style!css!../node_modules/sweetalert/lib/sweet-alert.css");
require("!style!css!../node_modules/leaflet/dist/leaflet.css");
require("!style!css!../node_modules/leaflet-draw/dist/leaflet.draw.css");
var L = require('leaflet');
L.Icon.Default.imagePath = '';
var LGeo = require('leaflet-geodesy');
require('leaflet-draw');
require('leaflet-hash');

var debug = require('debug')('Map.js');


var Map = React.createClass({
	mixins: [OverlayMixin],
    getInitialState: function () {
      return {
        isModalOpen: true,
        result: {}
      };
    },	
	getDefaultProps: function () {
	   return {
	     drawControlPosition: 'topleft',
	     latlng: [
			48.546, 9.426
	     ],
	     zoom: 5,
	     baseLayers: [
	     	{
                    mapbox: L.tileLayer('http://{s}.tiles.mapbox.com/v3/nelenschuurmans.5641a12c/{z}/{x}/{y}.png', {
                        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                        maxZoom: 22,
                        detectRetina: false
                    }),
                    satellite: L.tileLayer('http://{s}.tiles.mapbox.com/v3/nelenschuurmans.iaa79205/{z}/{x}/{y}.png', {
                        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                        maxZoom: 22,
                        detectRetina: false
                    }),
                    labels: L.tileLayer('http://{s}.tiles.mapbox.com/v3/nelenschuurmans.0a5c8e74/{z}/{x}/{y}.png', {
                        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                        maxZoom: 22,
                        detectRetina: false
                    })
			}
	     ],
	     layers: []
	   };
	},
	componentDidMount: function() {
		var self = this;
		var start_popups = [];
		var end_popups = [];
		var startingPoint, finishPoint;

		// Instruct Leaflet to prefer canvas rendering
		window.L.PREFER_CANVAS = true; 

		this.map = L.map(this.getDOMNode(), {
			layers: [
				this.props.baseLayers[0].mapbox, 
				this.props.baseLayers[0].labels
			]
		}).setView(this.props.latlng, this.props.zoom);	

		window.map = this.map;


		var drawnItems = new L.FeatureGroup();
		map.addLayer(drawnItems);		

		// Initialise the draw control and pass it the FeatureGroup of editable layers
		var drawControl = new L.Control.Draw({
		    edit: false,
			draw: {
		        polyline: false,
		        circle: false,
		        marker: false,
		        rectangle: false
	        }
		});
		map.addControl(drawControl);	

		map.on('draw:created', function (e) {
		    var type = e.layerType,
		        layer = e.layer;

		    if (type === 'polygon') {
		        debug('Drawing polygon! Area:', LGeo.area(e.layer));
		        console.log(e.layer.toGeoJSON());
		        self.setState({
		        	result: e.layer.toGeoJSON()
		        });
		        if(LGeo.area(e.layer) > 10000000000) {
		        	swal('Te groot oppervlak', 
		        		 'Sorry, het getekende oppervlak is te groot voor 3Di!', 
		        		 'error');
		        } else {
				    map.addLayer(layer);
				    showPolygonArea(e);						
					swal({
					  title: "Nieuw model",
					  text: "Wilt u dit gebied als nieuw modelgebied?",
					  type: "warning",
					  showCancelButton: true,
					  cancelButtonText: "Nee",
					  confirmButtonColor: "#337AB7",
					  confirmButtonText: "Ja, dit gebied wil ik!",
					  closeOnConfirm: true,
					  html: false
					}, function(e){
						if(e===true) self.handleToggle();
					});

		        }
		    }
		});

		function showPolygonArea(e) {
		  drawnItems.clearLayers();
		  drawnItems.addLayer(e.layer);
		  e.layer.bindPopup((LGeo.area(e.layer) / 1000000).toFixed(2) + ' km<sup>2</sup>');
		  e.layer.openPopup();
		}

		var hash = new L.Hash(this.map);		    

		var baseLayers = {
		    "Topo": this.props.baseLayers[0].mapbox,
		    "Satellite": this.props.baseLayers[0].satellite
		};

		var overlays = {
		    "Labels": this.props.baseLayers[0].labels
		};

		L.control.layers(baseLayers, overlays).addTo(this.map);

	},
    handleToggle: function () {
	    this.setState({
	      isModalOpen: !this.state.isModalOpen
	    });
    },
    handleSubmit: function() {
    	swal('Nog niet klaar', 'Sorry, deze feature is nog niet klaar!', 'error');
    },
    handleGeojsonIO: function() {
    	var redirectString = 'http://geojson.io/#data=data:application/json,' + encodeURIComponent(JSON.stringify(this.state.result));
    	window.location = redirectString;
    },
	renderOverlay: function () {

	    if (!this.state.isModalOpen) {
	      return <span/>;
	    }


	    var ac = (this.state.result.type === 'Feature') ? 2 : 1;

	    return (
	        <Modal bsStyle="primary" title="3Di Model Creator" onRequestHide={this.handleToggle}>
	          <div className="modal-body">
			    <TabbedArea defaultActiveKey={ac}>
			      <TabPane eventKey={1} tab="Nieuw modelgebied intekenen">
			      	  <hr/>
				      <h5>
					      Teken een polygoon op de kaart
				      </h5>
				      <p>Het gebied kan maximaal 10.000 km<sup>2</sup> groot zijn</p>
				      <p>Gebruik het polygoon icoontje linksboven om met intekenen te starten</p>
				      <p>U kunt de polygoon afsluiten door te dubbelklikken of door op het beginpunt te klikken</p>
			      </TabPane>
			      <TabPane eventKey={2} tab="Resultaat">
				      <hr/>
				      <h5>Resultaat</h5>
				      <pre dangerouslySetInnerHTML={{__html: JSON.stringify(this.state.result)}} />
				      <ButtonGroup>
					      <Button onClick={this.handleSubmit}>Dit model verzenden naar 3Di</Button>
					      <Button onClick={this.handleGeojsonIO}>Openen in geojson.io</Button>
					  </ButtonGroup>
			      </TabPane>
			    </TabbedArea>	            
	          </div>
	          <div className="modal-footer">
	            <Button onClick={this.handleToggle}>OK</Button>
	          </div>
	        </Modal>
	      );
	},	
	render: function() {
		return (
			<div className="mapwrapper">
				<div className="Map" id="map"></div>
			</div>
		)
	}
});



module.exports = Map;