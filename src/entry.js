/*jslint node: true */
/*jslint esnext: true*/
"use strict";

let Actions = require('./Actions');
let Events = require('./Events');
let InstanceStore = require('./InstanceStore');
let DataStore = require('./DataStore');
let GMap = require('./objects/map');
let DrawingManager = require('./objects/DrawingManager');

//TODO: Only allow init one time
module.exports = {
    events: Events,
    getData: DataStore.getData,
    init(mapId, mapOpts = {}, dmOpts = {}) {
        let _map = InstanceStore.gmap = GMap(mapId, mapOpts);
        InstanceStore.drawingManager = DrawingManager(_map, dmOpts);
    },
    mapComponents: InstanceStore,
    actions: Actions
};
