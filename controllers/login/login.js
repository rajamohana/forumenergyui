'use strict';
(function () {
  angular.module('cyient.login', [])
    .controller('Login', Login);
  Login.$inject = ['$scope','$rootScope', '$http','$location',  '$cookies', 'LoginService', '$log', '$window', 'ngOidcClient'];
  function Login($scope,$rootScope, $http,$location, $cookies, LoginService, $log,  $window, ngOidcClient) {
	  $rootScope.currentState = "login";
	    $scope.header = false;
    $scope.credentials = {
      username: 'Shane.Richard@f-e-t.com',
      password: 'R$hane123'
    };
    $scope.messages = {
      invalidUser: false,
      emailSent: false,
      isLoginProgress: false,
      loginError: null,
    };
      
    $scope.token = "Bearer  eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJTaGFuZS5SaWNoYXJkQGYtZS10LmNvbSIsImV4cCI6MTUzNDY3MzQ5Mn0.Bg8xVnrRDCALnXGTHGR0nTHXR8VwjcnIbPZ6jG29fdJ-2_PuPHjb1FfM2b9x_7qbqOSTLM3por5N_YdE5wgulg";

    function checkForAuthentication() {
        
        ngOidcClient.manager.getUser().then(function (user) {
            if (user) {
                user['profile']['Authorization'] = user.token_type+" "+user.access_token;// $scope.token;
                $log.warn("User logged in", user.profile);
                $scope.userData = {
                    Authorization : user.token_type+" "+user.access_token,
                    firstName:user.profile.name,
                    lastName:user.profile.name,
                    userId :user.profile.sub,
                    userName:user.profile.preferred_username
                };
                LoginService.authenticated = true;
                LoginService.setData($scope.userData);
                $cookies.putObject('login-token', user.token_type+" "+user.access_token);
                var cookieObj = {
                  userId: $scope.userData.userId,
                  userFirstName: $scope.userData.firstName,
                  userLastName: $scope.userData.lastName,
                  userName: $scope.userData.userName,
                  userImgUrl: ''
                };
                $cookies.putObject('loginData', cookieObj);
                $location.path('/').search({});
            }
            else {
                $log.warn("User not logged in");
                
                angular.forEach($cookies, function(value, key) {
                    $cookies.remove(key);
                });
            }
        });

        
        /*
		 * if (LoginService.isAuthenticated()) {
		 * $state.go('cyient.protected.allsites'); } else {
		 * angular.forEach($cookies, function(value, key) {
		 * $cookies.remove(key); }); }
		 */
    }

    checkForAuthentication();

    $scope.oldLogin = function () {
      $scope.messages.isLoginProgress = true;
      var username = $scope.credentials.username;
      var password = $scope.credentials.password;
      $scope.messages.loginError = null;
      if (username && password) {
        var loginObj = {
          "userName": username,
          "password": password
        };
        LoginService.getUserDetails(loginObj).then(function (response) {
          // $scope.messages.isLoginProgress = false;
          if (!response) {
            // $scope.messages.loginError = response.data.status + " - " +
			// response.status + " - " + response.statusText;
            $scope.messages.loginError = "Can not login at this moment";
          } else {
            $scope.userData = response;
            LoginService.setData($scope.userData);
            var cookieObj = {
              userId: $scope.userData.userId,
              userFirstName: $scope.userData.firstName,
              userLastName: $scope.userData.lastName,
              userName: $scope.userData.userName,
              userImgUrl: ''
            };
            $cookies.putObject('loginData', cookieObj);
            $state.go('cyient.protected.allsites', { authStatus: true });
          }
        }, function() {
          $scope.messages.loginError = "Can not login at this moment";
        })
          .catch(function (error) {
            $log.warn("Cannot login at this moment ...");
            $scope.messages.loginError = "Cannot login at this moment";
            // $scope.messages.isLoginProgress = false;
          })
          .finally(function () {
            $scope.messages.isLoginProgress = false;
          });
      } else {
        $scope.messages = {};
        $scope.messages["invalidUser"] = true;
      }
    };
      
    $scope.login = function() {
        // $window.alert('new login');
        ngOidcClient.signinRedirect();
        
    }
    $scope.forgotPassword = function () {
      var username = $scope.credentials.username;
      if (username) {
        LoginService.forgotPassword(username)
          .then(function (response) {
            if (response) {
              $scope.messages = {};
              $scope.messages["emailSent"] = true;
            }
          });
      }
    };
    // Get asset path
    $scope.getPath = function (key) {
      var key = key;
      var path = AssetService.getAssetPath(key);
      return path;
    };
  }
})();
