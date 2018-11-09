'use strict';
(function () {
	var app = angular.module('cyient', ['ngRoute', 'ngResource', 'ngCookies',
		'ngMessages', 'ngAnimate', 'ui.bootstrap.dropdown',
		'cyient.backendservice','cyient.assetService', 'cyient.filters', 'ng.oidcclient',
		'cyient.login', 'cyient.assetgroups', 'cyient.assetgroupdetails',
		'cyient.assets', 'cyient.geography', 'cyient.assetdetails',
		'cyient.insights','cyient.filters', 'cyient.miniLifechart','cyient.lifechart','cyient.loader'
	]);

	app.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when("/login", {
				templateUrl: "templates/login/login.html",
				controller: "Login"
			})
			.when("/", {
				templateUrl: "templates/assetgroups/assetgroups.html",
				controller: "AssetGroups"
			})
			.when("/assetgroupdetails", { //assetgroupdetails
				templateUrl: "templates/assetgroupdetails/assetgroupdetails.html",
				controller: "AssetGroupDetails"
			}).when("/assets", {
				templateUrl: "templates/assets/assets.html",
				controller: "Assets"
			}).when("/geography", {
				templateUrl: "templates/geography/geography.html",
				controller: "Geography"
			}).when("/assetdetails", {
				templateUrl: "templates/assetdetails/assetdetails.html",
				controller: "AssetDetails"
			}).when("/insights", {
				templateUrl: "templates/insights/insights.html",
				controller: "Insights"
			})
	}]);

	app.config(['ngOidcClientProvider', function (ngOidcClientProvider) {
		ngOidcClientProvider.setSettings({
			authority: "https://fetidentitydev.azurewebsites.net",
			client_id: "js", // This may change to another name in
			// production.

			redirect_uri: "http://localhost:1947/callback.html",

			response_type: "id_token token",

			scope: "openid profile api1",

			post_logout_redirect_uri: "http://localhost:1947/index.html",

			// userStore: new Oidc.WebStorageStateStore({ store: window.localStorage
			// })
		});
	}])
	app.run(['$rootScope', function ($rootScope) {
		$rootScope.currentState = "/";
	}]);
	app.controller('Header', ['$scope', '$location', '$cookies',
		'LoginService', '$window', '$rootScope', 'ngOidcClient', Header
	]);

	// Header.$inject = [ '$scope', '$state', '$cookies', 'LoginService',
	// '$window', '$rootScope', 'ngOidcClient' ];
	function Header($scope, $location, $cookies, LoginService, $window,
		$rootScope, ngOidcClient) {
		// var loginDataObjectLength =
		// Object.keys(LoginService.getData()).length;
		// var loginData = (loginDataObjectLength) ? LoginService.getData() :
		// $cookies.getObject('loginData');
		var loginData = $cookies.getObject('loginData');

		function checkImageUrl(url) {
			if (!url) {
				return;
			}
			return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
		}
		if (loginData) {
			$scope.header = {
				fullName: loginData.userFirstName,
				userImage: checkImageUrl(loginData.userImgUrl) ? loginData.userImgUrl : 'assets/images/dummy-photo.jpeg'
			};
		}
		$scope.logout = function () {
			$scope.currentState = "login";
			var cookies = $cookies.getAll();
			angular.forEach(cookies, function (value, key) {
				$cookies.remove(key);
			});
			ngOidcClient.signoutRedirect();
			LoginService.authenticated = false;
			// $state.go('cyient.login');
		};

		$scope.gotoState = function (str) {
			$location.path(str).search({});
		}

		// watcher for animations
		angular.element($window).bind("scroll", function () {
			if ($window.scrollY > 0) {
				$scope.scrolledDown = true;
			} else {
				$scope.scrolledDown = false;
			}
			$scope.$apply();
		});
	}

})();