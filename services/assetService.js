'use strict';
(function(){
  angular.module('cyient.assetService', [])
  .factory('AssetsFactory', AssetsFactory)
  .factory('AssetService', AssetService);

  AssetsFactory.$inject = ['$resource'];
  function AssetsFactory($resource) {
    return $resource('data/assets.json',{ }, {
      getData: {method:'GET', isArray: false}
    });
  }
  AssetService.$inject = ['$resource', 'AssetsFactory'];
  function AssetService($resource, AssetsFactory) {
    var assetServiceInstance = {};
    var imagesBaseUrl = 'assets/images/';
    var _this = this;
    AssetsFactory.getData(function(data){
      _this.data = data;
    });
    assetServiceInstance.getAssetPath = function(token){
      var path = '';
      var assets = _this.data;
      if(token) {
        for(var asset in assets) {
          if(asset === token) {
            path = assets[asset];
          }
        }
      }
      return imagesBaseUrl + path;
    }
    return assetServiceInstance;
  }

})();
