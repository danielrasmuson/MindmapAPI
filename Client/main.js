angular.module('app', []);

angular.module('app')
.constant('SERVER_DOMAIN', 'http://localhost:3000/')
.controller('BodyController', BodyController)
.service('Mindmap', Mindmap)

function BodyController(Mindmap){
  var me = this;
  me.hello = 'hi';
  me.attachDriveFiles = function(){
    swal("Good job!", "You clicked the button!", "success");
  }

  Mindmap
    .driveFolders()
    .then(function(folders){
      console.log('folder');
      console.log(folders);
    })

  setTimeout(function(){
    document.querySelector('#mindmap').focus();
  }, 1000)
}

function Mindmap($http, $q, SERVER_DOMAIN){
  function driveFolders(){
    var deferred = $q.defer();

    $http
      .get(SERVER_DOMAIN+'map/drive/folder')
      .then(function(res){
        deferred.resolve(res.data);
      })

    return deferred.promise;
  }

  return {
    driveFolders: driveFolders 
  } 
}