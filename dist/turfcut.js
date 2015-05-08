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
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdateTurfCut"];
/******/ 	this["webpackHotUpdateTurfCut"] =
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "9d0e6fe5bddfdb6bc165"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				fn[name] = __webpack_require__[name];
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 				else for(var i = 0; i < dep.length; i++)
/******/ 					hot._acceptedDependencies[dep[i]] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else for(var i = 0; i < dep.length; i++)
/******/ 					hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) { if(err) throw err; };
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0; { // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(+id);
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) { if(err) throw err; };
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) { if(err) throw err; };
/******/ 		}
/******/
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = +id;
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

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
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

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

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
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
	        console.log("calculatTurfs");
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
