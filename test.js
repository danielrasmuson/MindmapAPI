var request = require('request-promise');
var Promise = require("bluebird");
var parseString = require('xml2js').parseString;
var Rx = require('rx');
require('dotenv').load(); // load .env

function _get(){
  return Rx.Observable.create((observer)=>{
    request
      .get({
        url: "https://www.mindmeister.com/services/rest",
        qs: {
          api_key: process.env.MINDMAP_SECRET,
          auth_token: process.env.MINDMAP_TOKEN,
          method: 'mm.maps.getList',
          response_format: 'xml',
          api_sig: process.env.MINDMAP_SIG,
        }
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
    _get()
      .forEach((data)=>{
        observer.onNext(data.rsp.maps[0].map);
      }, (err)=>{
        observer.onError(err)
      })
  });
}


maps().forEach((maps)=>{
  console.log(maps);
})