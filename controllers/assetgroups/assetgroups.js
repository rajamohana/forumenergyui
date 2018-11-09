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