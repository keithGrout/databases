var fs = require('fs');
var util = require('./request-handler.js');

var findPath = function(parsedURL){
  var pathname = parsedURL.pathname;
  var location = '../client';

  if (pathname === '/'){
    location += '/index.html';
  } else {
    location += pathname;
  }

  return location;
};


var contentType = function(pathname){
  var extension = pathname.slice(pathname.split("").lastIndexOf('.')+1);

  var type = {
    'js': 'text/javascript',
    'css': 'text/css'
  };

  if (type[extension]){
    return type[extension];
  } else {
    return 'text/html';
  }
};


exports.fileRequest = function(request, response, parsedURL){

  var location = findPath(parsedURL);
  var content = contentType(parsedURL.pathname);

  fs.readFile(location, function(err, data){
    if(err){
      console.log(err);
      util.send404(response);
    } else {
        var headers = util.defaultCorsHeaders;
        headers['Content-Type'] = content;
        var respCode = 200;
        response.writeHead(respCode, headers);
        response.end(data);
    }
  });

};