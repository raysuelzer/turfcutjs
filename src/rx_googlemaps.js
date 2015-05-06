//// Copyright (c) Microsoft Corporation.  All rights reserved.
//// This code is licensed by Microsoft Corporation under the terms
//// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
//// See http://go.microsoft.com/fwlink/?LinkId=186234.
//
///*jslint node: true */
///*jslint esnext: true*/
///*global google*/
//
//"use strict";
//
//var Rx = require('rx');
//
//module.exports = function()
//{
//    var _undefined;
//    var maps = google.maps;
//    var evt = maps.event;
//    var observable = Rx.Observable;
//    var observableCreate = observable.create;
//    var asyncSubject = Rx.AsyncSubject;
//
////    evt.addListenerAsObservable = function(instance, eventName)
////    {
////        return observableCreate(function(observer)
////        {
////            var listener = evt.addListener(instance, eventName, function(eventObject)
////            {
////                observer.onNext(eventObject);
////            });
////            return function()
////            {
////                evt.removeListener(listener);
////            };
////        });
////    };
//
//    evt.addListenerAsObservable = function(instance, eventName)
//    {
//        return Rx.Observable.fromEvent(instance, eventName);
//
//    };
//
//    evt.addDomListenerAsObservable = function(instance, eventName)
//    {
//        return observableCreate(function(observer)
//        {
//            var listener = evt.addDomListener(instance, eventName, function(eventObject)
//            {
//                observer.onNext(eventObject);
//            });
//            return function()
//            {
//                evt.removeListener(listener);
//            };
//        });
//    };
//
//    maps.ElevationService.prototype.getElevationAlongPathAsObservable = function(request)
//    {
//        var subject = new asyncSubject();
//        this.getElevationAlongPath(request,
//            function(elevationResults, elevationStatus)
//            {
//                if (elevationStatus != maps.ElevationStatus.OK)
//                {
//                        subject.OnError(elevationStatus);
//                }
//                else
//                {
//                        subject.OnNext(elevationResults);
//                        subject.OnCompleted();
//                }
//            });
//        return subject;
//    };
//
//    maps.ElevationService.prototype.getElevationForLocationsAsObservable = function(request)
//    {
//        var subject = new asyncSubject();
//        this.getElevationForLocations(request,
//            function(elevationResults, elevationStatus)
//            {
//                if (elevationStatus != maps.ElevationStatus.OK)
//                {
//                        subject.onNext(elevationStatus);
//                }
//                else
//                {
//                        subject.onNext(elevationResults);
//                        subject.onCompleted();
//                }
//            });
//        return subject;
//    };
//
//    maps.Geocoder.prototype.geocodeAsObservable = function(request)
//    {
//        var subject = new asyncSubject();
//        this.geocode(request,
//            function(geocoderResults, geocoderStatus)
//            {
//                if (geocoderStatus != maps.GeocoderStatus.OK)
//                {
//                        subject.OnError(geocoderStatus);
//                }
//                else
//                {
//                        subject.onNext(geocoderResults);
//                        subject.onCompleted();
//                }
//            });
//        return subject;
//    };
//
//    maps.DirectionsService.prototype.routeAsObservable = function(request)
//    {
//        var subject = new asyncSubject();
//        this.route(request,
//            function(directionsResults, directionsStatus)
//            {
//                if (directionsStatus != maps.DirectionsStatus.OK)
//                {
//                        subject.OnError(directionsStatus);
//                }
//                else
//                {
//                        subject.OnNext(directionsResults);
//                        subject.OnCompleted();
//                }
//            });
//        return subject;
//    };
//
//    maps.StreetViewService.prototype.getPanoramaById = function(pano)
//    {
//        var subject = new asyncSubject();
//        this.getPanoramaById(pano,
//            function(data, status)
//            {
//                if (status != maps.StreetViewStatus.OK)
//                {
//                        subject.onNext(status);
//                }
//                else
//                {
//                        subject.onNext(data);
//                        subject.onCompleted();
//                }
//            });
//        return subject;
//    };
//
//    maps.StreetViewService.prototype.getPanoramaByLocation = function(latlng, radius)
//    {
//        var subject = new asyncSubject();
//        this.getPanoramaByByLocation(latlng, radius,
//            function(data, status)
//            {
//                if (status != maps.StreetViewStatus.OK)
//                {
//                        subject.OnError(status);
//                }
//                else
//                {
//                        subject.OnNext(data);
//                        subject.OnCompleted();
//                }
//            });
//        return subject;
//    };
//
//
//    maps.MVCArray.prototype.ToObservable = function(scheduler)
//    {
//        if (scheduler === _undefined) scheduler = currentThreadScheduler;
//        var parent = this;
//
//        return Rx.Observable.create(function(subscriber)
//        {
//            var count = 0;
//            return scheduler.scheduleRecursive(function(self)
//            {
//                if (count < parent.getLength())
//                {
//                    subscriber.onNext(parent.getAt(count));
//                    count++;
//                    self();
//                }
//                else
//                {
//                    subscriber.onCompleted();
//                }
//            });
//        });
//     };
//}();
