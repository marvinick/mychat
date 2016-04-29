angular.module('mychat.controllers', [])

.controller('LoginCtrl', function($scope, $ionicModal, $state) {
  console.log('Login Controller Initialized');

  var ref = new Firebase($scope, firebaseUrl);
  var auth = $firebaseAuth(ref);

  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.createUser = function(user) {
    console.log("Create User Function called");
    if (user && user.email && user.password && user,displayname) {
      $ionicLoading.show({
        template: "Signing Up . . ."
      });

      auth.$createUser( {
        email: user.email,
        password: user.password
      }).then(function (userData) {
        alert("User created successfully!");
        ref.child("users").child(userData.uid).set({
          email: user.email,
          displayname: user.displayname
        });
        $ionicLoading.hide();
        $scope.modal.hide();
      }).catch(function (error) {
        alert("Error: " + error);
        $ionicLoading.hide();
      });
    } else
        alert("Please fill all details");
  }

  scope.signIn = function(user) {
    if(user && user.email && user.pwdForLogin) {
      $ionicLoading.show({
        template: "Signing In . . ."
      });
      auth.$authWithPassword({
        email: user.email,
        password: user.pwdForLogin
      }).then(function (authData) {
        console.log("Logged in as:" + authData.uid);
        ref.child("users").child(authData.uid).once('value', function (snapshot) {
          var val = snapshot.val();
          // To Update angularJS $scope either use $apply or $timeout
          $scope.$apply(function() {
            $rootScope.displayname = val;
          });
        });
        $ionicLoading.hide();
        $state.go('tab.rooms');
      }).catch(function (error) {
        alert("Authentication failed:" + error.message);
        $ionicLoading.hide();
      });
    } else 
        alert("Please enter email and password both");
  }
})

.controller('ChatCtrl', function($scope, Chats) {
  console.log("Chat Controller initialized");
  $scope.chats = Chats.all();
})

.controller('RoomsCtrl', function($scope, Rooms) {
  console.log("Rooms Controller Initialized")
  $scope.rooms = Rooms.all();
});

