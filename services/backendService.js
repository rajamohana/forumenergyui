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
