angular.module('app', ['ngMaterial']);

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
                Mindmap.editNode(folder.title, folders[0].nodeId, folder.link)
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

  function editNode(title, id, link){
    var deferred = $q.defer();

    $http
      .get(SERVER_DOMAIN+'map/edit?title='+title+'&id='+id+"&link="+link)
      .then(function(res){
        deferred.resolve(res.data);
      })

    return deferred.promise;
  }


  return {
    driveFolders: driveFolders,
    addNode: addNode,
    editNode: editNode
  } 
}


angular.module('app')
  .controller('AppCtrl', AppCtrl);

function AppCtrl ($scope, $log) {
    var tabs = [
          { title: 'One', content: "Tabs will become paginated if there isn't enough room for them."},
          { title: 'Two', content: "You can swipe left and right on a mobile device to change tabs."},
          { title: 'Three', content: "You can bind the selected tab via the selected attribute on the md-tabs element."},
          { title: 'Four', content: "If you set the selected tab binding to -1, it will leave no tab selected."},
          { title: 'Five', content: "If you remove a tab, it will try to select a new one."},
          { title: 'Six', content: "There's an ink bar that follows the selected tab, you can turn it off if you want."},
          { title: 'Seven', content: "If you set ng-disabled on a tab, it becomes unselectable. If the currently selected tab becomes disabled, it will try to select the next tab."},
          { title: 'Eight', content: "If you look at the source, you're using tabs to look at a demo for tabs. Recursion!"},
          { title: 'Nine', content: "If you set md-theme=\"green\" on the md-tabs element, you'll get green tabs."},
          { title: 'Ten', content: "If you're still reading this, you should just go check out the API docs for tabs!"}
        ],
        selected = null,
        previous = null;
    $scope.tabs = tabs;
    $scope.selectedIndex = 2;
    $scope.$watch('selectedIndex', function(current, old){
      previous = selected;
      selected = tabs[current];
      if ( old + 1 && (old != current)) $log.debug('Goodbye ' + previous.title + '!');
      if ( current + 1 )                $log.debug('Hello ' + selected.title + '!');
    });
    $scope.addTab = function (title, view) {
      view = view || title + " Content View";
      tabs.push({ title: title, content: view, disabled: false});
    };
    $scope.removeTab = function (tab) {
      var index = tabs.indexOf(tab);
      tabs.splice(index, 1);
    };
}

// angular.module('app', [''])
//       .controller('AppCtrl', AppCtrl);
//   function AppCtrl ($scope, $log) {
//     var tabs = [
//           { title: 'One', content: "Tabs will become paginated if there isn't enough room for them."},
//           { title: 'Two', content: "You can swipe left and right on a mobile device to change tabs."},
//           { title: 'Three', content: "You can bind the selected tab via the selected attribute on the md-tabs element."},
//           { title: 'Four', content: "If you set the selected tab binding to -1, it will leave no tab selected."},
//           { title: 'Five', content: "If you remove a tab, it will try to select a new one."},
//           { title: 'Six', content: "There's an ink bar that follows the selected tab, you can turn it off if you want."},
//           { title: 'Seven', content: "If you set ng-disabled on a tab, it becomes unselectable. If the currently selected tab becomes disabled, it will try to select the next tab."},
//           { title: 'Eight', content: "If you look at the source, you're using tabs to look at a demo for tabs. Recursion!"},
//           { title: 'Nine', content: "If you set md-theme=\"green\" on the md-tabs element, you'll get green tabs."},
//           { title: 'Ten', content: "If you're still reading this, you should just go check out the API docs for tabs!"}
//         ],
//         selected = null,
//         previous = null;
//     $scope.tabs = tabs;
//     $scope.selectedIndex = 2;
//     $scope.$watch('selectedIndex', function(current, old){
//       previous = selected;
//       selected = tabs[current];
//       if ( old + 1 && (old != current)) $log.debug('Goodbye ' + previous.title + '!');
//       if ( current + 1 )                $log.debug('Hello ' + selected.title + '!');
//     });
//     $scope.addTab = function (title, view) {
//       view = view || title + " Content View";
//       tabs.push({ title: title, content: view, disabled: false});
//     };
//     $scope.removeTab = function (tab) {
//       var index = tabs.indexOf(tab);
//       tabs.splice(index, 1);
//     };
//   }
// }