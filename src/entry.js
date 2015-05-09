/*jslint node: true */
/*jslint esnext: true*/
"use strict";

let Actions = require('./Actions');
let InstanceStore = require('./InstanceStore');
let DataStore = require('./DataStore');
let TCMap = require('./objects/map');
let DrawingManager = require('./objects/DrawingManager');

//TODO: Only allow init one time
module.exports = {
    init(mapId, mapOpts = {}, dmOpts = {}) {
        let _map = InstanceStore.tc_map = TCMap(mapId, mapOpts);
        let _drawing_manager = InstanceStore.drawingManager = DrawingManager(_map, dmOpts);
    },
    mapComponents: InstanceStore,
    dataStore: DataStore,
    actions: Actions
};
