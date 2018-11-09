'use strict';
(function(){
  var configData = {
    animate: true,
    max: 100
  };
  angular.module('cyient.progressbar', ['progressbar.template'])
    .constant('progressConfig', {
      animate: true,
      max: 100
    })
    .controller('progressController', progressController)
    .filter('firstLetterCapital', function(){
      return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
      }
    })
    .directive('progressBar', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: 'progressController',
        scope: {
          value: '=',
          maxParam: '=?max',
          type: '@',
		  textval: '@',
          trucks: '='
        },
        templateUrl: 'directives/progressBar/progress-bar.html',
        link: function(scope, element, attrs, progressCtrl) {
          $timeout(function(){
            progressCtrl.addBar(scope, angular.element(element.children()[0]), {
              title: attrs.title
            });
          }, 200);
        }
      };
    }]);

    progressController.$inject = ['$scope', '$attrs', 'progressConfig', '$timeout'];
    function progressController($scope, $attrs, progressConfig, $timeout) {
      var self = this;
      var animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;
      this.bars = [];

      $scope.max = getMaxOrDefault();
      this.addBar = function(bar, element, attrs) {
        if (!animate) {
          element.css({
            'transition': 'none'
          });
        }

        this.bars.push(bar);

        bar.max = getMaxOrDefault();
        bar.title = attrs && angular.isDefined(attrs.title) ? attrs.title : 'progressbar';

        bar.$watch('value', function(value) {
          bar.recalculatePercentage();
        });

        bar.recalculatePercentage = function() {
          var totalPercentage = self.bars.reduce(function(total, bar) {
            bar.percent = +(100 * bar.value / bar.max).toFixed(2);
            return total + bar.percent;
          }, 0);

          if (totalPercentage > 100) {
            bar.percent -= totalPercentage - 100;
          }
        };

        bar.$on('$destroy', function() {
          element = null;
          self.removeBar(bar);
        });
      };

      this.removeBar = function(bar) {
        this.bars.splice(this.bars.indexOf(bar), 1);
        this.bars.forEach(function(bar) {
          bar.recalculatePercentage();
        });
      };

      $scope.$watch('maxParam', function(maxParam) {
        self.bars.forEach(function(bar) {
          bar.max = getMaxOrDefault();
          bar.recalculatePercentage();
        });
      });

      function getMaxOrDefault() {
        return angular.isDefined($scope.maxParam) ? $scope.maxParam : progressConfig.max;
      }
    }
})();

angular.module('progressbar.template', []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/progressBar/progress-bar.html",
    "<div>" +
    "<div class=\"progress-bar-title\">\n" +
      "<span class='das-trucks-count' ng-class=\"type && 'progress-bar-title-' + type\">{{trucks}}</span><span class='das-trucks-type' ng-class=\"type && 'progress-bar-title-' + type\">{{textval | firstLetterCapital}}</span>\n" +
    "</div>\n" +
    "<div class=\"progress\">\n" +
    "  <div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: (percent < 100 ? percent : 0) + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" aria-labelledby=\"{{::title}}\" ng-transclude></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "");
}]);
