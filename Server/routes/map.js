var express = require('express');
var router = express.Router();
var mindmap = require('../scripts/mindmap_es5.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the map page');
});

var angelHackMapId = '415467547';

function isDriveLink(text){
  return text.indexOf('https://drive.google.com') !== -1;
}

router.get('/drive/folder', function(req, res, next) {
  mindmap.nodes(angelHackMapId)
    .forEach(function(nodes){
      var folders = nodes
        .filter(function(node){
          return isDriveLink(node.title[0])
        })
        .map(function(node){
          return {id: node.id[0]}
        })
      res.json(folders);
    })
});

module.exports = router;
