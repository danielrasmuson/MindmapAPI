angular.module('app')
.service('Drive', GoogleDrive);

function GoogleDrive($q){
  

  function getFiles(folderId, callback){
    // Your Client ID can be retrieved from your project in the Google
    // Developer Console, https://console.developers.google.com
    var CLIENT_ID = '642063020701-6jg6jbknhlnf1gfl6g4i6mt0a733d0ul.apps.googleusercontent.com';
    var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

    /**
     * Check if current user has authorized this application.
     */
    function checkAuth() {
      gapi.auth.authorize(
        {
          'client_id': CLIENT_ID,
          'scope': SCOPES,
          'immediate': true
        }, handleAuthResult);
    }

    /**
     * Handle response from authorization server.
     *
     * @param {Object} authResult Authorization result.
     */
    function handleAuthResult(authResult) {
      // var authorizeDiv = document.getElementById('authorize-div');
      if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        // authorizeDiv.style.display = 'none';
        loadDriveApi();
      } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        // authorizeDiv.style.display = 'inline';
      }
    }

    /**
     * Initiate auth flow in response to user clicking authorize button.
     *
     * @param {Event} event Button click event.
     */
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
          id: resp.id
        });
      });

      return deferred.promise;
    }

    /**
     * Print files.
     */
    function listFiles() {
      // var request = gapi.client.drive.files.list({
      //     'maxResults': 10
      //   });

      var request = gapi.client.drive.children.list({
        'folderId': folderId 
      });
        request.execute(function(resp) {
          var filePromies = [];

          var files = resp.items;
          if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
              
              filePromies.push(getFile(files[i].id));

              // debugger
                
            }
          } else {
            appendPre('No files found.');
          }

          $q.all(filePromies).then(function(data){
            callback(data);
          })

        });

    }

    function allFiles(){
      if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              appendPre(file.title + ' (' + file.id + ')');
            }
          } else {
            appendPre('No files found.');
          }
    }

    /**
     * Append a pre element to the body containing the given message
     * as its text node.
     *
     * @param {string} message Text to be placed in pre element.
     */
    function appendPre(message) {
      // var pre = document.getElementById('output');
      // var textContent = document.createTextNode(message + '\n');
      // pre.appendChild(textContent);
    }

    function getFiles(authResult, folderId){
      // currentFolder = folderId;
      handleAuthResult(authResult);
    }
    getFilesPerFolder();
  }



  // setTimeout(function(){
  //     console.log(callback);
  //   });
  // }, 1000)


  return {
    getFiles: getFiles
  }  
}