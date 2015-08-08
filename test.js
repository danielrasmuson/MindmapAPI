var request = require('request-promise');
var Promise = require("bluebird");
var parseString = require('xml2js').parseString;
var Rx = require('rx');
var _ = require('lodash');
require('dotenv').load(); // load .env

const angelHackMapId = '415467547';

function _get(config){
  let qs = {
    api_key: process.env.MINDMAP_SECRET,
    auth_token: process.env.MINDMAP_TOKEN,
    api_sig: process.env.MINDMAP_SIG,
    response_format: 'xml',
  };
  _.assign(qs, config)
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
        method: 'mm.maps.getSlides',
        map_id: mapId
      })
      .forEach((data)=>{
        observer.onNext(data);
      }, (err)=>{
        observer.onError(err)
      })
  });
}


getNodes(angelHackMapId).forEach((nodes)=>{
  console.log(nodes);
})