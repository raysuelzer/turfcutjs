/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
/*global map*/
"use strict";
let DataStore = require('../DataStore');
let InstanceStore = require('../InstanceStore');
let Utils = require('../utils');

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


            //callbacks when the event is changed


        return polygon;
    };
