/** These are the events that an end user can attach to **/
/*jslint node: true */
/*jslint esnext: true*/

"use strict";
let DataStore = require('./DataStore'),
    CONSTANTS = require('./Constants');

let events = {
    turfUpdated: function (callback) {
        DataStore.addChangeListener(CONSTANTS.UPDATE_TYPES.TURF_CHANGED, function () {
            var _d = DataStore.getData();
                callback(_d);
        });
    }
};

module.exports = events;
