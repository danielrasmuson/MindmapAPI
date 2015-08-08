var request = require('request-promise');
require('dotenv').load(); // load .env

var url = "https://www.mindmeister.com/services/rest?api_key="+process.env.MINDMAP_SECRET+"&auth_token="+process.env.MINDMAP_TOKEN+"&method=mm.maps.getList&response_format=xml&api_sig="+process.env.MINDMAP_SIG;

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
  }, function(a,b,c){
    console.log(a,b,c);

  })
