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
