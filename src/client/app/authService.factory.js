(function() {
    'use strict';

    angular
        .module('app')
        .factory('authService', authService);

    // authService.$inject = [];

    /* @ngInject */
    function authService($http, $window, $q) {
        var service = {
            login: login,
            signup: signup,
            forgot: forgot,
            reset: reset,
            contact: contact
        };

        return service;

        function login(email, password) {
          return $http.post('/login',{email: email, password: password}); 
        }

        function signup(name, email, password){
            return $http.post('/register', {name:name, email:email, password: password});
        }

        function forgot(email) {
            return $http.post('/forgot', {email:email});
        }

        function reset(password, token) {
            console.log(password);
            console.log(token);
            return $http.post('/reset/:token', {newPassword: password, token: token});
        }

        function contact(name, email, message) {
            return $http.post('/contact',{name: name, email: email, message: message});
        }

        
        // function googleLogin(){
        //     var deferred = $q.defer();
        //     var urlBuilder = [];
        //     var clientId = '34441293765-chit3ni32s5m497eu1n8havjakg8jefs.apps.googleusercontent.com';
        //     urlBuilder.push('response_type=code','client_id='+clientId,
        //     'redirect_uri='+window.location.origin,
        //     'scope= profile email');
        //     var url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urlBuilder.join('&');
        //     var options = 'width= 500, height=500,left='+ ($window.outerWidth-500)/2 + ',top='+ ($window.outerHeight-500)/2.5;

        //     var popup = $window.open(url,'',options);
        //     $window.focus();
        //      $window.addEventListener('message', function(event){
        //          if(event.origin === $window.location.origin ){
        //             var code = event.data;
        //             popup.close();
        //             $http.post('/auth/google',{
        //                 clientId : clientId,
        //                 code: code,
        //                 redirectUri: window.location.origin 
        //             }).success(function(res){
        //                 deferred.resolve(res);
        //             });
        //          }
        //      });
        //      return deferred.promise;
        // }
    }
})();        