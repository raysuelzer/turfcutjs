/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
/*global map*/
"use strict";
let DataStore = require('../DataStore');
let InstanceStore = require('../InstanceStore');
let Utils = require('../utils');
let EventListeners = require('../EventListeners');

var mapevents =  google.maps.event;

module.exports = function Polygon(polygon) {
          let opts = {
                fillColor: Utils.getRandomHexColor(),
                fillOpacity: 0.40,
                strokeWeight: 4,
                clickable: true,
                editable: true
            };
            polygon.name = Utils.makeUuid();
            polygon.setOptions(opts); //set the options

            //Wire events to this polygon
    console.log(EventListeners);
            mapevents.addListener(polygon.getPath(), 'set_at',  EventListeners.polygonChanged);
            mapevents.addListener(polygon.getPath(), 'insert_at',  EventListeners.polygonChanged);

        return polygon;
    };
