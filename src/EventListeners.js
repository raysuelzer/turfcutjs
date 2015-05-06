/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
/*global _*/

let InstanceStore = require('./InstanceStore');
let DataStore = require('./DataStore');
let Polygon = require('./objects/Polygon');
let Utils = require('./utils');

var mapevents =  google.maps.event;

var EventListeners = {
    overlayComplete: function() {
        mapevents.addListener(InstanceStore.drawingManager, 'overlaycomplete', function (e) {
            let polygon = Polygon(e.overlay);
            console.log(polygon);
            DataStore.polygons.push(polygon);
        });
    },
    polygonChanged: function(e) {
       console.log(e);
    }
};

module.exports = EventListeners;
