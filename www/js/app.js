// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('mychat', ['ionic', 'mychat.controllers', 'mychat.services', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault(); 
    }
  });
})
     

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  //state to represent login view 
  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl',
    resolve: {
      //controller will not be loaded unti $requireAuth resolve
      // Auth refers to our $firebaseAuth wrapper in the example above 
      "currentAuth": ["Auth",
        function (Auth) {
          // $requireAuth returns promise so the resolve waits for it to complete
          return Auth.$waitForAuth();
      }]
    }
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    resolve: {
      //controller will not be loaded unti $requireAuth resolve
      // Auth refers to our $firebaseAuth wrapper in the example above 
      "currentAuth": ["Auth",
        function (Auth) {
          // $requireAuth returns promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
      }]
    }
  })

  // Each tab has its own nav history stack:

  .state('tab.rooms', {
    url: '/rooms',
    views: {
      'tab-rooms': {
        templateUrl: 'templates/tab-rooms.html',
        controller: 'RoomsCtrl'
      }
    }
  })

  .state('tab.chat', {
      url: '/chat',
      views: {
        'tab-chat': {
          templateUrl: 'templates/tab-chat.html',
          controller: 'ChatCtrl'
        }
      }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
