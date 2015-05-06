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

	var EventListeners = __webpack_require__(1);
	var InstanceStore = __webpack_require__(2);
	var Initializers = __webpack_require__(3);

	module.exports = {
	    init: function init(mapId) {
	        var gmapOpts = arguments[1] === undefined ? {} : arguments[1];
	        var dmOpts = arguments[2] === undefined ? {} : arguments[2];

	        Initializers.initMap(mapId, gmapOpts);
	        Initializers.initDrawingManager(dmOpts);
	        EventListeners.overlayComplete(InstanceStore.drawingManager);
	    },
	    mapComponents: InstanceStore
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	/*global google*/
	/*global _*/

	'use strict';

	var InstanceStore = __webpack_require__(2);
	var DataStore = __webpack_require__(4);
	var Polygon = __webpack_require__(5);
	var Utils = __webpack_require__(6);

	var mapevents = google.maps.event;

	var EventListeners = {
	    overlayComplete: function overlayComplete() {
	        mapevents.addListener(InstanceStore.drawingManager, 'overlaycomplete', function (e) {
	            var polygon = Polygon(e.overlay);
	            console.log(polygon);
	            DataStore.polygons.push(polygon);
	        });
	    },
	    polygonChanged: function polygonChanged(e) {
	        console.log(e);
	    }
	};

	module.exports = EventListeners;

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

	'use strict';

	var InstanceStore = __webpack_require__(2);
	var Utils = __webpack_require__(6);

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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/

	"use strict";

	module.exports = {
	    polygons: []
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true */
	/*jslint esnext: true*/
	/*global google*/
	/*global map*/
	'use strict';
	var DataStore = __webpack_require__(4);
	var InstanceStore = __webpack_require__(2);
	var Utils = __webpack_require__(6);
	var EventListeners = __webpack_require__(1);

	var mapevents = google.maps.event;

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
	        console.log(EventListeners);
	        mapevents.addListener(polygon.getPath(), 'set_at', EventListeners.polygonChanged);
	        mapevents.addListener(polygon.getPath(), 'insert_at', EventListeners.polygonChanged);

	        return polygon;
	};

/***/ },
/* 6 */
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
