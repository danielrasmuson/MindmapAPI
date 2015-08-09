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

        // debugger;
        Drive.getFiles(
          // "0B_2gh7Xek2PAfk5SWEhmZV9MY1k5Y3N1VEN2VTkzZXVBZkk3MnJkRTlQeFI4RFZvbFE5Umc",
          folders[0].driveId,
          function(docs){
            docs.forEach(function(doc){

              // this is where you will query google drive for folders
              // debugger;
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
          }
        )
      })
  }




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