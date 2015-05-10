/*jslint node: true */
/*jslint esnext: true*/

"use strict";
let EventEmitter = require('events').EventEmitter,
    AppDispatcher = require('./AppDispatcher'),
    CONSTANTS = require('./Constants'),
    assign = require('object-assign');

//*The data that is held in the store*/
let data = {
    polygons: [],
    markers: []
};

//*Internal function to remove polygons*//
let destroyPolygon = function (polygon) {
        polygon.setMap(null);
        data.polygons.splice(data.polygons.indexOf(polygon), 1);
        polygon = null; //clean up memory leaks :-P
    },

    addPolygon = function(polygon) {
        data.polygons.push(polygon);
    },

    addMarkers = function(markers) {
        let _markers = data.markers = data.markers.concat(markers);
        data.markers = data.markers;
        return _markers;
    },

    calculateTurfs = function () {
    if (data.polygons.length ===  0) {
        console.warn("You don't have any shapes drawn");
        return [];
    }

    let mappedMarkers = [],
        turfs = data.polygons
                    //reverse the order so newest are mapped first
                    .reverse()
                    //map each turf
                    .map( (polygon) => {
                            let r = {
                                polygon: polygon,
                                markers: data.markers
                                        .filter( (marker) => (marker.isWithinPolygon(polygon) && mappedMarkers.indexOf(marker) === -1) )
                    };
                        //store the markers that fall in this turf in an array
                        //to check against later, so we don't have markers in two a
                        r.markers.forEach(m => mappedMarkers.push(m));
                        return r;
                    }),

            emptyTurfs = turfs.filter((x) => x.markers.length === 0),
            nonEmptyTurfs = turfs.filter((x) => x.markers.length > 0);


    //remove polygons wihout markers
    //destroy empty turfs
    emptyTurfs.forEach(t => destroyPolygon(t.polygon));

    return nonEmptyTurfs;
    };


let DataStore = assign({}, EventEmitter.prototype,

{
    addChangeListener(change_event, callback) {
        this.on(change_event, callback);
    },
    /**
     * @param {function} callback
     */
    removeChangeListener(change_event, callback) {
        this.removeListener(change_event, callback);
    },

    emitChange(change_event, payload) {
        //Indicates that something has changed in
        //the store that would impact the calculated turf
        //Other places in the app hook into this event
        //in order to update the UI.
        this.emit(CONSTANTS.UPDATE_TYPES.TURF_CHANGED);
        this.emit(change_event, payload);
    },

    getData() {
        var _data = data;
        _data.turfs = calculateTurfs();
        return _data;
    }
});

AppDispatcher.register(function (action) {
    let a = action.action;
    switch (a.type) {
        case CONSTANTS.ACTION_TYPES.POLYGON_ADDED_ACTION:
            addPolygon(a.data);
            DataStore.emitChange(CONSTANTS.UPDATE_TYPES.POLYGON_ADDED, a.data);
            break;
        case CONSTANTS.ACTION_TYPES.POLYGON_CHANGED_ACTION:
            DataStore.emitChange(CONSTANTS.UPDATE_TYPES.POLYGON_CHANGED, a.data);
            break;
        case CONSTANTS.ACTION_TYPES.POLYGON_SELF_DESTRUCT:
            destroyPolygon(a.data);
            DataStore.emitChange(CONSTANTS.UPDATE_TYPES.POLYGON_DESTROYED);
            break;
        case CONSTANTS.ACTION_TYPES.MARKERS_ADDED_ACTION:
            addMarkers(a.data);
            DataStore.emitChange(CONSTANTS.UPDATE_TYPES.MARKERS_ADDED, a.data);
            break;
        default:
            // no ops
    }
});

module.exports = DataStore;



