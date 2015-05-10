/*jslint node: true */
/*jslint esnext: true*/

"use strict";
let Utils = require('../utils'),
    GMapEvents = require('../GMapEvents'),
    AppDispatcher = require('../AppDispatcher'),
    CONSTANTS = require('../Constants');

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
            GMapEvents.addPolygonChangedListener(polygon,  () => AppDispatcher.handleAction(CONSTANTS.ACTION_TYPES.POLYGON_CHANGED_ACTION, polygon));

            polygon.destroy = function () {
                polygon.setMap(null);
                AppDispatcher.handleAction(CONSTANTS.ACTION_TYPES.POLYGON_SELF_DESTRUCT, polygon);
            };

        return polygon;
    };
