'use strict';
(function () {
	angular.module('cyient.assetgroupdetails', ['cyient.progressbar', 'cyient.progressarc']).controller(
		'AssetGroupDetails', AssetGroupDetails);

	AssetGroupDetails.$inject = ['$rootScope', '$scope', '$http', '$location',
		'$cookies', '$log', '$window', 'LoginService', 'AllAssetsService',
		'AllSitesService'
	];

	function AssetGroupDetails($rootScope, $scope, $http, $location, $cookies,
		$log, $window, LoginService, AllAssetsService, AllSitesService) {
		$rootScope.currentState = "assetgroupdetails";
		var loginDataObjectLength = Object.keys(LoginService.getData()).length;
		var loginData = (loginDataObjectLength) ? LoginService.getData() :
			$cookies.getObject('loginData');

		if (!LoginService.isAuthenticated()) {
			$scope.currentState = "login";
			$location.path("/login").search({});
		}

		$scope.frackList = [];
		$scope.rigList = [];
		var params = $location.search();
		//TODO Remove
		
		if (params) {
			$scope.currentSiteType = params.assetGrpType;
			$scope.currentSiteGroup = params;
			var allAssetGrpsData = $window.localStorage.getItem('assetGroups') ||
				'[]';
			allAssetGrpsData = JSON.parse(allAssetGrpsData);
			if (allAssetGrpsData && allAssetGrpsData.length) {
				$scope.frackList = allAssetGrpsData.filter(function (truck) {
					return truck.assetGrpType == "frac";
				});
				$scope.rigList = allAssetGrpsData.filter(function (truck) {
					return truck.assetGrpType == "rig";
				});
			}
		}

		$scope.rigAvgData = [
			// {
			// name: "health",
			// displayName: "Avg. Health",
			// value: 0,
			// units: "percentage"
			// },
			{
				name: "ROD",
				displayName: "Avg. ROD",
				value: 0,
				units: "percentage"
			}
		]
		$scope.fracsiteData = [];
		$scope.getAssetList = function (id) {
			AllSitesService
				.getAssetGrp(id)
				.then(
					function (res) {
						$scope.fracsiteData = res;
						console.log($scope.fracsiteData);
						if ($scope.currentSiteGroup.assetGrpType) {
							$scope.rigAvgHealth = 0;
							$scope.rigAvgROD = 0;
							$scope.fracsiteData
								.forEach(function (ele) {
									$scope.rigAvgHealth += ele.assetsData[0].healthPercentage;
									if ($scope.currentSiteGroup.assetGrpType == 'rig') {
										ele.assetsData[0].metaData
											.forEach(function (
												elem) {
												if (elem.name == "ROD") {
													$scope.rigAvgROD += elem.value;
												}
											})
									}
									// TODO: Remove this once it is
									// available in API
									if ($scope.currentSiteGroup.assetGrpType == 'frac') {
										ele.assetGrpMetaData
											.forEach(function (
												elem) {
												if (elem.name == "ROD") {
													elem.displayName = "Avg. ROD";
													elem.units = "percentage";
												}
											})
									}

								});
							$scope.rigAvgROD = $scope.rigAvgROD /
								($scope.fracsiteData.length);
							$scope.rigAvgHealth = $scope.rigAvgHealth /
								($scope.fracsiteData.length);
							$scope.rigAvgData
								.forEach(function (element) {
									// if(element.name == 'health')
									// {
									// element.value =
									// $scope.rigAvgHealth;
									// }
									if (element.name == 'ROD') {
										element.value = $scope.rigAvgROD;
									}
								})
						}
					})
		}

		$scope.getAssetList(params.assetGrpId);
		// $scope.getFracsiteData = function (siteId) {
		// AllSitesService.getFracSite().then(function (response) {
		// $scope.fracsiteData = response[0];
		// })
		// }

		// if ($rootScope.currentSiteType == 'frac') {
		// $scope.getFracsiteData();
		// } else if ($rootScope.currentSiteType == 'rig') {
		// $scope.getRigList();
		// }

		// if (loginData) {
		// $scope.dashboard = {
		// "userId": loginData.userId,
		// "totalSites": loginData.totalSites,
		// "totalTrucks": loginData.totalTrucks,
		// "totalCritical": loginData.totalCritical,
		// "totalStable": loginData.totalStable,
		// "totalGood": loginData.totalGood,
		// "healthPercentAverage": null,
		// "sites": null,
		// "site": null,
		// "showDashboard": false,
		// };
		// $scope.trucksList = [];
		// getTruckList();
		// DashboardService.getSites($scope.dashboard.userId)
		// .then(function (response) {
		// $scope.dashboard.sites = {};
		// if (response.data.status === 'ERROR') {
		// return
		// } else {
		// $scope.dashboard.showDashboard = true;
		// var xdata = response.data.result;
		// // var xdata = [];
		// // for (var i = 0; i < data.length; i++) {
		// // xdata.push(JSON.parse(data[i]));
		// // }
		// $scope.dashboard.sites = xdata;
		// $scope.dashboard.site = _.head(xdata); // default
		// $cookies.putObject('siteData', xdata);
		// SiteDetailsService.setData(xdata);

		// $scope.dashboard.healthPercentAverage = _.meanBy(xdata,
		// 'healthPercentage');
		// }
		// });
		// $scope.dashboard.selectSite = function (siteId) {
		// $scope.dashboard.site = _.find($scope.dashboard.sites, function (o) {
		// return o.siteId === siteId; })
		// }
		// }

		$scope.gotoSiteDetails = function (category, truckId, assetType) {
			// var navigateDirectly = (truckId) ? true : false;
			var paramObj = {};

			if (category) {
				paramObj.category = category;
			}
			paramObj.siteId = $scope.fracsiteData[0].assetGrpId;
			paramObj.assetName = $scope.fracsiteData[0].assetGrpType;
			paramObj.assetLocation = $scope.fracsiteData[0].assetGrpName;
			if (truckId) {
				paramObj.truckId = truckId;
				paramObj.navigateDirectly = true;
			}
			$location.path("/assets").search(paramObj);
		};

		// $scope.gotoReports = function () {
		// $state.go("cyient.protected.repairs");
		// };
		// $scope.navigateToAssets = function () {
		// $state.go("cyient.protected.allassets");
		// }

		$scope.changeDropdown = function (data) {
			$scope.currentSiteGroup = data;
			$scope.fracsiteData = null;
			// if (data.assetGrpType == 'frac') {
			// $scope.getFracsiteData(data.assetGrpId);
			// } else if (data.assetGrpType == 'rig') {
			// $scope.getRigList();
			// }
			$scope.getAssetList(data.assetGrpId);
		}
		$scope.navigateBack = function () {
			$location.path("/").search({});
		}
		/* opens expanded view of truck details */
		$scope.openExpandedTruck = function (truckId, assetType) {
			// $scope.getSiteData(assetType).then(function (res) {
			// $cookies.putObject('siteData', res.data.result);
			// $scope.siteData = res.data.result;
			alert(assetType);
			if (assetType == "frac") {
				assetType = "fracpump";
			}
			$location.path('/assetdetails').search({
				truckId: truckId,
				assetType: assetType
			});
			angular.element('.scroll-body').css('display', 'none');
			// });
			// angular.element('.scroll-body').css('height', 'calc(100vh -
			// 250px)');
			// angular.element('.scroll-body').css('height', '-webkit-calc(100vh
			// - 250px)');
			// angular.element('.scroll-body').css('height', '-moz-calc(100vh -
			// 250px)');
			// angular.element('.scroll-body').css('height', '-ms-calc(100vh -
			// 250px)');
		};

		// $scope.getSiteData = function (siteId) {
		// // Used for side draw drop-down
		// return SiteDetailsService.getSiteData(siteId).then(function (res) {
		// return res;
		// })
		// // $cookies.putObject('siteData', $scope.siteData);
		// }
	}
})();