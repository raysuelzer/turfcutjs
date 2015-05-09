/*jslint node: true */
/*jslint esnext: true*/

"use strict";
let Utils = require('../utils');
let mapProviderListeners = require('../MapEvents');

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
            mapProviderListeners.polygonChangedListener(polygon,  () => Actions.polygonChanged(polygon));

        return polygon;
    };
