/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
/*global map*/
"use strict";

//class AddressMarker{
//        constructor(input, latLngObj) {
//            this.input = input;
//             let marker = new google.maps.Marker({ //this represents the actual google map marker object attched to the marker
//                position: new google.maps.LatLng(latLngObj.lat, latLngObj.lng),
//                map: map,
//                address: this //provide a reference to the parent marker,
//            });
//
//            marker.assignToPolygon = function () {};
//        }
//    }

module.exports = function Marker(lat,lng, originalObject, opts) {
            let marker = new google.maps.Marker({ //this represents the actual google map marker object attched to the marker
                position: new google.maps.LatLng(lat, lng),
                map: map,
                originalObject: originalObject //provide a reference to the original object,
            });

        return marker;
    };

