(function() {
    'use strict';

    angular
        .module('app')
        .directive('globalMenu', globalMenu);

    // globalMenu.$inject = [''];

    /* @ngInject */
    function globalMenu() {
        var directive = {
            bindToController: true,
            controller: GlobalMenuController,
            controllerAs: 'menuVm',
            link: link,
            restrict: 'EA',
            templateUrl: '/client/app/global-menu/global-menu.directive.html',
            scope: {
                eventHandler: '&ngClick'
            }
        };

        function link(scope, element, attrs) {}

        return directive;
    }

    // GlobalMenuController.$inject = [''];

    /* @ngInject */
    function GlobalMenuController($rootScope, $auth, $window, authToken, $scope, $state, authService) {
        var vm = this;
        vm.open = false;
        vm.show = false;
        //vm.name = $rootScope.userLoginName;
        vm.name = $window.localStorage.getItem('userName');
        vm.logout = logout;
        vm.isPhoto = isPhoto;
        vm.hideModal = hideModal;
        vm.sendMessage = sendMessage;
        vm.isAuthenticated = isAuthenticatedd;
        vm.isAuthenticated = vm.isAuthenticatedd || authToken.isAuth();

        function logout() {
            vm.isAuthenticated = false;
            $auth.logout();
            authToken.removeToken().then(function(){
                $state.go('home');
            });
        }
        
        function isAuthenticatedd() {
            return $auth.isAuthenticated();
        }

        function isPhoto() {
            if($window.localStorage.getItem('picture')){
                return $window.localStorage.getItem('picture');
            }
            else {
                return 'src/client/images/avatar.png';
            }
        }

        function hideModal() {
          vm.show = false;
        }

        function sendMessage() {
            console.log(vm.messageName, vm.messageEmail, vm.messageText);
            authService.contact(vm.messageName, vm.messageEmail, vm.messageText).then(function(res) {
                if(res.error) {
                    console.log('error');
                }
                else {
                    console.log('sent');
                }
                //console.log('mail sent');
                vm.show = false;
                vm.messageName = vm.messageEmail = vm.messageText = '';
            });
            
        }
    }
})();
