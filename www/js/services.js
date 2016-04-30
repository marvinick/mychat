angular.module('mychat.services', ['firebase'])

.factory('Auth', ["$firebaseAuth", "$rootScope", function($firebaseAuth, $rootScope) {
  var ref = new Firebase(firebaseUrl);
  return $firebaseAuth(ref);
}])

.factory('Chats', function ($firebase, Rooms) {

  var selectedRoomId;

  var ref = new Firebase(firebaseUrl);
  var chats;

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chat.$remove(chat).then(function (ref) {
        ref.key() === chat.$id; // true item has been removed 
      });
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    },
    getSelectedRoomName: function() {
      var selectedRoom;
      if (selectedROomId && selectedROomId != null) {
        selectedRoom = Rooms.get(selectedRoomId);
        if (selectedRoom)
          return selectedRoom.name;
        else
          return null;
      } else
          return null;
    },
    selectRoom: function (roomId) {
      console.log("selecting the room with id: " + roomId);
      selectedRoomId = roomId;
      if (!NaN(roomId)) {
        chats = $firebase(ref.child('rooms').child(selectedRoomId).child('chats')).$asArray();
      }
    },
    send: function(from, message) {
      console.log("sending message room :" + from.displayName + " & message is " + message);
      if (from && message) {
        var chatMessage = {
          from: from.displayName,
          message: message,
          createdAt: Firebase.ServerValue.TIMESTAMP
        };
        chats.$add(chatMessage).then(function (data) {
          console.log("message added");
        });
      }
    }
  }
})

//simple service which returns rooms coollection as array from salesforce & binds to the scope in controller
.factory('Rooms', function($firebase) {
  //might use resource here that returns a JSON Array
  var ref = new Firebase(firebaseUrl);
  var rooms = $firebase(ref.child('rooms')).$asArray();

  return {
     all: function() {
      return rooms;
     },
     get: function(roomId) {
      //simple index lookup
      return rooms.$getRecord(roomId);
     }
  }
});
