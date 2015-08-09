var express = require('express');
var router = express.Router();
var mindmap = require('../scripts/mindmap_es5.js');
var _ = require('lodash');

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
          return {
            nodeId: node.id[0],
            driveId: _.last(node.title[0].split('/'))
          }
        })
      res.json(folders);
    })
});

router.get('/add', function(req, res, next) {
  mindmap.newNode({
    mapId: angelHackMapId,
    parentId: req.param('parent'),
    title: req.param('title'),
  }).forEach(function(result){
    res.send(result);
  })
});

module.exports = router;
