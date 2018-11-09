'use strict';
(function() {
	angular.module('cyient.geography',
			[ 'cyient.progressbar', 'cyient.progressarc' ]).controller(
			'Geography', Geography);

	Geography.$inject = [ '$scope','$rootScope', '$http', '$location', '$cookies', '$log',
			'GeographyService', 'LoginService', 'SiteDetailsService' ];
	function Geography($scope,$rootScope, $http, $location, $cookies, $log,
			GeographyService, LoginService, SiteDetailsService) {
		// Map View Data
		$rootScope.currentState = "geography";
		$scope.mapviews = [
				{
					name : "OpenStreetMap",
					displayName : "Street View",
					url : "http://{s}.tile.osm.org/{z}/{x}/{y}.png"

				},
				{
					name : "WorldImagery",
					displayName : "Territory View",
					url : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

				} ];
		var viewMap = {};
		for (var i = 0; i < $scope.mapviews.length; i++) {
			viewMap[$scope.mapviews[i].name] = $scope.mapviews[i].url;
		}

		$scope.currentAsset = 'all';
		$scope.wData = {
			current : true,
			id : "all"
		};
		$scope.fpData = {
			list : [],
			displayName : "Frac Pump",
			name : "fracpump",
			id : "frac",
			total : 0,
			current : false,
			critical : 0
		};
		$scope.cwData = {
			list : [],
			displayName : "CatWalk",
			name : "catwalk",
			id : "rig",
			total : 0,
			current : false,
			critical : 0
		};

		$scope.getGeoData = function() {
			GeographyService.getGeoData().then(function(res) {
				$scope.geoData = res;
				processData();
			});
		}

		function processData() {
			$scope.geoData
					.forEach(function(asset) {
						if (asset.siteType == 'frac') {
							$scope.fpData.total = $scope.fpData.total
									+ (asset.assetsData[0].fracpump.totalAssets || 0);
							$scope.fpData.critical = $scope.fpData.critical
									+ (asset.assetsData[0].fracpump.critical || 0);
							$scope.fpData.list.push(asset);
						}
						if (asset.siteType == 'rig') {

							if (asset.assetsData[0].catwalk) {
								$scope.cwData.total = $scope.cwData.total
										+ (asset.assetsData[0].catwalk.totalAssets || 0);
								$scope.cwData.critical = $scope.cwData.critical
										+ (asset.assetsData[0].catwalk.critical || 0);
							}
							$scope.cwData.list.push(asset);

							// TODO: Remove this once the RUL is removed from
							// response...
							asset.dataToShowOnHover = asset.dataToShowOnHover
									.filter(function(elem) {
										return elem.name != "RUL";
									});
						}

					})
					|| [];
			initializeMap();
		}
		var mymap = null;

		$scope.changeLocation = function(loc) {
			$scope.currentAsset = loc.id;
			$scope.wData.current = false;
			$scope.cwData.current = false;
			$scope.fpData.current = false;
			loc.current = true;
			aType = loc.id;
			for ( var ind in markersList) {
				mymap.removeLayer(markersList[ind]);
			}
			markersList = {};
			initializeMap();
		}

		var markersList = {};
		var mymap = L.map('map').setView([ 37.0902, -95.7129 ], 5);
		var view = L
				.tileLayer(
						viewMap.OpenStreetMap,
						{
							attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
							noWrap : true
						});

		view.addTo(mymap);
		$(".view").on("change", function() {
			var val = $(this).val();
			view.setUrl(viewMap[val]);
		});
		var aType = "all";

		function initializeMap() {
			for (var i = 0; i < $scope.geoData.length; i++) {

				var obj = $scope.geoData[i];
				var template = '<div class="map-tooltip" id="geo-tooltip" ><div class="map-tooltip-section heading"><span>'
						+ obj.location
						+ ' </span><span class="map-tooltip-location"><svg><use xlink:href="#location"></use></svg></span></div><div class="map-tooltip-section"><div><div class="map-tt-heading">Name: <span class="map-tt-value">'
						+ obj.siteName + '</span></div></div></div>';

				for (var j = 0; j < obj.dataToShowOnHover.length; j++) {
					if (obj.dataToShowOnHover[j].name == "health"
							|| obj.dataToShowOnHover[j].name == "ROD"
							|| obj.dataToShowOnHover[j].name == "RUL") {
						var tval = obj.dataToShowOnHover[j].value.toFixed(2);
					} else if (obj.dataToShowOnHover[j].name == "operationaldate") {
						var date = new Date(obj.dataToShowOnHover[j].value);
						var tval = date.getDate() + "-" + date.getMonth() + "-"
								+ date.getFullYear();
					} else {
						var tval = obj.dataToShowOnHover[j].value;
					}

					template += '<div class="map-tooltip-section" ><div><span class="map-tt-heading">'
							+ obj.dataToShowOnHover[j].displayName
							+ ': </span><span class="map-tt-value">'
							+ tval
							+ '</span></div></div>';
				}
				template += '<span class="tip"></span><span class="tip-right"></span></div>';

				if (obj.category == 'Good') {
					var cIcon = L
							.divIcon({
								className : 'ship-div-icon',
								html : '<span style="fill:green"><svg><use xlink:href="#map-pin"></use></svg></span>',
								iconSize : [ 25, 60 ]
							});
				} else if (obj.category == 'Stable') {
					var cIcon = L
							.divIcon({
								className : 'ship-div-icon',
								html : '<span style="fill:orange"><svg><use xlink:href="#map-pin"></use></svg></span>',
								iconSize : [ 25, 60 ]
							});
				} else if (obj.category == 'Critical') {
					var cIcon = L
							.divIcon({
								className : 'ship-div-icon',
								html : '<span style="fill:red"><svg><use xlink:href="#map-pin"></use></svg></span>',
								iconSize : [ 25, 60 ]
							});
				}
				var opacity = 1;
				if (aType != "all") {
					if (aType != obj.siteType) {
						opacity = 0.5;
					}
				}
				var mid = guid();
				markersList[mid] = L.marker(
						[ obj.coordinates.x, obj.coordinates.y ], {
							icon : cIcon,
							// icon: L.BeautifyIcon.icon(options),
							draggable : true,
							opacity : opacity
						}).addTo(mymap).bindPopup(template).on('mouseover',
						function(e) {
							this.openPopup();
						}).on('mouseout', function(e) {
					this.closePopup();
				}).on("click", function(e) {
					var odata = e.target;
					$scope.navigateToAssetsList(odata.jdata);
				});
				markersList[mid].jdata = obj;
			}
		}

		$scope.navigateToAssetsList = function(siteData) {
			var paramObj = {};

			paramObj.assetGrpType = siteData.siteType;
			paramObj.assetGrpName = siteData.assetName;
			paramObj.assetGrpId = siteData.siteId;
			paramObj.navigateDirectly = true;
			$location.path("/assetgroupdetails").search(paramObj);
		}

		function guid() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16)
						.substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-'
					+ s4() + s4() + s4();
		}

		$scope.getGeoData();
	}
})();