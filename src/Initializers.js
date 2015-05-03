/*jslint node: true */
/*jslint esnext: true*/
/*global google*/
/*global _*/

let InstanceStore = require('./InstanceStore');
let Utils = require('./utils');

module.exports = {
    initMap(mapId, opts = {}) {
        _.extend(opts, {
            zoom: 4,
            center: new google.maps.LatLng(39.644, -85.48615),
            panControl: false
        });

        InstanceStore.map = new google.maps.Map(document.getElementById(mapId), opts);
    },

    initDrawingManager(opts = {}) {
        let dm, drawingControlDiv;
        let defaultOpts = {  //default drawing options
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
        _.extend(opts, defaultOpts);

        dm = InstanceStore.drawingManager = new google.maps.drawing.DrawingManager(opts); //create the drawing manager
        dm.setMap(InstanceStore.map);  //attach drawing manager to the map

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

    initPointerControl(controlDiv, dm) {
        let controlUI = document.createElement('div');
        controlUI.className = 'turfcut_pointer_control';
        controlDiv.appendChild(controlUI);

        //event listeners
        google.maps.event.addDomListener(controlUI, 'click', () => {
            controlUI.classList.add('active');
            InstanceStore.polygonControl.classList.remove('active');
            dm.setDrawingMode(null);
        });
        return controlUI;
    },

    initPolygonControl(controlDiv, dm) {
        let controlUI = document.createElement('div');
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
