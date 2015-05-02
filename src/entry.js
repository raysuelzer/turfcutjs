/*jslint node: true */
/*jslint esnext: true*/
"use strict";


let InstanceStore = require('./InstanceStore');
let Initializers = require('./Initializers');



module.exports = {
    init(mapId, gmapOpts = {}, dmOpts = {}) {
        Initializers.initMap(mapId, gmapOpts);
        Initializers.initDrawingManager(dmOpts);
    },
    mapComponents: InstanceStore
};
