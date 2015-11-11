require('../node_modules/openlayers/dist/ol.css');
require('./index.css');
var ol = require('openlayers');
var send = require('./feedback_send');

var url = 'http://student.ifip.tuwien.ac.at/geoserver/wfs';
var layer = 'feedback';
var prefix = 'g06_2015';
var featureNS = 'http://g06/2015';
var form = document.getElementById('feedback');

var feedbackPoints = new ol.source.Vector({
  features: new ol.Collection(),
});

var map = new ol.Map({
  controls: ol.control.defaults({attributionOptions: {collapsible: false}}),
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: url,
        params: {LAYERS: prefix + ':' + layer}
      })
    }),
    new ol.layer.Vector({
      source: feedbackPoints
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([16.373064, 48.20833]),
    zoom: 13
  })
});

var feature = new ol.Feature();
feature.setGeometryName('geom');
feature.setGeometry(new ol.geom.Point(map.getView().getCenter()));
feedbackPoints.addFeature(feature);
var modify = new ol.interaction.Modify({
  features: feedbackPoints.getFeaturesCollection()
});
map.addInteraction(modify);

var geolocation = new ol.Geolocation({
  projection: map.getView().getProjection(),
  tracking: true
});
geolocation.once('change:position', function(evt) {
  feature.getGeometry().setCoordinates(geolocation.getPosition());
  map.getView().setCenter(geolocation.getPosition());
});

send(form, feature, url, {
  featureType: layer,
  featurePrefix: prefix,
  featureNS: featureNS,
  srsName: map.getView().getProjection().getCode()
});
