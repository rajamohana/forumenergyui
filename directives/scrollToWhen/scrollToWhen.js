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
