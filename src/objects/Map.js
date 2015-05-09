/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
/*global _*/


"use strict";
module.exports = function Map(mapId, opts) {
        _.extend(opts, {
            zoom: 4,
            center: new google.maps.LatLng(39.644, -85.48615),
            panControl: false
        });
        return new google.maps.Map(document.getElementById(mapId), opts);
    };
