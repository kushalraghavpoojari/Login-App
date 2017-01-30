(function() {
    'use strict';

    angular
        .module('app')
        .controller('SignupController', SignupController);

    //SignupController.$inject = [''];

    /* @ngInject */
    function SignupController($http, $state, $rootScope, authToken, authService, $window, userData) {
        var vm = this;
        vm.signup = signup;
        vm.match = match;
        vm.message = null;

        function signup () {
            var newUser = {
                name: vm.userName,
                email: vm.userEmail,
                password: vm.userPassword
            };
            authService.signup(vm.userName,vm.userEmail,vm.userPassword).then(function(res){
                if(res.error){
                    vm.errorBlock = res;
                }
                else{
                    console.log(res);
                    $window.localStorage.setItem('userName', res.name);
                    $window.localStorage.setItem('userId', res.userId);
                    userData.userInfo(res);
                    authToken.setToken(res.token);
                    $state.go('dashboard');
                }
            }).catch(function(err){
                //vm.message = err.message;
                console.log(err);
            });
        }

        function match() {
            if(vm.userPassword === vm.userConfirmPassword)
                return true;
            else
                return false;
        }

    }
})();
