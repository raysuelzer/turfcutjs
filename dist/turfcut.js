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
	var InstanceStore = __webpack_require__(2);
	var DataStore = __webpack_require__(3);
	var TCMap = __webpack_require__(4);
	var DrawingManager = __webpack_require__(5);

	//TODO: Only allow init one time
	module.exports = {
	    init: function init(mapId) {
	        var mapOpts = arguments[1] === undefined ? {} : arguments[1];
	        var dmOpts = arguments[2] === undefined ? {} : arguments[2];

	        var _map = InstanceStore.tc_map = TCMap(mapId, mapOpts);
	        var _drawing_manager = InstanceStore.drawingManager = DrawingManager(_map, dmOpts);
	    },
	    mapComponents: InstanceStore,
	    dataStore: DataStore,
	    actions: Actions
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/

	'use strict';

	var DataStore = __webpack_require__(3);
	var Polygon = __webpack_require__(6);
	var AddressMarker = __webpack_require__(7);

	var Actions = {
	    polygonAdded: function polygonAdded(polygon) {
	        var p = Polygon(polygon);
	        DataStore.addPolygon(p);
	        return p;
	    },
	    polygonChanged: function polygonChanged(polygon) {
	        DataStore.getTurfs();
	        return polygon;
	    },
	    loadMarkers: function loadMarkers(arr, mapFn) {
	        if (mapFn === undefined) mapFn = function (i) {
	            return i;
	        };

	        var parsedMarkers = arr.map(mapFn).map(function (item) {
	            return AddressMarker(item);
	        });

	        DataStore.addMarkers(parsedMarkers);
	        return parsedMarkers;
	    }
	};

	module.exports = Actions;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/

	"use strict";

	module.exports = {
	    tc_map: null,
	    drawingManager: null,
	    pointerControl: null,
	    polygonControl: null
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/

	"use strict";

	var data = {
	    polygons: [],
	    markers: []
	};

	var _destroyPolygon = function _destroyPolygon(polygon) {
	    polygon.setMap(null);
	    data.polygons.splice(data.polygons.indexOf(polygon), 1);
	    polygon = null; //clean up memory leaks :-P
	};

	var calculateTurfs = function calculateTurfs() {
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
	        return _destroyPolygon(t.polygon);
	    });

	    return nonEmptyTurfs;
	};

	module.exports = {
	    addPolygon: function addPolygon(polygon) {
	        data.polygons.push(polygon);
	    },
	    getPolygons: function getPolygons() {
	        return data.polygons;
	    },
	    destroyPolygon: function destroyPolygon(polygon) {
	        _destroyPolygon(polygon);
	        return data.polygons;
	    },
	    //use for bulk adding markers
	    addMarkers: function addMarkers(markers) {
	        var _markers = data.markers = data.markers.concat(markers);
	        if (data.polygons.length > 0) calculateTurfs();

	        return _markers;
	    },
	    //use for small number of markers
	    addMarker: function addMarker(marker) {
	        return data.markers.push(marker);
	    },
	    getMarkers: function getMarkers() {
	        return data.markers;
	    },
	    calculateTurfs: calculateTurfs,
	    getTurfs: function getTurfs() {
	        //alias
	        return calculateTurfs();
	    }
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	/*global google*/
	/*global _*/

	"use strict";
	module.exports = function Map(mapId, opts) {
	    _.extend(opts, {
	        zoom: 4,
	        center: new google.maps.LatLng(39.644, -85.48615),
	        panControl: false
	    });
	    return new google.maps.Map(document.getElementById(mapId), opts);
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	/*global google*/
	/*global _*/

	'use strict';
	var InstanceStore = __webpack_require__(2);
	var mapevents = google.maps.event;

	function createDivWithClass(className) {
	        var div = document.createElement('div');
	        div.className = className;
	        return div;
	}

	function initPointerControl(controlDiv, dm) {
	        var controlUI = createDivWithClass('turfcut_pointer_control');
	        controlDiv.appendChild(controlUI);

	        //event listeners
	        google.maps.event.addDomListener(controlUI, 'click', function () {
	                controlUI.classList.add('active');
	                InstanceStore.polygonControl.classList.remove('active');
	                dm.setDrawingMode(null);
	        });
	        return controlUI;
	}

	function initPolygonControl(controlDiv, dm) {
	        var controlUI = createDivWithClass('turfcut_polygon_control');
	        controlDiv.appendChild(controlUI);

	        //Event listeners
	        google.maps.event.addDomListener(controlUI, 'click', function () {
	                controlUI.classList.add('active');
	                InstanceStore.pointerControl.classList.remove('active');
	                dm.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
	        });

	        return controlUI;
	}

	module.exports = function DrawingManager(tc_map) {
	        var opts = arguments[1] === undefined ? {} : arguments[1];

	        var Actions = __webpack_require__(1);

	        var dm = undefined,
	            drawingControlDiv = undefined;
	        var defaultOpts = { //default drawing options
	                drawingMode: google.maps.drawing.OverlayType.POLYGON,
	                drawingControl: false,
	                map: tc_map
	        };
	        _.extend(opts, defaultOpts);

	        dm = new google.maps.drawing.DrawingManager(opts); //create the drawing manager

	        drawingControlDiv = createDivWithClass('turfcut_drawing_control');

	        //Add controls
	        InstanceStore.pointerControl = initPointerControl(drawingControlDiv, dm);
	        InstanceStore.polygonControl = initPolygonControl(drawingControlDiv, dm);

	        //append controls to the map
	        tc_map.controls[google.maps.ControlPosition.TOP_CENTER].push(drawingControlDiv);

	        mapevents.addListener(dm, 'overlaycomplete', function (e) {
	                return Actions.polygonAdded(e.overlay);
	        });

	        return dm;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/

	'use strict';
	var Utils = __webpack_require__(8);
	var mapevents = __webpack_require__(9);

	module.exports = function Polygon(polygon) {
	      var Actions = __webpack_require__(1);
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
	      //TODO: consider if this makes sense here
	      console.log(mapevents);
	      mapevents.polygonChangedListener(polygon, function () {
	            return Actions.polygonChanged(polygon);
	      });

	      return polygon;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	/*global google*/
	'use strict';

	var Utils = __webpack_require__(8);
	var InstanceStore = __webpack_require__(2);
	var geometry = google.maps.geometry;

	module.exports = function Marker(object) {
	    //Todo: throw warning if no lat long prop on object
	    var marker = new google.maps.Marker({ //this represents the actual google map marker object attched to the marker
	        position: new google.maps.LatLng(object.latitude, object.longitude),
	        map: InstanceStore.tc_map,
	        originalObject: object, //provide a reference to the original object,
	        name: Utils.makeUuid()
	    });

	    marker.isWithinPolygon = function (polygon) {
	        return geometry.poly.containsLocation(marker.getPosition(), polygon);
	    };

	    return marker;
	};

/***/ },
/* 8 */
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
	    }
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	/*global google*/

	// A wrapper for map events

	'use strict';

	var googleMapEvents = {
	    polygonChangedListener: function polygonChangedListener(polygon, callback) {
	        google.maps.event.addListener(polygon.getPath(), 'set_at', callback);
	        google.maps.event.addListener(polygon.getPath(), 'insert_at', callback);
	    }

	};

	module.exports = googleMapEvents;

/***/ }
/******/ ])
});
;
