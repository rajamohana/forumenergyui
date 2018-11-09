'use strict';
angular.module('cyient.popup', [])
.directive('popup', [function() {
    return {
        restrict: 'AE',
        transclude: true,
        scope: {
            onClose: '&'
        },
        templateUrl: 'directives/popup/popup.html',
        link: function(scope, elem) {
        }
    };
}])
