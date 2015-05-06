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
	var Initializers = __webpack_require__(4);

	module.exports = {
	    init: function init(mapId) {
	        var gmapOpts = arguments[1] === undefined ? {} : arguments[1];
	        var dmOpts = arguments[2] === undefined ? {} : arguments[2];

	        Initializers.initMap(mapId, gmapOpts);
	        Initializers.initDrawingManager(dmOpts);
	        Actions.overlayComplete();
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
	/*global google*/
	///*global _*/

	'use strict';

	var InstanceStore = __webpack_require__(2);
	var DataStore = __webpack_require__(3);
	var Polygon = __webpack_require__(5);
	var AddressMarker = __webpack_require__(6);

	var mapevents = google.maps.event;

	var Actions = {
	    overlayComplete: function overlayComplete() {
	        mapevents.addListener(InstanceStore.drawingManager, 'overlaycomplete', function (e) {
	            var polygon = Polygon(e.overlay);
	            DataStore.addPolygon(polygon);
	        });
	    },
	    polygonChanged: function polygonChanged(polygon) {
	        //Todo: make this emit an event
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
	    map: null,
	    drawingManager: null,
	    pointerControl: null,
	    polygonControl: null
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	/*global google*/
	/*global _*/

	"use strict";

	var geometry = google.maps.geometry;
	var data = {
	    polygons: [],
	    markers: []
	};

	var calculateTurfs = function calculateTurfs() {
	    var turfs = data.polygons.map(function (polygon) {
	        return {
	            polygon: polygon,
	            markers: data.markers.filter(function (marker) {
	                return geometry.poly.containsLocation(marker.getPosition(), polygon);
	            })
	        };
	    });

	    var duplicateMarkers = turfs.map(function (x) {
	        return x.markers;
	    }).reduce(function (a, b) {
	        return a.concat(b);
	    }).filter(function (value, index, self) {
	        return self.indexOf(value) !== index;
	    });

	    var deDuped = turfs.map(function (turf) {
	        var r = {}; //resulting object
	        r.polygon = turf.polygon;
	        r.markers = _.difference(turf.markers, duplicateMarkers);

	        _.remove(duplicateMarkers, function (marker) {
	            return turf.markers.indexOf(marker) !== -1;
	        });

	        return r;
	    });

	    var result = deDuped.filter(function (turf) {
	        if (turf.markers.length === 0) {
	            turf.polygon.setMap(null);
	            //TODO: this is modifying the internal store of the polygons.
	            //It is not being treated as immutable.
	            _.pull(data.polygons, turf.polygon);
	            return false;
	        }
	        return true;
	    });
	    return result;
	};

	module.exports = {
	    addPolygon: function addPolygon(polygon) {
	        data.polygons.push(polygon);
	    },
	    getPolygons: function getPolygons() {
	        return data.polygons;
	    },
	    //use for bulk adding markers
	    addMarkers: function addMarkers(markers) {
	        var _markers = data.markers.concat(markers);
	        if (data.polygons.length > 0) calculateTurfs();

	        return _markers;
	    },
	    //use for small number of markers
	    addMarker: function addMarker(marker) {
	        return data.markers.push(marker);
	    },
	    getTurfs: function getTurfs() {
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

	'use strict';

	var InstanceStore = __webpack_require__(2);
	var Utils = __webpack_require__(7);

	module.exports = {
	    initMap: function initMap(mapId) {
	        var opts = arguments[1] === undefined ? {} : arguments[1];

	        _.extend(opts, {
	            zoom: 4,
	            center: new google.maps.LatLng(39.644, -85.48615),
	            panControl: false
	        });

	        InstanceStore.map = new google.maps.Map(document.getElementById(mapId), opts);
	    },

	    initDrawingManager: function initDrawingManager() {
	        var opts = arguments[0] === undefined ? {} : arguments[0];

	        var dm = undefined,
	            drawingControlDiv = undefined;
	        var defaultOpts = { //default drawing options
	            drawingMode: google.maps.drawing.OverlayType.POLYGON,
	            drawingControl: false
	        };
	        _.extend(opts, defaultOpts);

	        dm = InstanceStore.drawingManager = new google.maps.drawing.DrawingManager(opts); //create the drawing manager
	        dm.setMap(InstanceStore.map); //attach drawing manager to the map

	        drawingControlDiv = document.createElement('div');
	        drawingControlDiv.classList.add('turfcut_drawing_control');

	        //Add pointer control
	        InstanceStore.pointerControl = this.initPointerControl(drawingControlDiv, dm);
	        //Add polygon control
	        InstanceStore.polygonControl = this.initPolygonControl(drawingControlDiv, dm);

	        drawingControlDiv.index = 1;

	        //append controls to the map
	        InstanceStore.map.controls[google.maps.ControlPosition.TOP_CENTER].push(drawingControlDiv);
	        return dm;
	    },

	    initPointerControl: function initPointerControl(controlDiv, dm) {
	        var controlUI = document.createElement('div');
	        controlUI.className = 'turfcut_pointer_control';
	        controlDiv.appendChild(controlUI);

	        //event listeners
	        google.maps.event.addDomListener(controlUI, 'click', function () {
	            controlUI.classList.add('active');
	            InstanceStore.polygonControl.classList.remove('active');
	            dm.setDrawingMode(null);
	        });
	        return controlUI;
	    },

	    initPolygonControl: function initPolygonControl(controlDiv, dm) {
	        var controlUI = document.createElement('div');
	        controlUI.className = 'turfcut_polygon_control';
	        controlDiv.appendChild(controlUI);

	        //Event listeners
	        google.maps.event.addDomListener(controlUI, 'click', function () {
	            controlUI.classList.add('active');
	            InstanceStore.pointerControl.classList.remove('active');
	            dm.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
	        });

	        return controlUI;
	    }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	/*global google*/
	///*global map*/

	'use strict';
	var Utils = __webpack_require__(7);
	var mapevents = google.maps.event;

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
	      mapevents.addListener(polygon.getPath(), 'set_at', function () {
	            return Actions.polygonChanged(polygon);
	      });
	      mapevents.addListener(polygon.getPath(), 'insert_at', function () {
	            return Actions.polygonChanged(polygon);
	      });

	      return polygon;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	/*global google*/
	'use strict';

	var Utils = __webpack_require__(7);

	module.exports = function Marker(object) {
	    var InstanceStore = __webpack_require__(2);

	    var marker = new google.maps.Marker({ //this represents the actual google map marker object attched to the marker
	        position: new google.maps.LatLng(object.latitude, object.longitude),
	        map: InstanceStore.map,
	        originalObject: object //provide a reference to the original object,
	    });
	    marker.name = Utils.makeUuid();

	    return marker;
	};

/***/ },
/* 7 */
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

/***/ }
/******/ ])
});
;
