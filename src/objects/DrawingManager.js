/*jslint node: true */
/*jslint esnext: true*/
/*global google*/

"use strict";
let GMapEvents = require('../GMapEvents'),
    AppDispatcher = require('../AppDispatcher'),
    CONSTANTS = require('../Constants'),
    Polygon = require('./Polygon'),
    utils = require('../utils');

function createDrawingManagerUI(dm) {
    let drawingControlDiv = utils.createDivWithClass('turfcut_drawing_control'),
        polygonControlDiv = utils.createDivWithClass('turfcut_polygon_control'),
        pointerControlDiv = utils.createDivWithClass('turfcut_pointer_control');

    drawingControlDiv.appendChild(polygonControlDiv);
    drawingControlDiv.appendChild(pointerControlDiv);

    GMapEvents.addDomListener(polygonControlDiv, 'click', () => {
                polygonControlDiv.classList.add('active');
                pointerControlDiv.classList.remove('active');
                dm.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
            });

    GMapEvents.addDomListener(pointerControlDiv, 'click', () => {
                pointerControlDiv.classList.add('active');
                polygonControlDiv.classList.remove('active');
                dm.setDrawingMode(null);
        });

    return drawingControlDiv;
}


module.exports = function DrawingManager(gmap, opts = {}) {
        let defaultOpts = {  //default drawing options
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: false,
            map: gmap
        };
        utils.extend(opts, defaultOpts);

        let dm = new google.maps.drawing.DrawingManager(opts); //create the drawing manager
        //append controls to the map
        gmap.controls[google.maps.ControlPosition.TOP_CENTER].push(createDrawingManagerUI(dm));

        GMapEvents.addPolygonCompletedListener(dm, (e) =>
                                                  AppDispatcher.handleAction(CONSTANTS.ACTION_TYPES.POLYGON_ADDED_ACTION, Polygon(e.overlay)));

       return dm;
    };
