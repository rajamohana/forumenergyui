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
