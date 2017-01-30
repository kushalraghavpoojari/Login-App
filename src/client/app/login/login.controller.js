(function() {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    //LoginController.$inject = [''];

    /* @ngInject */
    function LoginController($http, $state, authToken, authService, $auth, $stateParams, userData, $window) {
        var vm = this;
        vm.login = login;
        vm.authenticate = authenticate;
        vm.forgot = forgot;
        vm.match = match;
        vm.reset = reset;
        vm.anijs = false;

        function login () {
            var user = {
                email : vm.userEmail,
                password: vm.userPassword
            };
            authService.login(vm.userEmail, vm.userPassword).then(function(res) {
                if(res.error) {
                    vm.errorBlock = res;
                    vm.anijs = true
                }
                else {
                    console.log(res);
                    $window.localStorage.setItem('userName', res.name);
                    if(res.picture){
                        $window.localStorage.setItem('picture', res.picture);
                    }
                    $window.localStorage.setItem('userId', res.userId);
                    authToken.setToken(res.token);
                    $state.go('dashboard');
                }
            }).catch(function(err) {
                console.log(err.message);
            });
        }

        function authenticate (provider) {
            $auth.authenticate(provider).then(function(res){
                console.log('logged In');
                console.log(res.data);
                $window.localStorage.setItem('userName', res.data.name);
                $window.localStorage.setItem('picture', res.data.picture);
                $window.localStorage.setItem('userId', res.data.userId);
                userData.userInfo(res.data);
                authToken.setToken(res.data.token);
                $state.go('dashboard');
            }, function(err) {
                console.log(err);
            });
        }

        function forgot() {
            authService.forgot(vm.passwordResetEmail).then(function(res){
                if(res.error){
                    vm.forgotPasswordError = res;
                }else{
                    vm.forgotPassword = res;
                }
            });
        }

        function reset() {
            var password = vm.passwordNew;
            var token = $stateParams.token;
            authService.reset(password, token).then(function(res){
                if(res.error){
                    vm.errorBlock = res;
                }
                else{
                    vm.message = res.result;
                    $state.go('login');
                }
            });
        }

        function match() {
            if(vm.passwordNew === vm.passwordNewConfirm)
                return true;
            else
                return false;
        }
    }
})();
