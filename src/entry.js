/*jslint node: true */
/*jslint esnext: true*/
"use strict";

let Actions = require('./Actions');
let InstanceStore = require('./InstanceStore');
let DataStore = require('./DataStore');
let Initializers = require('./Initializers');

module.exports = {
    init(mapId, gmapOpts = {}, dmOpts = {}) {
        Initializers.initMap(mapId, gmapOpts);
        Initializers.initDrawingManager(dmOpts);
        Actions.overlayComplete();
    },
    mapComponents: InstanceStore,
    dataStore: DataStore,
    actions: Actions
};
