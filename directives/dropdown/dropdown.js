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
