(function() {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    //ProfileController.$inject = [''];

    /* @ngInject */
    function ProfileController($window, $auth, userData) {
        var vm = this;
        vm.isEdit = false;
        vm.name = $window.localStorage.getItem('userName');
        vm.imageUpload = imageUpload;
        vm.link = link;
        vm.unlink = unlink;
        vm.getPhoto = getPhoto;
        vm.age = age;
        vm.dob = null;
        vm.isEditValue = isEditValue;
        vm.phone = '999-999-9999';
        //vm.age = 23;
        // vm.dob = '04/14/1994';
        vm.gender= 'Male';
        vm.location = '3030 Southern Pine Trl, Orlando, Fl-32826';
        vm.bio = 'loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom loreum epsom';

        function imageUpload() {
            $("input[id='imageUpload']").click();
        }

        function getPhoto() {
            if($window.localStorage.getItem('picture')){
                var photo = $window.localStorage.getItem('picture').split('sz=5');
                if(photo[1]){
                    var finalPic = photo[0] + 'sz=200';
                    return finalPic;
                } 
                return $window.localStorage.getItem('picture');
            } else {
                return 'src/client/images/avatar.png';
            }
        }

        function isEditValue() {
            vm.isEdit = !vm.isEdit;
        }

        function link(provider) {
            // console.log(userData.userInfo());
            // var user = userData.userInfo();
            // console.log(user);
            var userid = $window.localStorage.getItem('userId');
            $auth.link(provider, {userId: userid})
            .then(function(response) {
              console.log("You have successfully linked an account.");
            })
            .catch(function(err) {
              // Handle errors here.
              console.log(err);
            });
        }

        function unlink(provider) {
            $auth.link(provider)
            .then(function(response) {
              console.log("You have successfully unlinked an account.");
            })
            .catch(function(err) {
              // Handle errors here.
              console.log(err);
            });
        }

        function age() {
            if(vm.dob){
            var date = moment(vm.dob, "MM/DD/YYYY").fromNow();
            var test = date.split(' ');
               return test[0];   
            }
            else return null;
            
        }
    }
})();    
        