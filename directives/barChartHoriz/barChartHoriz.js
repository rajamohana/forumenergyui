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
