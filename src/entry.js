/*jslint node: true */
/*jslint esnext: true*/
"use strict";

let EventListeners = require('./EventListeners');
let InstanceStore = require('./InstanceStore');
let Initializers = require('./Initializers');

module.exports = {
    init(mapId, gmapOpts = {}, dmOpts = {}) {
        Initializers.initMap(mapId, gmapOpts);
        Initializers.initDrawingManager(dmOpts);
        EventListeners.overlayComplete(InstanceStore.drawingManager);
    },
    mapComponents: InstanceStore
};
