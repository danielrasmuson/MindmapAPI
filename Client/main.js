angular.module('app', []);

angular.module('app')
.controller('BodyController', BodyController);

function BodyController(){
  var me = this;
  me.hello = 'hi';
  me.attachDriveFiles = function(){
    swal("Good job!", "You clicked the button!", "success");
  }

  setTimeout(function(){
    document.querySelector('#mindmap').focus();
  }, 1000)
}
