angular.module('app', []);

angular.module('app')
.constant('SERVER_DOMAIN', 'http://localhost:3000/')
.controller('BodyController', BodyController)
.service('Mindmap', Mindmap)

function BodyController(Mindmap){
  var me = this;
  me.attachDriveFiles = function(){
    swal("Good job!", "You clicked the button!", "success");
  }

  Mindmap
    .driveFolders()
    .then(function(folders){

      // this is where you will query google drive for folders
      Mindmap
        .addNode('My New Awesome Node', folders[0].nodeId)
        .then(function(status){
        })

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

  function addNode(title, parentId){
    var deferred = $q.defer();

    $http
      .get(SERVER_DOMAIN+'map/add?title='+title+'&parent='+parentId)
      .then(function(res){
        deferred.resolve(res.data);
      })

    return deferred.promise;
  }

  return {
    driveFolders: driveFolders,
    addNode: addNode
  } 
}