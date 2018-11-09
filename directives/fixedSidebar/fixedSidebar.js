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
