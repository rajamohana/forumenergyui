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