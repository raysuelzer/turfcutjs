/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
/*global _*/
"use strict";

let AddressMarker = require('./AddressMarker');
let Utils = require('./utils);

const MapFunctions = {
    initMap(mapId, opts = {}) {
        _.extend(opts, {
            zoom: 4,
            center: new google.maps.LatLng(39.644, -85.48615),
            panControl: false
        });

        map = new google.maps.Map(document.getElementById(mapId), opts);
    },

    initDrawingManager(opts = {}) {
        let dm;
        defaultOpts = {  //default drawing options
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: false,
            polygonOptions: {
                fillColor: Utils.getRandomHexColor(),
                fillOpacity: 0.40,
                strokeWeight: 4,
                clickable: true,
                editable: true
            }
        };

        _.extend(opts, defaultOpts);;


       dm = new google.maps.drawing.DrawingManager(opts); //create the drawing manager
       dm.setMap(map);  //attach drawing manager to the map

       let drawingControlDiv = document.createElement('div');
       let pointerControl = new PointerControl(drawingControlDiv, dm);
       let polygonControl = new PolygonControl(drawingControlDiv, dm);
       drawingControlDiv.index = 1;

       map.controls[google.maps.ControlPosition.TOP_CENTER].push(drawingControlDiv);

       return dm;
    }
};

module.exports = MapFunctions;
