/*jslint node: true */
/*jslint esnext: true*/

"use strict";


var data = {
    polygons: [],
    markers: []
};

var destroyPolygon = function (polygon) {
        polygon.setMap(null);
        data.polygons.splice(data.polygons.indexOf(polygon), 1);
        polygon = null; //clean up memory leaks :-P
};


var calculateTurfs = function () {
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


module.exports = {
    addPolygon(polygon) {
        data.polygons.push(polygon);
    },
    getPolygons() {
        return data.polygons;
    },
    destroyPolygon(polygon) {
        destroyPolygon(polygon);
        return data.polygons;
    },
    //use for bulk adding markers
    addMarkers(markers) {
        let _markers = data.markers = data.markers.concat(markers);
        if (data.polygons.length > 0)
            calculateTurfs();

        return _markers;
    },
    //use for small number of markers
    addMarker(marker) {
        return data.markers.push(marker);
    },
    getMarkers() {
        return data.markers;
    },
    calculateTurfs: calculateTurfs,
    getTurfs() { //alias
        return calculateTurfs();
    }
};
