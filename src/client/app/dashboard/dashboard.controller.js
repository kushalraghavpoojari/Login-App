(function() {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    //DashboardController.$inject = [''];

    /* @ngInject */
    function DashboardController($window,$http) {
        var vm = this;
        vm.name = $window.localStorage.getItem('userName');

        $http.get('/dash').then(function(res){
            console.log(res);
            vm.dashboard = res.data;
        }).catch(function(err){
            console.log(err);
        });
    }
})();
