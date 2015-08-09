angular.module('app', []);

angular.module('app')
.constant('SERVER_DOMAIN', 'http://localhost:3000/')
.controller('BodyController', BodyController)
.service('Mindmap', Mindmap)

function BodyController(Mindmap, Drive){
  var me = this;
  var mindmap = document.getElementById('mindmap');

  function reloadMindmap(){
    mindmap.src = mindmap.src; 
  }

  me.attachDriveFiles = function(){
    Mindmap
      .driveFolders()
      .then(function(folders){

        // Todo: You Might be doing this [0] wrong
        Drive
          .getFiles(folders[0].driveId)
          .then(function(docs){

            Drive
              .getFolder(folders[0].driveId)
              .then(function(folder){
                console.log('folder');
                console.log(folder);
                // call file change here
              })


            docs.forEach(function(doc){
              Mindmap
                .addNode(doc.title, doc.link, folders[0].nodeId)
                .then(function(status){
                  reloadMindmap();
                  swal({
                      title: "Folder Synced with Drive!",
                      text:"Any Files you add in drive will be updated in this folder.",
                      type: "success",
                    },
                    function(){
                      mindmap.focus();
                    }
                  );
                })
            })
          })
      })
  }

 
  setTimeout(function(){
  }, 1000);





  setTimeout(function(){
    mindmap.focus();
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

  function addNode(title, link, parentId){
    var deferred = $q.defer();

    $http
      .get(SERVER_DOMAIN+'map/add?title='+title+'&parent='+parentId+"&link="+link)
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