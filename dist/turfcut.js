(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["TurfCut"] = factory();
	else
		root["TurfCut"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	'use strict';

	var Actions = __webpack_require__(1);
	var Events = __webpack_require__(2);
	var InstanceStore = __webpack_require__(3);
	var DataStore = __webpack_require__(4);
	var GMap = __webpack_require__(5);
	var DrawingManager = __webpack_require__(6);

	//TODO: Only allow init one time
	module.exports = {
	    events: Events,
	    getData: DataStore.getData,
	    init: function init(mapId) {
	        var mapOpts = arguments[1] === undefined ? {} : arguments[1];
	        var dmOpts = arguments[2] === undefined ? {} : arguments[2];

	        var _map = InstanceStore.gmap = GMap(mapId, mapOpts);
	        InstanceStore.drawingManager = DrawingManager(_map, dmOpts);
	    },
	    mapComponents: InstanceStore,
	    actions: Actions
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/

	'use strict';

	var CONSTANTS = __webpack_require__(7),
	    AddressMarker = __webpack_require__(8),
	    InstanceStore = __webpack_require__(3),
	    AppDispatcher = __webpack_require__(9);

	var Actions = {
	    loadMarkers: function loadMarkers(arr, mapFn) {
	        if (mapFn === undefined) mapFn = function (i) {
	            return i;
	        };

	        var parsedMarkers = arr.map(mapFn).map(function (item) {
	            return AddressMarker(item, InstanceStore.gmap);
	        });

	        AppDispatcher.handleAction(CONSTANTS.ACTION_TYPES.MARKERS_ADDED_ACTION, parsedMarkers);
	    }
	};

	module.exports = Actions;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/** These are the events that an end user can attach to **/
	/*jslint node: true */
	/*jslint esnext: true*/

	'use strict';
	var DataStore = __webpack_require__(4),
	    CONSTANTS = __webpack_require__(7);

	var events = {
	    turfUpdated: function turfUpdated(callback) {
	        DataStore.addChangeListener(CONSTANTS.UPDATE_TYPES.TURF_CHANGED, function () {
	            var _d = DataStore.getData();
	            callback(_d);
	        });
	    }
	};

	module.exports = events;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/

	"use strict";

	module.exports = {
	    gmap: null, /*avoid redifining map proto*/
	    drawingManager: null,
	    pointerControl: null,
	    polygonControl: null
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/

	'use strict';
	var EventEmitter = __webpack_require__(14).EventEmitter,
	    AppDispatcher = __webpack_require__(9),
	    CONSTANTS = __webpack_require__(7),
	    assign = __webpack_require__(13);

	//*The data that is held in the store*/
	var data = {
	    polygons: [],
	    markers: []
	};

	//*Internal function to remove polygons*//
	var destroyPolygon = function destroyPolygon(polygon) {
	    polygon.setMap(null);
	    data.polygons.splice(data.polygons.indexOf(polygon), 1);
	    polygon = null; //clean up memory leaks :-P
	},
	    addPolygon = function addPolygon(polygon) {
	    data.polygons.push(polygon);
	},
	    addMarkers = function addMarkers(markers) {
	    var _markers = data.markers = data.markers.concat(markers);
	    data.markers = data.markers;
	    return _markers;
	},
	    calculateTurfs = function calculateTurfs() {
	    if (data.polygons.length === 0) {
	        console.warn('You don\'t have any shapes drawn');
	        return [];
	    }

	    var mappedMarkers = [],
	        turfs = data.polygons
	    //reverse the order so newest are mapped first
	    .reverse()
	    //map each turf
	    .map(function (polygon) {
	        var r = {
	            polygon: polygon,
	            markers: data.markers.filter(function (marker) {
	                return marker.isWithinPolygon(polygon) && mappedMarkers.indexOf(marker) === -1;
	            })
	        };
	        //store the markers that fall in this turf in an array
	        //to check against later, so we don't have markers in two a
	        r.markers.forEach(function (m) {
	            return mappedMarkers.push(m);
	        });
	        return r;
	    }),
	        emptyTurfs = turfs.filter(function (x) {
	        return x.markers.length === 0;
	    }),
	        nonEmptyTurfs = turfs.filter(function (x) {
	        return x.markers.length > 0;
	    });

	    //remove polygons wihout markers
	    //destroy empty turfs
	    emptyTurfs.forEach(function (t) {
	        return destroyPolygon(t.polygon);
	    });

	    return nonEmptyTurfs;
	};

	var DataStore = assign({}, EventEmitter.prototype, {
	    addChangeListener: function addChangeListener(change_event, callback) {
	        this.on(change_event, callback);
	    },
	    /**
	     * @param {function} callback
	     */
	    removeChangeListener: function removeChangeListener(change_event, callback) {
	        this.removeListener(change_event, callback);
	    },

	    emitChange: function emitChange(change_event, payload) {
	        //Indicates that something has changed in
	        //the store that would impact the calculated turf
	        //Other places in the app hook into this event
	        //in order to update the UI.
	        this.emit(CONSTANTS.UPDATE_TYPES.TURF_CHANGED);
	        this.emit(change_event, payload);
	    },

	    getData: function getData() {
	        var _data = data;
	        _data.turfs = calculateTurfs();
	        return _data;
	    }
	});

	AppDispatcher.register(function (action) {
	    var a = action.action;
	    switch (a.type) {
	        case CONSTANTS.ACTION_TYPES.POLYGON_ADDED_ACTION:
	            addPolygon(a.data);
	            DataStore.emitChange(CONSTANTS.UPDATE_TYPES.POLYGON_ADDED, a.data);
	            break;
	        case CONSTANTS.ACTION_TYPES.POLYGON_CHANGED_ACTION:
	            DataStore.emitChange(CONSTANTS.UPDATE_TYPES.POLYGON_CHANGED, a.data);
	            break;
	        case CONSTANTS.ACTION_TYPES.POLYGON_SELF_DESTRUCT:
	            destroyPolygon(a.data);
	            DataStore.emitChange(CONSTANTS.UPDATE_TYPES.POLYGON_DESTROYED);
	            break;
	        case CONSTANTS.ACTION_TYPES.MARKERS_ADDED_ACTION:
	            addMarkers(a.data);
	            DataStore.emitChange(CONSTANTS.UPDATE_TYPES.MARKERS_ADDED, a.data);
	            break;
	        default:
	        // no ops
	    }
	});

	module.exports = DataStore;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	/*global google*/

	"use strict";

	var utils = __webpack_require__(12);

	"use strict";
	module.exports = function Map(mapId) {
	    var opts = arguments[1] === undefined ? {} : arguments[1];

	    utils.extend(opts, {
	        zoom: 4,
	        center: new google.maps.LatLng(39.644, -85.48615),
	        panControl: false
	    });
	    return new google.maps.Map(document.getElementById(mapId), opts);
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	/*global google*/

	'use strict';
	var GMapEvents = __webpack_require__(10),
	    AppDispatcher = __webpack_require__(9),
	    CONSTANTS = __webpack_require__(7),
	    Polygon = __webpack_require__(11),
	    utils = __webpack_require__(12);

	function createDrawingManagerUI(dm) {
	    var drawingControlDiv = utils.createDivWithClass('turfcut_drawing_control'),
	        polygonControlDiv = utils.createDivWithClass('turfcut_polygon_control'),
	        pointerControlDiv = utils.createDivWithClass('turfcut_pointer_control');

	    drawingControlDiv.appendChild(polygonControlDiv);
	    drawingControlDiv.appendChild(pointerControlDiv);

	    GMapEvents.addDomListener(polygonControlDiv, 'click', function () {
	        polygonControlDiv.classList.add('active');
	        pointerControlDiv.classList.remove('active');
	        dm.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
	    });

	    GMapEvents.addDomListener(pointerControlDiv, 'click', function () {
	        pointerControlDiv.classList.add('active');
	        polygonControlDiv.classList.remove('active');
	        dm.setDrawingMode(null);
	    });

	    return drawingControlDiv;
	}

	module.exports = function DrawingManager(gmap) {
	    var opts = arguments[1] === undefined ? {} : arguments[1];

	    var defaultOpts = { //default drawing options
	        drawingMode: google.maps.drawing.OverlayType.POLYGON,
	        drawingControl: false,
	        map: gmap
	    };
	    utils.extend(opts, defaultOpts);

	    var dm = new google.maps.drawing.DrawingManager(opts); //create the drawing manager
	    //append controls to the map
	    gmap.controls[google.maps.ControlPosition.TOP_CENTER].push(createDrawingManagerUI(dm));

	    GMapEvents.addPolygonCompletedListener(dm, function (e) {
	        return AppDispatcher.handleAction(CONSTANTS.ACTION_TYPES.POLYGON_ADDED_ACTION, Polygon(e.overlay));
	    });

	    return dm;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	'use strict';

	module.exports = {
	    ACTION_TYPES: {
	        POLYGON_ADDED_ACTION: 'POLYGON_ADDED_ACTION',
	        POLYGON_CHANGED_ACTION: 'POLYGON_CHANGED_ACTION',
	        POLYGON_SELF_DESTRUCT: 'POLYGON_SELF_DESTRUCT',
	        MARKERS_ADDED_ACTION: 'MARKERS_ADDED_ACTION'
	    },
	    UPDATE_TYPES: {
	        TURF_CHANGED: 'TURF_CHANGED',
	        POLYGON_CHANGED: 'POLYGON_CHANGED',
	        POLYGON_ADDED: 'POLYGON_ADDED',
	        POLYGON_DESTROYED: 'POLYGON_DESTROYED',
	        MARKERS_ADDED: 'MARKERS_ADDED'
	    }
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	/*global google*/
	'use strict';

	var utils = __webpack_require__(12),
	    InstanceStore = __webpack_require__(3);

	module.exports = function Marker(object) {
	    //Todo: throw warning if no lat long prop on object
	    var marker = new google.maps.Marker({ //this represents the actual google map marker object attched to the marker
	        position: new google.maps.LatLng(object.latitude, object.longitude),
	        map: InstanceStore.gmap,
	        originalObject: object, //provide a reference to the original object,
	        name: utils.makeUuid()
	    });

	    marker.isWithinPolygon = function (polygon) {
	        return google.maps.geometry.poly.containsLocation(marker.getPosition(), polygon);
	    };

	    return marker;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	"use strict";

	var Dispatcher = __webpack_require__(15);

	module.exports = Dispatcher;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	/*global google*/

	'use strict';

	var gevents = google.maps.event;

	var listeners = {
	    addPolygonChangedListener: function addPolygonChangedListener(polygon, callback) {
	        gevents.addListener(polygon.getPath(), 'set_at', callback);
	        gevents.addListener(polygon.getPath(), 'insert_at', callback);
	    },
	    addPolygonCompletedListener: function addPolygonCompletedListener(drawingManager, callback) {
	        gevents.addListener(drawingManager, 'overlaycomplete', callback);
	    },
	    addDomListener: function addDomListener(el, event, callback) {
	        gevents.addDomListener(el, 'click', callback);
	    }
	};

	module.exports = listeners;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/

	'use strict';
	var Utils = __webpack_require__(12),
	    GMapEvents = __webpack_require__(10),
	    AppDispatcher = __webpack_require__(9),
	    CONSTANTS = __webpack_require__(7);

	module.exports = function Polygon(polygon) {
	    var opts = {
	        fillColor: Utils.getRandomHexColor(),
	        fillOpacity: 0.4,
	        strokeWeight: 4,
	        clickable: true,
	        editable: true
	    };
	    polygon.name = Utils.makeUuid();
	    polygon.setOptions(opts); //set the options

	    //Wire events to this polygon
	    GMapEvents.addPolygonChangedListener(polygon, function () {
	        return AppDispatcher.handleAction(CONSTANTS.ACTION_TYPES.POLYGON_CHANGED_ACTION, polygon);
	    });

	    polygon.destroy = function () {
	        polygon.setMap(null);
	        AppDispatcher.handleAction(CONSTANTS.ACTION_TYPES.POLYGON_SELF_DESTRUCT, polygon);
	    };

	    return polygon;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/

	'use strict';

	module.exports = {
	    getRandomHexColor: function getRandomHexColor() {
	        return '#' + Math.floor(Math.random() * 16777215).toString(16);
	    },

	    makeUuid: function makeUuid() {
	        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	            var r = Math.random() * 16 | 0,
	                v = c === 'x' ? r : r & 3 | 8;
	            return v.toString(16);
	        });
	    },
	    createDivWithClass: function createDivWithClass(className) {
	        var div = document.createElement('div');
	        div.className = className;
	        return div;
	    },

	    // Helper to set/override default options.
	    // Mutates the destination object.
	    extend: function extend(destination, source) {
	        for (var prop in source) {
	            if (source.hasOwnProperty(prop)) destination[prop] = source[prop];
	        }
	    }
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        len = arguments.length;
	        args = new Array(len - 1);
	        for (i = 1; i < len; i++)
	          args[i - 1] = arguments[i];
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    len = arguments.length;
	    args = new Array(len - 1);
	    for (i = 1; i < len; i++)
	      args[i - 1] = arguments[i];

	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    var m;
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  var ret;
	  if (!emitter._events || !emitter._events[type])
	    ret = 0;
	  else if (isFunction(emitter._events[type]))
	    ret = 1;
	  else
	    ret = emitter._events[type].length;
	  return ret;
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var FluxDispatcher = __webpack_require__(16).Dispatcher;


	var dispatcher = new FluxDispatcher();


	dispatcher.handleAction = function handleAction(source, type, data) {

	    if (arguments.length < 2 || arguments.length > 3) {
	        var message = 'Expected two or three arguments.';
	        throw new Error(message);
	    }
	    else if (arguments.length === 2) {
	        data = type;
	        type = source;
	        source = undefined;
	    }

	    var payload = {
	        action: {
	            type: type,
	            data: data
	        }
	    };

	    if (source) {
	        payload.source = source;
	    }

	    dispatcher.dispatch(payload);
	};


	module.exports = dispatcher;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	module.exports.Dispatcher = __webpack_require__(17)


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Dispatcher
	 * @typechecks
	 */

	"use strict";

	var invariant = __webpack_require__(18);

	var _lastID = 1;
	var _prefix = 'ID_';

	/**
	 * Dispatcher is used to broadcast payloads to registered callbacks. This is
	 * different from generic pub-sub systems in two ways:
	 *
	 *   1) Callbacks are not subscribed to particular events. Every payload is
	 *      dispatched to every registered callback.
	 *   2) Callbacks can be deferred in whole or part until other callbacks have
	 *      been executed.
	 *
	 * For example, consider this hypothetical flight destination form, which
	 * selects a default city when a country is selected:
	 *
	 *   var flightDispatcher = new Dispatcher();
	 *
	 *   // Keeps track of which country is selected
	 *   var CountryStore = {country: null};
	 *
	 *   // Keeps track of which city is selected
	 *   var CityStore = {city: null};
	 *
	 *   // Keeps track of the base flight price of the selected city
	 *   var FlightPriceStore = {price: null}
	 *
	 * When a user changes the selected city, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'city-update',
	 *     selectedCity: 'paris'
	 *   });
	 *
	 * This payload is digested by `CityStore`:
	 *
	 *   flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'city-update') {
	 *       CityStore.city = payload.selectedCity;
	 *     }
	 *   });
	 *
	 * When the user selects a country, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'country-update',
	 *     selectedCountry: 'australia'
	 *   });
	 *
	 * This payload is digested by both stores:
	 *
	 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       CountryStore.country = payload.selectedCountry;
	 *     }
	 *   });
	 *
	 * When the callback to update `CountryStore` is registered, we save a reference
	 * to the returned token. Using this token with `waitFor()`, we can guarantee
	 * that `CountryStore` is updated before the callback that updates `CityStore`
	 * needs to query its data.
	 *
	 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       // `CountryStore.country` may not be updated.
	 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
	 *       // `CountryStore.country` is now guaranteed to be updated.
	 *
	 *       // Select the default city for the new country
	 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
	 *     }
	 *   });
	 *
	 * The usage of `waitFor()` can be chained, for example:
	 *
	 *   FlightPriceStore.dispatchToken =
	 *     flightDispatcher.register(function(payload) {
	 *       switch (payload.actionType) {
	 *         case 'country-update':
	 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
	 *           FlightPriceStore.price =
	 *             getFlightPriceStore(CountryStore.country, CityStore.city);
	 *           break;
	 *
	 *         case 'city-update':
	 *           FlightPriceStore.price =
	 *             FlightPriceStore(CountryStore.country, CityStore.city);
	 *           break;
	 *     }
	 *   });
	 *
	 * The `country-update` payload will be guaranteed to invoke the stores'
	 * registered callbacks in order: `CountryStore`, `CityStore`, then
	 * `FlightPriceStore`.
	 */

	  function Dispatcher() {
	    this.$Dispatcher_callbacks = {};
	    this.$Dispatcher_isPending = {};
	    this.$Dispatcher_isHandled = {};
	    this.$Dispatcher_isDispatching = false;
	    this.$Dispatcher_pendingPayload = null;
	  }

	  /**
	   * Registers a callback to be invoked with every dispatched payload. Returns
	   * a token that can be used with `waitFor()`.
	   *
	   * @param {function} callback
	   * @return {string}
	   */
	  Dispatcher.prototype.register=function(callback) {
	    var id = _prefix + _lastID++;
	    this.$Dispatcher_callbacks[id] = callback;
	    return id;
	  };

	  /**
	   * Removes a callback based on its token.
	   *
	   * @param {string} id
	   */
	  Dispatcher.prototype.unregister=function(id) {
	    invariant(
	      this.$Dispatcher_callbacks[id],
	      'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
	      id
	    );
	    delete this.$Dispatcher_callbacks[id];
	  };

	  /**
	   * Waits for the callbacks specified to be invoked before continuing execution
	   * of the current callback. This method should only be used by a callback in
	   * response to a dispatched payload.
	   *
	   * @param {array<string>} ids
	   */
	  Dispatcher.prototype.waitFor=function(ids) {
	    invariant(
	      this.$Dispatcher_isDispatching,
	      'Dispatcher.waitFor(...): Must be invoked while dispatching.'
	    );
	    for (var ii = 0; ii < ids.length; ii++) {
	      var id = ids[ii];
	      if (this.$Dispatcher_isPending[id]) {
	        invariant(
	          this.$Dispatcher_isHandled[id],
	          'Dispatcher.waitFor(...): Circular dependency detected while ' +
	          'waiting for `%s`.',
	          id
	        );
	        continue;
	      }
	      invariant(
	        this.$Dispatcher_callbacks[id],
	        'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
	        id
	      );
	      this.$Dispatcher_invokeCallback(id);
	    }
	  };

	  /**
	   * Dispatches a payload to all registered callbacks.
	   *
	   * @param {object} payload
	   */
	  Dispatcher.prototype.dispatch=function(payload) {
	    invariant(
	      !this.$Dispatcher_isDispatching,
	      'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
	    );
	    this.$Dispatcher_startDispatching(payload);
	    try {
	      for (var id in this.$Dispatcher_callbacks) {
	        if (this.$Dispatcher_isPending[id]) {
	          continue;
	        }
	        this.$Dispatcher_invokeCallback(id);
	      }
	    } finally {
	      this.$Dispatcher_stopDispatching();
	    }
	  };

	  /**
	   * Is this Dispatcher currently dispatching.
	   *
	   * @return {boolean}
	   */
	  Dispatcher.prototype.isDispatching=function() {
	    return this.$Dispatcher_isDispatching;
	  };

	  /**
	   * Call the callback stored with the given id. Also do some internal
	   * bookkeeping.
	   *
	   * @param {string} id
	   * @internal
	   */
	  Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
	    this.$Dispatcher_isPending[id] = true;
	    this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
	    this.$Dispatcher_isHandled[id] = true;
	  };

	  /**
	   * Set up bookkeeping needed when dispatching.
	   *
	   * @param {object} payload
	   * @internal
	   */
	  Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
	    for (var id in this.$Dispatcher_callbacks) {
	      this.$Dispatcher_isPending[id] = false;
	      this.$Dispatcher_isHandled[id] = false;
	    }
	    this.$Dispatcher_pendingPayload = payload;
	    this.$Dispatcher_isDispatching = true;
	  };

	  /**
	   * Clear bookkeeping used for dispatching.
	   *
	   * @internal
	   */
	  Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
	    this.$Dispatcher_pendingPayload = null;
	    this.$Dispatcher_isDispatching = false;
	  };


	module.exports = Dispatcher;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	"use strict";

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (false) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        'Invariant Violation: ' +
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;


/***/ }
/******/ ])
});
;
