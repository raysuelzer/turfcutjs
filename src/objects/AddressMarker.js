/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
/*global map*/
"use strict";

module.exports = function Marker(lat,lng, originalObject, opts) {
            let marker = new google.maps.Marker({ //this represents the actual google map marker object attched to the marker
                position: new google.maps.LatLng(lat, lng),
                map: map,
                originalObject: originalObject //provide a reference to the original object,
            });

        return marker;
    };
