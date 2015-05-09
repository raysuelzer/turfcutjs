/*jslint node: true */
/*jslint esnext: true*/


let DataStore = require('./DataStore');
let Polygon = require('./objects/Polygon');
let AddressMarker = require('./objects/AddressMarker');


let Actions = {
    polygonAdded: function(polygon) {
        var p = Polygon(polygon);
        DataStore.addPolygon(p);
        return p;
    },
    polygonChanged: function(polygon) {
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
