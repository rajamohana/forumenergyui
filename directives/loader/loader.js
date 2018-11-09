'use strict';
(function(){
  angular.module('cyient.loader', [])
    .directive('loading', ['$http', function ($http){
    return {
      restrict: 'A',
      templateUrl: 'directives/loader/loader.html',
      link: function (scope, elm, attrs){
        scope.isLoading = function(){
          return $http.pendingRequests.length > 0;
        };
        scope.$watch(scope.isLoading, function(val){
          if(val){
            elm.show();
          } else{
            elm.hide();
          }
        });
      }
    };

    }]);
})();
