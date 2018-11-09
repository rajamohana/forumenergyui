'use strict';
(function(){
  angular.module('cyient.filters', [])
  /**
   * Set decimal
   */
   .filter('setDecimal', ['$filter', function ($filter) {
      return function (input, places) {
          if (isNaN(input)) {
            return input;
          }
          // If we want 1 decimal place, we want to mult/div by 10
          // If we want 2 decimal places, we want to mult/div by 100, etc
          // So use the following to create that factor
          var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
          input = Math.round(input * factor) / factor;
          if(input > 0){
            return input;
          } else {
            return null;
          }
      };
  }])
  /**
   * Convert all first characters in a sequence of words to uppercase
   */
  .filter('firstLetterUppercase', [function(){
    return function(str) {
      if(str){
        return str.replace(/\w\S*/g, function(txt){
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }
    };
  }])
  /**
   * Converts date to its string representation
   * E.g. 04/12/2014 will be converted to 4 Dec 2014
   */
  .filter('dateToString', ['$filter', function($filter){
    return function(input){
      if(input){
        var date = new Date(input.split("/").reverse().join("-"));
        var output = $filter('date')(date, 'd MMM yyyy'); // use predefined Date filter
        return output;
      }
    };
  }])
  .filter('round', [function(){
    return function(input) {
      return Math.round(input);
    };
  }])
  .filter('roundTo', [function(){
    return function(input, precision) {
      if (typeof input !== 'number') {
        return input;
      }
      return _.round(input, precision);
    };
  }])
  .filter('ceil', [function(){
    return function(input) {
      return Math.ceil(input);
    };
  }])
  .filter('floor', [function(){
    return function(input) {
      return Math.floor(input);
    };
  }])
  .filter('abs', [function(){
    return function(input) {
      return Math.abs(input);
    };
  }]);
})();

'use strict';
(function(){
  angular.module('cyient.assetService', [])
  .factory('AssetsFactory', AssetsFactory)
  .factory('AssetService', AssetService);

  AssetsFactory.$inject = ['$resource'];
  function AssetsFactory($resource) {
    return $resource('data/assets.json',{ }, {
      getData: {method:'GET', isArray: false}
    });
  }
  AssetService.$inject = ['$resource', 'AssetsFactory'];
  function AssetService($resource, AssetsFactory) {
    var assetServiceInstance = {};
    var imagesBaseUrl = 'assets/images/';
    var _this = this;
    AssetsFactory.getData(function(data){
      _this.data = data;
    });
    assetServiceInstance.getAssetPath = function(token){
      var path = '';
      var assets = _this.data;
      if(token) {
        for(var asset in assets) {
          if(asset === token) {
            path = assets[asset];
          }
        }
      }
      return imagesBaseUrl + path;
    }
    return assetServiceInstance;
  }

})();

'use strict';
(function() {
	var apiPath = "54.210.193.228";
	var insightsBasePath = "http://" + apiPath + ":34211/jobs?";
	var basePath = "http://" + apiPath + ":8081" + "/forumenergyweb";
	var basePath2 = basePath;// "http://"+apiPath +":3000";
	var tempBasePathRN = basePath;// "http://"+apiPath
	// +":3000/assets/asset/roughneck/";
	var tempBasePathCW = basePath;// "http://"+apiPath
	// +":3000/assets/asset/catwalk/";
	var baseParams = {
		appName : 'am102',
		context : 'sql-contex1',
		sync : true,
		timeout : 60
	};
	// Use in development mode only
	// Set default value 'false' in production mode.
	// Truth value indicates offline.
	var isOffline = false;
	// Offline API endpoints
	var staticPaths = {
		login : '/login',
		sites : '/api/sites',
		trucks : '/api/trucks?',
		truck : '/api/truck?',
		parametersData : '/api/params',
		insightsData : '/api/insights',
		whatIfDefaultData : '/api/whatifdefault',
		whatIfTweakData : '/api/whatif',
		whatIfLoadScenarios : '/api/whatif',
		whatIfSaveNewScenario : '/api/whatif`',
		forgotPassword : '/api/forgotPassword'
	};

	function getServerPath(path) {
		return basePath + serverPaths[path];
	}

	// function prepareHeaders() {
	// var loginToken="Bearer
	// eyJhbGciOiJSUzI1NiIsImtpZCI6IjBiNzQ5MWQ0YTJjODk4OTYzNjljY2Y5OThjZTVmNDM4IiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NDA4OTU4NDQsImV4cCI6MTU0MDg5NjQ0NCwiaXNzIjoiaHR0cHM6Ly9mZXRpZGVudGl0eWRldi5henVyZXdlYnNpdGVzLm5ldCIsImF1ZCI6WyJodHRwczovL2ZldGlkZW50aXR5ZGV2LmF6dXJld2Vic2l0ZXMubmV0L3Jlc291cmNlcyIsImFwaTEiXSwiY2xpZW50X2lkIjoianMiLCJzdWIiOiI0ZmI4M2UxYS1jYWU3LTRmMTMtYTlhYy0yZTAwYWJhYjVhMDciLCJhdXRoX3RpbWUiOjE1NDA4OTU4NDMsImlkcCI6ImxvY2FsIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsImFwaTEiXSwiYW1yIjpbInB3ZCJdfQ.lfCfYMwOwi7Iozo4TVdxRLnbKPR2Zuo_AK7xJW5yUX2fgQDdb9qUVI_HRe2-OYm6Fipmmu2rZzsSzQ30l3K9tXE-aifw3ulLng7dhyEHNUDgAh8P5v87Fr1W8kuHZn9e0R_FI5f1AIgVqiSwbZd58UVYooHSQEYCS08sE9v0utrGfXD8nVV4I26M9l5CLHqOxg0bqwWgJnzXk_VSfdNnwX2EUPV2uHqFrh2Sq4q4Y8bYJfHnnhT5YfqpYMdk3fqa1rff2DenLoUO68im7rob1JWn1VIP8H1E_681w2vcvZBO5aiRLW8q0BHldeqKftoQOlMriWUgglPBY_iY6hXiew";//$cookies.getObject("login-token");

	// var config = {
	// headers: {
	// 'Authorization': loginToken
	// }
	// };
	// return config;
	// }

	var serverPaths = {
		login : '/login',
		assetGroups : '/assetGroups/assetGroup',
		assetGroup : '/assetGroups/assetGroupdetailsUser/',
		assets : '/assets/assetsuser/',
		assetDetails : '/assets/assetDetails/',
		assetDetailsChart : '/assets/assetDetails/chartData/',
		geography : '/assetGroups/geographicData',
		secondsData : '/category/fracType?filter=5hrs',
		hoursData : '/category/fracType?filter=30days',
		whatIfScenarios : '/whatIfScenarios'
	};

	angular.module('cyient.urls', []).constant('Endpoints', {
		login : 'loginAM',
		sites : 'GetSitesDataAM',
		trucks : 'callfourAM3',
		truck : 'callTen',
		parametersData : 'GetParametersDataAM',
		insightsData : 'Variable_Payload',
		whatIfDefaultData : 'WhatIfFirstAM3',
		whatIfTweakData : 'WhatIfNext',
		whatIfLoadScenarios : 'scenarioLoadAM',
		whatIfSaveNewScenario : 'scenarioSaveAM2',
		forgotPassword : '/api/forgotPassword'
	});

	angular.module('cyient.backendservice', [ 'cyient.urls' ]).factory(
			'LoginService', LoginService).factory('DashboardService',
			DashboardService).factory('SiteDetailsService', SiteDetailsService)
			.factory('TruckDetailsService', TruckDetailsService).factory(
					'InsightsService', InsightsService).factory(
					'WhatIfScenarioService', WhatIfScenarioService).factory(
					'SocketAPIService', SocketAPIService).factory(
					'AllSitesService', AllSitesService).factory(
					'AllAssetsService', AllAssetsService).factory(
					'GeographyService', GeographyService);

	LoginService.$inject = [ '$q', '$http', '$log', '$httpParamSerializer',
			'Endpoints', '$cookies' ];
	function LoginService($q, $http, $log, $httpParamSerializer, Endpoints,
			$cookies) {
		var loginService = {}
		var loginData = {};
		baseParams["classPath"] = "";
		baseParams["classPath"] = "spark.jobserver" + "." + Endpoints.login;
		var urlString = (isOffline) ? (staticPaths.login)
				: getServerPath('login');
		var defer = null;

		// loginService.authenticated = true;

		loginService.isAuthenticated = function() {
			var loginToken = $cookies.getObject('login-token');
			return loginToken ? true : false;
		};

		loginService.getUserDetails = function(loginObj) {
			return $http.post(urlString, loginObj).then(function(response) {
				if (response.status == 200) {
					// loginService.authenticated = true;
					var resp = response.data;
					$cookies.putObject('login-token', resp['Authorization']);
					return resp;
				} else {
					// loginService.authenticated = false;
					Promise.reject(response);
				}
			}, function(err) {
				// loginService.authenticated = false;
				Promise.reject(err);
			});

			// $http.get("data/loginOutput.json").then(function(response) {
			// if(response.status !== "ERROR"){
			// loginService.authenticated = true;
			// defer.resolve(response);
			// } else {
			// loginService.authenticated = false;
			// return defer.reject(response);
			// }
			// });

			// return defer.promise;
		};
		loginService.setData = function(data) {
			loginData = data;
		};
		loginService.getData = function() {
			return loginData;
		};

		loginService.forgotPassword = function(username) {
			defer = $q.defer();
			$http.post(Endpoints.forgotPassword, {
				params : {
					username : username
				}
			}).then(function(response) {
				if (response.status !== 'ERROR') {
					defer.resolve(data);
				}
			}, function(error) {
				$log.warn("Forgot password. Try again ...");
			});
			return defer.promise;
		};
		return loginService;
	}

	DashboardService.$inject = [ '$q', '$http', '$log', '$httpParamSerializer',
			'Endpoints' ];
	function DashboardService($q, $http, $log, $httpParamSerializer, Endpoints) {
		var defer = $q.defer();
		baseParams["classPath"] = "";
		baseParams["classPath"] = "spark.jobserver" + "." + Endpoints.sites;
		var urlString = (isOffline) ? staticPaths.sites
				: (basePath + $httpParamSerializer(baseParams));
		return {
			getSites : function(userId) {
				var userData = {
					"userId" : userId
				};
				/*
				 * $http.post(urlString, userData).then(function(response){ if
				 * (response.status !== 'ERROR') { defer.resolve(response); } },
				 * function(error){ $log.warn("Cannot retrieve sites ..."); });
				 */
				$http.get("data/getsitesdataoutput.json").then(
						function(response) {
							if (response.status !== "ERROR") {
								defer.resolve(response);
							} else {
								return defer.reject(response);
							}
						});
				return defer.promise;
			}
		};
	}

	SiteDetailsService.$inject = [ '$q', '$http', '$log',
			'$httpParamSerializer', 'Endpoints' ];
	function SiteDetailsService($q, $http, $log, $httpParamSerializer,
			Endpoints) {
		var defer = null;
		var siteData = {};
		return {
			getAllTrucks : function(userId, siteId, category, filter, sort) {
				category = "All";
				baseParams["classPath"] = "spark.jobserver" + "."
						+ Endpoints.trucks;
				var payloadData = {
					"userId" : userId,
					"siteId" : siteId,
					"sort" : sort,
					"filter" : filter,
					"type" : category
				};
				var urlString = (isOffline) ? (staticPaths.trucks + $httpParamSerializer(payloadData))
						: (basePath + $httpParamSerializer(baseParams));
				defer = $q.defer();
				/*
				 * $http.post(urlString, payloadData).then(function(response){
				 * if (response.status !== 'ERROR') { defer.resolve(response); } },
				 * function(error){ $log.warn("Unable to load truck details
				 * ..."); });
				 */

				$http.get("data/gettrucksdataoutput-all2.json").then(
						function(response) {
							if (response.status !== "ERROR") {
								defer.resolve(response);
							} else {
								return defer.reject(response);
							}
						});
				return defer.promise;
			},

			getSiteData : function(userId, siteId) {
				var userData = {
					"userId" : userId,
					"siteId" : siteId
				};
				/*
				 * $http.post(urlString, userData).then(function(response){ if
				 * (response.status !== 'ERROR') { defer.resolve(response); } },
				 * function(error){ $log.warn("Cannot retrieve sites ..."); });
				 */
				return $http.get("data/getsitesdataoutput.json").then(
						function(response) {
							if (response.status !== "ERROR") {
								return response;
							} else {
								Promise.reject(response);
							}
						});
				// return defer.promise;
			},
			getParametersData : function(userId, siteId, truckNumber,
					parameterName) {
				baseParams["classPath"] = "spark.jobserver" + "."
						+ Endpoints.parametersData;
				var urlString = basePath + $httpParamSerializer(baseParams);
				var parameterData = {
					"userId" : userId,
					"siteId" : siteId,
					"truckNumber" : truckNumber,
					"paramName" : parameterName
				};
				defer = $q.defer();
				$http.post(urlString, parameterData).then(function(response) {
					if (response.status !== 'ERROR') {
						defer.resolve(response);
					}
				}, function(error) {
					$log.warn("Unable to retrieve parameter data ...");
				});
				return defer.promise;
			},
			setData : function(data) {
				siteData = data;
			},
			getData : function(siteID) {
				var lookupData = {};
				var len = Object.keys(siteData).length;
				if (len !== 0) {
					var lookupData = siteData.filter(function(obj) {
						return obj.siteId == siteID;
					});
				}
				return lookupData[0];
			},
			cancelRequest : function() {
				if (defer) {
					defer.resolve("Cancel request ...");
				}
			},
		};
	}

	TruckDetailsService.$inject = [ '$q', '$http', '$log',
			'$httpParamSerializer', 'Endpoints', '$cookies' ];
	function TruckDetailsService($q, $http, $log, $httpParamSerializer,
			Endpoints, $cookies) {
		var defer = null;
		baseParams["classPath"] = "";
		return {
			getTruck : function(truckId, assetType) {
				// baseParams["classPath"] = "spark.jobserver" + "." +
				// Endpoints.truck;
				// var payloadData = {
				// "userId": userId,
				// "siteId": siteId,
				// "truckNumber": truckId,
				// "binOrDate": 'Date' //for bins this should be 'Bin'
				// };
				// var urlString = (isOffline) ? (staticPaths.truck +
				// $httpParamSerializer(payloadData)) : (basePath +
				// $httpParamSerializer(baseParams));

				var loginToken = $cookies.getObject("login-token");
				var config = {
					headers : {
						'Authorization' : loginToken
					}
				};
				var urlString = (isOffline) ? (staticPaths.assetGroups)
						: getServerPath('assetDetails');
				
				urlString = urlString + truckId;

				var jsonType = "new-asset-details-cw.json";
				// defer = $q.defer();
				return $http.get(urlString, config).then(function(response) {
					if (response.status == 200) {
						if (response.data.result) {
							return response.data.result;
						}
						return response.data;
					} else {
						Promise.reject(response);
					}
				});

			},
			cancelRequest : function() {
				defer.resolve("Cancel request ...");
			},
			getChartData : function(truckId, assetType) {
				// baseParams["classPath"] = "spark.jobserver" + "." +
				// Endpoints.truck;
				// var urlString = (isOffline) ? (staticPaths.truck +
				// $httpParamSerializer(payloadData)) : (basePath +
				// $httpParamSerializer(baseParams));
				// defer = $q.defer();
				/*
				 * $http.post(urlString, payloadData).then(function(response){
				 * if (response.status !== 'ERROR') { defer.resolve(response); } },
				 * function(error){ $log.warn("Unable to load truck details
				 * ..."); });
				 */

				var loginToken = $cookies.getObject("login-token");
				var config = {
					headers : {
						'Authorization' : loginToken
					}
				};
				var urlString = (isOffline) ? (staticPaths.assetGroups)
						: getServerPath('assetDetailsChart');
				urlString = urlString + truckId;
				return $http.get(urlString, config).then(function(response) {
					if (response.status == 200) {
						return response.data;
					} else {
						Promise.reject(response);
					}
				});
			},

			// getCategories: function (truckId) {

			// var loginToken="Bearer
			// eyJhbGciOiJSUzI1NiIsImtpZCI6IjBiNzQ5MWQ0YTJjODk4OTYzNjljY2Y5OThjZTVmNDM4IiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NDA4OTU4NDQsImV4cCI6MTU0MDg5NjQ0NCwiaXNzIjoiaHR0cHM6Ly9mZXRpZGVudGl0eWRldi5henVyZXdlYnNpdGVzLm5ldCIsImF1ZCI6WyJodHRwczovL2ZldGlkZW50aXR5ZGV2LmF6dXJld2Vic2l0ZXMubmV0L3Jlc291cmNlcyIsImFwaTEiXSwiY2xpZW50X2lkIjoianMiLCJzdWIiOiI0ZmI4M2UxYS1jYWU3LTRmMTMtYTlhYy0yZTAwYWJhYjVhMDciLCJhdXRoX3RpbWUiOjE1NDA4OTU4NDMsImlkcCI6ImxvY2FsIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsImFwaTEiXSwiYW1yIjpbInB3ZCJdfQ.lfCfYMwOwi7Iozo4TVdxRLnbKPR2Zuo_AK7xJW5yUX2fgQDdb9qUVI_HRe2-OYm6Fipmmu2rZzsSzQ30l3K9tXE-aifw3ulLng7dhyEHNUDgAh8P5v87Fr1W8kuHZn9e0R_FI5f1AIgVqiSwbZd58UVYooHSQEYCS08sE9v0utrGfXD8nVV4I26M9l5CLHqOxg0bqwWgJnzXk_VSfdNnwX2EUPV2uHqFrh2Sq4q4Y8bYJfHnnhT5YfqpYMdk3fqa1rff2DenLoUO68im7rob1JWn1VIP8H1E_681w2vcvZBO5aiRLW8q0BHldeqKftoQOlMriWUgglPBY_iY6hXiew";//$cookies.getObject("login-token");
			// var config = {
			// headers: {
			// 'Authorization': loginToken
			// }
			// };
			// var urlString = (isOffline) ? (staticPaths.assetGroups) :
			// getServerPath('categories');
			// urlString = urlString + truckId;

			// return $http.get(urlString, config).then(function (response) {
			// if (response.status !== "ERROR") {
			// return respons.data;
			// } else {
			// Promise.reject(response);
			// }
			// });
			// }
			getCategories : function(type) {
				var jsonname;
				if (type == 'catwalk') {
					jsonname = "data/categories-catwalk.json";
				} else {
					jsonname = "data/categories-fracpump.json";
				}
				return $http.get(jsonname).then(function(response) {
					if (response.status !== "ERROR") {
						return response;
					} else {
						Promise.reject(response);
					}
				});
			}
		}
	}

	InsightsService.$inject = [ '$q', '$http', '$httpParamSerializer',
			'Endpoints', '$cookies' ];
	function InsightsService($q, $http, $httpParamSerializer, Endpoints,
			$cookies) {
		return {
			getData : function(userId, siteId, assetId, categoryId, assetType,
					sensorNames) {
				// baseParams["classPath"] = "spark.jobserver" + "." +
				// Endpoints.insightsData;
				// var urlString = insightsBasePath +
				// $httpParamSerializer(baseParams);
				var loginToken = $cookies.getObject("login-token");
				var config = {
					headers : {
						'Authorization' : loginToken
					}
				};
				var urlString = (isOffline) ? (staticPaths.assetGroups)
						: getServerPath('secondsData');
				var parameterData = {
					"userId" : userId,
					"siteId" : siteId,
					"assetId" : assetId,
					"assetType" : assetType,
					"categoryId" : categoryId,
					"sensorNames" : sensorNames
				};
				
				//TODO Remove
				parameterData.sensorNames=["inletTemp", "outletTemp"];
				var defer = $q.defer();
				$http.post(urlString, parameterData, config).then(
						function(response) {
							if (response.status !== 'ERROR') {
								var parsedData = response.data.map(function(d) {
									return d;
								});
								defer.resolve(parsedData);
							}
						}, function(error) {
							defer.reject("ERROR");
						});
				return defer.promise;
			},

			getDaysData : function(userId, siteId, assetId, assetType,
					categoryId, sensorNames) {
				var loginToken = $cookies.getObject("login-token");
				var config = {
					headers : {
						'Authorization' : loginToken
					}
				};
				var urlString = (isOffline) ? (staticPaths.assetGroups)
						: getServerPath('hoursData');
				var parameterData = {
					"userId" : userId,
					"siteId" : siteId,
					"assetId" : assetId,
					"assetType" : assetType,
					"categoryId" : categoryId,
					"sensorNames" : sensorNames
				};
				var defer = $q.defer();
				// $http.get("data/hoursData.json").then(function (response) {
				$http.post(urlString, parameterData, config).then(
						function(response) {
							if (response.status !== 'ERROR') {
								var parsedData = response.data.map(function(d) {
									return d;
								});
								defer.resolve(parsedData);
							}
						}, function(error) {
							defer.reject("ERROR");
						});
				return defer.promise;
			}

		}

	}

	WhatIfScenarioService.$inject = [ '$q', '$http', '$log',
			'$httpParamSerializer', 'Endpoints', '$timeout', '$cookies' ];
	function WhatIfScenarioService($q, $http, $log, $httpParamSerializer,
			Endpoints, $timeout, $cookies) {
		return {
			getDefaultData : function(truckNumber) {
				var loginToken = $cookies.getObject("login-token");
				var config = {
					headers : {
						'Authorization' : loginToken
					}
				};
				var urlString = (isOffline) ? (staticPaths.assetGroups)
						: basePath2 + serverPaths['whatIfScenarios'];

				urlString = urlString + "/" + truckNumber;

				var defer = $q.defer();
				$http.get(urlString).then(function(response) {
					var parsedData = response.data;
					defer.resolve(parsedData);
				}, function(error) {
					$log.warn("Unable to retrieve data ...");
				})
				return defer.promise;
			},
			tweakParameter : function(userId, siteId, truckNumber,
					allParameters) {
				baseParams["classPath"] = "spark.jobserver" + "."
						+ Endpoints.whatIfTweakData;
				var urlString = basePath + $httpParamSerializer(baseParams);
				var parameterData = {
					"userId" : userId,
					"siteId" : siteId,
					"truckNumber" : truckNumber,
					"payload" : allParameters.payload,
					"fuelConsumption" : allParameters.fuelConsumption,
					"gearShiftCount" : allParameters.gearShiftCount,
					"binOrDate" : 'Date' // for bins this should be 'Bin'
				};
				var defer = $q.defer();
				$http.post(urlString, parameterData).then(function(response) {
					if (response.status !== 'ERROR') {
						var parsedData = JSON.parse(response.data.result[0]);
						defer.resolve(parsedData);
					}
				}, function(error) {
					$log.warn("Unable to retrieve data ...");
				});
				return defer.promise;
			},
			loadScenarios : function(userId, siteId, truckNumber) {
				// baseParams["classPath"] = "spark.jobserver" + "." +
				// Endpoints.whatIfLoadScenarios;
				// var urlString = basePath + $httpParamSerializer(baseParams);
				// var parameterData = {
				// "userId" : userId,
				// "siteId" : siteId,
				// "truckNumber": truckNumber
				// };
				var defer = $q.defer();
				$http.get("data/whatif-second.json").then(
						function(response) {
							if (response.status !== 'ERROR') {
								var parsedData = response.data.result
										.map(function(scenario) {
											return scenario;
										})
								defer.resolve(parsedData);
							}
						}, function(error) {
							$log.warn("Unable to retrieve data ...");
						});
				return defer.promise;
			},
			saveNewScenario : function(userId, siteId, truckNumber,
					scenarioName, params) {
				baseParams["classPath"] = "spark.jobserver" + "."
						+ Endpoints.whatIfSaveNewScenario;
				var urlString = basePath + $httpParamSerializer(baseParams);
				var parameterData = {
					"scenarioName" : scenarioName,
					"userId" : userId,
					"siteId" : siteId,
					"truckNumber" : truckNumber,
					"payload" : params.payload,
					"fuelConsumption" : params.fuelConsumption,
					"gearShiftCount" : params.gearShiftCount
				};
				var defer = $q.defer();
				$http.post(urlString, parameterData).then(function(response) {
					if (response.status !== 'ERROR') {
						var status = JSON.parse(response.data.result).status
						defer.resolve(response)
					}
				}, function(error) {
					$log.warn("Unable to save scenario ...");
				});
				return defer.promise;
			}
		};
	}

	// Socket-api service to handle web-socket calls.
	SocketAPIService.$inject = [];
	function SocketAPIService() {
		var onmessageDefer;
		var socket = {
			ws : new WebSocket('ws://' + apiPath + ':8089'),
			send : function(data) {
				data = JSON.stringify(data);
				socket.ws.send(data);
			},
			onmessage : function(callback) {
				socket.ws.onmessage = callback;
			}
		};
		socket.ws.onopen = function(event) {
			// Connection established...
		};
		socket.ws.onerror = function(event) {
			setTimeout(function() {
				socket.ws = new WebSocket('ws://apiPath:8089');
			}, 1000);
		};
		socket.ws.onclose = function(event) {
			setTimeout(function() {
				socket.ws = new WebSocket('ws://apiPath:8089');
			}, 1000);
		};
		return socket;
	}

	AllSitesService.$inject = [ '$q', '$http', '$log', '$httpParamSerializer',
			'Endpoints', '$cookies' ];
	function AllSitesService($q, $http, $log, $httpParamSerializer, Endpoints,
			$cookies) {
		var defer = $q.defer();
		baseParams["classPath"] = "";
		baseParams["classPath"] = "spark.jobserver" + "." + Endpoints.sites;
		var urlString = (isOffline) ? staticPaths.sites
				: (basePath + $httpParamSerializer(baseParams));
		return {
			getSites : function() {
				var loginToken = $cookies.getObject("login-token");
				var loginData = $cookies.getObject("loginData");
				var config = {
					headers : {
						'Authorization' : loginToken,
						'userId' : loginData.userId
					}
				};
				var urlString = (isOffline) ? (staticPaths.assetGroups)
						: getServerPath('assetGroups');

				return $http.get(urlString, config).then(function(response) {
					if (response.status == 200) {
						// defer.resolve(response);
						return response.data;
					}
				}, function(error) {
					$log.warn("Cannot retrieve sites ...");
				});
				// $http.get("data/getallsites.json").then(function (response) {
				// if (response.status !== "ERROR") {
				// defer.resolve(response);
				// } else {
				// return defer.reject(response);
				// }
				// });
				// return defer.promise;
			},
			getAssetGrp : function(id) {
				/*
				 * $http.post(urlString, userData).then(function(response){ if
				 * (response.status !== 'ERROR') { defer.resolve(response); } },
				 * function(error){ $log.warn("Cannot retrieve sites ..."); });
				 */
				var loginToken = $cookies.getObject("login-token");
				var config = {
					headers : {
						'Authorization' : loginToken
					}
				};
				var urlString = (isOffline) ? (staticPaths.assetGroups)
						: getServerPath('assetGroup');
				urlString = urlString + id;

				return $http.get(urlString, config).then(function(response) {
					if (response.status == 200) {						
						return response.data;
					} else {
						Promise.reject(response);
					}
				});
			},
			getFracSite : function() {
				var loginToken = $cookies.getObject("login-token");
				var config = {
					headers : {
						'Authorization' : loginToken
					}
				};
				var urlString = (isOffline) ? (staticPaths.assetGroups)
						: getServerPath('assetGroup');

				return $http.get(urlString, config).then(function(response) {
					if (response.status == 200) {
						return response.data;
					} else {
						Promise.reject(response);
					}
				});
			}

		};
	}

	AllAssetsService.$inject = [ '$q', '$http', '$log', '$httpParamSerializer',
			'Endpoints', '$cookies' ];
	function AllAssetsService($q, $http, $log, $httpParamSerializer, Endpoints,
			$cookies) {
		var defer = $q.defer();
		baseParams["classPath"] = "";
		baseParams["classPath"] = "spark.jobserver" + "." + Endpoints.sites;
		var urlString = (isOffline) ? staticPaths.sites
				: (basePath + $httpParamSerializer(baseParams));
		return {
			getSites : function(postObj) {
				var loginToken = $cookies.getObject("login-token");
				var loginData = $cookies.getObject("loginData");
				var config = {
					headers : {
						'Authorization' : loginToken,
						'userId' : loginData.userId
					}
				};
				var urlString = (isOffline) ? (staticPaths.assetGroups)
						: getServerPath('assets');

				/*
				 * $http.post(urlString, userData).then(function(response){ if
				 * (response.status !== 'ERROR') { defer.resolve(response); } },
				 * function(error){ $log.warn("Cannot retrieve sites ..."); });
				 */
				return $http.get(urlString, config).then(function(response) {
					if (response.status == 200) {
						return response.data;
					} else {
						Promise.reject(response);
					}
				});
			}
		};
	}

	GeographyService.$inject = [ '$q', '$http', '$log', '$cookies' ];
	function GeographyService($q, $http, $log, $cookies) {
		var obj = {};

		obj.getGeoData = function() {

			var loginToken = $cookies.getObject("login-token");
			var loginData = $cookies.getObject("loginData");
			var config = {
				headers : {
					'Authorization' : loginToken,
					'userId' : loginData.userId
				}
			};
			var urlString = (isOffline) ? (staticPaths.assetGroups)
					: getServerPath('geography');

			return $http.get(urlString, config).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					Promise.reject(response);
				}
			});
		}

		return obj;
	}

})();

'use strict';
angular.module('cyient.areachart', [])
.directive('areaChart', ['$window', '$log', function($window, $log) {
    return {
        scope: {
            compressedMode: '=',
            tripVals: "=",
            xlabel: "=",
            ylabel: "=",
            bandMin: "=",
            bandMax: "=",
            height: "@"
        },
        restrict: "AE",
        templateUrl: "directives/areaChart/areachart.html",
        link: function(scope, elem, attrs) {

            var container = elem[0];

            scope.$watch("tripVals", function(newVal, oldVal) {
                render();
            }, true);

            angular.element($window).bind('resize', function() {
                if ($window.innerWidth >= 1024) {
                    render();
                    scope.$digest();
                }
            });

            function render() {

                if (!scope.tripAvgVals && !scope.siteAvgVals && !scope.tripVals) {
                    return;
                }

                d3.select(container).select("svg").text("");

                // Storing key names in variables makes them changing
                // easy later.
                // var tripsAvgXKey = 'xValue', tripsAvgYKey = 'yValue';
                var siteAvgXKey  = 'xValue', siteAvgYKey  = 'yValue';
                // var tripsXKey    = 'xValue', tripsYKey    = 'yValue';

                var containerWidth;
                var barMaxWidth = 10;
                /*
                 * Multiple area-charts in the same page are having same clip ID.
                 * So, prevent the clash by generating it randomly.
                 */
                var clipId = "area-clip-" + _.random(0, 10000);

                // Hacky way of calcuating the width.
                // Find a way to remove the hardcoded number '200'
                if (scope.compressedMode) {
                    containerWidth = $(elem).width() - 250;
                } else {
                    containerWidth = $(elem).width() - 200;
                }

                var margin  = {top: 10, right: 10, bottom: 150, left: 55},
                    margin2 = {top: 180, right: 10, bottom: 20, left: 55},
                    width   = containerWidth + 100,
                    height  = 300 - margin.top - margin.bottom,
                    height2 = 300 - margin2.top - margin2.bottom;

                if (!scope.compressedMode) {
                    height  = height - 10;
                    height2 = height2 - 10;
                }

                if (!scope.compressedMode) {
                	margin2.top += 30;
                	height += 50;
                }

                

                var x  = d3.scale.linear().range([0, width]),
                    x2 = d3.scale.linear().range([0, width]),
                    y  = d3.scale.linear().range([height, 0]),
                    y2 = d3.scale.linear().range([height2, 0]);

                var count = 5;

                if(scope.compressedMode){
                    var xAxis  = d3.svg.axis()
                                .scale(x).orient("bottom").outerTickSize(0)
                                .ticks(5)
                                .tickFormat(function(){
                                    count = count - 1;
                                    return count+"hrs";
                                })
                               
                }  else{
                    var xAxis  = d3.svg.axis()
                                .scale(x).orient("bottom").outerTickSize(0)
                                .ticks(0)
                } 
                
                var xAxisCount = 31;
                var xAxis2 = d3.svg.axis()
                            .scale(x2).orient("bottom").outerTickSize(0)
                            .ticks(30)
                            .tickFormat(function(d) { 
                                xAxisCount = xAxisCount - 1;
                                return xAxisCount;
                            })
                            
                var yAxis  = d3.svg.axis().scale(y).orient("left").outerTickSize(0)
                                    .ticks(scope.compressedMode ? 5 : 6)
                                    .tickFormat(function(d){
                                        var num = d;
                                        if (num >= 1000000000) {
                                            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
                                         }
                                         if (num >= 1000000) {
                                            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
                                         }
                                         if (num >= 1000) {
                                            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
                                         }
                                         return num;
                                    })
                
                var brush = d3.svg.brush()
                    .x(x2)
                    .on("brush", brushed)
                    .extent([0.95, 0.05]);

                // define line
                // var line = d3.svg.line()
                //         .interpolate("monotone")
                //         .x(function(d) { return x(d[siteAvgXKey]) })
                //         .y(function(d) { return y(d[siteAvgYKey])    });

                var line2 = d3.svg.line()
                  .interpolate("monotone")
                  .x(function(d) { return x2(d[siteAvgXKey]) })
                  .y(function(d) { return y2(d[siteAvgYKey]) });


                var svg = d3.select(container).select("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                    svg.append("defs")
                    .append("clipPath")
                        .attr("id", clipId)
                      .append("rect")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", width)
                        .attr("height", height);

                var focus = svg.append("g")
                    .attr("class", "focus-cnt")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var focusGraphs = focus.append("g")
                    .attr("class", "focus-graphs-cnt")
                    .attr( "clip-path", "url(#" + clipId + ")" );

                var context = svg.append("g")
                    .attr("class", "context-cnt")
                    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

                if(scope.compressedMode){
                    var labelx = scope.xlabel+" (last 5 hrs)";
                    var xAxisLabel = focus.append("text")
                        .attr("class", "label-text")
                        .style("text-anchor", "middle")
                        .text(labelx)
                        .attr("transform", function() {
                            var trWidth  = width / 2;
                            var trHeight = scope.compressedMode ? (height + 27) : (height + 65);
                            return "translate(" + trWidth + "," + trHeight + ")";
                        });
                } else{
                    var labelx = scope.xlabel+" (last 30 days)";
                    var xAxisLabel = focus.append("text")
                        .attr("class", "label-text")
                        .style("text-anchor", "middle")
                        .text(labelx)
                        .attr("transform", function() {
                            var trWidth  = width / 2;
                            var trHeight = scope.compressedMode ? (height + 27) : (height + 145);
                            return "translate(" + trWidth + "," + trHeight + ")";
                        });
                }
                

                var yAxisLabel = svg.append("text")
                    .attr("class", "label-text")
                    .attr("dy", "3em")
                    .style("text-anchor", "middle")
                    .text(scope.ylabel)
                    .attr("transform", function () {
                        var trWidth  = scope.compressedMode ? -20 : -30;
                        var trHeight = height / 2;
                        var rAngle   = -90;
                        return "translate(" + trWidth + "," + trHeight + ")"
                                + "rotate(" + rAngle + ")";
                    });

               
                x.domain(d3.extent(
                    [].concat(
                        scope.tripVals.map(function(d) { 
                            return d[siteAvgXKey]; 
                        })
                    )
                ));

                y.domain([0, d3.max(
                    [].concat(
                        scope.tripVals.map(function(d) { return d[siteAvgYKey] }),
                        [scope.bandMax]
                    )
                )]); // +5 to prevent points getting cut
                x2.domain(x.domain());
                y2.domain(y.domain());

                var tripsGroup = focusGraphs.append("g")
                    .attr("class", "trips-grp");
                
                // define line
                var avgLine = d3.svg.line()
                    .interpolate("monotone")
                    .x(function(d) { return x(d[siteAvgXKey]) })
                    .y(function(d) { return y(d[siteAvgYKey]) });

                var siteAvgLine = tripsGroup.append("path")
                    .datum(scope.tripVals)
                    .attr("class", "site-avg-line")
                    .attr("d", avgLine)
                    .attr("fill", "#4bb3ba")

                var totalLength = siteAvgLine.node().getTotalLength();
                var dashing = "2, 2";
                // var dashLength = dashing
                //     .split(/[\s,]/)
                //     .map(function (a) { return parseFloat(a) || 0 })
                //     .reduce(function (a, b) { return a + b });

                // //How many of these dash patterns will fit inside the entire path?
                // var dashCount = Math.ceil( totalLength / dashLength );

                // //Create an array that holds the pattern as often so it will fill the entire path
                // var newDashes = new Array(dashCount).join( dashing + " " );
                // //Then add one more dash pattern, namely with a visible part of length 0 (so nothing) and a white part
                // //that is the same length as the entire path
                // var dashArray = newDashes + " 0, " + totalLength;

                // siteAvgLine
                //     .attr("stroke-dashoffset", totalLength)
                //         .attr("stroke-dasharray", dashArray)	//This is where it differs with the solid line example
                //         .transition().duration(2000).ease("linear")
                //         .attr("stroke-dashoffset", 0);

                             
                focusGraphs.append("g")
                    .selectAll("circle")
                    .data(scope.tripVals)
                    .enter().append("circle")
                    .attr("class", "trip-circles")
                    .attr("r", 3.5)
                    .attr("cx", function(d) { return x(d[siteAvgXKey])})
                    .attr("cy", function(d) {return y(d[siteAvgYKey])})
                    .on("mouseover", function(d) {
                        var xVal = d[siteAvgXKey];
                        showHoverNodes(xVal);
                        scope.$apply();
                    })
                    .on("mouseout", function(d) {
                        hideHoverNodes();
                        scope.$apply();
                    })

                focus.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .attr("y", 9)
                    .attr("x", 1)
                   
                focus.append("g")   
                    .attr("class", "y axis")
                    .call(yAxis);

                context.append("path")
                    .datum(scope.tripVals)
                    .attr("class", "mini-arc")
                    .attr("d", line2);
                
                    
                context.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height2 + ")")
                    .call(xAxis2);

                var brushg = context.append("g")
                    .attr("class", "x brush")
                    .call(brush)

                brushg.selectAll("rect")
                    .attr("y", -6)
                    .attr("height", height2 + 7)


                // Not working. Disabled temporarily
                // brushed();

                addHandles();
                addTransparentRects();

                function addTransparentRects() {

                    var lRect = brushg.insert("rect", ":first-child")
                        .attr("class", "brush-lbgc")
                        .attr("x",  0)
                        .attr("y", -4)
                        .attr("width", 0.05 * width)
                        .attr("height", height2 + 4)

                    var rRect = brushg.insert("rect", ":first-child")
                        .attr("class", "brush-rbgc")
                        .attr("x",  0.95 * width)
                        .attr("y", -4)
                        .attr("width", 0.05 * width)
                        .attr("height", height2 + 4)

                }

                function brushed() {

                    x.domain(brush.empty() ? x2.domain() : brush.extent());

                    var extent = brush.extent();

                    // x.domain(brush.empty() ? x2.domain() : brush.extent());
                    tripsGroup.selectAll(".site-avg-line").attr("d",  avgLine);
                    focus.select(".x.axis").call(xAxis);

                    var lRect = brushg.select(".brush-lbgc")
                        .attr("width", x2(extent[0]))

                    var rRect = brushg.select(".brush-rbgc")
                        .attr("x", x2(extent[1]))
                        .attr("width", width - x2(extent[1]))

                }


                function addHandles() {

                   brushg.selectAll(".resize").append("line")
                        .attr("x1", 0)
                        .attr("y1", -4) // 0 isn't working. Find out why later
                        .attr("x2", 0)
                        .attr("y2", height2)
                        .attr("stroke", "#3A4555")
                        .attr("stroke-width", 1)
                        .attr("fill", "#3A4555")

                    // Handle width & Handle height
                    var hW = 8, hH = 22;

                    brushg.selectAll(".resize").append("rect")
                        .attr("x", -hW / 2)
                        .attr("y", 0)
                        .attr("rx", hW / 2)
                        .attr("ry", hW / 2)
                        .attr("width", hW)
                        .attr("height", hH)
                        .attr("transform", "translate(0," +  (height2 / 2 - hH / 2) + ")")
                        .attr("stroke", "#fff")
                        .attr("stroke-width", 1)
                        .attr("fill", "#3A4555")

                }

                var hoverLine = focusGraphs.append("line")
                    .attr("class", "hover-line")
                    .style("stroke", "black")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", height)
                    .classed("hide-node", true);
               
                var siteAvgHoverCircle = focusGraphs.append("circle")
                    .attr("class", "siteavg-circles-hover")
                    .attr("r", 3.5)
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .classed("hide-node", true);

                function showHoverNodes(xVal) {
                    scope.xVal = xVal;

                    scope.siteAvgY = _.find(scope.tripVals, function(obj) {
                         return obj[siteAvgXKey] === xVal;
                    })[siteAvgYKey];

                    scope.siteAvgY = parseFloat(scope.siteAvgY).toFixed(2);
                    
                   if(scope.old != scope.siteAvgY){
                        hoverLine.attr("transform", "translate(" + x(xVal) + ",0)");
                        siteAvgHoverCircle.attr("transform", "translate(" + x(xVal) + ", " + y(scope.siteAvgY) + ")");

                        var hideHoveLine = (!scope.showTripsAvg && !scope.showSiteAvg && !scope.showTrips) || false;
                        var hideSiteAvgHoverLine = !scope.showTrips || false;

                        hoverLine.classed("hide-node", hideHoveLine);
                        siteAvgHoverCircle.classed("hide-node", hideSiteAvgHoverLine);

                        scope.old = scope.siteAvgY;
                   }
                   

                }
                function hideHoverNodes() {
                    hoverLine.classed("hide-node", true);
                    // tripAvgHoverCircle.classed("hide-node", true);
                    siteAvgHoverCircle.classed("hide-node", true);
                    
                    scope.xVal     = null;
                    scope.tripAvgY = null;
                    scope.tripY    = null;
                    scope.siteAvgY = null;
                }

                // Checkbox variables
                scope.showTripsAvg = true;
                scope.showTrips = true;
                scope.showOptimalValue = true;
                scope.showSiteAvg = true;

                // Click Handlers
                scope.toggleTripsAvgGraph = function() {
                    if (scope.showTripsAvg) {
                        d3.select(container).select('.trips-avg-line').classed("hide-node", false);
                    } else {
                        d3.select(container).select('.trips-avg-line').classed("hide-node", true);
                        d3.select(container).select('.tripavg-circles-hover').classed("hide-node", true);
                    }
                };
                scope.toggleTripsGraph = function() {
                    if (scope.showTrips) {
                        d3.select(container).select('.trips-grp').classed("hide-node", false);
                    } else {
                        d3.select(container).select('.trips-grp').classed("hide-node", true);
                    }
                };
                scope.toggleOptimalValueGraph = function() {
                    // if (scope.showOptimalValue) {
                    //     d3.select(container).select('.band-rect').classed("hide-node", false);
                    // } else {
                    //     d3.select(container).select('.band-rect').classed("hide-node", true);
                    // }
                };
                scope.toggleSiteAvgGraph = function() {
                    if (scope.showSiteAvg) {
                        d3.select(container).select('.site-avg-line').classed("hide-node", false);
                    } else {
                        d3.select(container).select('.site-avg-line').classed("hide-node", true);
                        d3.select(container).select('.siteavg-circles-hover').classed("hide-node", true);
                    }
                };

                // Default display variables at the top of the graph
                // scope.xVal     = scope.tripAvgVals[0][tripsAvgXKey];
                // scope.tripAvgY = scope.tripAvgVals[0][tripsAvgYKey];
                // scope.siteAvgY = scope.tripAvgVals[0][siteAvgYKey];
                // scope.tripY    = scope.tripAvgVals[0][tripsYKey];

            } // End of render function
        } // End of link function
    }; // End of return object

}]);

'use strict';
angular.module('cyient.barcharthoriz', [])
.directive('barChartHoriz', ['$sce', function($sce) {
    return {
        scope: {
            data: "="
        },
        restrict: "AE",
        templateUrl: 'directives/barChartHoriz/barcharthoriz.html',
        link: function(scope, elem, attrs) {

            scope.sumVal = _.sumBy(scope.data, 'val')

            scope.renderHTML = function(str) {
                return $sce.trustAsHtml(str);;
            }

        }
    };
}]);

'use strict';
angular.module('cyient.donut', [])
.directive('donut', [function() {
    return {
        scope: {
            type: '=',
            mode: '=',
            data: '=',
            numVal: '=',
            numLabel: '=',
            totalVal: '=',
            bottomLabel: '=',
            valLabel: '=',
            colorLabel: '='
        },
        restrict: "AE",
        link: function(scope, elem, attrs) {

            var container = elem[0];

            var width = elem.width(),
                height = elem.width(),
                radius = width / 2;

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d[scope.valLabel] });

            var arc = d3.svg.arc()
                .innerRadius(radius - 10)
                .outerRadius(radius);

            var svg = d3.select(container).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
				.attr("class", function() {
					if (radius < 50) {
						return "small-donut";
					}
				})
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            var path = svg.selectAll("path")
                .data(pie(scope.data))
              .enter().append("path")
                .attr("fill", function(d) { return d.data[scope.colorLabel] })
                .attr("d", arc)
                .transition()
                .duration(1500)
                .attrTween('d', function(d) {
                   var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
                   return function(t) {
                       d.endAngle = i(t);
                     return arc(d);
                   }
                });

            if (scope.type === 'type1') {
                var textGroup = svg.append("g")
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(0, 15)")
                if (scope.mode === 'small') {
                    textGroup.append("text")
                        .attr("transform", "translate(0, -16)")
                        .attr("fill", "#2aaef9")
                        .attr("font-family", "OpenSansSemiBold")
                        .attr("font-size", 20)
                        .text(scope.numVal);
                    textGroup.append("line")
                        .attr("shape-rendering", "crispEdges")
                        .attr("stroke-width", "1")
                        .attr("stroke", "#72787e")
                    	.attr("x1", -10)
                    	.attr("y1", 0)
                    	.attr("x2", 10)
                    	.attr("y2", 0)
                    	.attr("transform", "translate(0, -12)")
                    textGroup.append("text")
                        .attr("font-size", 10)
                        .text(scope.totalVal);
                } else if (scope.mode === 'big') {
                    var upperGroup = textGroup.append("g")
                        .attr("transform", "translate(0, -25)");
                    upperGroup.append("text")
                        .attr("transform", "translate(0, 5)")
                    	.attr("font-family", "OpenSansSemiBold")
                        .attr("fill", "#2aaef9")
                        .attr("font-size", 35)
                        .text(scope.numVal);
                    // upperGroup.append("line")
                    //     .attr("stroke-width", "1")
                    // 	.attr("fill", "#000")
                    // 	.attr("x1", -10)
                    // 	.attr("y1", 0)
                    // 	.attr("x2", 10)
                    // 	.attr("y2", 0)
                    // 	.attr("transform", "translate(0, -15)")
                    // upperGroup.append("text")
                    //     .text("343");
                    textGroup.append("text")
                        .attr("font-size", "12")
                        .text(scope.totalVal + " across site");
                }
            } else if (scope.type === 'type2'){
                var textGroup = svg.append("g")
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(0, 8)")
                textGroup.append("text")
                    .attr("class", "overload-text")
                    .text(scope.numVal)
            }

            // var textGroup = svg.append("g")
            //     .attr("transform", "translate(0, 15)");
//				.attr("transform", function() {
//					if(radius < 50) {
//						return "translate(0, 15)";
//					} else {
//						return "translate(0, 20)"
//					}
//				});

            // var upperText = textGroup.append("g")
            //     .attr("class", "upper-text")
            //     .attr("text-anchor", "middle")
            //     .attr("transform", "translate(0, -20)")

            // upperText.append("text")
            //     .attr("class", "upper-left-text")
            //     .attr("transform", "translate(0, 5)")
            //     // .attr("text-anchor", "end")
            //     .text(scope.numVal)
            // upperText.append("text")
            //     .attr("class", "upper-right-text")
            //     // .attr("text-anchor", "start")
// //                .attr("transform", "translate(0, 20)")
				// .attr("transform", function() {
					// if(radius < 50) {
						// return "translate(0, 20)";
					// } else {
						// return "translate(0, 25)"
					// }
				// })
            //     .text(scope.numLabel);

//            var lowerText = textGroup.append("text")
//                .attr("class", "lower-text")
//                .attr("text-anchor", "middle")
//                .text(scope.bottomLabel);

        }
    };
}]);

'use strict';
angular.module("cyient.dropdown", ['angular-click-outside'])
.directive("dropdown", [function() {
    return {
        scope: {
            tabs: "=",
            numAllTrucks: "=",
            numCriticalTrucks: "=",
            numStableTrucks: "=",
            numGoodTrucks: "=",
            onCategoryChange: "&"
        },
        restrict: "AE",
        templateUrl: "directives/dropdown/dropdown.html",
        link: function(scope, elem, attrs) {

            scope.$watch('tabs', function(newVal, oldVal) {

                if (scope.tabs.activeTab === 'All') {
                    scope.category = "all";
                    scope.numTrucks = scope.numAllTrucks;
                } else if (scope.tabs.activeTab === 'critical') {
                    scope.category = "critical";
                    scope.numTrucks = scope.numCriticalTrucks;
                } else if (scope.tabs.activeTab === 'monitor') {
                    scope.category = "stable";
                    scope.numTrucks = scope.numStableTrucks;
                } else if (scope.tabs.activeTab === 'good') {
                    scope.category = "good";
                    scope.numTrucks = scope.numGoodTrucks;
                }
                
            }, true);

            scope.hideMenu = true;

            scope.selectCategory = function(category) {
                scope.category = category;
                switch (scope.category) {
                    case "all":
                        scope.numTrucks = scope.numAllTrucks;
                        scope.category = "all";
                        scope.onCategoryChange({clickedCategory: "All Trucks"});
                        break;
                    case "critical":
                        scope.numTrucks = scope.numCriticalTrucks;
                        scope.category = "critical";
                        scope.onCategoryChange({clickedCategory: "Critical"});
                        break;
                    case "stable":
                        scope.numTrucks = scope.numStableTrucks;
                        scope.category = "stable";
                        scope.onCategoryChange({clickedCategory: "Stable"});
                        break;
                    case "good":
                        scope.numTrucks = scope.numGoodTrucks;
                        scope.category = "good";
                        scope.onCategoryChange({clickedCategory: "Good"});
                        break;
                }
            };

            scope.toggleDropDown = function($event) {
                $event.stopPropagation();
                scope.hideMenu = !scope.hideMenu;
            }

            scope.closeDropDown = function() {
                scope.hideMenu = true;
            }
            
        } // End of Link function
    }; // End of return object
}]); // End of directive

'use strict';
angular.module('cyient.fixedsidebar', [])
.directive('fixedSidebar', ['$timeout', '$window', function($timeout, $window) {
    return {
        scope: {
            fixedSidebar: "="
        },
        restrict: "A",
        link: function(scope, elem, attrs) {

            scope.$watch('fixedSidebar', function(newVal, oldVal) {
                $timeout(function() {
                    reAdjust();
                }, 1000)
            });

            angular.element($window).bind('resize', function(){
                reAdjust();
                scope.$digest();
            });

            function reAdjust() {
                if (elem.hasClass('active')) {
                    var parent = elem.parent();
                    elem.css('left', parent.position().left );
                }
            }

        }
    };
}]);

/*
 * angular-ui-bootstrap dropdown
 * http://angular-ui.github.io/bootstrap/
 * Version: 1.3.3 - 2016-05-22
 * License: MIT
 */
angular.module('ui.bootstrap.dropdown', ['ui.bootstrap.position'])

.constant('uibDropdownConfig', {
  appendToOpenClass: 'uib-dropdown-open',
  openClass: 'open'
})

.service('uibDropdownService', ['$document', '$rootScope', function($document, $rootScope) {
  var openScope = null;

  this.open = function(dropdownScope, element) {
    if (!openScope) {
      $document.on('click', closeDropdown);
      element.on('keydown', keybindFilter);
    }

    if (openScope && openScope !== dropdownScope) {
      openScope.isOpen = false;
    }

    openScope = dropdownScope;
  };

  this.close = function(dropdownScope, element) {
    if (openScope === dropdownScope) {
      openScope = null;
      $document.off('click', closeDropdown);
      element.off('keydown', keybindFilter);
    }
  };

  var closeDropdown = function(evt) {
    // This method may still be called during the same mouse event that
    // unbound this event handler. So check openScope before proceeding.
    if (!openScope) { return; }

    if (evt && openScope.getAutoClose() === 'disabled') { return; }

    if (evt && evt.which === 3) { return; }

    var toggleElement = openScope.getToggleElement();
    if (evt && toggleElement && toggleElement[0].contains(evt.target)) {
      return;
    }

    var dropdownElement = openScope.getDropdownElement();
    if (evt && openScope.getAutoClose() === 'outsideClick' &&
      dropdownElement && dropdownElement[0].contains(evt.target)) {
      return;
    }

    openScope.isOpen = false;
    openScope.focusToggleElement();

    if (!$rootScope.$$phase) {
      openScope.$apply();
    }
  };

  var keybindFilter = function(evt) {
    if (evt.which === 27) {
      evt.stopPropagation();
      openScope.focusToggleElement();
      closeDropdown();
    } else if (openScope.isKeynavEnabled() && [38, 40].indexOf(evt.which) !== -1 && openScope.isOpen) {
      evt.preventDefault();
      evt.stopPropagation();
      openScope.focusDropdownEntry(evt.which);
    }
  };
}])

.controller('UibDropdownController', ['$scope', '$element', '$attrs', '$parse', 'uibDropdownConfig', 'uibDropdownService', '$animate', '$uibPosition', '$document', '$compile', '$templateRequest', function($scope, $element, $attrs, $parse, dropdownConfig, uibDropdownService, $animate, $position, $document, $compile, $templateRequest) {
  var self = this,
    scope = $scope.$new(), // create a child scope so we are not polluting original one
    templateScope,
    appendToOpenClass = dropdownConfig.appendToOpenClass,
    openClass = dropdownConfig.openClass,
    getIsOpen,
    setIsOpen = angular.noop,
    toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop,
    appendToBody = false,
    appendTo = null,
    keynavEnabled = false,
    selectedOption = null,
    body = $document.find('body');

  $element.addClass('dropdown');

  this.init = function() {
    if ($attrs.isOpen) {
      getIsOpen = $parse($attrs.isOpen);
      setIsOpen = getIsOpen.assign;

      $scope.$watch(getIsOpen, function(value) {
        scope.isOpen = !!value;
      });
    }

    if (angular.isDefined($attrs.dropdownAppendTo)) {
      var appendToEl = $parse($attrs.dropdownAppendTo)(scope);
      if (appendToEl) {
        appendTo = angular.element(appendToEl);
      }
    }

    appendToBody = angular.isDefined($attrs.dropdownAppendToBody);
    keynavEnabled = angular.isDefined($attrs.keyboardNav);

    if (appendToBody && !appendTo) {
      appendTo = body;
    }

    if (appendTo && self.dropdownMenu) {
      appendTo.append(self.dropdownMenu);
      $element.on('$destroy', function handleDestroyEvent() {
        self.dropdownMenu.remove();
      });
    }
  };

  this.toggle = function(open) {
    scope.isOpen = arguments.length ? !!open : !scope.isOpen;
    if (angular.isFunction(setIsOpen)) {
      setIsOpen(scope, scope.isOpen);
    }

    return scope.isOpen;
  };

  // Allow other directives to watch status
  this.isOpen = function() {
    return scope.isOpen;
  };

  scope.getToggleElement = function() {
    return self.toggleElement;
  };

  scope.getAutoClose = function() {
    return $attrs.autoClose || 'always'; //or 'outsideClick' or 'disabled'
  };

  scope.getElement = function() {
    return $element;
  };

  scope.isKeynavEnabled = function() {
    return keynavEnabled;
  };

  scope.focusDropdownEntry = function(keyCode) {
    var elems = self.dropdownMenu ? //If append to body is used.
      angular.element(self.dropdownMenu).find('a') :
      $element.find('ul').eq(0).find('a');

    switch (keyCode) {
      case 40: {
        if (!angular.isNumber(self.selectedOption)) {
          self.selectedOption = 0;
        } else {
          self.selectedOption = self.selectedOption === elems.length - 1 ?
            self.selectedOption :
            self.selectedOption + 1;
        }
        break;
      }
      case 38: {
        if (!angular.isNumber(self.selectedOption)) {
          self.selectedOption = elems.length - 1;
        } else {
          self.selectedOption = self.selectedOption === 0 ?
            0 : self.selectedOption - 1;
        }
        break;
      }
    }
    elems[self.selectedOption].focus();
  };

  scope.getDropdownElement = function() {
    return self.dropdownMenu;
  };

  scope.focusToggleElement = function() {
    if (self.toggleElement) {
      self.toggleElement[0].focus();
    }
  };

  scope.$watch('isOpen', function(isOpen, wasOpen) {
    if (appendTo && self.dropdownMenu) {
      var pos = $position.positionElements($element, self.dropdownMenu, 'bottom-left', true),
        css,
        rightalign,
        scrollbarWidth;

      css = {
        top: pos.top + 'px',
        display: isOpen ? 'block' : 'none'
      };

      rightalign = self.dropdownMenu.hasClass('dropdown-menu-right');
      if (!rightalign) {
        css.left = pos.left + 'px';
        css.right = 'auto';
      } else {
        css.left = 'auto';
        scrollbarWidth = $position.scrollbarWidth(true);
        css.right = window.innerWidth - scrollbarWidth -
          (pos.left + $element.prop('offsetWidth')) + 'px';
      }

      // Need to adjust our positioning to be relative to the appendTo container
      // if it's not the body element
      if (!appendToBody) {
        var appendOffset = $position.offset(appendTo);

        css.top = pos.top - appendOffset.top + 'px';

        if (!rightalign) {
          css.left = pos.left - appendOffset.left + 'px';
        } else {
          css.right = window.innerWidth -
            (pos.left - appendOffset.left + $element.prop('offsetWidth')) + 'px';
        }
      }

      self.dropdownMenu.css(css);
    }

    var openContainer = appendTo ? appendTo : $element;
    var hasOpenClass = openContainer.hasClass(appendTo ? appendToOpenClass : openClass);

    if (hasOpenClass === !isOpen) {
      $animate[isOpen ? 'addClass' : 'removeClass'](openContainer, appendTo ? appendToOpenClass : openClass).then(function() {
        if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
          toggleInvoker($scope, { open: !!isOpen });
        }
      });
    }

    if (isOpen) {
      if (self.dropdownMenuTemplateUrl) {
        $templateRequest(self.dropdownMenuTemplateUrl).then(function(tplContent) {
          templateScope = scope.$new();
          $compile(tplContent.trim())(templateScope, function(dropdownElement) {
            var newEl = dropdownElement;
            self.dropdownMenu.replaceWith(newEl);
            self.dropdownMenu = newEl;
          });
        });
      }

      scope.focusToggleElement();
      uibDropdownService.open(scope, $element);
    } else {
      if (self.dropdownMenuTemplateUrl) {
        if (templateScope) {
          templateScope.$destroy();
        }
        var newEl = angular.element('<ul class="dropdown-menu"></ul>');
        self.dropdownMenu.replaceWith(newEl);
        self.dropdownMenu = newEl;
      }

      uibDropdownService.close(scope, $element);
      self.selectedOption = null;
    }

    if (angular.isFunction(setIsOpen)) {
      setIsOpen($scope, isOpen);
    }
  });
}])

.directive('uibDropdown', function() {
  return {
    controller: 'UibDropdownController',
    link: function(scope, element, attrs, dropdownCtrl) {
      dropdownCtrl.init();
    }
  };
})

.directive('uibDropdownMenu', function() {
  return {
    restrict: 'A',
    require: '?^uibDropdown',
    link: function(scope, element, attrs, dropdownCtrl) {
      if (!dropdownCtrl || angular.isDefined(attrs.dropdownNested)) {
        return;
      }

      element.addClass('dropdown-menu');

      var tplUrl = attrs.templateUrl;
      if (tplUrl) {
        dropdownCtrl.dropdownMenuTemplateUrl = tplUrl;
      }

      if (!dropdownCtrl.dropdownMenu) {
        dropdownCtrl.dropdownMenu = element;
      }
    }
  };
})

.directive('uibDropdownToggle', function() {
  return {
    require: '?^uibDropdown',
    link: function(scope, element, attrs, dropdownCtrl) {
      if (!dropdownCtrl) {
        return;
      }

      element.addClass('dropdown-toggle');

      dropdownCtrl.toggleElement = element;

      var toggleDropdown = function(event) {
        event.preventDefault();

        if (!element.hasClass('disabled') && !attrs.disabled) {
          scope.$apply(function() {
            dropdownCtrl.toggle();
          });
        }
      };

      element.bind('click', toggleDropdown);

      // WAI-ARIA
      element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
      scope.$watch(dropdownCtrl.isOpen, function(isOpen) {
        element.attr('aria-expanded', !!isOpen);
      });

      scope.$on('$destroy', function() {
        element.unbind('click', toggleDropdown);
      });
    }
  };
});

angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods for working with the DOM.
 * It is meant to be used where we need to absolute-position elements in
 * relation to another element (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$uibPosition', ['$document', '$window', function($document, $window) {
    /**
     * Used by scrollbarWidth() function to cache scrollbar's width.
     * Do not access this variable directly, use scrollbarWidth() instead.
     */
    var SCROLLBAR_WIDTH;
    /**
     * scrollbar on body and html element in IE and Edge overlay
     * content and should be considered 0 width.
     */
    var BODY_SCROLLBAR_WIDTH;
    var OVERFLOW_REGEX = {
      normal: /(auto|scroll)/,
      hidden: /(auto|scroll|hidden)/
    };
    var PLACEMENT_REGEX = {
      auto: /\s?auto?\s?/i,
      primary: /^(top|bottom|left|right)$/,
      secondary: /^(top|bottom|left|right|center)$/,
      vertical: /^(top|bottom)$/
    };
    var BODY_REGEX = /(HTML|BODY)/;

    return {

      /**
       * Provides a raw DOM element from a jQuery/jQLite element.
       *
       * @param {element} elem - The element to convert.
       *
       * @returns {element} A HTML element.
       */
      getRawNode: function(elem) {
        return elem.nodeName ? elem : elem[0] || elem;
      },

      /**
       * Provides a parsed number for a style property.  Strips
       * units and casts invalid numbers to 0.
       *
       * @param {string} value - The style value to parse.
       *
       * @returns {number} A valid number.
       */
      parseStyle: function(value) {
        value = parseFloat(value);
        return isFinite(value) ? value : 0;
      },

      /**
       * Provides the closest positioned ancestor.
       *
       * @param {element} element - The element to get the offest parent for.
       *
       * @returns {element} The closest positioned ancestor.
       */
      offsetParent: function(elem) {
        elem = this.getRawNode(elem);

        var offsetParent = elem.offsetParent || $document[0].documentElement;

        function isStaticPositioned(el) {
          return ($window.getComputedStyle(el).position || 'static') === 'static';
        }

        while (offsetParent && offsetParent !== $document[0].documentElement && isStaticPositioned(offsetParent)) {
          offsetParent = offsetParent.offsetParent;
        }

        return offsetParent || $document[0].documentElement;
      },

      /**
       * Provides the scrollbar width, concept from TWBS measureScrollbar()
       * function in https://github.com/twbs/bootstrap/blob/master/js/modal.js
       * In IE and Edge, scollbar on body and html element overlay and should
       * return a width of 0.
       *
       * @returns {number} The width of the browser scollbar.
       */
      scrollbarWidth: function(isBody) {
        if (isBody) {
          if (angular.isUndefined(BODY_SCROLLBAR_WIDTH)) {
            var bodyElem = $document.find('body');
            bodyElem.addClass('uib-position-body-scrollbar-measure');
            BODY_SCROLLBAR_WIDTH = $window.innerWidth - bodyElem[0].clientWidth;
            BODY_SCROLLBAR_WIDTH = isFinite(BODY_SCROLLBAR_WIDTH) ? BODY_SCROLLBAR_WIDTH : 0;
            bodyElem.removeClass('uib-position-body-scrollbar-measure');
          }
          return BODY_SCROLLBAR_WIDTH;
        }

        if (angular.isUndefined(SCROLLBAR_WIDTH)) {
          var scrollElem = angular.element('<div class="uib-position-scrollbar-measure"></div>');
          $document.find('body').append(scrollElem);
          SCROLLBAR_WIDTH = scrollElem[0].offsetWidth - scrollElem[0].clientWidth;
          SCROLLBAR_WIDTH = isFinite(SCROLLBAR_WIDTH) ? SCROLLBAR_WIDTH : 0;
          scrollElem.remove();
        }

        return SCROLLBAR_WIDTH;
      },

      /**
       * Provides the padding required on an element to replace the scrollbar.
       *
       * @returns {object} An object with the following properties:
       *   <ul>
       *     <li>**scrollbarWidth**: the width of the scrollbar</li>
       *     <li>**widthOverflow**: whether the the width is overflowing</li>
       *     <li>**right**: the amount of right padding on the element needed to replace the scrollbar</li>
       *     <li>**rightOriginal**: the amount of right padding currently on the element</li>
       *     <li>**heightOverflow**: whether the the height is overflowing</li>
       *     <li>**bottom**: the amount of bottom padding on the element needed to replace the scrollbar</li>
       *     <li>**bottomOriginal**: the amount of bottom padding currently on the element</li>
       *   </ul>
       */
      scrollbarPadding: function(elem) {
        elem = this.getRawNode(elem);

        var elemStyle = $window.getComputedStyle(elem);
        var paddingRight = this.parseStyle(elemStyle.paddingRight);
        var paddingBottom = this.parseStyle(elemStyle.paddingBottom);
        var scrollParent = this.scrollParent(elem, false, true);
        var scrollbarWidth = this.scrollbarWidth(scrollParent, BODY_REGEX.test(scrollParent.tagName));

        return {
          scrollbarWidth: scrollbarWidth,
          widthOverflow: scrollParent.scrollWidth > scrollParent.clientWidth,
          right: paddingRight + scrollbarWidth,
          originalRight: paddingRight,
          heightOverflow: scrollParent.scrollHeight > scrollParent.clientHeight,
          bottom: paddingBottom + scrollbarWidth,
          originalBottom: paddingBottom
         };
      },

      /**
       * Checks to see if the element is scrollable.
       *
       * @param {element} elem - The element to check.
       * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
       *   default is false.
       *
       * @returns {boolean} Whether the element is scrollable.
       */
      isScrollable: function(elem, includeHidden) {
        elem = this.getRawNode(elem);

        var overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
        var elemStyle = $window.getComputedStyle(elem);
        return overflowRegex.test(elemStyle.overflow + elemStyle.overflowY + elemStyle.overflowX);
      },

      /**
       * Provides the closest scrollable ancestor.
       * A port of the jQuery UI scrollParent method:
       * https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js
       *
       * @param {element} elem - The element to find the scroll parent of.
       * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
       *   default is false.
       * @param {boolean=} [includeSelf=false] - Should the element being passed be
       * included in the scrollable llokup.
       *
       * @returns {element} A HTML element.
       */
      scrollParent: function(elem, includeHidden, includeSelf) {
        elem = this.getRawNode(elem);

        var overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
        var documentEl = $document[0].documentElement;
        var elemStyle = $window.getComputedStyle(elem);
        if (includeSelf && overflowRegex.test(elemStyle.overflow + elemStyle.overflowY + elemStyle.overflowX)) {
          return elem;
        }
        var excludeStatic = elemStyle.position === 'absolute';
        var scrollParent = elem.parentElement || documentEl;

        if (scrollParent === documentEl || elemStyle.position === 'fixed') {
          return documentEl;
        }

        while (scrollParent.parentElement && scrollParent !== documentEl) {
          var spStyle = $window.getComputedStyle(scrollParent);
          if (excludeStatic && spStyle.position !== 'static') {
            excludeStatic = false;
          }

          if (!excludeStatic && overflowRegex.test(spStyle.overflow + spStyle.overflowY + spStyle.overflowX)) {
            break;
          }
          scrollParent = scrollParent.parentElement;
        }

        return scrollParent;
      },

      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/ - distance to closest positioned
       * ancestor.  Does not account for margins by default like jQuery position.
       *
       * @param {element} elem - The element to caclulate the position on.
       * @param {boolean=} [includeMargins=false] - Should margins be accounted
       * for, default is false.
       *
       * @returns {object} An object with the following properties:
       *   <ul>
       *     <li>**width**: the width of the element</li>
       *     <li>**height**: the height of the element</li>
       *     <li>**top**: distance to top edge of offset parent</li>
       *     <li>**left**: distance to left edge of offset parent</li>
       *   </ul>
       */
      position: function(elem, includeMagins) {
        elem = this.getRawNode(elem);

        var elemOffset = this.offset(elem);
        if (includeMagins) {
          var elemStyle = $window.getComputedStyle(elem);
          elemOffset.top -= this.parseStyle(elemStyle.marginTop);
          elemOffset.left -= this.parseStyle(elemStyle.marginLeft);
        }
        var parent = this.offsetParent(elem);
        var parentOffset = {top: 0, left: 0};

        if (parent !== $document[0].documentElement) {
          parentOffset = this.offset(parent);
          parentOffset.top += parent.clientTop - parent.scrollTop;
          parentOffset.left += parent.clientLeft - parent.scrollLeft;
        }

        return {
          width: Math.round(angular.isNumber(elemOffset.width) ? elemOffset.width : elem.offsetWidth),
          height: Math.round(angular.isNumber(elemOffset.height) ? elemOffset.height : elem.offsetHeight),
          top: Math.round(elemOffset.top - parentOffset.top),
          left: Math.round(elemOffset.left - parentOffset.left)
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/ - distance to viewport.  Does
       * not account for borders, margins, or padding on the body
       * element.
       *
       * @param {element} elem - The element to calculate the offset on.
       *
       * @returns {object} An object with the following properties:
       *   <ul>
       *     <li>**width**: the width of the element</li>
       *     <li>**height**: the height of the element</li>
       *     <li>**top**: distance to top edge of viewport</li>
       *     <li>**right**: distance to bottom edge of viewport</li>
       *   </ul>
       */
      offset: function(elem) {
        elem = this.getRawNode(elem);

        var elemBCR = elem.getBoundingClientRect();
        return {
          width: Math.round(angular.isNumber(elemBCR.width) ? elemBCR.width : elem.offsetWidth),
          height: Math.round(angular.isNumber(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
          top: Math.round(elemBCR.top + ($window.pageYOffset || $document[0].documentElement.scrollTop)),
          left: Math.round(elemBCR.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft))
        };
      },

      /**
       * Provides offset distance to the closest scrollable ancestor
       * or viewport.  Accounts for border and scrollbar width.
       *
       * Right and bottom dimensions represent the distance to the
       * respective edge of the viewport element.  If the element
       * edge extends beyond the viewport, a negative value will be
       * reported.
       *
       * @param {element} elem - The element to get the viewport offset for.
       * @param {boolean=} [useDocument=false] - Should the viewport be the document element instead
       * of the first scrollable element, default is false.
       * @param {boolean=} [includePadding=true] - Should the padding on the offset parent element
       * be accounted for, default is true.
       *
       * @returns {object} An object with the following properties:
       *   <ul>
       *     <li>**top**: distance to the top content edge of viewport element</li>
       *     <li>**bottom**: distance to the bottom content edge of viewport element</li>
       *     <li>**left**: distance to the left content edge of viewport element</li>
       *     <li>**right**: distance to the right content edge of viewport element</li>
       *   </ul>
       */
      viewportOffset: function(elem, useDocument, includePadding) {
        elem = this.getRawNode(elem);
        includePadding = includePadding !== false ? true : false;

        var elemBCR = elem.getBoundingClientRect();
        var offsetBCR = {top: 0, left: 0, bottom: 0, right: 0};

        var offsetParent = useDocument ? $document[0].documentElement : this.scrollParent(elem);
        var offsetParentBCR = offsetParent.getBoundingClientRect();

        offsetBCR.top = offsetParentBCR.top + offsetParent.clientTop;
        offsetBCR.left = offsetParentBCR.left + offsetParent.clientLeft;
        if (offsetParent === $document[0].documentElement) {
          offsetBCR.top += $window.pageYOffset;
          offsetBCR.left += $window.pageXOffset;
        }
        offsetBCR.bottom = offsetBCR.top + offsetParent.clientHeight;
        offsetBCR.right = offsetBCR.left + offsetParent.clientWidth;

        if (includePadding) {
          var offsetParentStyle = $window.getComputedStyle(offsetParent);
          offsetBCR.top += this.parseStyle(offsetParentStyle.paddingTop);
          offsetBCR.bottom -= this.parseStyle(offsetParentStyle.paddingBottom);
          offsetBCR.left += this.parseStyle(offsetParentStyle.paddingLeft);
          offsetBCR.right -= this.parseStyle(offsetParentStyle.paddingRight);
        }

        return {
          top: Math.round(elemBCR.top - offsetBCR.top),
          bottom: Math.round(offsetBCR.bottom - elemBCR.bottom),
          left: Math.round(elemBCR.left - offsetBCR.left),
          right: Math.round(offsetBCR.right - elemBCR.right)
        };
      },

      /**
       * Provides an array of placement values parsed from a placement string.
       * Along with the 'auto' indicator, supported placement strings are:
       *   <ul>
       *     <li>top: element on top, horizontally centered on host element.</li>
       *     <li>top-left: element on top, left edge aligned with host element left edge.</li>
       *     <li>top-right: element on top, lerightft edge aligned with host element right edge.</li>
       *     <li>bottom: element on bottom, horizontally centered on host element.</li>
       *     <li>bottom-left: element on bottom, left edge aligned with host element left edge.</li>
       *     <li>bottom-right: element on bottom, right edge aligned with host element right edge.</li>
       *     <li>left: element on left, vertically centered on host element.</li>
       *     <li>left-top: element on left, top edge aligned with host element top edge.</li>
       *     <li>left-bottom: element on left, bottom edge aligned with host element bottom edge.</li>
       *     <li>right: element on right, vertically centered on host element.</li>
       *     <li>right-top: element on right, top edge aligned with host element top edge.</li>
       *     <li>right-bottom: element on right, bottom edge aligned with host element bottom edge.</li>
       *   </ul>
       * A placement string with an 'auto' indicator is expected to be
       * space separated from the placement, i.e: 'auto bottom-left'  If
       * the primary and secondary placement values do not match 'top,
       * bottom, left, right' then 'top' will be the primary placement and
       * 'center' will be the secondary placement.  If 'auto' is passed, true
       * will be returned as the 3rd value of the array.
       *
       * @param {string} placement - The placement string to parse.
       *
       * @returns {array} An array with the following values
       * <ul>
       *   <li>**[0]**: The primary placement.</li>
       *   <li>**[1]**: The secondary placement.</li>
       *   <li>**[2]**: If auto is passed: true, else undefined.</li>
       * </ul>
       */
      parsePlacement: function(placement) {
        var autoPlace = PLACEMENT_REGEX.auto.test(placement);
        if (autoPlace) {
          placement = placement.replace(PLACEMENT_REGEX.auto, '');
        }

        placement = placement.split('-');

        placement[0] = placement[0] || 'top';
        if (!PLACEMENT_REGEX.primary.test(placement[0])) {
          placement[0] = 'top';
        }

        placement[1] = placement[1] || 'center';
        if (!PLACEMENT_REGEX.secondary.test(placement[1])) {
          placement[1] = 'center';
        }

        if (autoPlace) {
          placement[2] = true;
        } else {
          placement[2] = false;
        }

        return placement;
      },

      /**
       * Provides coordinates for an element to be positioned relative to
       * another element.  Passing 'auto' as part of the placement parameter
       * will enable smart placement - where the element fits. i.e:
       * 'auto left-top' will check to see if there is enough space to the left
       * of the hostElem to fit the targetElem, if not place right (same for secondary
       * top placement).  Available space is calculated using the viewportOffset
       * function.
       *
       * @param {element} hostElem - The element to position against.
       * @param {element} targetElem - The element to position.
       * @param {string=} [placement=top] - The placement for the targetElem,
       *   default is 'top'. 'center' is assumed as secondary placement for
       *   'top', 'left', 'right', and 'bottom' placements.  Available placements are:
       *   <ul>
       *     <li>top</li>
       *     <li>top-right</li>
       *     <li>top-left</li>
       *     <li>bottom</li>
       *     <li>bottom-left</li>
       *     <li>bottom-right</li>
       *     <li>left</li>
       *     <li>left-top</li>
       *     <li>left-bottom</li>
       *     <li>right</li>
       *     <li>right-top</li>
       *     <li>right-bottom</li>
       *   </ul>
       * @param {boolean=} [appendToBody=false] - Should the top and left values returned
       *   be calculated from the body element, default is false.
       *
       * @returns {object} An object with the following properties:
       *   <ul>
       *     <li>**top**: Value for targetElem top.</li>
       *     <li>**left**: Value for targetElem left.</li>
       *     <li>**placement**: The resolved placement.</li>
       *   </ul>
       */
      positionElements: function(hostElem, targetElem, placement, appendToBody) {
        hostElem = this.getRawNode(hostElem);
        targetElem = this.getRawNode(targetElem);

        // need to read from prop to support tests.
        var targetWidth = angular.isDefined(targetElem.offsetWidth) ? targetElem.offsetWidth : targetElem.prop('offsetWidth');
        var targetHeight = angular.isDefined(targetElem.offsetHeight) ? targetElem.offsetHeight : targetElem.prop('offsetHeight');

        placement = this.parsePlacement(placement);

        var hostElemPos = appendToBody ? this.offset(hostElem) : this.position(hostElem);
        var targetElemPos = {top: 0, left: 0, placement: ''};

        if (placement[2]) {
          var viewportOffset = this.viewportOffset(hostElem, appendToBody);

          var targetElemStyle = $window.getComputedStyle(targetElem);
          var adjustedSize = {
            width: targetWidth + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginLeft) + this.parseStyle(targetElemStyle.marginRight))),
            height: targetHeight + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginTop) + this.parseStyle(targetElemStyle.marginBottom)))
          };

          placement[0] = placement[0] === 'top' && adjustedSize.height > viewportOffset.top && adjustedSize.height <= viewportOffset.bottom ? 'bottom' :
                         placement[0] === 'bottom' && adjustedSize.height > viewportOffset.bottom && adjustedSize.height <= viewportOffset.top ? 'top' :
                         placement[0] === 'left' && adjustedSize.width > viewportOffset.left && adjustedSize.width <= viewportOffset.right ? 'right' :
                         placement[0] === 'right' && adjustedSize.width > viewportOffset.right && adjustedSize.width <= viewportOffset.left ? 'left' :
                         placement[0];

          placement[1] = placement[1] === 'top' && adjustedSize.height - hostElemPos.height > viewportOffset.bottom && adjustedSize.height - hostElemPos.height <= viewportOffset.top ? 'bottom' :
                         placement[1] === 'bottom' && adjustedSize.height - hostElemPos.height > viewportOffset.top && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom ? 'top' :
                         placement[1] === 'left' && adjustedSize.width - hostElemPos.width > viewportOffset.right && adjustedSize.width - hostElemPos.width <= viewportOffset.left ? 'right' :
                         placement[1] === 'right' && adjustedSize.width - hostElemPos.width > viewportOffset.left && adjustedSize.width - hostElemPos.width <= viewportOffset.right ? 'left' :
                         placement[1];

          if (placement[1] === 'center') {
            if (PLACEMENT_REGEX.vertical.test(placement[0])) {
              var xOverflow = hostElemPos.width / 2 - targetWidth / 2;
              if (viewportOffset.left + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.right) {
                placement[1] = 'left';
              } else if (viewportOffset.right + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.left) {
                placement[1] = 'right';
              }
            } else {
              var yOverflow = hostElemPos.height / 2 - adjustedSize.height / 2;
              if (viewportOffset.top + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom) {
                placement[1] = 'top';
              } else if (viewportOffset.bottom + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.top) {
                placement[1] = 'bottom';
              }
            }
          }
        }

        switch (placement[0]) {
          case 'top':
            targetElemPos.top = hostElemPos.top - targetHeight;
            break;
          case 'bottom':
            targetElemPos.top = hostElemPos.top + hostElemPos.height;
            break;
          case 'left':
            targetElemPos.left = hostElemPos.left - targetWidth;
            break;
          case 'right':
            targetElemPos.left = hostElemPos.left + hostElemPos.width;
            break;
        }

        switch (placement[1]) {
          case 'top':
            targetElemPos.top = hostElemPos.top;
            break;
          case 'bottom':
            targetElemPos.top = hostElemPos.top + hostElemPos.height - targetHeight;
            break;
          case 'left':
            targetElemPos.left = hostElemPos.left;
            break;
          case 'right':
            targetElemPos.left = hostElemPos.left + hostElemPos.width - targetWidth;
            break;
          case 'center':
            if (PLACEMENT_REGEX.vertical.test(placement[0])) {
              targetElemPos.left = hostElemPos.left + hostElemPos.width / 2 - targetWidth / 2;
            } else {
              targetElemPos.top = hostElemPos.top + hostElemPos.height / 2 - targetHeight / 2;
            }
            break;
        }

        targetElemPos.top = Math.round(targetElemPos.top);
        targetElemPos.left = Math.round(targetElemPos.left);
        targetElemPos.placement = placement[1] === 'center' ? placement[0] : placement[0] + '-' + placement[1];

        return targetElemPos;
      },

      /**
      * Provides a way for positioning tooltip & dropdown
      * arrows when using placement options beyond the standard
      * left, right, top, or bottom.
      *
      * @param {element} elem - The tooltip/dropdown element.
      * @param {string} placement - The placement for the elem.
      */
      positionArrow: function(elem, placement) {
        elem = this.getRawNode(elem);

        var innerElem = elem.querySelector('.tooltip-inner, .popover-inner');
        if (!innerElem) {
          return;
        }

        var isTooltip = angular.element(innerElem).hasClass('tooltip-inner');

        var arrowElem = isTooltip ? elem.querySelector('.tooltip-arrow') : elem.querySelector('.arrow');
        if (!arrowElem) {
          return;
        }

        var arrowCss = {
          top: '',
          bottom: '',
          left: '',
          right: ''
        };

        placement = this.parsePlacement(placement);
        if (placement[1] === 'center') {
          // no adjustment necessary - just reset styles
          angular.element(arrowElem).css(arrowCss);
          return;
        }

        var borderProp = 'border-' + placement[0] + '-width';
        var borderWidth = $window.getComputedStyle(arrowElem)[borderProp];

        var borderRadiusProp = 'border-';
        if (PLACEMENT_REGEX.vertical.test(placement[0])) {
          borderRadiusProp += placement[0] + '-' + placement[1];
        } else {
          borderRadiusProp += placement[1] + '-' + placement[0];
        }
        borderRadiusProp += '-radius';
        var borderRadius = $window.getComputedStyle(isTooltip ? innerElem : elem)[borderRadiusProp];

        switch (placement[0]) {
          case 'top':
            arrowCss.bottom = isTooltip ? '0' : '-' + borderWidth;
            break;
          case 'bottom':
            arrowCss.top = isTooltip ? '0' : '-' + borderWidth;
            break;
          case 'left':
            arrowCss.right = isTooltip ? '0' : '-' + borderWidth;
            break;
          case 'right':
            arrowCss.left = isTooltip ? '0' : '-' + borderWidth;
            break;
        }

        arrowCss[placement[1]] = borderRadius;

        angular.element(arrowElem).css(arrowCss);
      }
    };
  }]);

'use strict';
angular.module('cyient.histogram', [])
.directive('histogram', [function() {
    return {
        scope: {
            data: "=",
            toolTipValue: "=",
        },
        restrict: "AE",
        link: function(scope, elem, attrs) {

            var container = elem[0];

            scope.$watch("data", function(newVal, oldVal) {
                render();
            }, true);


            function render() {

                d3.select(container).text("");

                var containerWidth = elem.width();
                var containerHeight = elem.height();

                var margin = {top: 10, right: 10, bottom: 24, left: 55},
                    width = containerWidth - margin.left - margin.right,
                    height = containerHeight - margin.top - margin.bottom;

                var formatPercent = d3.format(".0%");

                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(5)
                    .tickFormat(formatPercent);

                var svg = d3.select(container).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var data = scope.data;

                x.domain(data.map(function(d) { return d.xValue; }));
                y.domain([0, d3.max(data, function(d) { return d.yValue; })]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)

                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.xValue); })
                    .attr("width", x.rangeBand())
                    .attr("y", function (d, i) {
                      return height;
                    })
                    .attr("height", 0)
                      .transition()
                      .duration(2000)
                      .delay(function (d, i) {
                        return i * 50;
                      })
                    .attr("y", function(d) {
                      return y(d.yValue);
                    })
                    .attr("height", function(d) {
                      return height - y(d.yValue);
                    });
            } // End of render function

        } // End of link function
    }; // End of return object

}]);

'use strict';
(function(){
  angular.module("directives/lifeChart/lifeChart.html", []).run(["$templateCache", function($templateCache){
    $templateCache.put("directives/lifeChart/lifeChart.html",
    '<div class="graph-container">' +
      '<div id="life-chart-legends" class="chart-legends">' +
        '<div class="rul-legends" ng-if="isRULLegend">' +
          '<div class="checkbox-wrapper">' +
            '<div class="checkbox-btn-group">' +
              '<div class="life-1">' +
                '<label class="checkbox-button today-check">' +
                  '<input type="checkbox" name="SMHValue" ng-model="isRULTodayLine" ng-click="toggleRULTodayLine()">' +
                    '<span>Today <span class="graph-value">{{xvalue}}</span></span>' +
                '</label>' +
              '</div>' +
              '<div class="life-1">' +
                '<label class="checkbox-button health-check">' +
                  '<input type="checkbox" name="check" ng-model="isRULHealthLine" ng-click="toggleRULHealthLine()">' +
                    '<span>Health <span class="graph-value">{{(healthvalue | setDecimal: 3)}}</span></span>' +
                '</label>' +
              '</div>' +
              '<div class="life-1">' +
                '<label class="checkbox-button rul-check">' +
                  '<input type="checkbox" name="check" ng-model="isRULArea" ng-click="toggleRULArea()">' +
                    '<span>RUL <span class="graph-value" ng-if="rulminvalue">min: {{(rulminvalue | setDecimal: 2)}}<span ng-if="rulmaxvalue">,</span></span> &nbsp; <span ng-if="rulmaxvalue"> max: {{(rulmaxvalue | setDecimal: 2) }}</span></span>' +
                '</label>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="deterioration-legends" ng-if="isDeteriotationLegend">' +
          '<div class="checkbox-wrapper">' +
            '<div class="checkbox-btn-group">' +
              '<label class="checkbox-button today-check">' +
                '<input type="checkbox" name="SMHValue" ng-model="isRODTodayLine" ng-click="toggleRODTodayLine()">' +
                  '<span>Today <span class="graph-value">{{xvalue}}</span></span>' +
              '</label>' +
              '<label class="checkbox-button health-check">' +
                '<input type="checkbox" name="check" ng-model="isROD" ng-click="toggleROD()">' +
                  '<span>ROD <span class="graph-value">{{(healthvalue | setDecimal: 3)}}</span></span>' +
              '</label>' +
              '<label class="checkbox-button optimal-check">' +
                '<input type="checkbox" name="check" ng-model="isRODOptimalVal" ng-click="toggleOptimalVal()">' +
                  '<span>Optimal Value</span>' +
                  // <span class="graph-value">{{optimalmin}}</span> &dash; <span class="graph-value">{{optimalmax}}</span>
              '</label>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="life-chart-graph"><svg class="life-graph-{{chartType}}"></svg></div>' +
    '</div>'
    );
  }]);
  angular.module('cyient.lifechart', ['directives/lifeChart/lifeChart.html'])
  .directive('lifeChart', ['_', '$compile', '$timeout', '$document', '$state', '$filter', '$log', function(_, $compile, $timeout, $document, $state, $filter, $log) {
    return {
      restrict: 'E',
      scope: {
        width: '=',
        height: '=',
        todayX: '=',
        todayY: '=',
        data: '=data',
        xvalue: '@',
        trendvalue: '@',
        siteavgvalue: '@',
        healthvalue: '@',
        rulminvalue: '@',
        rulmaxvalue: '@',
        optimalmin: '@',
        optimalmax: '@',
        

        /**
         * NOTE: only two chart types are supported 'RUL' and 'ROD'
         * some ternary operations might be affected if a new type is introduced
         */
        chartType: '@',
      },
      templateUrl: "directives/lifeChart/lifeChart.html",
      link: function(scope, element, attrs, ngModel) {

        var margin = {
          top: 20,
          right: 100,
          bottom: 100,
          left: 55
        },
        padding = 100;

        var width = scope.width;
        var height = scope.height;
        var minOptimalValue = scope.data.minOptimalValue || 0;
        var maxOptimalValue = scope.data.maxOptimalValue || 0;

        scope.inline = 'block';
        if($state.current.name === "cyient.protected.sitedetails.whatifscenario"){
          scope.inline = 'inline-flex';
        }

        var isOptimal = false; // boolean for optimal value rectangle

        if(scope.chartType === 'RUL'){
          // default values
          scope.isRULLegend = true;
          scope.isRULTodayLine = true;
          scope.isRULHealthLine = true;
          scope.isRULTrendLine = false;
          scope.isRULSiteAvgLine = false;
          scope.isRULArea = true;
          isOptimal = false;

          // action functions for checkbox elements in RUL graph
          scope.toggleRULTodayLine = function(){
            scope.isRULTodayLine = !scope.isRULTodayLine;
            scope.isRULTodayLine ? d3.select(element[0]).selectAll('#life-chart-todayLine, #life-chart-todayLabel, #life-chart-intersect').style('visibility', 'visible') : d3.select(element[0]).selectAll('#life-chart-todayLine, #life-chart-todayLabel, #life-chart-intersect').style('visibility', 'hidden');
          };
          scope.toggleRULTrendLine = function(){
            scope.isRULTrendLine = !scope.isRULTrendLine;
            scope.isRULTrendLine ? d3.select(element[0]).select('.trendLine').style('visibility', 'visible') : d3.select(element[0]).select('.trendLine').style('visibility', 'hidden');
          };
          scope.toggleRULHealthLine = function(){
            scope.isRULHealthLine = !scope.isRULHealthLine;
            scope.isRULHealthLine ? d3.select(element[0]).select('.healthLine').style('visibility', 'visible') : d3.select(element[0]).select('.healthLine').style('visibility', 'hidden');
          };
          scope.toggleRULSiteAvgLine = function(){
            scope.isRULSiteAvgLine = !scope.isRULSiteAvgLine;
            scope.isRULSiteAvgLine ? d3.select(element[0]).select('.siteAvgLine').style('visibility', 'visible') : d3.select(element[0]).select('.siteAvgLine').style('visibility', 'hidden');
          }
          scope.toggleRULArea = function(){
            scope.isRULArea = !scope.isRULArea;
            scope.isRULArea ? d3.select(element[0]).selectAll('#rul-minArea, #rul-maxArea, #rulMaxLine, #rulAvgLine, #rulMinLine, #life-chart-minLine, #life-chart-minLabel,  #life-chart-avgLine, #life-chart-avgLabel, #life-chart-maxLine, #life-chart-maxLabel').style('visibility', 'visible') : d3.select(element[0]).selectAll('#rul-minArea, #rul-maxArea, #rulMaxLine, #rulAvgLine, #rulMinLine, #life-chart-minLine, #life-chart-minLabel,  #life-chart-avgLine, #life-chart-avgLabel, #life-chart-maxLine, #life-chart-maxLabel').style('visibility', 'hidden');
          };

        } else if(scope.chartType === 'ROD'){
          // default values
          scope.isDeteriotationLegend = true;
          scope.isRODTodayLine = true;
          scope.isRODTrendLine = true;
          scope.isROD = true;
          scope.isRODOptimalVal = true;
          scope.isRODSiteAvgLine = false;
          isOptimal = true;

          // action functions for checkbox elements in deterioration/ROD graph
          scope.toggleRODTodayLine = function(){
            scope.isRODTodayLine = !scope.isRODTodayLine;
            scope.isRODTodayLine ? d3.select(element[0]).selectAll('#life-chart-todayLine, #life-chart-todayLabel, #life-chart-intersect').style('visibility', 'visible') : d3.select(element[0]).selectAll('#life-chart-todayLine, #life-chart-todayLabel, #life-chart-intersect').style('visibility', 'hidden');
          };
          scope.toggleRODTrendLine = function(){
            scope.isRODTrendLine = !scope.isRODTrendLine;
            scope.isRODTrendLine ? d3.select(element[0]).select('.trendLine').style('visibility', 'visible') : d3.select(element[0]).select('.trendLine').style('visibility', 'hidden');
          };
          scope.toggleROD = function(){
            scope.isROD = !scope.isROD;
            scope.isROD ? d3.select(element[0]).select('.healthLine').style('visibility', 'visible') : d3.select(element[0]).select('.healthLine').style('visibility', 'hidden');
          };
          scope.toggleOptimalVal = function(){
            scope.isRODOptimalVal = !scope.isRODOptimalVal;
            scope.isRODOptimalVal ? d3.select(element[0]).select('.optimalArea').style('visibility', 'visible') : d3.select(element[0]).select('.optimalArea').style('visibility', 'hidden');
          };
          scope.toggleRODSiteAvgLine =  function(){
            scope.isRODSiteAvgLine = !scope.isRODSiteAvgLine;
            scope.isRODSiteAvgLine ? d3.select(element[0]).select('.siteAvgLine').style('visibility', 'visible') : d3.select(element[0]).select('.siteAvgLine').style('visibility', 'hidden');
          };
        }

        function compare(a,b) {
          if (a.xAxis < b.xAxis)
            return -1;
          if (a.xAxis > b.xAxis)
            return 1;
          return 0;
        }

        // render plot
        scope.render = function() {

          if(scope.data){
            var today = scope.today;
            var todayX = scope.todayX;
            var todayY = scope.todayY;
            var healthDataTemp = scope.data.trendGraph || [];
            var healthData = healthDataTemp.concat(scope.data.healthGraph);
          } else {
            return;
          }

          // sort by yAxis
          healthData = _.sortBy(healthData, 'yAxis');

          // sort data by xAxis
          healthData.sort(compare);
            
          // trim off negative/zero values in yAxis
          /*healthData = _.remove(healthData, function(ele) {
            return ele.xAxis < 0 ||ele.yAxis > 0;
          });*/

          // today point
          var todayPoint = healthData.filter(function(ele){
            return ele.xAxis === todayX || ele.yAxis === todayY;
          });

          // trim data off negative `x` and `y` values
          for(var i=healthData.length-1; i >= 0; i--){
            if(healthData[i].xAxis < todayPoint.xAxis && healthData[i].yAxis < 0){
              healthData.splice(i, 1);
            }
          }

          var first_smallest = Number.POSITIVE_INFINITY;
          for (var i in healthData) {
            /* If current element is smaller than first then update both first and second */
            if (healthData[i].yAxis < first_smallest) {
              first_smallest = healthData[i].yAxis;
            }
          }
          // return first largest yAxis value
          var first_largest_yAxis = d3.max(healthData, function(d) { return d.yAxis});

          /* slice original data until today */
          var mainData = [], rulData = [];
          var rulMinData = [], rulMaxData = [];
          var todayIndex = null;
          for (var i = 0, len = healthData.length; i < len; i++){
            if(healthData[i].xAxis === todayX || healthData[i].yAxis === todayY){
              // index of `today` data point in the datum
              todayIndex = healthData.indexOf(healthData[i]);
			        break;
            }
          }
          mainData = healthData.slice(0, todayIndex+1);
          
          var rulData2 = healthData.slice(todayIndex, healthData.length-1);
		  
		  //now adjust the data if any value is more than 1 in yAxis
		  rulData = _.map(rulData2, function(e) {
			  if(e.yAxisMin > 1 || e.yAxisMax > 1) {
				// e.yAxisMin /= 100;
				// e.yAxisMax /= 100;
			  }
			  return e;
		  })

          // if it's an ROD graph, slice off siteAvgData from todayIndex
          if(scope.chartType === 'ROD'){
            // siteAvgData = siteAvgData.slice(0, todayIndex);
          }

          // omit yAxisMin and yAxisMax keys
          _.omit(healthData, ['yAxisMin', 'yAxisMax']);
          _.omit(rulData, ['yAxisMin', 'yAxisMax']);
          // separate yAxisMin and yAxisMax data from rulData
          for(var i in rulData){
            rulMinData.push({ xAxis: rulData[i].xAxis, yAxis: rulData[i].yAxisMin});
            rulMaxData.push({ xAxis: rulData[i].xAxis, yAxis: rulData[i].yAxisMax });
          }
          rulData = _.sortBy(rulData, 'yAxis');
          rulData = _.remove(rulData, function(ele) {
            return ele.xAxis < 0 || ele.yAxis > 0;
          });
          rulData.sort(compare);

          rulMinData = _.sortBy(rulMinData, 'yAxis');
          rulMinData = _.remove(rulMinData, function(ele) {
            return ele.xAxis < 0 || ele.yAxis > 0;
          });
          rulMinData.sort(compare);

          rulMaxData = _.sortBy(rulMaxData, 'yAxis');
          rulMaxData = _.remove(rulMaxData, function(ele) {
            return ele.xAxis < 0 || ele.yAxis > 0;
          });
          rulMaxData.sort(compare);

          var x = d3.scale.linear()
            .domain([0, d3.max([].concat(
              healthData.map(function(d) { return d.xAxis }),
              // siteAvgData.map(function(d) { return d.xAxis }),
              // trendData.map(function(d) { return d.xAxis }),
              rulMinData.map(function(d) { return d.xAxis }),
              rulMaxData.map(function(d) { return d.xAxis }))
            )])
            .range([0, width - margin.right]);

          var yMaxValue = d3.max(
            [].concat(
              healthData.map(function(d) { return d.yAxis }),
              // siteAvgData.map(function(d) { return d.yAxis }),
              // trendData.map(function(d) { return d.yAxis }),
              rulMinData.map(function(d) { return d.yAxis }),
              rulMaxData.map(function(d) { return d.yAxis }),
              [maxOptimalValue])
          );

          var y = d3.scale.linear()
            .domain([0, yMaxValue])
            .range([height / 2, 0]);

          var xTicks = d3.max([].concat(
              healthData.length,
              // siteAvgData.length,
              // trendData.length,
              rulMinData.length,
              rulMaxData.length)
            );

          // count number of decimals after the decimal point
          var countDecimals = function (value) {
            if ((value % 1) != 0){
              return value.toString().split(".")[1].length;
            }
            return 0;
          };

          // var initSec = d3.select("svg")
          // .attr("id", "life-graph-group");
          // if(initSec){
          //   initSec.remove();
          // }
          // define SVG canvas
          var svg = d3.select(element.children()[0]).select("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
            .attr("id", "life-graph-group")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var chartBody = svg.append("g").attr("id", "chart-body");

          var xAxisLine = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(6)
            /*.tickFormat(function(d) {
                // This function is temporary.
                // Will be changed/removed in a short time.

                var startDate = new Date(2003, 1);
                var endDate = new Date(2016, 1);

                // Maps the x-axis values to milliseconds
                var dateScale = d3.scale.linear()
                        .domain(x.domain())
                        .range([startDate.getTime(), endDate.getTime()]);

                // var format = d3.time.format("%e %b' %y");
                var format = d3.time.format("%b' %y");
                // var format = d3.time.format("%Y");
                var str = format(new Date(dateScale(d)))
                // console.log(str);
                return str;
            })*/
            // .ticks(xTicks/35)
            .tickSize(0)
            .tickPadding(8);
            
            
            d3.selectAll(".xAxis>.tick>text")
		      .style("font-size",8);

          var yAxisLine = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(function(d) {
              // if(d>0 && countDecimals(d)<2) { return d * 100; }
              // else { return d * 10; }
              return d;
             })
            .tickSize(5)
            .ticks(5)
            .tickPadding(6);

          // define line
          var line = d3.svg.line()
            .interpolate("linear")
            .x(function(d) {
              return x(d.xAxis);
            })
            .y(function(d) {
              return y(d.yAxis);
            });

          // define area
          //custom interpolator - function(points) { return points.join(""); }
          var area = d3.svg.area()
            .interpolate("monotone")
            .x(function(d) {
              return x(d.xAxis);
            })
            .y0(height)
            .y1(function(d) {
              return y(d.yAxis);
            });

          // render axes
          var xTranslateHeight = height / 2;
          chartBody.append("g")
            .attr("id", "life-chart-xAxis")
            .attr("class", "x lifeChartAxis")
            .attr("transform", "translate(0," + xTranslateHeight + ")")
            .call(xAxisLine);

          chartBody.append("g")
            .attr("id", "life-chart-yAxis")
            .attr("class", "y lifeChartAxis")
            .call(yAxisLine);

          // render vertical grid lines
          chartBody.selectAll("line.horizontalGrid").data(y.ticks(5)).enter()
            .append("line")
            .attr({
              "class": "horizontalGrid",
              "x1": 0,
              "x2": width,
              "y1": function(d) {
                return y(d);
              },
              "y2": function(d) {
                return y(d);
              },
              "fill": "none",
              "shape-rendering": "crispEdges",
              "stroke": "#cbcccd",
              "stroke-width": "1px"
            });

          // return first largest xAxis value
          var first_largest_xAxis = d3.max(healthData, function(d) { return d.xAxis});

          // render optimal area
          scope.optimalmin = $filter('setDecimal')(minOptimalValue, 3);
          scope.optimalmax = $filter('setDecimal')(maxOptimalValue, 3);
          if(minOptimalValue && maxOptimalValue){
            chartBody.append("rect")
            .attr("class", "optimalArea")
            .attr("x", 0)
            .attr("y", y(minOptimalValue))
            .attr("width", width)
            .attr("height", Math.abs(y(maxOptimalValue) - y(minOptimalValue)) )
            .style("visibility", (scope.chartType === 'RUL')? ((false)? 'visible': 'hidden') : ((scope.isRODOptimalVal)? 'visible': 'hidden'))
          }

          // render Health trend line
          var healthLine = chartBody.append("path")
            .datum(mainData)
            .attr("class", function(d) {
              return "lifeChartLine healthLine";
            })
            .attr("d", line);
          var totalLength = healthLine.node().getTotalLength();
          healthLine
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1000)
            .ease("linear")
            .attr("stroke-dashoffset", 0)
            .attr("visibility", (scope.chartType === 'RUL')? ((scope.isRULHealthLine)? 'visible': 'hidden') : ((scope.isROD)? 'visible': 'hidden'));

          // Adds two circles for min & max points in life-chart
          if (scope.chartType === 'ROD') {
            var minPoint = _.minBy(mainData, 'yAxis');
            var maxPoint = _.maxBy(mainData, 'yAxis');

            chartBody.append("circle")
              .attr("cx", x(minPoint.xAxis))
              .attr("cy", y(minPoint.yAxis))
              .attr("r", 4)
              .attr("stroke", "#65318f")
              .attr("stroke-width", "3px")
              .attr("fill", "#fff")

            chartBody.append("circle")
              .attr("cx", x(maxPoint.xAxis))
              .attr("cy", y(maxPoint.yAxis))
              .attr("r", 4)
              .attr("stroke", "#65318f")
              .attr("stroke-width", "3px")
              .attr("fill", "#fff")
          }

          /*
          var siteAvgLine = chartBody.append("path")
            .datum(siteAvgData)
            .attr("class", function(d) {
              return "lifeChartLine siteAvgLine";
            })
            .attr("stroke", "#d78219")
            .attr("d", line);
          var lineLen = siteAvgLine.node().getTotalLength();
          var dashLen = 10;
          var ddLen = dashLen * 2;
          var darray = dashLen;
          while(ddLen < lineLen){
            darray += "," + dashLen + "," + dashLen;
            ddLen += dashLen * 2;
          }
          siteAvgLine
              .attr("stroke-linecap", "round")
              .attr("stroke-dasharray", darray + "," +lineLen)
              .attr("stroke-dashoffset", lineLen)
            .transition()
              .duration(2000)
              .ease("linear")
              .attr("stroke-dashoffset", 0)
              .attr("visibility", (scope.chartType === 'RUL')? ((scope.isRULSiteAvgLine)? 'visible': 'hidden') : ((scope.isRODSiteAvgLine)? 'visible': 'hidden'));
          */

          /*
          var trendLine = chartBody.append("path")
            .datum(trendData)
            .attr("class", function(d) {
              return "lifeChartLine trendLine";
            })
            .attr("d", line);
          var totalLength = trendLine.node().getTotalLength();
          trendLine
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1000)
            .ease("linear")
            .attr("stroke-dashoffset", 0)
            .attr("visibility", (scope.chartType === 'RUL')? ((scope.isRULTrendLine)? 'visible': 'hidden') : ((scope.isRODTrendLine)? 'visible': 'hidden'));
            */

           if(scope.data.showMoreLines == true){
            if(scope.data.dataPoints){
              var rulMinData = scope.data.dataPoints["minLine"];
              var rulMaxData = scope.data.dataPoints["maxLine"];
              var rulData = scope.data.dataPoints["avgLine"];
              if(rulMinData && rulMinData.length){
                var len = rulMinData.length;
                for(var i=0; i<len; i++){
                  rulMinData[i].xAxis = parseFloat(rulMinData[i].xAxis).toFixed(2);
                }
              }

              if(rulMaxData && rulMaxData.length){
                var len = rulMaxData.length;
                for(var i=0; i<len; i++){
                  rulMaxData[i].xAxis = parseFloat(rulMaxData[i].xAxis).toFixed(2);
                }
              }

              if(rulData && rulData.length){
                var len = rulData.length;
                for(var i=0; i<len; i++){
                  rulData[i].xAxis = parseFloat(rulData[i].xAxis).toFixed(2);
                }
              }

            }
          }

          if(rulData.length > 0){
            // define line
            var rulLine = d3.svg.line()
              .interpolate("linear")
              .x(function(d) {
                if(d) return x(d.xAxis);
              })
              .y(function(d) {
                if(d) return y(d.yAxis);
              });
              
            var rulArea = chartBody.append("g").attr("id", "rul-area").attr("class", "rulArea");
            rulData = _.map(rulData, function(o) { return _.omit(o, 'yAxisMin'); });
            rulData = _.map(rulData, function(o) { return _.omit(o, 'yAxisMax'); });
            var rulMinArea = [_.head(rulData), _.last(rulData)];
            var rulMaxArea = [_.head(rulData)];
            for(var i in rulMinData){
              rulMinArea.push(rulMinData[i]);
            }
            rulMinArea.sort(compare);
            rulMinArea = _.uniqBy(rulMinArea, 'xAxis');
            for(var i in rulMaxData){
              rulMaxArea.push(rulMaxData[i]);
            }
            rulMaxArea.sort(compare);
            rulMaxArea = _.uniqBy(rulMaxArea, 'xAxis');
            rulMaxArea.push(_.last(rulData));
            rulArea.append("path")
              .datum(rulMinArea)
              .attr("id", "rul-minArea")
              .attr("fill", "#32d1dc")
              .transition()
              .delay(1000)
              .duration(2000)
              .ease("linear")
              .attr("d", rulLine)
              .attr("visibility", (scope.isRULArea)? 'visible': 'hidden');
            rulArea.append("path")
              .datum(rulMaxArea)
              .attr("id", "rul-maxArea")
              .attr("fill", "#32d1dc")
              .transition()
              .delay(1000)
              .duration(2000)
              .ease("linear")
              .attr("d", rulLine)
              .attr("visibility", (scope.isRULArea)? 'visible': 'hidden');
              
            var rulAvgLine = rulArea.append("path")
              .datum(rulData)
              .attr("id", "rulAvgLine")
              .attr({ "fill": "none", "stroke": "#479fa5", "stroke-width": "2px" })
              .attr("d", rulLine);
            var totalLength = rulAvgLine.node().getTotalLength();
            rulAvgLine
              .attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
              .transition()
              .delay(1000)
              .duration(1000)
              .ease("linear")
              .attr("stroke-dashoffset", 0)
            	.attr("visibility", (scope.isRULArea)? 'visible': 'hidden');
            var rulMaxLine = rulArea.append("path")
              .datum(rulMaxData)
              .attr("id", "rulMaxLine")
              .attr({ "fill": "none", "stroke": "#479fa5", "stroke-width": "1px" })
              .attr("d", rulLine);
            var totalLength = rulMaxLine.node().getTotalLength();
            rulMaxLine
              .attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
              .transition()
              .delay(1000)
              .duration(2000)
              .ease("linear")
              .attr("stroke-dashoffset", 0)
              .attr("visibility", (scope.isRULArea)? 'visible': 'hidden');
            var rulMinLine = rulArea.append("path")
              .datum(rulMinData)
              .attr("id", "rulMinLine")
              .attr({ "fill": "none", "stroke": "#479fa5", "stroke-width": "1px" })
              .attr("d", rulLine);
            var totalLength = rulMinLine.node().getTotalLength();
            rulMinLine
              .attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
              .transition()
              .delay(1000)
              .duration(2000)
              .ease("linear")
              .attr("stroke-dashoffset", 0)
              .attr("visibility", (scope.isRULArea)? 'visible': 'hidden');
          }

         
          

          // Render line at today. yAxis is ranges from 0 to 1 as per design
          var lineData = [
            {"xAxis": todayX, "yAxis": 0},
            {"xAxis": todayX, "yAxis": 100}
          ];
          /* today-line group */
          var todayGroup = chartBody.append("g").attr("id", "today-group");
          todayGroup.append("path")
            .datum(lineData)
            .attr("id", "life-chart-todayLine")
            .attr("class", "todayLine")
            .attr("d", line);
          todayGroup.append("text")
            .attr("id", "life-chart-todayLabel")
            .attr("class", "lifeChartAxis")
            .attr("transform", "translate(" + x(todayX) + "," + 0 + ")")
            .attr("dx", "5px")
            .attr("dy", "10px")
            .text("Today");
          // render circular intersection dot
          todayGroup.selectAll("dot")
          .data(todayPoint)
          .enter().append("circle")
            .attr("id", "life-chart-intersect")
            .attr("class", "dots")
            .attr("r", "4")
            .attr("cx", function(d) {
                return x(d.xAxis);
            })
            .attr("cy", function(d){
              return y(d.yAxis);
            });
          todayGroup.attr("visibility", (scope.chartType === 'RUL')? ((scope.isRULTodayLine)? 'visible': 'hidden') : ((scope.isRODTodayLine)? 'visible': 'hidden'));

          chartBody.append("rect")
            .attr("id", "chart-rect" + "-" + scope.chartType)
            .attr("fill", "#3ed1db")
            .style("opacity", 1e-6)
            .attr("width", width)
            .attr("height", height / 2)
            .on({
              "mouseover": function(d) {
                showHoverLine();
                scope.$apply();
              },
              "mouseout": function(d) {
                hideHoverLine();
                scope.$apply();
              }
            })
            .on("mousemove", function(d){
              var mouseX = d3.mouse(this)[0];
              var mouseY = d3.mouse(this)[1];
              // NOTE: round number to nearest 100
              // var xPoint = Math.ceil((x.invert(mouseX))/100)*100;

              var xPoint = Number(parseFloat(x.invert(mouseX)).toFixed(2));

              if(scope.chartType === 'ROD'){
                var xPoint = Math.ceil((x.invert(mouseX))/100)*100;
              }
              if((scope.chartType === 'RUL') ? scope.isRULHealthLine : false){
                var healthLinePoint = _.find(healthDataTemp, function(d){
                  return d.xAxis == xPoint;
                });
              }
              // if((scope.chartType === 'RUL')? (scope.isRULSiteAvgLine): (scope.isRODSiteAvgLine)){
              //   var siteAvgLinePoint = _.find(siteAvgData, function(d){
              //     return d.xAxis === xPoint;
              //   });
              // }
              // if((scope.chartType === 'RUL')? (scope.isRULTrendLine): (scope.isRODTrendLine)){
              //   var trendLinePoint = _.find(trendData, function(d){
              //     return d.xAxis === xPoint;
              //   });
              // }
              if((scope.chartType === 'RUL')? (scope.isRULArea): false){
                var RULPoint = _.find(rulData, function(d){
                  return d.xAxis == xPoint;
                });
              }
              if((scope.chartType === 'RUL')? (scope.isRULArea): false){
                var RULMinPoint = _.find(rulMinData, function(d){
                  return d.xAxis == xPoint;
                });
              }
              if((scope.chartType === 'RUL')? (scope.isRULArea): false){
                var RULMaxPoint = _.find(rulMaxData, function(d){
                  return d.xAxis == xPoint;
                });
              }

              if((scope.chartType === 'ROD') && (scope.isROD)){
                var healthLinePoint = _.find(healthData, function(d){
                  return d.xAxis == xPoint;
                });
              }


              if(healthLinePoint){
                hoverLine.attr("x1", x(healthLinePoint.xAxis)).attr("x2", x(healthLinePoint.xAxis));
                healthLineCircle
                  .style("opacity", 1)
                  .attr("cx", x(healthLinePoint.xAxis))
                  .attr("cy", y(healthLinePoint.yAxis));
                scope.xvalue = healthLinePoint.xAxis;
                scope.healthvalue = healthLinePoint.yAxis;
              }

              if((scope.chartType === 'ROD') && (scope.isROD)){
                if(!healthLinePoint){
                  hoverLine.attr("x1", x(todayX)).attr("x2", x(todayX));
                  healthLineCircle
                  .style("opacity", 1)
                  .attr("cx", x(todayX))
                  .attr("cy", y(todayY));
                }
              }
              // if(trendLinePoint){
              //   hoverLine.attr("x1", x(trendLinePoint.xAxis)).attr("x2", x(trendLinePoint.xAxis));
              //   trendLineCircle
              //     .style("opacity", 1)
              //     .attr("cx", x(trendLinePoint.xAxis))
              //     .attr("cy", y(trendLinePoint.yAxis));
              //   scope.xvalue = trendLinePoint.xAxis;
              //   scope.trendvalue = trendLinePoint.yAxis;
              // }
              // if(siteAvgLinePoint){
              //   hoverLine.attr("x1", x(siteAvgLinePoint.xAxis)).attr("x2", x(siteAvgLinePoint.xAxis));
              //   siteAvgLineCircle
              //     .style("opacity", 1)
              //     .attr("cx", x(siteAvgLinePoint.xAxis))
              //     .attr("cy", y(siteAvgLinePoint.yAxis));
              //   scope.xvalue = siteAvgLinePoint.xAxis;
              //   scope.siteavgvalue = siteAvgLinePoint.yAxis;
              // }
              if(RULPoint){
                hoverLine.attr("x1", x(RULPoint.xAxis)).attr("x2", x(RULPoint.xAxis));
                rulAvgCircle
                  .datum(RULPoint)
                  .style("opacity", 1)
                  .attr("cx", function(d){ return x(d.xAxis);})
                  .attr("cy", function(d){ return y(d.yAxis);});
                scope.xvalue = RULPoint.xAxis;
                scope.trendvalue = RULPoint.yAxis;
              }
              if(RULMinPoint){
                hoverLine.attr("x1", x(RULMinPoint.xAxis)).attr("x2", x(RULMinPoint.xAxis));
                rulMinCircle
                  .datum(RULMinPoint)
                  .style("opacity", 1)
                  .attr("cx", function(d){ return x(d.xAxis);})
                  .attr("cy", function(d){ return y(d.yAxis);});
                scope.rulminvalue = RULMinPoint.yAxis;
              }
              if(RULMaxPoint){
                hoverLine.attr("x1", x(RULMaxPoint.xAxis)).attr("x2", x(RULMaxPoint.xAxis));
                rulMaxCircle
                  .datum(RULMaxPoint)
                  .style("opacity", 1)
                  .attr("cx", function(d){ return x(d.xAxis);})
                  .attr("cy", function(d){ return y(d.yAxis);});
                scope.rulmaxvalue = RULMaxPoint.yAxis;
              }
              scope.$apply();
            });
            var hoverLine = chartBody.append('line')
              .attr("id", "hover-line")
              .attr({ 'x1': 10, 'y1': 0, 'x2': 10, 'y2': height/2 })
              .attr('class', 'hoverLine')
              .style("opacity", 1e-6); // hidden by default
            function showHoverLine() {
              hoverLine.style("opacity", 1);
							if(scope.chartType === 'RUL' && scope.isRULHealthLine){
								healthLineCircle.style("opacity", 1);
							} else if(scope.chartType === 'ROD' && scope.isROD){
								healthLineCircle.style("opacity", 1);
							}
							// if(scope.chartType === 'RUL' && scope.isRULTrendLine){
							// 	trendLineCircle.style("opacity", 1);
							// } else if(scope.chartType === 'ROD' && scope.isRODTrendLine){
							// 	trendLineCircle.style("opacity", 1);
							// }
							// if(scope.chartType === 'RUL' && scope.isRULSiteAvgLine){
							// 	siteAvgLineCircle.style("opacity", 1);
							// } else if(scope.chartType === 'ROD' && scope.isRODSiteAvgLine){
							// 	siteAvgLineCircle.style("opacity", 1);
							// }
							if(scope.chartType === 'RUL' && scope.isRULArea){
								rulAvgCircle.style("opacity", 1);
	              rulMinCircle.style("opacity", 1);
	              rulMaxCircle.style("opacity", 1);
							}
            }
            function hideHoverLine() {
              hoverLine.style("opacity", 1e-6);
              healthLineCircle.style("opacity", 1e-6);
              // trendLineCircle.style("opacity", 1e-6);
              // siteAvgLineCircle.style("opacity", 1e-6);
              rulAvgCircle.style("opacity", 1e-6);
              rulMinCircle.style("opacity", 1e-6);
              rulMaxCircle.style("opacity", 1e-6);
              scope.xvalue = null;
              // scope.trendvalue = null;
              // scope.siteavgvalue = null;
              scope.healthvalue = null;
              scope.rulminvalue = null;
              scope.rulmaxvalue = null;
            }

            var healthLineCircle = chartBody.append("circle")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", 6)
              .attr("fill", "#65318f")
              .style("opacity", 1e-6);
            // var trendLineCircle = chartBody.append("circle")
            //   .attr("cx", 0)
            //   .attr("cy", 0)
            //   .attr("r", 3)
            //   .attr("fill", "#ea148c")
            //   .style("opacity", 1e-6);
            // var siteAvgLineCircle = chartBody.append("circle")
            //   .attr("cx", 0)
            //   .attr("cy", 0)
            //   .attr("r", 3)
            //   .attr("fill", "#d78219")
            //   .style("opacity", 1e-6);
            //TODO: try to reuse one circle point instead of three
            var rulAvgCircle = chartBody.append("circle")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", 3)
              .attr("fill", "#479fa5")
              .style("opacity", 1e-6);
            var rulMinCircle = chartBody.append("circle")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", 3)
              .attr("fill", "#479fa5")
              .style("opacity", 1e-6);
            var rulMaxCircle = chartBody.append("circle")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", 3)
              .attr("fill", "#479fa5")
              .style("opacity", 1e-6);

            if(scope.isRULArea){
              var rulMinLastPoint = _.last(rulMinData);
            	var rulAvgLastPoint = _.last(rulData);
            	var rulMaxLastPoint = _.last(rulMaxData);
            	var rulMinLastData = [
            		rulMinLastPoint, {"xAxis": parseFloat(rulMinLastPoint.xAxis).toFixed(2), "yAxis": -25}
            	];
            	var rulAvgLastData = [
            		rulAvgLastPoint, {"xAxis": parseFloat(rulAvgLastPoint.xAxis).toFixed(2), "yAxis": -55}
            	];
            	var rulMaxLastData = [
            		rulMaxLastPoint, {"xAxis": parseFloat(rulMaxLastPoint.xAxis).toFixed(2), "yAxis": -65}
              ];
              
              if(rulMinLastPoint.yAxis > 0 || scope.data.showMoreLines){
                var rulMinLabelLine = chartBody.append("path")
                .datum(rulMinLastData)
                .attr("id", "life-chart-minLine")
                .attr("class", "rulLabelLine")
                .attr("d", line);
                var rulMinLabelLineLength = rulMinLabelLine.node().getTotalLength();
                var xRulMinLabelPos = x(rulMinLastPoint.xAxis) - 30;
                rulMinLabelLine
                  .attr("stroke-dasharray", rulMinLabelLineLength + " " + rulMinLabelLineLength)
                  .attr("stroke-dashoffset", rulMinLabelLineLength)
                .transition()
                  .delay(2000)
                  .duration(2000)
                  .ease("linear")
                .attr("stroke-dashoffset", 0);
                chartBody.append("text")
              		.attr("id", "life-chart-minLabel")
              		.attr("class", "rulLineLabel")
              		.attr("text-anchor", "middle")
              		.attr("transform", "translate(" + xRulMinLabelPos + "," + y(-25) + ")")
                  .attr( "fill-opacity", 0 )
                  .transition()
                    .delay(2000)
                    .duration(2000)
                    .ease("linear")
                  .attr( "fill-opacity", 1 )
                  .text(rulMinLastPoint.xAxis + " " + "(min)");
              }
              if(rulAvgLastPoint.yAxis > 0 || scope.data.showMoreLines) {
                var rulAvgLabelLine = chartBody.append("path")
                .datum(rulAvgLastData)
                .attr("id", "life-chart-avgLine")
                .attr("class", "rulLabelLine")
                .attr("d", line);
                var rulAvgLabelLineLength = rulAvgLabelLine.node().getTotalLength();
                var xRulAvgLabelPos = x(rulAvgLastPoint.xAxis) - 30;
                rulAvgLabelLine
                  .attr("stroke-dasharray", rulAvgLabelLineLength + " " + rulAvgLabelLineLength)
                  .attr("stroke-dashoffset", rulAvgLabelLineLength)
                .transition()
                  .delay(2000)
                  .duration(2000)
                  .ease("linear")
                .attr("stroke-dashoffset", 0);
                chartBody.append("text")
              		.attr("id", "life-chart-avgLabel")
              		.attr("class", "rulLineLabel")
              		.attr("text-anchor", "middle")
              		.attr("transform", "translate(" + xRulAvgLabelPos + "," + y(-55) + ")")
                  .attr( "fill-opacity", 0 )
                  .transition()
                    .delay(2000)
                    .duration(2000)
                    .ease("linear")
                  .attr( "fill-opacity", 1 )
                  .text(rulAvgLastPoint.xAxis + " " + "(avg)");
              }
              if(rulMaxLastPoint.yAxis > 0 || scope.data.showMoreLines){
                var rulMaxLabelLine = chartBody.append("path")
                .datum(rulMaxLastData)
                .attr("id", "life-chart-maxLine")
                .attr("class", "rulLabelLine")
                .attr("d", line);
                var rulMaxLabelLineLength = rulMaxLabelLine.node().getTotalLength();
                var xRulMaxLabelPos = x(rulMaxLastPoint.xAxis) - 30;
                rulMaxLabelLine
                  .attr("stroke-dasharray", rulMaxLabelLineLength + " " + rulMaxLabelLineLength)
                  .attr("stroke-dashoffset", rulMaxLabelLineLength)
                  .transition()
                    .delay(2000)
                    .duration(2000)
                    .ease("linear")
                  .attr("stroke-dashoffset", 0);
                chartBody.append("text")
              		.attr("id", "life-chart-maxLabel")
              		.attr("class", "rulLineLabel")
              		.attr("text-anchor", "middle")
              		.attr("transform", "translate(" + xRulMaxLabelPos + "," + y(-65) + ")")
                  .attr( "fill-opacity", 0 )
                  .transition()
                    .delay(2000)
                    .duration(2000)
                    .ease("linear")
                  .attr( "fill-opacity", 1 )
                  .text((rulMaxLastPoint.xAxis + " " + "(max)"));
              }
            }
          // chartBody.append("text")
          //   .attr("id", "life-chart-todayLabel")
          //   .attr("class", "lifeChartAxis")
          //   .attr("transform", "translate(" + x(todayX) + "," + 0 + ")")
          //   .attr("dx", "5px")
          //   .attr("dy", "10px")
          //   .text("Today");
          // render labels
          if(scope.chartType == 'ROD'){
            chartBody.append("text")
            .attr("id", "life-chart-yLabel")
            .attr("class", "lifeChartLabels")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (-45) + "," + ((height/2)-150) + ") rotate(-90)")
            .text(scope.data.yLabel + ' (%)');
          } else{
            chartBody.append("text")
            .attr("id", "life-chart-yLabel")
            .attr("class", "lifeChartLabels")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (-45) + "," + ((height/2)-50) + ") rotate(-90)")
            .text(scope.data.yLabel + ' (%)');
          }
          

          chartBody.append("text")
            .attr("id", "life-chart-xLabel")
            .attr("class", "lifeChartLabels")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (50) + "," + ((height + padding)/2) + ")")
            .text(scope.data.xLabel);

          //TODO: RUL text
          // chartBody.append("text")
          //   .attr("id", "life-chart-rulLabel")
          //   .attr("class", "lifeChartAxis")
          //   .attr("transform", "translate(" + (width - 100) + "," + (height/3) + ")")
          //   .attr("dx", "5px")
          //   .attr("dy", "10px")
          //   .text("RUL");

        };

        scope.$watch('data', function(newValue) {
          if(newValue){
            $timeout(function() {
              scope.render();
            }, 300);
          }
        }, true);

        // scope.render(scope.data, scope.today);

        // $timeout(function() {
        //   scope.$watch('today', function(newValue) {
        //     if(newValue){
        //       element.removeAttr("life-chart");
        //       $compile(element)(scope);
        //       scope.render(scope.data, scope.today);
        //     }
        //   }, true);
        // }, 3000);

      } // link function ends
    } // return ends
  }]); // directive ends
})();

'use strict';
angular.module('cyient.lineDashedLine', [])
.directive('lineDashedLine', [function() {
    return {
        scope: {
            data: "="
        },
        restrict: "AE",
        templateUrl: "directives/lineDashedLine/linedashedline.html",
        link: function(scope, elem, attrs) {

            var container = elem[0];

            scope.$watch("data", function(newVal, oldVal) {
                render();
            }, true);

            var xKey = 'xValue', yKey = 'yValue';

            function render() {

                var failures = scope.data;

                d3.select(container).select("svg").text("");

                var containerWidth = elem.width();
                var containerHeight = elem.height();

                var parseDate = d3.time.format("%Y%m%d").parse;

                var margin = {top: 10, right: 10, bottom: 150, left: 55},
                    width = containerWidth - margin.left - margin.right,
                    height = containerHeight - margin.top - margin.bottom;

                var x = d3.time.scale().range([0, width]),
                    y = d3.scale.linear().range([height, 0]),
                    color = d3.scale.category10();

                var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .tickFormat(d3.time.format("%d %b"));

                var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                var line = d3.svg.line()
                    .interpolate("basis")
                    .x(function(d) { return x(d[xKey]); })
                    .y(function(d) { return y(d[yKey]); });

                var svg = d3.select(container).select("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                color.domain(d3.keys(failures[0]).filter(function(key) { return key !== "date"; }));

                x.domain([
                    d3.min(failures, function(c) { return d3.min(c.values, function(v) { return v[xKey]; }); }),
                    d3.max(failures, function(c) { return d3.max(c.values, function(v) { return v[xKey]; }); })
                ]);

                y.domain([
                    0,
                    d3.max(failures, function(c) { return d3.max(c.values, function(v) { return v[yKey]; }); })
                ]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

                var failure = svg.selectAll(".failure")
                    .data(failures)
                    .enter().append("g")
                    .attr("class", "failure");

                failure.append("path")
                    .attr("class", "line")
                    .style("stroke-dasharray", function(d,i) {
                        if (i % 2 === 0)
                            return ("1, 0");
                        else 
                            return ("2, 5");
                    })
                    .attr("d", function(d) { return line(d.values); })
                    .style("fill", "none")
                    .style("stroke", function(d) { return color(d.name); });

                var focus = svg.append("g")
                    .attr("class", "focus")
                    .style("display", "none");

                focus.append("circle")
                    .attr("r", 4.5);

                focus.append("text")
                    .attr("x", 9)
                    .attr("dy", ".35em");

            } // End of render function
            
        } // End of link function
    }; // End of return object
}]); // End of directive

'use strict';
(function(){
  angular.module('cyient.loader', [])
    .directive('loading', ['$http', function ($http){
    return {
      restrict: 'A',
      templateUrl: 'directives/loader/loader.html',
      link: function (scope, elm, attrs){
        scope.isLoading = function(){
          return $http.pendingRequests.length > 0;
        };
        scope.$watch(scope.isLoading, function(val){
          if(val){
            elm.show();
          } else{
            elm.hide();
          }
        });
      }
    };

    }]);
})();

'use strict';
(function(){
  angular.module("directives/miniLifeChart/miniLifeChart.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("directives/miniLifeChart/miniLifeChart.html",
    "<div><div id=\"mini-lifechart-graph\"><svg class=\"mini-life-canvas\"></svg></div></div>");
  }]);
  angular.module('cyient.miniLifechart', ["directives/miniLifeChart/miniLifeChart.html"])
  .directive('miniLifechart', ['$q', '$timeout', '$log', function($q, $timeout, $log) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        width: '=',
        height: '=',
        todayX: '=',
        todayY: '=',
        smh: '=',
        rul: '=',
        data: '=data',
        dotRadius: "=",
      },
      templateUrl: "directives/miniLifeChart/miniLifeChart.html",
      link: function(scope, element, attrs) {

        var margin = {
          top: 10,
          right: 15,
          bottom: 30,
          left: 10
        };
        // define SVG canvas
        var svg = d3.select(element.children()[0]).select("svg")
          .attr("width", "100%")
          .attr("height", scope.height + margin.bottom)
          .append("g")
            .attr("id", "mini-lifechart-group")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // make the visualization responsive by watching for changes in window size
        window.onresize = function() {
          return scope.$apply();
        };
        scope.$watch(function() {
          return angular.element(window)[0].innerWidth;
        }, function() {
          var innerWidth = angular.element(window)[0].innerWidth;
          if(innerWidth >= 1024 && innerWidth < 1200) {
            scope.width = 95;
          }
          if(innerWidth >= 1200) {
            scope.width = 125;
          }
          return scope.render(scope.data, scope.todayX, scope.todayY);
        });

        scope.render = function(data, todayX, todayY) {

          if(!data){
            return
          }

          var dots = {
            originPos: 0,
            xTodayPos: null,
            yTodayPos: null,
            rulPos: null
          };

          // Trim the graph data
          for (var i = data.length-1; i >= 0; i--){
            if (data[i].yAxis < 0){
              data.splice(i, 1); // remove negative points
            }
          }

          // return first smallest yAxis value
          var first_smallest = Number.POSITIVE_INFINITY;
          for (var i in data) {
            /* If current element is smaller than first then update both first and second */
            if (data[i].yAxis < first_smallest) {
              first_smallest = data[i].yAxis;
            }
          }

          // return first largest xAxis value
          var first_largest = Math.max.apply(Math, data.map(function(o){return o.xAxis;}));
          dots.rulPos = first_largest;

          // return data midpoint of trimmed graph data
          var midpoint = data[Math.round((data.length - 1) / 2)];
          dots.xTodayPos = todayX;

          // add label property and Today label to trimmed data
          for (var j in data) {
            data[j].label = "";
            if(data[j].xAxis === todayX){
              data[j].label = "Today";
              dots.yTodayPos = data[j].yAxis;
            }
          }

          var width = scope.width;
          var height = scope.height;

          var x = d3.scale.linear()
            .domain([0, d3.max(data, function(d) {
              return d.xAxis;
            })])
            .range([0, width]);

          var y = d3.scale.linear()
            .domain([0, d3.max(data, function(d) {
              return d.yAxis;
            })])
            .range([height, 0]);

          var xAxisLine = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(0)
            .tickSize(0)
            .tickPadding(12);

          var yAxisLine = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(0)
            .tickSize(0)
            .tickPadding(12);

          svg.selectAll("*").remove();
          var chartBody = svg.append("g");

          // define line to extend axes (as per design)
          var line = d3.svg.line()
            .interpolate("monotone")
            .x(function(d) {
              return x(d.xAxis);
            })
            .y(function(d) {
              return y(d.yAxis);
            });

          var mainArea = function(datum, field) {
            return d3.svg.area()
              .interpolate("monotone")
              .x(function(d) {
                return x(d.xAxis);
              })
              .y0(height)
              .y1(function(d) {
                return y(d[field] || 0);
              })(datum);
          };

          // define RUL area with linear interpolation
          var rulArea = function(datum, field){
            return d3.svg.area()
              .interpolate("linear")
              .x(function(d) {
                return x(d.xAxis);
              })
              .y0(height)
              .y1(function(d) {
                return y(d[field] || 0);
              })(datum);
          };

          var mainData = [];
          var todayIndex = null, mainTickValue = null;
          for (var i = 0, len = data.length; i < len; i++){
            if(data[i].label === "Today"){
              // find index of data point where label is "Today"
              todayIndex = data.indexOf(data[i]);
              mainTickValue = data[todayIndex].xAxis;
            }
          }

          // slice original data until today index
          mainData = data.slice(0, todayIndex+1);

          // define tick values
          var totalTickValue = data[data.length-1].xAxis;
          var secondTickValue = totalTickValue - mainTickValue;

          // filter out data that has labels Today and RUL
          // this data will be used to render the second area
          var data2 = data.filter(function(el) {
            return el.label === "Today" || el.xAxis === first_largest;
          });

          // render X axis
          svg.append("g")
            .attr("class", "x mlifeChartAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxisLine);

          // render Y axis
          svg.append("g")
            .attr("class", "y mlifeChartAxis")
            .call(yAxisLine);

          // add main area
          chartBody.append('path')
            .attr('class', 'mArea1')
            .attr('d', mainArea(mainData))
            .attr('opacity', 1)
            .transition().duration(1000)
            .attr('d', mainArea(mainData, 'yAxis'));

          // add second area
          chartBody.append('path')
            .attr('class', 'mArea2')
            .attr('d', rulArea(data2))
            .attr('opacity', 1)
            .transition().duration(2000)
            .attr('d', rulArea(data2, 'yAxis'));

          var mainLine = chartBody.append("path")
            .datum(mainData)
            .attr("class", "mlifeChartLine")
            .transition()
              .duration(3000)
              .attr("d", line);

          var rulLine = chartBody.append("path")
            .datum(data2)
            .attr("class", "mlifeChartLine")
            .style("stroke-dasharray", ("3, 3"))
            .transition()
              .duration(3000)
              .attr("d", line);

          // draw line at today
          var lineData = [
            {"xAxis": dots.xTodayPos, "yAxis": 0},
            {"xAxis": dots.xTodayPos, "yAxis": dots.yTodayPos}
          ];
          var thisWidth;
          var todayLine = chartBody.append("path")
            .datum(lineData)
            .attr("class", "midpointLine")
            .attr("d", line);
            var todayLineLength = todayLine.node().getTotalLength();
            todayLine
              .attr("stroke-dasharray", todayLineLength + " " + todayLineLength)
              .attr("stroke-dashoffset", todayLineLength)
              .transition()
              .duration(1000)
              .ease("linear")
              .attr("stroke-dashoffset", 0);

          // x-axis labels
          chartBody.append("text")
            .attr("id", "main-label")
            .attr("x", 0)
            .attr("y", height + 5)
            .attr("dy", ".85em")
            // .attr("dx", (width-25)/2+5)
            .attr("class", "mlifeChartLabels")
            .text(Math.round(scope.smh));
            // .each(function (d, i) {
            //   thisWidth = this.getComputedTextLength()
            // })
            // .attr("style", "transform:translateX("+ -thisWidth + "px" + ")");

          chartBody.append("text")
            .attr("id", "secondary-label")
            .attr("x", width - 25)
            .attr("y", height + 5)
            .attr("dy", ".85em")
            .attr("class", "mlifeChartLabels")
            .text(Math.round(scope.rul));

          // add 'Today' label
          // svg.append("text")
          //   .attr("id", "today-label")
          //   .attr("transform", "translate(" + (x(dots.xTodayPos)-30) + "," + (y(todayY)-5) + ")")
          //   .attr("class", "mlifeChartLabels")
          //   .text("Today");

        };

        scope.$watch('data', function(newValue) {
          if(newValue){
            scope.render(scope.data, scope.todayX, scope.todayY);
          }
        }, true);

      } // link function ends
    } // return ends
  }]); // directive ends
})();

'use strict';
angular.module('cyient.onfinishrender', [])
.directive('onFinishRender', ['$timeout', function($timeout) {
    return {
        restrict: "AE",
        link: function(scope, elem, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    };
}]);

'use strict';
angular.module('cyient.popup', [])
.directive('popup', [function() {
    return {
        restrict: 'AE',
        transclude: true,
        scope: {
            onClose: '&'
        },
        templateUrl: 'directives/popup/popup.html',
        link: function(scope, elem) {
        }
    };
}])

'use strict';
angular.module('cyient.progressarc', [])
    .directive('progressArc', [function () {
        return {
            scope: {
                progress: "="
                , type: "@", // Possible values: "type1", "type2"
                label: "@", // Optional. Default value: "Health"
                radius: "=", // Optional. Default value: 85
                radiusDiff: "=", // Optional. Default value: (radius - 8)
                avg: "="
                , hidePointer: "="
            }
            , restrict: "AE"
            , link: function (scope, elem, attrs) {

                    function render() {
                        var container = elem[0];
                        var outerRadius = scope.radius || 85;
                        var innerRadius = outerRadius - (scope.radiusDiff || 8);

                        var width = 2 * outerRadius + 5
                            , height = outerRadius + 30
                            , degrees = 1 * Math.PI;

                        var label = scope.label || "Health";

                        // Colors for Arcs & Text
                        var foregroundColor = (scope.type === "type1") ? "#ffdd33" : "#f7941e";
                        var backgroundColor = "#e1e1de";
                        var textColor = (scope.type === "type1") ? "#fff" : "#000";

                        // Converts progress values to radians
                        var radianScale = d3.scale.linear()
                            .domain([0, 100])
                            .range([-Math.PI / 2, Math.PI / 2])
                            .clamp(true);

                        // Converts progress values to degrees
                        var degreeScale = d3.scale.linear()
                            .domain([0, 100])
                            .range([-180, 180])
                            .clamp(true);

                        var progressStartAngle = radianScale(0);
                        var progressEndAngle = radianScale(scope.progress);

                        var avgArcStartAngle = radianScale(scope.avg - 1);
                        var avgArcEndAngle = radianScale(scope.avg + 1);

                        var backgroundArc = d3.svg.arc()
                            .innerRadius(innerRadius)
                            .outerRadius(outerRadius)
                            .startAngle(progressStartAngle)
                            .endAngle(Math.PI / 2);

                        var foregroundArc = d3.svg.arc()
                            .innerRadius(innerRadius)
                            .outerRadius(outerRadius)
                            .startAngle(progressStartAngle);

                        var avgArc = d3.svg.arc()
                            .innerRadius(innerRadius)
                            .outerRadius(outerRadius)
                            .startAngle(avgArcStartAngle)
                            .endAngle(avgArcEndAngle);

                        var svg = d3.select(container).append("svg")
                            .attr("width", width)
                            .attr("height", height)
                            .attr("class", "progress-arc")
                            .append("g")
                            .attr("transform", "translate(0, 10)");

                        var meter = svg.append("g")
                            .attr("class", "season-progress")
                            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

                        var background = meter.append("path")
                            .datum({
                                endAngle: Math.PI / 2
                            })
                            .style("fill", backgroundColor)
                            .attr("d", backgroundArc);

                        var foreground = meter.append("path")
                            .datum({
                                endAngle: progressStartAngle
                            })
                            .style("fill", foregroundColor)
                            .attr("class", "foreground")
                            .attr("d", foregroundArc);

                        foreground.transition()
                            .duration(2000)
                            .delay(750)
                            .ease("linear")
                            .attrTween("d", function (d) {
                                var interpolate = d3.interpolate(d.endAngle, progressEndAngle)
                                return function (t) {
                                    d.endAngle = interpolate(t);
                                    return foregroundArc(d);
                                };
                            });

                        var avgMark = meter.append("path")
                            .datum({
                                endAngle: progressEndAngle
                            })
                            .style("fill", "#fff")
                            .style("opacity", 0)
                            .attr("d", avgArc)

                        // Pointer Height & Pointer Displacement
                        var pHeight = (scope.type === "type1") ? 23 : 12;
                        var pDisp = (scope.type === "type1") ? 20 : 8;

                        var pointer = meter.append("g")
                            .attr("transform", function (d) {
                                return "translate(" + avgArc.centroid(d) + ")";
                            })
                            .append("svg:image")
                            .attr("xlink:href", "svg/pointer.svg")
                            .attr("x", -4)
                            .attr("y", -pDisp)
                            .attr("width", 8)
                            .attr("height", pHeight)
                            .attr("transform", "rotate(" + (degreeScale(scope.avg) / 2) + ")")

                        var tip = d3.tip()
                            .attr('class', 'd3-tip')
                            .offset([-10, 0])
                            .html("Site Avg: " + Math.round(scope.avg));
                        svg.call(tip);
                        pointer
                            .on('mouseover', tip.show)
                            .on('mouseout', tip.hide)

                        if (scope.hidePointer) {
                            pointer.attr("display", "none");
                        }

                        var progressText = meter.append("text")
                            .attr("text-anchor", "middle")
                            .attr("dy", "-.35em")
                            .attr("font-size", "35")
                            .style("fill", textColor)
                            .attr("class", "progress-percent")
                            .text(Math.round(scope.progress) + "%");

                        var textGroup = svg.append("g")
                            .attr("transform", "translate(" + 0 + "," + (outerRadius + 15) + ")")
                            .attr("width", outerRadius)
                            /*.style("fill", textColor)*/
                            .attr("font-size", "17")
                            .attr("y", "5");

                        var zeroText = textGroup.append("text")
                            .attr("text-anchor", "left")
                            .attr("x", "0")
                            .attr("class", "startpoint")
                            .text("0");

                        var hundredText = textGroup.append("text")
                            .attr("text-anchor", "end")
                            .attr("x", 2 * outerRadius + 5)
                            .attr("class", "endpoint")
                            .text("100");

                        var healthText = textGroup.append("text")
                            .attr("text-anchor", "middle")
                            .attr("x", outerRadius)
                            .attr("class", "progress-health")
                            .text(label);

                        elem.on("$destroy", function () {
                            tip.destroy();
                        });
                    } // End of render function

                    scope.$watch('progress', function (newValue) {
                        if (newValue) {
                            d3.select(elem[0]).selectAll('svg.progress-arc').remove(); // Prevent duplicate nodes
                            render();
                        }
                    });

                } // End of link function
        }; // End of return statement
}]) // End of directive
    .directive("smProgressArc", [function () {
        return {
            scope: {
                progress: "="
            }
            , restrict: "AE"
            , link: function (scope, elem, attrs) {

                    var container = elem[0];

                    var width = 28; // Measured from given designs

                    var outerRadius = width / 2;
                    var innerRadius = 0.7 * outerRadius;

                    // Maps progress percentages to angles
                    var radianScale = d3.scale.linear()
                        .domain([0, 100])
                        .range([-Math.PI / 2, Math.PI / 2])
                        .clamp(true);

                    var svg = d3.select(container)
                        .append("svg")
                        .attr("width", width)
                        .attr("height", width / 2)
                        .append("g")
                        .attr("transform", "translate(" + (width / 2) + "," + (width / 2) + ")");

                    var arc = d3.svg.arc()
                        .innerRadius(outerRadius)
                        .outerRadius(innerRadius)
                        .startAngle(radianScale(0))
                        .endAngle(radianScale(100));

                    svg.append("path")
                        .attr("class", "arc")
                        .attr("d", arc)
                        .attr("fill", "#c4c7ce");

                    arc.endAngle(radianScale(scope.progress));

                    svg.append("path")
                        .attr("d", arc)
                        .attr("fill", "#f7941e");

                } // End of link function
        }; // End of return statment
}]); // End of directive
'use strict';
(function(){
  var configData = {
    animate: true,
    max: 100
  };
  angular.module('cyient.progressbar', ['progressbar.template'])
    .constant('progressConfig', {
      animate: true,
      max: 100
    })
    .controller('progressController', progressController)
    .filter('firstLetterCapital', function(){
      return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
      }
    })
    .directive('progressBar', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: 'progressController',
        scope: {
          value: '=',
          maxParam: '=?max',
          type: '@',
		  textval: '@',
          trucks: '='
        },
        templateUrl: 'directives/progressBar/progress-bar.html',
        link: function(scope, element, attrs, progressCtrl) {
          $timeout(function(){
            progressCtrl.addBar(scope, angular.element(element.children()[0]), {
              title: attrs.title
            });
          }, 200);
        }
      };
    }]);

    progressController.$inject = ['$scope', '$attrs', 'progressConfig', '$timeout'];
    function progressController($scope, $attrs, progressConfig, $timeout) {
      var self = this;
      var animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;
      this.bars = [];

      $scope.max = getMaxOrDefault();
      this.addBar = function(bar, element, attrs) {
        if (!animate) {
          element.css({
            'transition': 'none'
          });
        }

        this.bars.push(bar);

        bar.max = getMaxOrDefault();
        bar.title = attrs && angular.isDefined(attrs.title) ? attrs.title : 'progressbar';

        bar.$watch('value', function(value) {
          bar.recalculatePercentage();
        });

        bar.recalculatePercentage = function() {
          var totalPercentage = self.bars.reduce(function(total, bar) {
            bar.percent = +(100 * bar.value / bar.max).toFixed(2);
            return total + bar.percent;
          }, 0);

          if (totalPercentage > 100) {
            bar.percent -= totalPercentage - 100;
          }
        };

        bar.$on('$destroy', function() {
          element = null;
          self.removeBar(bar);
        });
      };

      this.removeBar = function(bar) {
        this.bars.splice(this.bars.indexOf(bar), 1);
        this.bars.forEach(function(bar) {
          bar.recalculatePercentage();
        });
      };

      $scope.$watch('maxParam', function(maxParam) {
        self.bars.forEach(function(bar) {
          bar.max = getMaxOrDefault();
          bar.recalculatePercentage();
        });
      });

      function getMaxOrDefault() {
        return angular.isDefined($scope.maxParam) ? $scope.maxParam : progressConfig.max;
      }
    }
})();

angular.module('progressbar.template', []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/progressBar/progress-bar.html",
    "<div>" +
    "<div class=\"progress-bar-title\">\n" +
      "<span class='das-trucks-count' ng-class=\"type && 'progress-bar-title-' + type\">{{trucks}}</span><span class='das-trucks-type' ng-class=\"type && 'progress-bar-title-' + type\">{{textval | firstLetterCapital}}</span>\n" +
    "</div>\n" +
    "<div class=\"progress\">\n" +
    "  <div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: (percent < 100 ? percent : 0) + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" aria-labelledby=\"{{::title}}\" ng-transclude></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "");
}]);

'use strict';
angular.module('cyient.scrollonclick', [])
.directive('scrollOnClick', [function() {
    return {
        restrict: "A",
        link: function(scope, elem) {
            elem.on('click', function() {
                $("html,body").animate({scrollTop: 0}, 1000);
            });
        }
    };
}])

'use strict';
angular.module('cyient.scrolltowhen', [])
.directive('scrollToWhen', ['$timeout', function($timeout) {
    return {
        restrict: "AE",
        scope: {
            scrollToWhen: '=',
            scrollToDelay: '='
        },
        link: function(scope, elem) {

            scope.$watch('scrollToWhen', function(newVal, oldVal) {
                if (newVal === true) {
                    $timeout(function() {
                        $('html, body').animate({
                            scrollTop: elem.offset().top - 135
                        }, 1000);
                    }, scope.scrollToDelay || 0);
                }
            })

        }
    };
}]);

'use strict';
angular.module('cyient.slider', [])
.directive('slider', ['$window', function($window) {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            ticksNumber: '=',
            disabled: '=',
            onSlide: '&'
        },
        link: function(scope, elem, attrs) {

            var container = elem[0];

            scope.ticksNumber = 10;

            render();

            // Reponsive directive. Not the most efficient way,
            // but it works for now without any visible performance problem
            angular.element($window).bind('resize', function() {
                if ($window.innerWidth >= 1024) {
                    render();
                    scope.$digest();
                }
            });

            function render() {

                if (!scope.data) {
                    return;
                }

                d3.select(container).text("");

                var min = scope.data.min;
                var max = scope.data.max;
                var rangeMin = scope.data.start;
                var rangeMax = scope.data.end;
                var currVal = scope.data.current;
                var optimal = scope.data.optimal;
                var units = scope.data.units;

                var stepVal = (scope.data.max - scope.data.min)/10;

                var margin = {
                    top: 0,
                    right: 20,
                    bottom: 0,
                    left: 10
                };

                var width = elem.width() - margin.left - margin.right,
                    height = 70 - margin.bottom - margin.top;

                var x = d3.scale.linear()
                    .domain([min, max])
                    .range([0, width])
                    .clamp(true);

                var xb = d3.scale.linear()
                    .domain([rangeMin, rangeMax])
                    .range([x(rangeMin), x(rangeMax)])
                    .clamp(true);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(scope.ticksNumber)
                    .tickFormat(function(d) {
                        return (d > 0) ? (d) : (d);
                        // return (d > 0) ? (d + units) : (d);
                    })
                    .tickSize(10, 10)
                    .tickPadding(5);

                var svg = d3.select(container).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + -10 + ")");

                if (scope.disabled) {
                    svg.attr("class", "disabled");
                }

                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (height / 2) + ")")
                    .call(xAxis)
                    .select(".domain")
                    .select(function() {
                        return this.parentNode.appendChild(this.cloneNode(true));
                    })
                    .attr("class", "halo");

                var currValMark = svg.append("g")
                    .attr("class", "curr-val-axis-grp")
                    .attr("transform", "translate(" + xb(scope.data.current) + "," + height / 2  + ")");

                currValMark.append("line")
                    .attr("class", "curr-val-axis-line")
                    .attr("x1", "0")
                    .attr("y1", "0")
                    .attr("x2", "0")
                    .attr("y2", "12")

                currValMark.append("text")
                    .text(scope.data.current)
                    // .text(scope.data.current + '' + units)
                    .attr("text-anchor", "middle")
                    .attr("y", "15")
                    .attr("dy", "0.71em")

                var slider = svg.append("g");

                var brush = d3.svg.brush()
                    .x(xb)
                    .extent([scope.data.current, scope.data.current])
                    .on("brush", brushed);

                slider.attr("class", "slider")
                    .call(brush);

                slider.selectAll(".extent, .resize")
                    .remove();

                slider.select(".background")
                    .attr("height", height);

                var lineData = [
                    { x: x(rangeMin), y: height / 2 },
                    { x: x(rangeMax), y: height / 2 }
                ];

                var lineFunction = d3.svg.line()
                    .x(function(d) { return d.x })
                    .y(function(d) { return d.y });

                slider.append("path")
                    .attr("d", lineFunction(lineData))
                    .attr("class", "brush")
                    .attr("transform", "translate(0, 2)");

                var handle = slider.append("circle")
                    .attr("class", "handle")
                    .attr("transform", "translate(0," + height / 2 + ")")
                    .attr("r", 8);

                slider.insert("line", ":first-child")
                    .attr("class", "boundary-lines")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", 20)
                    .attr("transform", "translate(" + xb(rangeMin) + "," + (height / 2 - 10) + ")");

                slider.insert("line", ":first-child")
                    .attr("class", "boundary-lines")
                    .attr("x1", 10)
                    .attr("y1", 0)
                    .attr("x2", 10)
                    .attr("y2", 20)
                    .attr("transform", "translate(" + (xb(rangeMax) - 10) + "," + (height / 2 - 10) + ")");

                slider.insert("line", ":first-child")
                    .attr("class", "optimal-val")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", 20)
                    .attr("transform", "translate(" + xb(scope.data.optimal) + "," + (height / 2 - 10) + ")")

                slider.call(brush.event)
                    .transition()
                    .duration(750)
                    .call(brush.event);

                var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(Math.round(scope.data.current) + scope.data.units);
                svg.call(tip);
                handle
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)

                elem.on("$destroy", function() {
                    tip.destroy();
                });

                var firstTimeBrushCall = true;
                function brushed() {
                    var value = brush.extent()[0];

                    if (!d3.event.sourceEvent) {
                        handle.attr("cx", xb(value));
                        return;
                    }

                    value = xb.invert(d3.mouse(this)[0]);
                    brush.extent([value, value]);

                    /* Path for disabled slider */
                    if (scope.disabled) {
                        handle.attr("cx", xb(scope.data.current));
                        return;
                    }

                    /* Path for non-disabled slider */

                    // Discrete step implementation
                    var newVal, valChanged = false;
                    var diff = value - scope.data.current;
                    if (Math.abs(diff) < stepVal) { // If the difference is small enough, don't change anything
                        newVal = scope.data.current;
                    } else if (diff < 0) { // Slider moves left
                        newVal = scope.data.current - stepVal;
                        valChanged = true;
                    } else if (diff > 0) { // Slider moves right
                        newVal = scope.data.current + stepVal;
                        valChanged = true;
                    } else {
                        newVal = scope.data.current
                    }
                    // Making sure the current value is in the bounds
                    newVal = _.clamp(newVal, rangeMin, rangeMax);

                    handle.attr("cx", xb(newVal));

                    scope.data.current = Math.round(newVal);
                    tip.html(Math.round(scope.data.current) + scope.data.units);
                    if(firstTimeBrushCall) {
                        firstTimeBrushCall = false;
                    } else {
                        // do nothing ...
                        // scope.onSlide();
                    }
                    if (valChanged) {
                        scope.$apply();
                    }

                } // End of brushed function

            } // End of render function

        } // End of link function
    }; // End of return statement
}]); // End of directive

angular.module('ui.slimscroll', []).directive('slimscroll', function () {
  'use strict';

  return {
    restrict: 'A',
    link: function ($scope, $elem, $attr) {
      var off = [];
      var option = {};
      
      var refresh = function () {		
         if ($attr.slimscroll) {		         
           option = $scope.$eval($attr.slimscroll);		           
         } else if ($attr.slimscrollOption) {		        
           option = $scope.$eval($attr.slimscrollOption);		           
         }
         
        $($elem).slimScroll({ destroy: true });		        

         $($elem).slimScroll(option);		         
      };
      
      var registerWatch = function () {
        if ($attr.slimscroll && !option.noWatch) {
          off.push($scope.$watchCollection($attr.slimscroll, refresh));
        }

        if ($attr.slimscrollWatch) {
          off.push($scope.$watchCollection($attr.slimscrollWatch, refresh));
        }

        if ($attr.slimscrolllistento) {
          off.push($scope.$on($attr.slimscrolllistento, refresh));
        }
      };

      var destructor = function () {
        $($elem).slimScroll({ destroy: true });
        off.forEach(function (unbind) {
          unbind();
        });
        off = null;
      };

      off.push($scope.$on('$destroy', destructor));
      
      registerWatch();
    }
  };
});

/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.7
 *
 */
(function($) {

  $.fn.extend({
    slimScroll: function(options) {

      var defaults = {

        // width in pixels of the visible scroll area
        width : 'auto',

        // height in pixels of the visible scroll area
        height : '',

        // width in pixels of the scrollbar and rail
        size : '7px',

        // scrollbar color, accepts any hex/color value
        color: '#000',

        // scrollbar position - left/right
        position : 'right',

        // distance in pixels between the side edge and the scrollbar
        distance : '1px',

        // default scroll position on load - top / bottom / $('selector')
        start : 'top',

        // sets scrollbar opacity
        opacity : .4,

        // enables always-on mode for the scrollbar
        alwaysVisible : false,

        // check if we should hide the scrollbar when user is hovering over
        disableFadeOut : false,

        // sets visibility of the rail
        railVisible : false,

        // sets rail color
        railColor : '#333',

        // sets rail opacity
        railOpacity : .2,

        // whether  we should use jQuery UI Draggable to enable bar dragging
        railDraggable : true,

        // defautlt CSS class of the slimscroll rail
        railClass : 'slimScrollRail',

        // defautlt CSS class of the slimscroll bar
        barClass : 'slimScrollBar',

        // defautlt CSS class of the slimscroll wrapper
        wrapperClass : 'slimScrollDiv',

        // check if mousewheel should scroll the window if we reach top/bottom
        allowPageScroll : false,

        // scroll amount applied to each mouse wheel step
        wheelStep : 20,

        // scroll amount applied when user is using gestures
        touchScrollStep : 200,

        // sets border radius
        borderRadius: '7px',

        // sets border radius of the rail
        railBorderRadius : '7px'
      };

      var o = $.extend(defaults, options);

      // do it for every element that matches selector
      this.each(function(){

      var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
        barHeight, percentScroll, lastScroll,
        divS = '<div></div>',
        minBarHeight = 30,
        releaseScroll = false;

        // used in event handlers and for better minification
        var me = $(this);

        // ensure we are not binding it again
        if (me.parent().hasClass(o.wrapperClass))
        {
            // start from last bar position
            var offset = me.scrollTop();

            // find bar and rail
            bar = me.siblings('.' + o.barClass);
            rail = me.siblings('.' + o.railClass);

            getBarHeight();

            // check if we should scroll existing instance
            if ($.isPlainObject(options))
            {
              // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
              if ( 'height' in options && options.height == 'auto' ) {
                me.parent().css('height', 'auto');
                me.css('height', 'auto');
                var height = me.parent().parent().height();
                me.parent().css('height', height);
                me.css('height', height);
              } else if ('height' in options) {
                var h = options.height;
                me.parent().css('height', h);
                me.css('height', h);
              }

              if ('scrollTo' in options)
              {
                // jump to a static point
                offset = parseInt(o.scrollTo);
              }
              else if ('scrollBy' in options)
              {
                // jump by value pixels
                offset += parseInt(o.scrollBy);
              }
              else if ('destroy' in options)
              {
                // remove slimscroll elements
                bar.remove();
                rail.remove();
                me.unwrap();
                return;
              }

              // scroll content by the given offset
              scrollContent(offset, false, true);
            }

            return;
        }
        else if ($.isPlainObject(options))
        {
            if ('destroy' in options)
            {
            	return;
            }
        }

        // optionally set height to the parent's height
        o.height = (o.height == 'auto') ? me.parent().height() : o.height;

        // wrap content
        var wrapper = $(divS)
          .addClass(o.wrapperClass)
          .css({
            position: 'relative',
            overflow: 'hidden',
            width: o.width,
            height: o.height
          });

        // update style for the div
        me.css({
          overflow: 'hidden',
          width: o.width,
          height: o.height
        });

        // create scrollbar rail
        var rail = $(divS)
          .addClass(o.railClass)
          .css({
            width: o.size,
            height: '100%',
            position: 'absolute',
            top: 0,
            display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
            'border-radius': o.railBorderRadius,
            background: o.railColor,
            opacity: o.railOpacity,
            zIndex: 90
          });

        // create scrollbar
        var bar = $(divS)
          .addClass(o.barClass)
          .css({
            background: o.color,
            width: o.size,
            position: 'absolute',
            top: 0,
            opacity: o.opacity,
            display: o.alwaysVisible ? 'block' : 'none',
            'border-radius' : o.borderRadius,
            BorderRadius: o.borderRadius,
            MozBorderRadius: o.borderRadius,
            WebkitBorderRadius: o.borderRadius,
            zIndex: 99
          });

        // set position
        var posCss = (o.position == 'right') ? { right: o.distance } : { left: o.distance };
        rail.css(posCss);
        bar.css(posCss);

        // wrap it
        me.wrap(wrapper);

        // append to parent div
        me.parent().append(bar);
        me.parent().append(rail);

        // make it draggable and no longer dependent on the jqueryUI
        if (o.railDraggable){
          bar.bind("mousedown", function(e) {
            var $doc = $(document);
            isDragg = true;
            t = parseFloat(bar.css('top'));
            pageY = e.pageY;

            $doc.bind("mousemove.slimscroll", function(e){
              currTop = t + e.pageY - pageY;
              bar.css('top', currTop);
              scrollContent(0, bar.position().top, false);// scroll content
            });

            $doc.bind("mouseup.slimscroll", function(e) {
              isDragg = false;hideBar();
              $doc.unbind('.slimscroll');
            });
            return false;
          }).bind("selectstart.slimscroll", function(e){
            e.stopPropagation();
            e.preventDefault();
            return false;
          });
        }

        // on rail over
        rail.hover(function(){
          showBar();
        }, function(){
          hideBar();
        });

        // on bar over
        bar.hover(function(){
          isOverBar = true;
        }, function(){
          isOverBar = false;
        });

        // show on parent mouseover
        me.hover(function(){
          isOverPanel = true;
          showBar();
          hideBar();
        }, function(){
          isOverPanel = false;
          hideBar();
        });

        // support for mobile
        me.bind('touchstart', function(e,b){
          if (e.originalEvent.touches.length)
          {
            // record where touch started
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        me.bind('touchmove', function(e){
          // prevent scrolling the page if necessary
          if(!releaseScroll)
          {
  		      e.originalEvent.preventDefault();
		      }
          if (e.originalEvent.touches.length)
          {
            // see how far user swiped
            var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
            // scroll content
            scrollContent(diff, true);
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        // set up initial height
        getBarHeight();

        // check start position
        if (o.start === 'bottom')
        {
          // scroll content to bottom
          bar.css({ top: me.outerHeight() - bar.outerHeight() });
          scrollContent(0, true);
        }
        else if (o.start !== 'top')
        {
          // assume jQuery selector
          scrollContent($(o.start).position().top, null, true);

          // make sure bar stays hidden
          if (!o.alwaysVisible) { bar.hide(); }
        }

        // attach scroll events
        attachWheel(this);

        function _onWheel(e)
        {
          // use mouse wheel only when mouse is over
          if (!isOverPanel) { return; }

          var e = e || window.event;

          var delta = 0;
          if (e.wheelDelta) { delta = -e.wheelDelta/120; }
          if (e.detail) { delta = e.detail / 3; }

          var target = e.target || e.srcTarget || e.srcElement;
          if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
            // scroll content
            scrollContent(delta, true);
          }

          // stop window scroll
          if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
          if (!releaseScroll) { e.returnValue = false; }
        }

        function scrollContent(y, isWheel, isJump)
        {
          releaseScroll = false;
          var delta = y;
          var maxTop = me.outerHeight() - bar.outerHeight();

          if (isWheel)
          {
            // move bar with mouse wheel
            delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();

            // move bar, make sure it doesn't go out
            delta = Math.min(Math.max(delta, 0), maxTop);

            // if scrolling down, make sure a fractional change to the
            // scroll position isn't rounded away when the scrollbar's CSS is set
            // this flooring of delta would happened automatically when
            // bar.css is set below, but we floor here for clarity
            delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

            // scroll the scrollbar
            bar.css({ top: delta + 'px' });
          }

          // calculate actual scroll amount
          percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
          delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

          if (isJump)
          {
            delta = y;
            var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
            offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
            bar.css({ top: offsetTop + 'px' });
          }

          // scroll content
          me.scrollTop(delta);

          // fire scrolling event
          me.trigger('slimscrolling', ~~delta);

          // ensure bar is visible
          showBar();

          // trigger hide when scroll is stopped
          hideBar();
        }

        function attachWheel(target)
        {
          if (window.addEventListener)
          {
            target.addEventListener('DOMMouseScroll', _onWheel, false );
            target.addEventListener('mousewheel', _onWheel, false );
          }
          else
          {
            document.attachEvent("onmousewheel", _onWheel)
          }
        }

        function getBarHeight()
        {
          // calculate scrollbar height and make sure it is not too small
          barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
          bar.css({ height: barHeight + 'px' });

          // hide scrollbar if content is not long enough
          var display = barHeight == me.outerHeight() ? 'none' : 'block';
          bar.css({ display: display });
        }

        function showBar()
        {
          // recalculate bar height
          getBarHeight();
          clearTimeout(queueHide);

          // when bar reached top or bottom
          if (percentScroll == ~~percentScroll)
          {
            //release wheel
            releaseScroll = o.allowPageScroll;

            // publish approporiate event
            if (lastScroll != percentScroll)
            {
                var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
                me.trigger('slimscroll', msg);
            }
          }
          else
          {
            releaseScroll = false;
          }
          lastScroll = percentScroll;

          // show only when required
          if(barHeight >= me.outerHeight()) {
            //allow window scroll
            releaseScroll = true;
            return;
          }
          bar.stop(true,true).fadeIn('fast');
          if (o.railVisible) { rail.stop(true,true).fadeIn('fast'); }
        }

        function hideBar()
        {
          // only hide when options allow it
          if (!o.alwaysVisible)
          {
            queueHide = setTimeout(function(){
              if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg)
              {
                bar.fadeOut('slow');
                rail.fadeOut('slow');
              }
            }, 1000);
          }
        }

      });

      // maintain chainability
      return this;
    }
  });

  $.fn.extend({
    slimscroll: $.fn.slimScroll
  });

})(jQuery);

'use strict';
(function () {
	var app = angular.module('cyient', ['ngRoute', 'ngResource', 'ngCookies',
		'ngMessages', 'ngAnimate', 'ui.bootstrap.dropdown',
		'cyient.backendservice','cyient.assetService', 'cyient.filters', 'ng.oidcclient',
		'cyient.login', 'cyient.assetgroups', 'cyient.assetgroupdetails',
		'cyient.assets', 'cyient.geography', 'cyient.assetdetails',
		'cyient.insights','cyient.filters', 'cyient.miniLifechart','cyient.lifechart','cyient.loader'
	]);

	app.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when("/login", {
				templateUrl: "templates/login/login.html",
				controller: "Login"
			})
			.when("/", {
				templateUrl: "templates/assetgroups/assetgroups.html",
				controller: "AssetGroups"
			})
			.when("/assetgroupdetails", { //assetgroupdetails
				templateUrl: "templates/assetgroupdetails/assetgroupdetails.html",
				controller: "AssetGroupDetails"
			}).when("/assets", {
				templateUrl: "templates/assets/assets.html",
				controller: "Assets"
			}).when("/geography", {
				templateUrl: "templates/geography/geography.html",
				controller: "Geography"
			}).when("/assetdetails", {
				templateUrl: "templates/assetdetails/assetdetails.html",
				controller: "AssetDetails"
			}).when("/insights", {
				templateUrl: "templates/insights/insights.html",
				controller: "Insights"
			})
	}]);

	app.config(['ngOidcClientProvider', function (ngOidcClientProvider) {
		ngOidcClientProvider.setSettings({
			authority: "https://fetidentitydev.azurewebsites.net",
			client_id: "js", // This may change to another name in
			// production.

			redirect_uri: "http://localhost:1947/callback.html",

			response_type: "id_token token",

			scope: "openid profile api1",

			post_logout_redirect_uri: "http://localhost:1947/index.html",

			// userStore: new Oidc.WebStorageStateStore({ store: window.localStorage
			// })
		});
	}])
	app.run(['$rootScope', function ($rootScope) {
		$rootScope.currentState = "/";
	}]);
	app.controller('Header', ['$scope', '$location', '$cookies',
		'LoginService', '$window', '$rootScope', 'ngOidcClient', Header
	]);

	// Header.$inject = [ '$scope', '$state', '$cookies', 'LoginService',
	// '$window', '$rootScope', 'ngOidcClient' ];
	function Header($scope, $location, $cookies, LoginService, $window,
		$rootScope, ngOidcClient) {
		// var loginDataObjectLength =
		// Object.keys(LoginService.getData()).length;
		// var loginData = (loginDataObjectLength) ? LoginService.getData() :
		// $cookies.getObject('loginData');
		var loginData = $cookies.getObject('loginData');

		function checkImageUrl(url) {
			if (!url) {
				return;
			}
			return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
		}
		if (loginData) {
			$scope.header = {
				fullName: loginData.userFirstName,
				userImage: checkImageUrl(loginData.userImgUrl) ? loginData.userImgUrl : 'assets/images/dummy-photo.jpeg'
			};
		}
		$scope.logout = function () {
			$scope.currentState = "login";
			var cookies = $cookies.getAll();
			angular.forEach(cookies, function (value, key) {
				$cookies.remove(key);
			});
			ngOidcClient.signoutRedirect();
			LoginService.authenticated = false;
			// $state.go('cyient.login');
		};

		$scope.gotoState = function (str) {
			$location.path(str).search({});
		}

		// watcher for animations
		angular.element($window).bind("scroll", function () {
			if ($window.scrollY > 0) {
				$scope.scrolledDown = true;
			} else {
				$scope.scrolledDown = false;
			}
			$scope.$apply();
		});
	}

})();
'use strict';
(function() {
	angular.module('cyient.assetdetails', [ 'ngAnimate' ]).controller(
			'AssetDetails', AssetDetails);
	AssetDetails.$inject = [ '$rootScope', '$scope', '$window', '$http',
			'$log', '$cookies', '$location', 'TruckDetailsService',
			'SocketAPIService', 'LoginService' ];

	function AssetDetails($rootScope, $scope, $window, $http, $log, $cookies,
			$location, TruckDetailsService, SocketAPIService, LoginService) {
		$rootScope.currentState = "assetdetails";
		$window.scrollTo(0, 0); // scroll to top
		// var siteData = $cookies.getObject('siteData')[0];
		var loginData = $cookies.getObject('loginData');
		if (!LoginService.isAuthenticated()) {
			$scope.currentState="login";
			$location.path("/login").search({});
		}

		$scope.currentCategories = {
			sections : []
		};

		$scope.SensorPositions = {
			fracpump : {
				imageUrl : 'assets/images/fracpump.png',
				sensors : [ {
					y : 22,
					x : 255,
					name : 'Outlet Pressure',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 28,
					x : 295,
					name : 'Vibration 1',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 131,
					x : 122,
					name : 'Vibration 2',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 100,
					x : 341,
					name : 'Vibration 3',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 111,
					x : 165,
					name : 'Vibration 4',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 60,
					x : 22,
					name : 'Speed',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 48,
					x : 63,
					name : 'Lube Pressure',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 85,
					x : 91,
					name : 'Lube Temp In',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 170,
					x : 160,
					name : 'Lube Temp Out',
					deacription : 'This is Sensor',
					state : 'active'
				} ],
				consumables : [ {
					y : 97,
					x : 254,
					name : 'Consumables',
					deacription : 'This is Consumable',
					state : 'active'
				} ]
			},
			catwalk : {
				imageUrl : "assets/images/catwalk-ad.png",
				sensors : [ {
					y : 330,
					x : 382,
					name : 'Main Arm Load Pin',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 280,
					x : 425,
					name : 'Main Cylinder Pressure 1',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 240,
					x : 375,
					name : 'Main Cylinder Pressure 2',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 180,
					x : 450,
					name : 'HydraulicAux. System Pressure',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 220,
					x : 402,
					name : 'Hydraulic Main System Pressure',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 205,
					x : 430,
					name : 'Hydraulic Return Pressure',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 190,
					x : 510,
					name : 'Hydraulic Flow',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 10,
					x : 490,
					name : 'Skate Encoder',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 307,
					x : 405,
					name : 'Main Arm Encoder',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 135,
					x : 565,
					name : 'Current Meter',
					deacription : 'This is Sensor',
					state : 'active'
				} ],
				consumables : [ {
					y : 110,
					x : 536,
					name : 'Return Filter Sensor',
					deacription : 'This is Consumable',
					state : 'active'
				}, {
					y : 120,
					x : 507,
					name : 'Main System Filter Sensor',
					deacription : 'This is Consumable',
					state : 'moderate'
				}, {
					y : 148,
					x : 492,
					name : 'Aux System Filter Pressure',
					deacription : 'This is Consumable',
					state : 'active'
				} ]
			},
			ironroughneck : {
				imageUrl : "assets/images/roughneck.png",
				sensors : [ {
					y : 180,
					x : 275,
					name : 'Make-Up Pressure',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 221,
					x : 275,
					name : 'Break-Out Pressure',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 263,
					x : 275,
					name : 'System Pressure',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 475,
					x : 110,
					name : 'Slew Encoder',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 65,
					x : 250,
					name : 'Horizontal Position',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 35,
					x : 130,
					name : 'Vertical Position',
					deacription : 'This is Sensor',
					state : 'active'
				}, {
					y : 99,
					x : 143,
					name : 'Spinner',
					deacription : 'This is Sensor',
					state : 'active'
				} ],
				consumables : [ {
					y : 302,
					x : 45,
					name : 'Hydraulic Filter',
					deacription : 'This is Consumable',
					state : 'active'
				} ]
			}
		};

		$scope.categoriesData = {
			fracpump : {
				"sections" : [ {
					"sectionName" : "Key Data Points",
					"categories" : [ {
						"categoryName" : "Key Data Points",
						"variables" : [ {
							"name" : "Pump_Efficiency",
							"value" : 0.00,
							"disName" : "Pump Efficiency"
						}, {
							"name" : "Piston_Accumulated_Travel",
							"value" : 0.00,
							"disName" : "Piston Accumulated Travel"
						}, {
							"name" : "CBM_InletPressure_Scale_Real",
							"value" : 0.00,
							"disName" : "Inlet Pressure"
						}, {
							"name" : "CBM_LubePressure_Scale_Real",
							"value" : 0.00,
							"disName" : "Lube Pressure"
						}, {
							"name" : "CBM_InletTemp_Scale_Real",
							"value" : 0.00,
							"disName" : "Inlet Temperature"
						}, {
							"name" : "CBM_OutletTemp_Scale_Real",
							"value" : 0.00,
							"disName" : "Outlet Temperature"
						}, {
							"name" : "CBM_OutletPressure_Scale_Real",
							"value" : 0.00,
							"disName" : "Outlet Pressure"
						} ],
						limiting : 1
					} ]
				}, {
					"sectionName" : "Power End Categories",
					"categories" : [ {
						"categoryName" : "Temperatures",
						"variables" : [ {
							"name" : "CBM_InletTemp_Scale_Real",
							"value" : 0.00,
							"disName" : "Inlet Temperature"
						}, {
							"name" : "CBM_OutletTemp_Scale_Real",
							"value" : 0.00,
							"disName" : "Outlet Temperature"
						} ],
						limiting : 1
					}, {
						"categoryName" : "Vibrations",
						"variables" : [ {
							"name" : "CBM_Vibration01_Scale_Real",
							"value" : 0.00,
							"disName" : "Vibration-01"
						}, {
							"name" : "CBM_Vibration02_Scale_Real",
							"value" : 0.00,
							"disName" : "Vibration-02"
						}, {
							"name" : "CBM_LubePressure_Scale_Real",
							"value" : 0.00,
							"disName" : "Lube Pressure"
						} ],
						limiting : 1
					}, {
						"categoryName" : "Pressures",
						"variables" : [ {
							"name" : "CBM_LubePressure_Scale_Real",
							"value" : 0.00,
							"disName" : "Lube Pressure"
						} ],
						limiting : 1
					} ]
				}, {
					"sectionName" : "Fluid End Categories",
					"categories" : [ {
						"categoryName" : "Pressures",
						"variables" : [ {
							"name" : "CBM_InletPressure_Scale_Real",
							"value" : 0.00,
							"disName" : "Inlet Pressure"
						}, {
							"name" : "CBM_OutletPressure_Scale_Real",
							"value" : 0.00,
							"disName" : "Outlet Pressure"
						} ],
						limiting : 1
					}, {
						"categoryName" : "Vibrations",
						"variables" : [ {
							"name" : "CBM_Vibration03_Scale_Real",
							"value" : 0.00,
							"disName" : "Vibration-03"
						}, {
							"name" : "CBM_Vibration04_Scale_Real",
							"value" : 0.00,
							"disName" : "Vibration-04"
						} ],
						limiting : 1
					} ]
				} ]
			},
			ironroughneck : {
				"sections" : [ {
					"sectionName" : "Key Data Points",
					"categories" : [ {
						"categoryName" : "Key Data Points",
						"variables" : [ {
							"name" : "Cycles_Per_Day",
							"value" : 0.00,
							"disName" : "Cycles Per Day"
						}, {
							"name" : "MakeUp_Torque",
							"value" : 0.00,
							"disName" : "MakeUp Torque"
						}, {
							"name" : "BreakOut_Torque",
							"value" : 0.00,
							"disName" : "BreakOut Torque"
						}, {
							"name" : "Ambient_Temperature",
							"value" : 0.00,
							"disName" : "Ambient Temperature"
						}, {
							"name" : "Slip_Detection",
							"value" : 0.00,
							"disName" : "Slip Detection"
						}, {
							"name" : "MakeUp_Pressure",
							"value" : 0.00,
							"disName" : "MakeUp Pressure"
						}, {
							"name" : "BreakUp_Pressure",
							"value" : 0.00,
							"disName" : "BreakUp Pressure"
						} ],
						limiting : 1
					} ]
				}, {
					"sectionName" : "Sensor Categories",
					"categories" : [ {
						"categoryName" : "Temperatures",
						"variables" : [ {
							"name" : "Ambient_Temperature",
							"value" : 0.00,
							"disName" : "Ambient Temperature"
						} ],
						limiting : 1
					}, {
						"categoryName" : "Pressures",
						"variables" : [ {
							"name" : "MakeUp_Pressure",
							"value" : 0.00,
							"disName" : "MakeUp Pressure"
						}, {
							"name" : "BreakUp_Pressure",
							"value" : 0.00,
							"disName" : "BreakUp Pressure"
						}, {
							"name" : "System_Pressure",
							"value" : 0.00,
							"disName" : "System Pressure"
						} ],
						limiting : 1
					}, {
						"categoryName" : "Other Sensors",
						"variables" : [ {
							"name" : "Slew_Encoder",
							"value" : 0.00,
							"disName" : "Slew Encoder"
						}, {
							"name" : "Horz_Encoder",
							"value" : 0.00,
							"disName" : "Horizontal Encoder"
						}, {
							"name" : "Vert_Encoder",
							"value" : 0.00,
							"disName" : "Vertical Encoder"
						}, {
							"name" : "Spinner_RPM",
							"value" : 0.00,
							"disName" : "Spinner RPM"
						}, {
							"name" : "Filter_Health",
							"value" : 0.00,
							"disName" : "Filter Health"
						} ],
						limiting : 1
					} ]
				} ]
			},
			catwalk : {
				"sections" : [ {
					"sectionName" : "Key Data Points",
					"categories" : [ {
						"categoryName" : "Key Data Points",
						"variables" : [ {
							"name" : "CBM_Hydraulic_Flow_Value",
							"value" : 0.00,
							"disName" : "Hydraulic Flow"
						}, {
							"name" : "CBM_HydroElec_Efficiency_Value",
							"value" : 0.00,
							"disName" : "Hydro Electricity Efficiency"
						}, {
							"name" : "CBM_Volumetric_Efficiency_Value",
							"value" : 0.00,
							"disName" : "Volumetric Efficiency"
						}, {
							"name" : "CBM_MainArm_Angle_Value",
							"value" : 0.00,
							"disName" : "MainArm Angle"
						}, {
							"name" : "CBM_Hydraulic_Fluid_Level",
							"value" : 0.00,
							"disName" : "Hydraulic Fluid Level"
						}, {
							"name" : "CBM_Asset_Temperature",
							"value" : 0.00,
							"disName" : "Asset Temperature"
						}, {
							"name" : "CBM_Skate_Position",
							"value" : 0.00,
							"disName" : "Skate Position"
						}, {
							"name" : "CBM_Trough_Load",
							"value" : 0.00,
							"disName" : "Trough Load"
						}, {
							"name" : "CBM_Main_Pressure_Value",
							"value" : 0.00,
							"disName" : "Main Pressure"
						}, {
							"name" : "CBM_Main_Arm_Cylinder_Pressure_1",
							"value" : 0.00,
							"disName" : "Main Arm Cylinder Pressure 1"
						}, {
							"name" : "CBM_Main_Arm_Cylinder_Pressure_2",
							"value" : 0.00,
							"disName" : "Main Arm Cylinder Pressure 2"
						} ],
						limiting : 1
					} ]
				}, {
					"sectionName" : "Sensor Categories",
					"categories" : [ {
						"categoryName" : "Temperatures",
						"variables" : [ {
							"name" : "CBM_Ambient_Temp_Value",
							"value" : 0.00,
							"disName" : "Ambient Temp"
						}, {
							"name" : "CBM_Asset_Temperature",
							"value" : 0.00,
							"disName" : "Asset Temperature"
						} ],
						limiting : 1
					}, {
						"categoryName" : "Pressures",
						"variables" : [ {
							"name" : "CBM_Auxiliary_Pressure_Value",
							"value" : 0.00,
							"disName" : "Auxiliary Pressure"
						}, {
							"name" : "CBM_Return_Pressure_Value",
							"value" : 0.00,
							"disName" : "Return Pressure"
						}, {
							"name" : "CBM_MainFilter_Pressure_Value",
							"value" : 0.00,
							"disName" : "MainFilter Pressure"
						}, {
							"name" : "CBM_AuxFilter_Pressure_Value",
							"value" : 0.00,
							"disName" : "AuxFilter Pressure"
						}, {
							"name" : "CBM_Main_Arm_Cylinder_Pressure_1",
							"value" : 0.00,
							"disName" : "Main Arm Cylinder Pressure 1"
						}, {
							"name" : "CBM_Main_Arm_Cylinder_Pressure_2",
							"value" : 0.00,
							"disName" : "Main Arm Cylinder Pressure 2"
						}, {
							"name" : "CBM_Return_Filter_Pressure",
							"value" : 0.00,
							"disName" : "Return Filter Pressure"
						} ],
						limiting : 1
					}, {
						"categoryName" : "Other Sensors",
						"variables" : [ {
							"name" : "CBM_System_Current_Value",
							"value" : 0.00,
							"disName" : "System Current"
						}, {
							"name" : "CBM_Hydraulic_Flow_Value",
							"value" : 0.00,
							"disName" : "Hydraulic Flow"
						}, {
							"name" : "CBM_Hydraulic_Fluid_Level",
							"value" : 0.00,
							"disName" : "Hydraulic Fluid Level"
						} ],
						limiting : 1
					} ]
				} ]
			}
		}

		// Added dummy web-socket to test...
		SocketAPIService.onmessage(function(data) {
			var wsdata = JSON.parse(data.data);
			// if ($scope.truck.truckData.assetType == 'fracpump') {
			// $scope.powerEndcat.forEach(function (truck) {
			// truck.paramList.forEach(function (ti) {
			// var itemName = ti.id;
			// ti.paramValue = wsdata[itemName] + Math.random(0, 100);
			// })
			// })
			// $scope.fluidEndCat.forEach(function (truck) {
			// truck.paramList.forEach(function (ti) {
			// var itemName = ti.id;
			// ti.paramValue = wsdata[itemName] + Math.random(0, 100);
			// })
			// })
			// } else {
			if ($scope.currentCategories.sections.length) {
				$scope.currentCategories.sections.forEach(function(section) {
					section.categories.forEach(function(cat) {
						cat.variables.forEach(function(ti) {
							var itemName = ti.name;
							ti.value = wsdata[itemName];
						})
					})
				})
			}
			// }
			$scope.$apply();
		});
		var params = $location.search();
		var truckId = params.truckId, assetType;
		if (params.assetType) {
			assetType = params.assetType;
		} else {
			assetType = null;
		}
		$scope.truckdetails = {};
		$scope.truckdetails.showRODGraph = false;
		$scope.truck = {
			truckData : [],
			healthGraphData : [],
			deteriorationGraphData : [],
			showTruckDetails : false,
			// siteName: siteData.siteName,
			mainTruckCategories : []
		};
		$scope.showImgSection = true;
		// $scope.mainTruckCategories = [];

		// get individual truck details data
		TruckDetailsService.getTruck(truckId, assetType).then(function (response) {
			var data = response;
			if (response) {
				if (data) {
					$scope.truck.showTruckDetails = true;
					$scope.truck.truckData = data[0];
					if ($scope.truck.truckData.assetType == 'catwalk') {
						var temp = $scope.truck.truckData.assetHealthData.splice(6, $scope.truck.truckData.assetHealthData.length);
						$scope.truck.truckData.assetMetaData = temp.concat($scope.truck.truckData.assetMetaData);
					}
					// $scope.truck.mainTruckCategories = $scope.truck.truckData.categories;
					// $scope.truck.otherTruckCategories = _.slice($scope.truck.truckData.categories, 6, $scope.truck.truckData.categories.length - 1);
					// $scope.truck.healthGraphData = formattedData[0].healthGraphs;
					// $scope.truck.deteriorationGraphData = formattedData[0].deteriorationGraphs;
					
					$scope.currentCategories = $scope.categoriesData[$scope.truck.truckData.assetType];

					TruckDetailsService.getChartData(truckId, assetType).then(function (response) {
						$scope.truck.healthGraphDatas = response;
						$scope.truck.healthGraphDatas.forEach(function(elem) {
							// if($scope.truck.truckData.assetType == 'fracpump' || $scope.truck.truckData.assetType == 'ironroughneck') {
							// 	elem.xLabel = "Hours";
							// } else {
							// 	elem.xLabel = "Cycles";
							// }				
						})	
						if($scope.truck.truckData.deteriorationGraphs && $scope.truck.truckData.deteriorationGraphs.length){
							$scope.truck.truckData.deteriorationGraphs.forEach(function(detgraph){
								// if($scope.truck.truckData.assetType == 'fracpump' || $scope.truck.truckData.assetType == 'ironroughneck') {
								// 	detgraph.xLabel = "Hours";
								// } else {
								// 	detgraph.xLabel = "Cycles";
								// }
							})
						}
						
					})

				}
			}

		});

		/* opens expanded view of truck insights */
		$scope.openInsights = function(index, variableName, parentIndex) {

			variableName = variableName || '';
			var categoryId = $scope.currentCategories.sections[parentIndex].categories[index].categoryName;
			var uniqCategNames = _
					.chain(
							$scope.currentCategories.sections[parentIndex].categories[index].variables)
					.filter(function(sensor) {
						return sensor;
					}).map(function(sensor) {
						return {
							"name" : sensor.name,
							"displayName" : sensor.disName
						};
					}).uniq().value();
			$location.path('/insights').search({
				'siteId' : $scope.truck.truckData.siteId,
				'truckId' : $scope.truck.truckData.assetId,
				'assetName' : $scope.truck.truckData.assetName,
				'categories' : uniqCategNames,
				'categoryId' : categoryId,
				'assetType' : $scope.truck.truckData.assetType
			});
		};

		/*
		 * Inlining the assignemnt "showToolTip = false" isn't working. So, a
		 * function is created for toggling the display of tooltip.
		 */
		$scope.toggleToolTip = function(flag) {
			$scope.showTooltip = flag;
		};

		$scope.switchDetails = function(partName, type) {
			$scope.x = partName.x;
			$scope.y = partName.y;
			$scope.sensorName = partName.name;
			$scope.showPreviewTooltip = true;
		}

		$scope.closeAssetPreviewTooltp = function(part) {
			$scope.showPreviewTooltip = false;
		}

		$scope.changeLimit = function(cat) {
			if (cat.limiting == 1) {
				cat.limiting = 99;
			} else {
				cat.limiting = 1;
			}
		}

		$scope.navigateToAssetsList = function() {
			// $state.go('cyient.protected.allassets', null, {reload: true,
			// inherit: false});
			var paramObj = {};
			$scope.data = '';
			paramObj.assetGrpType = $scope.truck.truckData.siteType;
			paramObj.assetGrpName = $scope.truck.truckData.siteName;
			paramObj.assetGrpId = $scope.truck.truckData.siteId;
			paramObj.navigateDirectly = true;
			// if (truckId) {
			// paramObj.truckId = truckId;
			// paramObj.navigateDirectly = true;
			// }
			// if (assetName) {
			// paramObj.assetName = siteData.type;
			// }

			$location.path("/").search(paramObj);
		}

	}
})();
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
'use strict';
(function () {
    angular.module('cyient.assetgroups', ['cyient.progressarc', 'ngRoute'])
        .controller('AssetGroups', Allsites);

    Allsites.$inject = ['$scope', '$rootScope', '$http', '$log', '$location', '$window', 'AllSitesService', 'LoginService'];

    function Allsites($scope, $rootScope, $http, $log, $location, $window, AllSitesService, LoginService) {
        $rootScope.currentState = "/";
        $scope.trucks = {};
        $scope.tabs = {};
        $rootScope.currentSiteGroup = {};

        if (!LoginService.isAuthenticated()) {
            $rootScope.currentState = "login";
            $location.path('/login').search({});
            return;
        }

        $window.scrollTo(0, 0); // scroll to top
        // watcher for animations
        angular.element($window).bind("scroll", function () {
            if ($window.scrollY > 0) {
                $scope.scrolledDown = true;
            } else {
                $scope.scrolledDown = false;
            }
            $scope.$apply();
        });

        AllSitesService.getSites().then(function (response) {
            if (!response) {
                return
            } else {
                // var data = response.data.result;
                $scope.trucks.list = response;

                // Todo
                $window.localStorage.setItem('assetGroups', JSON.stringify($scope.trucks.list));
                $scope.trucks.exhaustiveList = response;
                getTabsData();
            }
        });

        // TODO: Need to optimize
        function getTabsData() {
            $scope.tabs.activeTab = "All";

            $scope.tabs.all = $scope.trucks.exhaustiveList.length;
            $scope.tabs.fracpumps = $scope.trucks.exhaustiveList.filter(function (ele2) {
                return ele2.assets.some(function (ele3) {
                    // TODO: this has to change when "name" property key changes
                    return ele3.name == 'fracpump' && ele3.value >= 1;
                })
            }).length;
            $scope.tabs.roughneck = $scope.trucks.exhaustiveList.filter(function (ele2) {
                return ele2.assets.some(function (ele3) {
                    return ele3.name == 'roughneck' && ele3.value >= 1;
                })
            }).length;
            $scope.tabs.catwalk = $scope.trucks.exhaustiveList.filter(function (ele2) {
                return ele2.assets.some(function (ele3) {
                    return ele3.name == 'catwalk' && ele3.value >= 1;
                })
            }).length;
            $scope.tabs.monitor = $scope.trucks.exhaustiveList.filter(function (ele) {
                return ele.healthPercentage > 20 && ele.healthPercentage <= 80
            }).length;
            $scope.tabs.good = $scope.trucks.exhaustiveList.filter(function (ele) {
                return ele.healthPercentage > 80;
            }).length;
            $scope.tabs.critical = $scope.trucks.exhaustiveList.filter(function (ele) {
                return ele.healthPercentage <= 20
            }).length;
        }


        $scope.trucks = {
            'list': [],
            'exhaustiveList': [],
            'parameterInsights': {},
            'isOrder': false, // ascending order
            'trucks.orderSymbol': '+', // ascending order
            'selectedType': 'operationalDate', // default selection,
            'selectedText': 'Operational Date',
            'filterSelectedText': 'All Asset Groups',
            'category': 'All', // default
        };

        // watch option change and reset order
        $scope.$watch('trucks.selectedType', function (NewValue, OldValue) {
            $scope.trucks.isOrder = false;
        }, true);

        $scope.toggleOrder = function () {
            $scope.trucks.isOrder = !$scope.trucks.isOrder;
            if ($scope.trucks.isOrder === false) {
                $scope.trucks.orderSymbol = '+'; // ascending
            } else {
                $scope.trucks.orderSymbol = '-'; // descending
            }
        };

        $scope.trucks.selectedOption = function (selection, selectionText) {
            $scope.trucks.selectedType = selection;
            $scope.trucks.selectedText = selectionText;
        };
        $scope.trucks.filterSelectedOption = function (selection, selectionText) {
            $scope.trucks.filterSelectedText = selectionText;
        };
        // TODO: Need to optimize
        $scope.filterAssets = function (key, val) {
            $scope.tabs.activeTab = val;
            if (key == 'All') {
                $scope.trucks.list = $scope.trucks.exhaustiveList;
                return;
            } else if (key == 'health') {
                $scope.trucks.list = $scope.trucks.exhaustiveList.filter(function (ele) {
                    return checkStability(ele.healthPercentage, val);
                });
                return;
            } else if (key == 'asset') {
                $scope.trucks.list = $scope.trucks.exhaustiveList.filter(function (ele2) {
                    return ele2.assets.some(function (ele3) {
                        return ele3.name == val && ele3.value >= 1;
                    })
                });
            }
        }

        function checkStability(val, condition) {
            if (condition == 'good') {
                return val > 80;
            } else if (condition == 'monitor') {
                return val > 20 && val <= 80;
            } else if (condition == 'critical') {
                return val <= 20
            }
        }

        /* opens expanded view of truck details */
        $scope.openExpandedTruck = function (asset) {
            var qdata = asset;
            console.log(JSON.stringify(asset));
            $location.path("/assetgroupdetails").search(qdata);
        };
    }
})();
'use strict';
(function () {
    angular.module('cyient.assets', ['cyient.progressarc'])
        .controller('Assets', Assets);

    Assets.$inject = ['$scope', '$rootScope', '$http', '$log', '$location', '$window', '$cookies', 'AllAssetsService',  'LoginService'];
    function Assets($scope, $rootScope, $http, $log, $location, $window, $cookies, AllAssetsService,  LoginService) {
    	$rootScope.currentState="assets";
       $scope.trucks = {};
       var params=$location.search();
       if(!params){
       	params={};
       }
        $scope.tabs = {
            'activeTab': 'All'
        };
        $scope.singleSiteData = false;
        $scope.assetTypeName = "";
        /* ng-class handling variables */
        $rootScope.expandTruck = false;
        $rootScope.collapseExpanded = false;
        $rootScope.siteCardSectionActive = false;
        $rootScope.showView = "";

        if(!LoginService.isAuthenticated()) {
        	$scope.currentState="login";
            $location.path("/login").search({});
        }

        $window.scrollTo(0, 0); // scroll to top
        // watcher for animations
        angular.element($window).bind("scroll", function () {
            if ($window.scrollY > 0) {
                $scope.scrolledDown = true;
            }
            else {
                $scope.scrolledDown = false;
            }
            $scope.$apply();
        });

        $window.localStorage.removeItem("trucksList"); // clean old trucks list
														// data


        $scope.trucks = {
            'list': [],
            'exhaustiveList': [],
            'parameterInsights': {},
            'isOrder': false, // ascending order
            'trucks.orderSymbol': '+', // ascending order
            'selectedType': 'RUL', // default selection,
            'selectedText': 'RUL',
            'filterSelectedText': 'All Assets',
            'category': 'All', // default
        };

        // TODO: cahnge this
        if (params&&params.category === 'All') {
            $scope.tabs.activeTab = params.assetName == 'frac' ? 'fracpump': params.assetName;

        } else if (params&&params.category === 'Critical') {
            $scope.tabs.activeTab = 'critical';
        } else if (params&&params.category === 'Stable') {
            $scope.tabs.activeTab = 'monitor';
        } else if (params&&params.category === 'Good') {
            $scope.tabs.activeTab = 'good';
        }

        $scope.trucks.category = params.category || 'All';

        if (params.siteId) { // display on top as heading
            $scope.singleSiteData = true; 
            $scope.siteId = params.siteId; // Identifier to show on top
													// as heading
            $scope.assetLocation = params.assetLocation; // rig or
																// fracing site
            $scope.assetTypeName = params.assetName == 'frac' ? 'fracpump': params.assetName;
        }
        

        var loginData = $cookies.getObject('loginData');
        var postObj = {};
        if (params.siteId) {
            postObj.siteId = params.siteId;
        }

        AllAssetsService.getSites(postObj).then(function (response) {
            if (!response) {
                return;
            } else {
                var data = response;
                // TODO: Remove this once the data comes fine
                data.forEach(function(element) {
                    element.progressGraph.graphData[1].xAxis = element.smh;
                    element.progressGraph.xAxisToday = element.smh;
                });
                $window.localStorage.setItem('trucksList', JSON.stringify(data));
                // $scope.trucks.exhaustiveList = data;
                if ($scope.singleSiteData) {
                    $scope.trucks.exhaustiveList = data.filter(function (item) {
                        return item.siteId == $scope.siteId;
                    });
                    $scope.trucks.list = $scope.trucks.exhaustiveList;
                    if (params&&params.category && params.category != 'All') {
                        $scope.filterAssets('health', $scope.tabs.activeTab);
                    }
                } else {
                    $scope.trucks.exhaustiveList = data;
                    $scope.trucks.list = $scope.trucks.exhaustiveList;
                }
                getTabsData();
            }
        });


        // $scope.getSiteData = function (siteId) {
        // // Used for side draw drop-down
        // return SiteDetailsService.getSiteData(siteId).then(function (res) {
        // return res;
        // })
        // }

        /* opens expanded view of truck details */
        $scope.openExpandedTruck = function (truckId, assetType) {
            // $scope.getSiteData(siteId).then(function (res) {
                // $cookies.putObject('siteData', res.data.result);
                // $scope.siteData = res.data.result;
                $scope.openExpanded();
                $rootScope.showView = "overview-expand";
                $location.path("/assetdetails").search({ "truckId": truckId.assetId, 'assetType': truckId.assetType });
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

        $scope.trucks.setActive = function (menuItem) {
            $scope.trucks.activeMenuItem = menuItem;
        };

        /* opens expanded view of card */
        $scope.openExpanded = function () {
            $rootScope.siteCardSectionActive = true;
            $rootScope.collapseExpanded = true;
            $rootScope.expandTruck = true;
        };

        $scope.trucks.goToDashboard = function () {
            // cancel any calls in progress
           // SiteDetailsService.cancelRequest();
            // $state.go("cyient.protected.dashboard");
        }

        $scope.trucks.retrieveAllTrucks = function () {
            SiteDetailsService.getAllTrucks(params.siteID, 'all')
                .then(function (response) {
                    if (response.data.status === "ERROR") {
                        return
                    } else {
                        $scope.trucks.list = response.data.result;
                    }
                });
        };

        
        // To get the data length of each tab
        // TODO: Need to optimize
        function getTabsData() {
            // $scope.tabs.activeTab = "All";

            $scope.tabs.all = $scope.trucks.exhaustiveList.length;
            $scope.tabs.fracpumps = $scope.trucks.exhaustiveList.filter(function (ele) {
                return ele.assetType == 'fracpump';
            }).length;
            $scope.tabs.roughneck = $scope.trucks.exhaustiveList.filter(function (ele) {
                return ele.assetType == 'ironroughneck';
            }).length;
            $scope.tabs.catwalk = $scope.trucks.exhaustiveList.filter(function (ele) {
                return ele.assetType == 'catwalk';
            }).length;
            $scope.tabs.monitor = $scope.trucks.exhaustiveList.filter(function (ele) {
                return ele.healthPercentage > 20 && ele.healthPercentage <= 80
            }).length;
            $scope.tabs.good = $scope.trucks.exhaustiveList.filter(function (ele) {
                return ele.healthPercentage > 80;
            }).length;
            $scope.tabs.critical = $scope.trucks.exhaustiveList.filter(function (ele) {
                return ele.healthPercentage <= 20
            }).length;
        }



        // watch option change and reset order
        $scope.$watch('trucks.selectedType', function (NewValue, OldValue) {
            $scope.trucks.isOrder = false;
        }, true);

        $scope.toggleOrder = function () {
            $scope.trucks.isOrder = !$scope.trucks.isOrder;
            if ($scope.trucks.isOrder === false) {
                $scope.trucks.orderSymbol = '+'; // ascending
            } else {
                $scope.trucks.orderSymbol = '-'; // descending
            }
        };
        

        $scope.trucks.selectedOption = function (selection, selectionText) {
            $scope.trucks.selectedType = selection;
            $scope.trucks.selectedText = selectionText;
        };
        $scope.trucks.filterSelectedOption = function (selection, selectionText) {
            $scope.trucks.filterSelectedText = selectionText;
        };
        // TODO: Need to optimize
        $scope.filterAssets = function (key, val) {
            $scope.tabs.activeTab = val;
            if (key == 'All') {
                $scope.trucks.list = $scope.trucks.exhaustiveList;
                return;
            } else if (key == 'health') {
                $scope.trucks.list = $scope.trucks.exhaustiveList.filter(function (ele) {
                    return checkStability(ele.healthPercentage, val);
                });
                return;
            } else if (key == 'asset') {
                $scope.trucks.list = $scope.trucks.exhaustiveList.filter(function (ele) {
                    return ele.assetType == val;
                });
            }
        }

        function checkStability(val, condition) {
            if(condition == 'good') {
                return val > 80;
            } else if(condition == 'monitor') {
                return val>20 && val <= 80; 
            } else if(condition == 'critical') {
                return val<=20
            }
        }

        /* closes expanded view of card */
        $scope.closeExpanded = function (ele) {
            $rootScope.siteCardSectionActive = false;
            $rootScope.expandTruck = false;
            $rootScope.collapseExpanded = false;
            angular.element('.scroll-body').css('height', '');
            angular.element('.sites-card').removeClass('selected');
            TruckDetailsService.cancelRequest(); // cancel running call
            // $state.reload(); // reload trucks list data
        };

        /* opens collapsed view of truck */
        $scope.openCollapsedExpandedTruck = function () {
            $rootScope.collapseExpanded = true;
            angular.element('.whatif-collapse').removeClass('whatif-collapse--modified');
            angular.element('.scroll-body').css('display', 'none');
        };

        /* closes collapsed view of truck */
        $scope.closeCollapsedExpandedTruck = function () {
            $rootScope.collapseExpanded = false;
            angular.element('.scroll-body').css('display', 'block');
            angular.element('.whatif-collapse').addClass('whatif-collapse--modified');
        };

        function getTruckById(truckId) {
            for (var i = 0; i < $scope.trucks.list.length; i++) {
                if ($scope.trucks.list[i].truckId === truckId) {
                    return $scope.trucks.list[i];
                }
            }
        }

        


        // Created for dropdown directive
        // $scope.trucks.retreiveCategoryTrucks = function (clickedCategory) {
        // switch (clickedCategory) {
        // case 'All Trucks':
        // $scope.trucks.retrieveAllTrucksList($scope.siteData.siteId, 'All');
        // break;
        // case 'Critical':
        // $scope.trucks.retrieveCriticalTrucksList($scope.siteData.siteId,
		// 'Critical');
        // break;
        // case 'Stable':
        // $scope.trucks.retrieveStableTrucksList($scope.siteData.siteId,
		// 'Stable');
        // break;
        // case 'Good':
        // $scope.trucks.retrieveGoodTrucksList($scope.siteData.siteId, 'Good');
        // break;
        // }
        // };

        $scope.trucks.retrieveAllTrucksList = function (siteId, category) {
            $scope.tabs = {};
            $scope.tabs.activeTab = 'All';
            $scope.trucks.category = 'All';
            $scope.trucks.list = JSON.parse($window.localStorage.getItem("trucksList"));
            /*
			 * NOTE: commented out for demonstration purpose. Uncomment it in
			 * production
			 */
            // $scope.trucks.list = [];
            // SiteDetailsService.getAllTrucks($stateParams.userId ||
			// loginData.userId,
            // siteId, category, $scope.trucks.selectedType, "ascending")
            // .then(function (response) {
            // if(response.data.status === "ERROR"){
            // return
            // } else {
            // var data = response.data.result;
            // if(data){
            // var xdata = [];
            // for(var i=0; i<data.length; i++){
            // xdata.push(JSON.parse(data[i]));
            // }
            // $scope.trucks.list = xdata;
            // }
            // }
            // });
        };

        $scope.trucks.retrieveCriticalTrucksList = function (siteId, category) {
            $scope.tabs = {};
            $scope.tabs.activeTab = 'critical';
            $scope.trucks.category = 'Critical';
            var data = $window.localStorage.getItem("trucksList");
            $log.log(data)
            $scope.trucks.list = JSON.parse($window.localStorage.getItem("trucksList"));
            // for (var i in $scope.trucks.list) {
                $scope.trucks.list = $scope.trucks.list.filter(function (ele) {
                    return ele.category === category;
                });
            // }
            /*
			 * NOTE: commented out for demonstration purpose. Uncomment it in
			 * production
			 */
            // $scope.trucks.list = [];
            // SiteDetailsService.getAllTrucks($stateParams.userId ||
			// loginData.userId,
            // siteId, category, $scope.trucks.selectedType, "ascending")
            // .then(function (response) {
            // if(response.data.status === "ERROR"){
            // return
            // } else {
            // var data = response.data.result;
            // if(data){
            // var xdata = [];
            // for(var i=0; i<data.length; i++){
            // xdata.push(JSON.parse(data[i]));
            // }
            // $scope.trucks.list = xdata;
            // }
            // }
            // });
        };

        $scope.trucks.retrieveStableTrucksList = function (siteId, category) {
            $scope.tabs = {};
            $scope.tabs.activeTab = 'monitor';
            $scope.trucks.category = 'Stable';
            $scope.trucks.list = JSON.parse($window.localStorage.getItem("trucksList") || '{}');
            // for (var i in $scope.trucks.list) {
                $scope.trucks.list = $scope.trucks.list.filter(function (ele) {
                    return ele.category === category;
                });
            // }
            /*
			 * NOTE: commented out for demonstration purpose. Uncomment it in
			 * production
			 */
            // $scope.trucks.list = [];
            // SiteDetailsService.getAllTrucks($stateParams.userId ||
			// loginData.userId,
            // siteId, category, $scope.trucks.selectedType, "ascending")
            // .then(function (response) {
            // if(response.data.status === "ERROR"){
            // return
            // } else {
            // var data = response.data.result;
            // if(data){
            // var xdata = [];
            // for(var i=0; i<data.length; i++){
            // xdata.push(JSON.parse(data[i]));
            // }
            // $scope.trucks.list = xdata;
            // }
            // }
            // });
        };

        $scope.trucks.retrieveGoodTrucksList = function (siteId, category) {
            $scope.tabs = {};
            $scope.tabs.activeTab = 'good';
            $scope.trucks.category = 'Good';
            $scope.trucks.list = JSON.parse($window.localStorage.getItem("trucksList"));
            // for (var i in $scope.trucks.list) {
                $scope.trucks.list = $scope.trucks.list.filter(function (ele) {
                    return ele.category === category;
                });
            // }
            /*
			 * NOTE: commented out for demonstration purpose. Uncomment it in
			 * production
			 */
            // $scope.trucks.list = [];
            // SiteDetailsService.getAllTrucks($stateParams.userId ||
			// loginData.userId,
            // siteId, category, $scope.trucks.selectedType, "ascending")
            // .then(function (response) {
            // if(response.data.status === "ERROR"){
            // return
            // } else {
            // var data = response.data.result;
            // if(data){
            // var xdata = [];
            // for(var i=0; i<data.length; i++){
            // xdata.push(JSON.parse(data[i]));
            // }
            // $scope.trucks.list = xdata;
            // }
            // }
            // });
        };

        $scope.filterTrucks = function (truck) {
            var result = (($scope.trucks.category === 'All') || (truck.category === $scope.trucks.category));
            return result;
        };   
        }
})();

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
'use strict';
(function(){
    angular.module('cyient.insights', [
        'cyient.areachart',
        'cyient.barcharthoriz',
        'cyient.donut',
        'cyient.onfinishrender',
        'cyient.popup',
        'cyient.scrolltowhen'
    ])
        .controller('Insights', Insights);

    Insights.$inject = ['$scope', '$location', '$cookies', '$timeout', 'InsightsService', '$log', '$window', '$rootScope'];
    function Insights($scope, $location, $cookies, $timeout, InsightsService, $log, $window, $rootScope){
    	$rootScope.currentState = "insights";
    	$scope.ins = {};
        $window.scrollTo(0, 0);
        // default data
        // $scope.siteData = $cookies.getObject('siteData')[0];
        var loginData = $cookies.getObject('loginData');
        var params=$location.search();
        var userId = loginData.userId;
        var siteId = params.siteId;

        $scope.truckId = params.truckId;
        $scope.partName = params.partName;
        $scope.categories = params.categories;
        $scope.categoryId = params.categoryId;
        $scope.variableName = params.variableName;
        $scope.assetType = params.assetType;

        $scope.popupData = {};

        // $scope.variableName = 'Average Payload Tonns';

        $scope.currIndex = _.findIndex($scope.categories, function(category) {
            return category === $scope.categoryName;
        });
        if ($scope.currIndex === -1) {
            $scope.currIndex = 0;
        }

        $scope.goToState = function(str){
            $location.path(str);
        }

        $scope.changeCategory = function(index) {
            $scope.currIndex = index;
            $scope.getCategoryData($scope.categories[$scope.currIndex]);
        };

        $scope.firstTimeCall = true;
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            $timeout(function() {
                $scope.firstTimeCall = false;
            }, 2000);
        });

        $scope.showGraphPopup = function(variable){
            $log.log(variable);
            var userId = loginData.userId;
            var siteId = siteId;
            var categoryId = $scope.categoryId;
            var assetId = $scope.truckId;
            var assetType = $scope.assetType;
            var sensorName = [variable.name];

            InsightsService.getDaysData(userId, siteId, categoryId, assetType, assetId, sensorName).then(function(data){
                var variableData = data[0];
                $scope.popupData.minOptimal = variableData.minOptimal;
                $scope.popupData.maxOptimal = variableData.maxOptimal;
                $scope.popupData.xLabel = variableData.xLabel;
                $scope.popupData.yLabel = variableData.yLabel;
                $scope.popupData.popupLineGraph = variableData.variableGraph;
                var nowDate = Date.now();

                var len = variableData.variableGraph.length;
                for(var j = len; j > 0; j--) {
                    nowDate = nowDate - (5 * 36000 * 1000);	
                    $scope.popupData.popupLineGraph[j-1].xValue = nowDate;	
                }
                variable.showPopup = true;
            });
            
        };

        $scope.closePopup = function(variable){
            variable.showPopup = false;
            $scope.popupData = {};
        }

        $scope.getCategoryData = function(categoryName) {
            var userId = loginData.userId;
            var siteId = siteId;
            var categoryId = $scope.categoryId;
            var assetId = $scope.truckId;
            var assetType = $scope.assetType;
            var sensorNames = _.chain($scope.categories).filter(function (sensor) {
                                return sensor;
                            })
                            .map(function (sensor) {
                                return sensor.name;
                            })
                            .uniq()
                            .value();
            
            InsightsService.getData(
                userId,
                siteId,
                assetId,
                categoryId,
                assetType,
                sensorNames
            )
                .then(function(data) {
                if(data.status === "ERROR"){
                    return
                } else {
                    $scope.variables = data.map(function(variable) {

                        var result = {};

                        // result.name = variable.variableName.replace(/_|-/g, "
						// ");
                        result.name = variable.variableName;
                        result.displayName = categoryName.filter(function(sensor){
                            return sensor.name == result.name;
                        })
                        result.paramtype = variable.paramtype;
                        result.duration = variable.duration;
                        result.varTrend = variable.varTrend;

                        // result.trucks = {
                        // min: variable.trucks.min,
                        // max: variable.trucks.max,
                        // avg: variable.trucks.avg,
                        // };

                        // result.site = {
                        // min: variable.site.min,
                        // max: variable.site.max,
                        // avg: variable.site.avg,
                        // };

                        // Parsing area-chart
                        // result.trendGraph = variable.trendGraph;
                        // result.siteAvgGraph = variable.siteAvgGraph;
                        
                        // result.Graph = variable.Graph;

                        result.lineGraph = variable.variableGraph;
                        var nowDate = Date.now();

                        var len = result.lineGraph.length
                        for(var j =  len; j > 0; j--) {
                            // if(j < 18000) {
                                nowDate = nowDate - (10 * 1000);
                                result.lineGraph[j-1].xValue = nowDate;
                            // } else {
                            // nowDate = nowDate - 36000 * 1000;
                            // graphData[j].xValue = nowDate;
                            // }
                            // graphData[j].yValue = Math.random(80, 100)*100;
                        }

                        // $log.log(graphData);
                        result.Graph = result.lineGraph;

                        result.minOptimal = variable.minOptimal;
                        result.maxOptimal = variable.maxOptimal;
                        result.xLabel = variable.xLabel;
                        result.yLabel = variable.yLabel;

                        if (variable.paramtype === 'Total') {

                            result.totalObj = variable.totalObj;

                        } else if (variable.paramtype === 'Avg') {

                            result.avgObj = variable.avgObj;

                        } else if (variable.paramtype === 'Overload') {

                            result.overLoadObj = variable.overLoadObj;

                        }
                        return result;
                    });
                }

            }, function(err) {
                $log.warn(err);
            })
        }; // End of getCategoryData function

       
        
        $scope.navigateToOverview = function() {
            $location.path("/assetdetails").search({"truckId": $scope.truckId,"assetType":$scope.assetType});            
        };

        $scope.getCategoryData($scope.categories);

    }; // End of controller
})(); // End of IFFE

'use strict';
(function () {
  angular.module('cyient.login', [])
    .controller('Login', Login);
  Login.$inject = ['$scope','$rootScope', '$http','$location',  '$cookies', 'LoginService', '$log', '$window', 'ngOidcClient'];
  function Login($scope,$rootScope, $http,$location, $cookies, LoginService, $log,  $window, ngOidcClient) {
	  $rootScope.currentState = "login";
	    $scope.header = false;
    $scope.credentials = {
      username: 'Shane.Richard@f-e-t.com',
      password: 'R$hane123'
    };
    $scope.messages = {
      invalidUser: false,
      emailSent: false,
      isLoginProgress: false,
      loginError: null,
    };
      
    $scope.token = "Bearer  eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJTaGFuZS5SaWNoYXJkQGYtZS10LmNvbSIsImV4cCI6MTUzNDY3MzQ5Mn0.Bg8xVnrRDCALnXGTHGR0nTHXR8VwjcnIbPZ6jG29fdJ-2_PuPHjb1FfM2b9x_7qbqOSTLM3por5N_YdE5wgulg";

    function checkForAuthentication() {
        
        ngOidcClient.manager.getUser().then(function (user) {
            if (user) {
                user['profile']['Authorization'] = user.token_type+" "+user.access_token;// $scope.token;
                $log.warn("User logged in", user.profile);
                $scope.userData = {
                    Authorization : user.token_type+" "+user.access_token,
                    firstName:user.profile.name,
                    lastName:user.profile.name,
                    userId :user.profile.sub,
                    userName:user.profile.preferred_username
                };
                LoginService.authenticated = true;
                LoginService.setData($scope.userData);
                $cookies.putObject('login-token', user.token_type+" "+user.access_token);
                var cookieObj = {
                  userId: $scope.userData.userId,
                  userFirstName: $scope.userData.firstName,
                  userLastName: $scope.userData.lastName,
                  userName: $scope.userData.userName,
                  userImgUrl: ''
                };
                $cookies.putObject('loginData', cookieObj);
                $location.path('/').search({});
            }
            else {
                $log.warn("User not logged in");
                
                angular.forEach($cookies, function(value, key) {
                    $cookies.remove(key);
                });
            }
        });

        
        /*
		 * if (LoginService.isAuthenticated()) {
		 * $state.go('cyient.protected.allsites'); } else {
		 * angular.forEach($cookies, function(value, key) {
		 * $cookies.remove(key); }); }
		 */
    }

    checkForAuthentication();

    $scope.oldLogin = function () {
      $scope.messages.isLoginProgress = true;
      var username = $scope.credentials.username;
      var password = $scope.credentials.password;
      $scope.messages.loginError = null;
      if (username && password) {
        var loginObj = {
          "userName": username,
          "password": password
        };
        LoginService.getUserDetails(loginObj).then(function (response) {
          // $scope.messages.isLoginProgress = false;
          if (!response) {
            // $scope.messages.loginError = response.data.status + " - " +
			// response.status + " - " + response.statusText;
            $scope.messages.loginError = "Can not login at this moment";
          } else {
            $scope.userData = response;
            LoginService.setData($scope.userData);
            var cookieObj = {
              userId: $scope.userData.userId,
              userFirstName: $scope.userData.firstName,
              userLastName: $scope.userData.lastName,
              userName: $scope.userData.userName,
              userImgUrl: ''
            };
            $cookies.putObject('loginData', cookieObj);
            $state.go('cyient.protected.allsites', { authStatus: true });
          }
        }, function() {
          $scope.messages.loginError = "Can not login at this moment";
        })
          .catch(function (error) {
            $log.warn("Cannot login at this moment ...");
            $scope.messages.loginError = "Cannot login at this moment";
            // $scope.messages.isLoginProgress = false;
          })
          .finally(function () {
            $scope.messages.isLoginProgress = false;
          });
      } else {
        $scope.messages = {};
        $scope.messages["invalidUser"] = true;
      }
    };
      
    $scope.login = function() {
        // $window.alert('new login');
        ngOidcClient.signinRedirect();
        
    }
    $scope.forgotPassword = function () {
      var username = $scope.credentials.username;
      if (username) {
        LoginService.forgotPassword(username)
          .then(function (response) {
            if (response) {
              $scope.messages = {};
              $scope.messages["emailSent"] = true;
            }
          });
      }
    };
    // Get asset path
    $scope.getPath = function (key) {
      var key = key;
      var path = AssetService.getAssetPath(key);
      return path;
    };
  }
})();
