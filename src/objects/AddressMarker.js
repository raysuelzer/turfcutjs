/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
"use strict";

let Utils = require('../utils');
let InstanceStore = require('../InstanceStore');
let geometry = google.maps.geometry;

module.exports = function Marker(object) {
    //Todo: throw warning if no lat long prop on object
      let marker = new google.maps.Marker({ //this represents the actual google map marker object attched to the marker
                position: new google.maps.LatLng(object.latitude, object.longitude),
                map: InstanceStore.tc_map,
                originalObject: object, //provide a reference to the original object,
                name: Utils.makeUuid()
            });

        marker.isWithinPolygon = function (polygon) {
            return geometry.poly.containsLocation(marker.getPosition(), polygon);
        };

        return marker;
};
