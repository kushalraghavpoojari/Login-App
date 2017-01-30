(function() {

    'use strict';

    angular.module('app').config(configuration);

    function configuration($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $authProvider) {
    $urlRouterProvider.otherwise("/");
    //$locationProvider.html5Mode(true);

    $stateProvider
        .state('home',{
            url:'/',
            templateUrl:'./app/main/main.html',
            controller: 'MainController',
            controllerAs: 'mainVm'
        })

        .state('login',{
            url:'/login',
            templateUrl:'./app/login/login.html',
            controller: 'LoginController',
            controllerAs: 'loginVm'
        })

        .state('signup',{
            url:'/signup',
            templateUrl:'./app/signup/signup.html',
            controller: 'SignupController',
            controllerAs: 'signupVm'
        })

        .state('forgot',{
            url:'/forgot',
            templateUrl:'./app/login/forgot.html',
            controller: 'LoginController',
            controllerAs: 'loginVm'
        })
        .state('resetpassword', {
            url: '/reset/:token',
            templateUrl:'./app/login/reset.html',
            controller: 'LoginController',
            controllerAs: 'loginVm'
        })

        .state('editprofile',{
            url:'/profile',
            templateUrl:'./app/profile/edit-profile.html',
            controller: 'ProfileController',
            controllerAs: 'profileVm'
        })

        .state('dashboard',{
            url:'/dashboard',
            templateUrl:'./app/dashboard/dashboard.html',
            controller: 'DashboardController',
            controllerAs: 'dashboardVm'
        });

        $authProvider.google({
            clientId: '34441293765-chit3ni32s5m497eu1n8havjakg8jefs.apps.googleusercontent.com'
            //url: 'auth/google'
        });

        $authProvider.facebook({
            clientId: '1703919073263199'
            //url: 'auth/google'
        });

        $httpProvider.interceptors.push('authInterceptor');
}

// function runApp($window) {
//     var params = $window.location.search.substring(1);
//     console.log('hello');
//     console.log(params);

//     if(params && $window.opener && $window.opener.location.origin === $window.location.origin){
//         var pair = params.split('=');
//         var code = decodeURIComponent(pair[1]);
//         $window.opener.postMessage(code, $window.location.origin );
//     }
// }

})();