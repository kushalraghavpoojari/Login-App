(function() {
    'use strict';

    angular
        .module('app')
        .factory('authToken', authToken);

    // authToken.$inject = [];

    /* @ngInject */
    function authToken($window, $q) {
        var cachedToken;
        var storage = $window.localStorage;
        var service = {
            setToken: setToken,
            getToken: getToken,
            removeToken: removeToken,
            isAuth: isAuth
        };

        return service;

        function setToken(token) {
            cachedToken = token;
            storage.setItem('userToken', token);
        }

        function getToken() {
            if(!cachedToken){
                cachedToken = storage.getItem('userToken');
            }
            return cachedToken;
        }

        function removeToken(){
            cachedToken = null;
            var defer = $q.defer();
            storage.removeItem('userToken');
            $window.localStorage.removeItem('userName');
            $window.localStorage.removeItem('picture');
            defer.resolve();
            return defer.promise;
        }

        function isAuth() {
            return !!this.getToken();
        }
    }
})();        