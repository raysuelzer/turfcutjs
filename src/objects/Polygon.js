/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
///*global map*/

"use strict";
let Utils = require('../utils');
let mapevents =  google.maps.event;

module.exports = function Polygon(polygon) {
         let Actions = require('../Actions');
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
            //TODO: consider if this makes sense here
            mapevents.addListener(polygon.getPath(), 'set_at',  () => Actions.polygonChanged(polygon));
            mapevents.addListener(polygon.getPath(), 'insert_at',  () => Actions.polygonChanged(polygon));

        return polygon;
    };
