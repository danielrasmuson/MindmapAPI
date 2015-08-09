var request = require('request-promise');
var parseString = require('xml2js').parseString;
var Rx = require('rx');
var _ = require('lodash');
var md5 = require('md5');
require('dotenv').load(); // load .env

const angelHackMapId = '415467547';

function calculateSignature(params){
  const SHARED_KEY = process.env.MINDMAP_SHARED;
  return md5(
    SHARED_KEY+
    Object.keys(params)
      .sort()
      .map((key)=>{
        return key+params[key]
      })
      .join('')
  )
}

function _get(config){
  let qs = {
    api_key: process.env.MINDMAP_SECRET,
    auth_token: process.env.MINDMAP_TOKEN,
    response_format: 'xml',
  };
  _.assign(qs, config)
  qs.api_sig = calculateSignature(qs);

  return Rx.Observable.create((observer)=>{
    request
      .get({
        url: "https://www.mindmeister.com/services/rest",
        qs: qs
      })
      .then((xml)=>{
        parseString(xml, (err, result)=>{
          if (err){
            observer.onError(err);
          } else{
            observer.onNext(result);
          }
        })
      })
      .catch((err)=>{
        observer.onError(err);
      });
  });
}

function maps(){
  return Rx.Observable.create((observer)=>{
    _get({
        method: 'mm.maps.getList',
      })
      .forEach((data)=>{
        observer.onNext(data.rsp.maps[0].map);
      }, (err)=>{
        observer.onError(err)
      })
  });
}

function getNodes(mapId){
  return Rx.Observable.create((observer)=>{
    _get({
        method: 'mm.maps.getMap',
        map_id: mapId
      })
      .forEach((data)=>{
        observer.onNext(data.rsp.ideas[0].idea);
      }, (err)=>{
        observer.onError(err)
      })
  });
}

function newNode({mapId, parentId, title}){
  return Rx.Observable.create((observer)=>{
    _get({
        method: 'mm.ideas.insert',
        map_id: mapId,
        parent_id: parentId,
        title: title,
      })
      .forEach((data)=>{
        observer.onNext(data)
      }, (err)=>{
        observer.onError(err)
      })
  });
}

function isDriveLink(text){
  return text.indexOf('https://drive.google.com') !== -1;
}

getNodes(angelHackMapId).forEach((nodes)=>{
  nodes
    .filter((node)=>{
      return isDriveLink(node.title[0])
    })
    .forEach((node)=>{
      newNode({
        mapId: angelHackMapId,
        parentId: node.id[0],
        title: 'My New Inserted Node'
      }).forEach((data)=>{
        console.log(data)
      })
    })
})