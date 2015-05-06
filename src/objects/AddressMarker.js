/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
"use strict";

let Utils = require('../utils');

module.exports = function Marker(object) {
            let InstanceStore = require('../InstanceStore');

            let marker = new google.maps.Marker({ //this represents the actual google map marker object attched to the marker
                position: new google.maps.LatLng(object.latitude, object.longitude),
                map: InstanceStore.map,
                originalObject: object //provide a reference to the original object,
            });
        marker.name = Utils.makeUuid();

        return marker;
    };
