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
