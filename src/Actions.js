/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
///*global _*/

let InstanceStore = require('./InstanceStore');
let DataStore = require('./DataStore');
let Polygon = require('./objects/Polygon');
let AddressMarker = require('./objects/AddressMarker');


let mapevents =  google.maps.event;

let Actions = {
    overlayComplete: function() {
        mapevents.addListener(InstanceStore.drawingManager, 'overlaycomplete', function (e) {
            let polygon = Polygon(e.overlay);
            DataStore.addPolygon(polygon);
        });
    },
    polygonChanged: function(polygon) {
       //Todo: make this emit an event
        DataStore.getTurfs();
       return polygon;
    },
    loadMarkers(arr, mapFn) {
        if (mapFn === undefined)
            mapFn = function(i){return i;};

        let parsedMarkers = arr.map(mapFn)
            .map(function(item) {
                return AddressMarker(item);
            });

        DataStore.addMarkers(parsedMarkers);
        return parsedMarkers;
    }
};

module.exports = Actions;
