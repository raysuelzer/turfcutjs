/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
/*global _*/

"use strict";
let mapProviderListeners = require('../MapEvents');
let Utils = require('../utils');



function createDrawingManagerUI(dm) {
    let drawingControlDiv = Utils.createDivWithClass('turfcut_drawing_control'),
        polygonControlDiv = Utils.createDivWithClass('turfcut_polygon_control'),
        pointerControlDiv = Utils.createDivWithClass('turfcut_pointer_control');

    drawingControlDiv.appendChild(polygonControlDiv);
    drawingControlDiv.appendChild(pointerControlDiv);

    mapProviderListeners.addDomListener(polygonControlDiv, 'click', () => {
                polygonControlDiv.classList.add('active');
                pointerControlDiv.classList.remove('active');
                dm.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
            });

    mapProviderListeners.addDomListener(pointerControlDiv, 'click', () => {
                pointerControlDiv.classList.add('active');
                polygonControlDiv.classList.remove('active');
                dm.setDrawingMode(null);
        });

    return drawingControlDiv;
}


module.exports = function DrawingManager(tc_map, opts = {}) {
        let Actions = require('../Actions');

        let defaultOpts = {  //default drawing options
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: false,
            map: tc_map
        };
        _.extend(opts, defaultOpts);

        let dm = new google.maps.drawing.DrawingManager(opts); //create the drawing manager
        //append controls to the map
        tc_map.controls[google.maps.ControlPosition.TOP_CENTER].push(createDrawingManagerUI(dm));

        mapProviderListeners.addPolygonCompletedListener(dm, (e) => Actions.polygonAdded(e.overlay) );

       return dm;
    };
