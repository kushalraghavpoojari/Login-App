(function() {
    'use strict';

    angular
        .module('app')
        .factory('userData', userData);

    // userData.$inject = [];

    /* @ngInject */
    function userData() {
        var service = {
            userInfo : userInfo
        };

        return service;

        function userInfo(user) {
            var vm = this;
            console.log('in userdata');
            console.log(user);
            vm.loggedUser = {

                userName: user.name,
                picture: user.picture,
                userId: user.userId
            }
            //console.log(vm.loggedUser);
            return vm.loggedUser;
        }
        
    }
})();        