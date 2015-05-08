/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
/*global _*/

"use strict";

var geometry = google.maps.geometry;
var data = {
    polygons: [],
    markers: []
};

var calculateTurfs = function () {
    let turfs = data.polygons.map(function (polygon) {
        return {
            polygon: polygon,
            markers: data.markers
                            .filter( (marker) => {
                                    return geometry.poly.containsLocation(marker.getPosition(), polygon);
                            })
            };
        });

    let duplicateMarkers = turfs.map((x) => {return x.markers;})
                                            .reduce( (a,b) => {return a.concat(b);})
                                            .filter( (value,index,self) =>
                                                    {
                                                        return self.indexOf(value) !== index;
                                                    });

    let deDuped = turfs.map((turf) => {
                                        let r = {}; //resulting object
                                        r.polygon = turf.polygon;
                                        r.markers = _.difference(turf.markers, duplicateMarkers);

                                        _.remove(duplicateMarkers, function(marker) {
                                                            return turf.markers.indexOf(marker) !== -1;
                                                        });

                                        return r;
                                    });

    let result = deDuped.filter(function (turf) {
        if (turf.markers.length === 0) {
            turf.polygon.setMap(null);
            //TODO: this is modifying the internal store of the polygons.
            //It is not being treated as immutable.
            _.pull(data.polygons, turf.polygon);
            return false;
        }
        return true;
    });
    return result;
};


module.exports = {
    addPolygon(polygon) {
        data.polygons.push(polygon);
    },
    getPolygons() {
        return data.polygons;
    },
    //use for bulk adding markers
    addMarkers(markers) {
        var _markers = data.markers.concat(markers);
        if (data.polygons.length > 0)
            calculateTurfs();

        return _markers;
    },
    //use for small number of markers
    addMarker(marker) {
        return data.markers.push(marker);
    },
    getTurfs() {
        console.log('calculatTurfs');
        return calculateTurfs();
    }
};
