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

.controller('ChatCtrl', function($scope, Chats, $state) {
  console.log("Chat Controller initialized");
  $scope.IM = {
    textMessage: ""
  }; 

  Chats.selectRoom($state.params.roomId);

  //fetching chat records only if a room is selected
  if (roomName) {
    $scope.roomName = " - " + roomName;
    $scope.chats = Chats.all();
  }
  
  $scope.sendMessage = function (msg) {
    console.log(msg);
    Chats.send($scope.displayname, msg);
    $scope.IM.textMessage = "";
  }

  $scope.remove = function (chat) {
    Chats.remove(chat);
  }
})

.controller('RoomsCtrl', function($scope, Rooms, Chats, $state) {
  console.log("Rooms Controller Initialized")
  $scope.rooms = Rooms.all();

  $scope.openChatRoom = function (roomId) {
    $state.go('tab.chat', {
      roomId: roomId
    });
  }
});

