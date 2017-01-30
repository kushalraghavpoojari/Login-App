(function() {
    'use strict';

    angular
        .module('app')
        .factory('authInterceptor', authInterceptor);

    // authInterceptor.$inject = [];

    /* @ngInject */
    function authInterceptor(authToken) {
        var service = {
            request: request,
            response: response
        };

        return service;

        function request(config) {
            var token = authToken.getToken();

            if(token){
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        }

        function response(response){
            return response;
        }
    }
})();        