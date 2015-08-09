angular.module('app')
.service('Drive', GoogleDrive);

function GoogleDrive($q){
  

  function getFiles(folderId, callback){
    // Your Client ID can be retrieved from your project in the Google
    // Developer Console, https://console.developers.google.com
    var CLIENT_ID = '642063020701-6jg6jbknhlnf1gfl6g4i6mt0a733d0ul.apps.googleusercontent.com';
    var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

    function checkAuth() {
      gapi.auth.authorize(
        {
          'client_id': CLIENT_ID,
          'scope': SCOPES,
          'immediate': true
        }, handleAuthResult);
    }

    function handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        loadDriveApi();
      } 
    }

    function handleAuthClick(event) {
      gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResult);
      return false;
    }

    function getFilesPerFolder(){
      // currentFolder = document.querySelector('input').value;
      handleAuthClick(event);
    }

    /**
     * Load Drive API client library.
     */
    function loadDriveApi() {
      gapi.client.load('drive', 'v2', listFiles);
    }

    function getFile(fileId){
      var deferred = $q.defer();

      gapi.client.drive.files.get({
        'fileId': fileId
      })
      .execute(function(resp) {
        deferred.resolve({
          title: resp.title,
          id: resp.id,
          link: resp.alternateLink
        });
      });

      return deferred.promise;
    }

    function listFiles() {
      var request = gapi.client.drive.children.list({
        'folderId': folderId 
      });
        request.execute(function(resp) {
          var filePromies = [];

          var files = resp.items;
          if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
              filePromies.push(getFile(files[i].id));
            }
          } 
          $q.all(filePromies).then(function(data){
            callback(data);
          })

        });

    }

    getFilesPerFolder();
  }





  return {
    getFiles: getFiles
  }  
}