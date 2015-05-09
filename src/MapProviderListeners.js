/*jslint node: true */
/*jslint esnext: true*/
/*global google*/

// A wrapper for map events
// Goal here is to create an interface that will work with major map apis

var gevents = google.maps.event;
let googleMapEvents = {
        polygonChangedListener: function (polygon, callback) {
            gevents.addListener(polygon.getPath(), 'set_at',  callback);
            gevents.addListener(polygon.getPath(), 'insert_at',  callback);
        },
        addPolygonCompletedListener: function (drawingManager, callback) {
            gevents.addListener(drawingManager, 'overlaycomplete', callback);
        },
        addDomListener: function(el, event, callback) {
            gevents.addDomListener(el, 'click', callback);
        }
};

module.exports = googleMapEvents;
