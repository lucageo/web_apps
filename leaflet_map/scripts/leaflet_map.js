require({
		async: true,
		paths: {
			widgetsPackage: "/../../widgets",
		}
	}, ["dojo/dom-style", "dojo/html", "dojo/dom-construct", "dojo/_base/array", "dojo/_base/lang", "dijit/form/Button", "dojo/dom", "widgetsPackage/ReferenceList", "widgetsPackage/ImageryTimeSlider", "widgetsPackage/PhotoViewer", "dojo/dom-construct", "dojo/io-query", "dojo/_base/window", "dojo/parser", "dojo/on", "dijit/registry", "dojo/ready", "dijit/form/CheckBox", "dijit/layout/BorderContainer", "dijit/layout/ContentPane"],
	function(domStyle, html, domConstruct, array, lang, Button, dom, ReferenceList, ImageryTimeSlider, PhotoViewer, domConstruct, ioQuery, win, parser, on, registry, ready) {
		ready(function() {
			var CALLOUT_CIRCLE_RADIUS = 7;
			var CALLOUT_LINE_LENGTH = 50;
			var FILL_OPACITY = 0.2;
			var OPACITY = 0.4;
			// var FILL_OPACITY = 0;
			// var OPACITY = 0;
			var vectorTileStyling = {
				water: {
					fill: true,
					weight: 1,
					fillColor: '#06cccc',
					color: '#06cccc',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY,
				},
				boundaries: function(properties, zoom) {
					var style;
					switch (properties.kind_detail) {
						case 8:
							style = {
								weight: 100,
								fillColor: 'pink',
								color: 'pink',
								fillOpacity: FILL_OPACITY,
								opacity: OPACITY
							};
							break;
						default:
							style = {
								weight: 1,
								fillColor: 'pink',
								color: 'pink',
								fillOpacity: FILL_OPACITY,
								opacity: OPACITY
							};
							break;
					}
					return style;
				},
				waterway: {
					weight: 1,
					fillColor: '#2375e0',
					color: '#2375e0',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY
				},
				landcover: {
					fill: true,
					weight: 1,
					fillColor: '#53e033',
					color: '#53e033',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY,
				},
				landuse: {
					fill: true,
					weight: 1,
					fillColor: '#e5b404',
					color: '#e5b404',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY
				},
				park: {
					fill: true,
					weight: 1,
					fillColor: '#84ea5b',
					color: '#84ea5b',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY
				},
				boundary: {
					weight: 1,
					fillColor: '#c545d3',
					color: '#c545d3',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY
				},
				aeroway: {
					weight: 1,
					fillColor: '#51aeb5',
					color: '#51aeb5',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY
				},
				roads: function(properties, zoom) {
					var style;
					switch (properties.kind) {
						case "major_road":
							style = {
								weight: 1,
								fillColor: '#f2b648',
								color: '#f2b648',
								fillOpacity: FILL_OPACITY,
								opacity: OPACITY,
							};
							break;
						default:
							style = {
								weight: 1,
								fillColor: '#f2b648',
								color: '#f2b648',
								fillOpacity: FILL_OPACITY,
								opacity: OPACITY,
							};
							break;
					}
					return style;
				},
				tunnel: { // mapbox only
					weight: 0.5,
					fillColor: '#f2b648',
					color: '#f2b648',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY,
					// 					dashArray: [4, 4]
				},
				bridge: { // mapbox only
					weight: 0.5,
					fillColor: '#f2b648',
					color: '#f2b648',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY,
					// 					dashArray: [4, 4]
				},
				transportation: { // openmaptiles only
					weight: 0.5,
					fillColor: '#f2b648',
					color: '#f2b648',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY,
					// 					dashArray: [4, 4]
				},
				transit: { // mapzen only
					weight: 0.5,
					fillColor: '#f2b648',
					color: '#f2b648',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY,
					// 					dashArray: [4, 4]
				},
				building: {
					fill: true,
					weight: 1,
					fillColor: '#2b2b2b',
					color: '#2b2b2b',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY
				},
				water_name: {
					weight: 1,
					fillColor: '#022c5b',
					color: '#022c5b',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY
				},
				transportation_name: {
					weight: 1,
					fillColor: '#bc6b38',
					color: '#bc6b38',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY
				},
				place: {
					weight: 1,
					fillColor: '#f20e93',
					color: '#f20e93',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY
				},
				housenumber: {
					weight: 1,
					fillColor: '#ef4c8b',
					color: '#ef4c8b',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY
				},
				poi: {
					weight: 1,
					fillColor: '#3bb50a',
					color: '#3bb50a',
					fillOpacity: FILL_OPACITY,
					opacity: OPACITY
				},
				earth: [], //added by ac on 14/7/17 so that mouse over events can occur under this layer - this turns it off

				// Do not symbolize some stuff for mapbox
				country_label: [],
				marine_label: [],
				state_label: [],
				place_label: [],
				waterway_label: [],
				poi_label: [],
				road_label: [],
				housenum_label: [],


				// Do not symbolize some stuff for openmaptiles
				country_name: [],
				marine_name: [],
				state_name: [],
				place_name: [],
				waterway_name: [],
				poi_name: [],
				road_name: [],
				housenum_name: [],
			};
			var queryObject = ioQuery.queryToObject(win.doc.location.search.substring(1));
			// var geeServerUrl = (document.domain === "localhost") ? "http://localhost:8080" : "http://geeImageServer.appspot.com";
			var geeServerUrl = "http://geeImageServer.appspot.com";
			var digitialGlobeApiKey = "pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpbmJscnhhZTBudmp0cWx3MXI5bWt0djgifQ.9DibR63tG-LY6FvjDLhCXg";
			// var jrcLayer = L.tileLayer.wms(geeServerUrl + "/ogc", { // traditional WMS request with a default tile size of 250x250 pixels
			var osmlayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
				maxZoom: 18,
				id: 'blishten.pnnbdo98',
				accessToken: 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg'
			});
			var map = L.map('mapid', {
				layers: [],
				// center: [16.02, -3.54],//used for ages
				center: [16.5887, -14.8975], // Podor Senegal - seasonal flooding
				// center: [11.5265,-9.3102], // Siguiri Gold Mine in Guinea
				zoom: 12,
				loadingControl: true,
				fullscreenControl: true,
			});
			map.whenReady(function mapLoaded(e) {
				if (queryObject.lat !== undefined) {
					map.setView({
						lon: queryObject.lng,
						lat: queryObject.lat
					}, queryObject.zoom);
				}
			});
			var digitalGlobeLayer = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.nal0g75k/{z}/{x}/{y}.png?access_token=' + digitialGlobeApiKey, {
				minZoom: 1,
				maxZoom: 19,
				attribution: '(c) <a href="http://microsites.digitalglobe.com/interactive/basemap_vivid/">DigitalGlobe</a> , (c) OpenStreetMap, (c) Mapbox'
			});
			var transitions = new L.tileLayer("https://storage.googleapis.com/global-surface-water/maptiles/transitions/{z}/{x}/{y}.png", {
				format: "image/png",
				maxZoom: 13,
				errorTileUrl: "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
				attribution: "<a href='https://global-surface-water.appspot.com/'>© 2016 EC JRC/Google</a>"
			});
			//openmaptiles.org vector tiles
			var vectorTilesUrl = "https://free-{s}.tilehosting.com/data/v3/{z}/{x}/{y}.pbf.pict?key=UmmATPUongHdDmIicgs7"; //openmaps.org
			var vectorTilesUrl = "https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v7/{z}/{x}/{y}.mvt?access_token=pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg"; //mapbox
			var vectorTilesUrl = "https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.mvt?api_key=vector-tiles-VyYjZGS"; //mapzen
			// var vectorTilesUrl = "https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/tile/{z}/{x}/{y}.pbf"; //esri
			var openmaptilesVectorTileOptions = {
				rendererFactory: L.svg.tile,
				interactive: true,
				attribution: '<a href="https://openmaptiles.org/">&copy; esri</a>, <a href="http://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a> contributors',
				vectorTileLayerStyles: vectorTileStyling,
				subdomains: '0123',
				maxZoom: 14,
				getFeatureId: function(f) {
					return f.properties.class;
				}
			};
			//normal WMS layers from lrm-maps - reprojected on the fly from 4326 to 3857
			//		var africa_boundaries = L.tileLayer.wms("http://lrm-maps.jrc.ec.europa.eu/geoserver/acp/wms?", {
			//		    layers: 'acp:acp-africa-countries',
			//		    format: 'image/png',
			//		    transparent: true
			//		});
			//		var pais = L.tileLayer.wms("http://lrm-maps.jrc.ec.europa.eu/geoserver/pais/wms?", {
			//		    layers: 'pais:validated_segments',
			//		    format: 'image/png',
			//            styles: 'pais_class_1990',
			//		    transparent: true
			//		});
			L.control.scale().addTo(map);
			L.control.mousePosition().addTo(map);
			parser.parse().then(lang.hitch(this, function() {
				on(registry.byId("togglewaterlayer"), "change", function(value) {
					(value) ? map.addLayer(transitions): map.removeLayer(transitions);
				});
				on(registry.byId("togglebaselayer"), "change", function(value) {
					(value) ? map.addLayer(digitalGlobeLayer): map.removeLayer(digitalGlobeLayer);
				});
				on(registry.byId("toggleleafletlayer"), "change", function(value) {
					(value) ? map.addLayer(osmlayer): map.removeLayer(osmlayer);
				});
				//			map.addLayer(pais);
				var photoViewer = new PhotoViewer({
					map: map,
					providers: ["flickr"],
					tags: ["biopama"],
					text: "outdoor",
					photoSize: "thumbnail", //small
					accuracy: 4,
				}, "photos"); //tags are an array, e.g. tags: ["biopama"], text is a string, e.g. text: "landscape"
				photoViewer.startup();
				var imageryTimeSlider = new ImageryTimeSlider({
					leafletMap: map,
					// provider: "geeImagerServer",
					provider: "sentinelHub",
					hideToEdge: true
				}, "ImageryTimeSliderDiv");
				imageryTimeSlider.startup();
				var vectorGridLayer = L.vectorGrid.protobuf(vectorTilesUrl, openmaptilesVectorTileOptions).addTo(map);
				vectorGridLayer.popup = domConstruct.create("div", {
					id: "popup"
				}, win.body());
				vectorGridLayer.continuous = true;
				on(vectorGridLayer, "mouseover", lang.hitch(this, function(evt) {
					if (vectorGridLayer.continuous) {
						showPopup(evt);
					}
					else {

					}
				}));

				function showPopup(evt) {
					//show the callout
					vectorGridLayer.currentId = evt.layer.properties.id;
					// vectorGridLayer.setFeatureStyle(evt.layer.properties.class, {
					// 	stroke: "#ffffff",
					// 		fill: "#ffffff",
					// });
					//add the circle
					if (vectorGridLayer.circle) {
						vectorGridLayer.circle.remove();
						vectorGridLayer.polyline.remove();
					}
					vectorGridLayer.circle = L.circleMarker(evt.latlng, {
						radius: CALLOUT_CIRCLE_RADIUS,
						color: "white",
						weight: 1,
						fillOpacity: 0,
					});
					var p1 = evt.containerPoint;
					var linePoints = [
						[p1.x - CALLOUT_CIRCLE_RADIUS, p1.y],
						[p1.x - CALLOUT_CIRCLE_RADIUS - CALLOUT_LINE_LENGTH, p1.y],
						[p1.x - CALLOUT_CIRCLE_RADIUS - CALLOUT_LINE_LENGTH, p1.y - CALLOUT_LINE_LENGTH]
					];
					var latlngs = [];
					array.forEach(linePoints, function(point) {
						latlngs.push(map.containerPointToLatLng(point));
					});
					vectorGridLayer.circle.addTo(map);
					vectorGridLayer.polyline = L.polyline(latlngs, {
						color: 'white',
						weight: 1,
					}).addTo(map);
					//show the properties
					var text = "";
					var omitProps = ["sort_rank", "kind_detail", "id:right", "id:left", "source", "min_zoom", "id", "osm_relation", "area", "tier", "boundary"];
					for (var prop in evt.layer.properties) {
						if (omitProps.indexOf(prop) == -1) {
							if (evt.layer.properties[prop]) {
								text += "<div>" + evt.layer.properties[prop].substr(0, 1).toUpperCase() + evt.layer.properties[prop].substr(1) + "</div>";
							}
						}
					}
					html.set(dom.byId("popup"), text);
					domStyle.set(dom.byId("popup"), "left", (evt.originalEvent.clientX - CALLOUT_CIRCLE_RADIUS - CALLOUT_LINE_LENGTH - (domStyle.get(dom.byId("popup"), "width") / 2) - 20) + "px"); //20 for padding
					domStyle.set(dom.byId("popup"), "top", (evt.originalEvent.clientY - CALLOUT_LINE_LENGTH - domStyle.get(dom.byId("popup"), "height") - 22) + "px"); //20 for padding
				}
			}));
		});
	});

//photoSizes:
//medium 				 		500 maximum dimension
//small							240 maximum dimension
//thumbnail						100 maximum dimension
//square						60 x 60
//mini_square					32 x 32

//tags:
//these are passed on to the Flickr search API

//showLocatorLine: set to true to show a line to the location on a map
