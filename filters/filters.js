'use strict';
(function(){
  angular.module('cyient.filters', [])
  /**
   * Set decimal
   */
   .filter('setDecimal', ['$filter', function ($filter) {
      return function (input, places) {
          if (isNaN(input)) {
            return input;
          }
          // If we want 1 decimal place, we want to mult/div by 10
          // If we want 2 decimal places, we want to mult/div by 100, etc
          // So use the following to create that factor
          var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
          input = Math.round(input * factor) / factor;
          if(input > 0){
            return input;
          } else {
            return null;
          }
      };
  }])
  /**
   * Convert all first characters in a sequence of words to uppercase
   */
  .filter('firstLetterUppercase', [function(){
    return function(str) {
      if(str){
        return str.replace(/\w\S*/g, function(txt){
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }
    };
  }])
  /**
   * Converts date to its string representation
   * E.g. 04/12/2014 will be converted to 4 Dec 2014
   */
  .filter('dateToString', ['$filter', function($filter){
    return function(input){
      if(input){
        var date = new Date(input.split("/").reverse().join("-"));
        var output = $filter('date')(date, 'd MMM yyyy'); // use predefined Date filter
        return output;
      }
    };
  }])
  .filter('round', [function(){
    return function(input) {
      return Math.round(input);
    };
  }])
  .filter('roundTo', [function(){
    return function(input, precision) {
      if (typeof input !== 'number') {
        return input;
      }
      return _.round(input, precision);
    };
  }])
  .filter('ceil', [function(){
    return function(input) {
      return Math.ceil(input);
    };
  }])
  .filter('floor', [function(){
    return function(input) {
      return Math.floor(input);
    };
  }])
  .filter('abs', [function(){
    return function(input) {
      return Math.abs(input);
    };
  }]);
})();
