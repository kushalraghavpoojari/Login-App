(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    //MainController.$inject = [''];

    /* @ngInject */
    function MainController() {
        var vm = this;
        vm.hello = 'bye';
        vm.open = false;
    }
})();    
        