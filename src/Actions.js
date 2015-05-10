/*jslint node: true */
/*jslint esnext: true*/

let CONSTANTS = require('./Constants'),
    AddressMarker = require('./objects/AddressMarker'),
    InstanceStore = require('./InstanceStore'),
    AppDispatcher = require('./AppDispatcher');

let Actions = {
    loadMarkers(arr, mapFn) {
        if (mapFn === undefined)
            mapFn = function(i){return i;};

        let parsedMarkers = arr.map(mapFn)
            .map(function(item) {
                return AddressMarker(item, InstanceStore.gmap);
            });

        AppDispatcher.handleAction(CONSTANTS.ACTION_TYPES.MARKERS_ADDED_ACTION, parsedMarkers);
    }
};

module.exports = Actions;
