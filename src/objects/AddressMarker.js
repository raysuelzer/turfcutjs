/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
"use strict";

let utils = require('../utils'),
    InstanceStore = require('../InstanceStore');

module.exports = function Marker(object) {
    //Todo: throw warning if no lat long prop on object
      let marker = new google.maps.Marker({ //this represents the actual google map marker object attched to the marker
                position: new google.maps.LatLng(object.latitude, object.longitude),
                map: InstanceStore.gmap,
                originalObject: object, //provide a reference to the original object,
                name: utils.makeUuid()
            });

        marker.isWithinPolygon = function (polygon) {
            return google.maps.geometry.poly.containsLocation(marker.getPosition(), polygon);
        };

        return marker;
};
