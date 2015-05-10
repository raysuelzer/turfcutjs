/*jslint node: true */
/*jslint esnext: true*/
/*global google*/

let gevents = google.maps.event;

let listeners = {
        addPolygonChangedListener: function (polygon, callback) {
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

module.exports = listeners;
