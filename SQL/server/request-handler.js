var fs = require('fs');
var dbconfig = require('./dbconfig');
var util = require('util');
var mysql = require('mysql');
var db = mysql.createConnection(dbconfig);
var sqlHelpers = require('./sqlHelpers');

exports.sendMessage = function(res, data, respCode , contentType){

  var headers = exports.defaultCorsHeaders;
  if (contentType){
    headers['Content-Type'] = contentType;
  } else {
    headers['Content-Type'] = 'application/json';
  }
  res.writeHead(respCode, headers);
  res.end(JSON.stringify({results: data}));
};

exports.send404 = function(response){
  exports.sendMessage(response, 'Not Found', 404);
};

exports.collectData = function(req){
  var data ='';
  req.on('data', function(partial){
    data += partial;
  });

  req.on('end', function(){
    data = JSON.parse(data);
    messages.unshift(data);

    var username = data.username;
    var text = data.text;

    // writeLog(messages);
    // db.connect();

    // make sure the user exists
    sqlHelpers.users.get(username, function (rows, fields) {
      //  if no create a user
      if (rows.length === 0) {
        sqlHelpers.users.create(username, function (rows, fields) {
          // get the id
          console.log(rows);
          var id = rows.insertId;
          // save the message
          sqlHelpers.messages.create(id, text, function (row, fields) {
            console.log(row);
          });
        });
      } else { //  if yes get the id
        var id = rows[0].id;
        // save the message
        sqlHelpers.messages.create(id, text, function (row, fields) {
          console.log(row);
        });
      }

      // console.log(rows, fields);
    });
  });

};

var messages = [];

var writeLog = function(data){
  fs.writeFile('./log.txt', JSON.stringify(data), function(err){
    if (err){
      console.log('write error');
    }
  });
};

var readLog = function(){
  fs.readFile('./log.txt', function(err, data){
    if (err){
      console.log('error reading file');
    } else {
      messages = JSON.parse(data);
    }
  });
};

readLog();

exports.defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
};

var sendGet = function(request, response){
  exports.sendMessage(response, messages, 200);
};

var sendPost = function(request, response){
  exports.collectData(request);
  exports.sendMessage(response, messages[0], 201);
};

var sendOptions = function(request,response){
  exports.sendMessage(response, messages, 201);
};

var responseTypes = {
  'GET': sendGet,
  'POST': sendPost,
  'OPTIONS': sendOptions
};

exports.handleRequest = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);
  var action = responseTypes[request.method];

  if (action){
    action(request, response);
  } else {
    exports.send404(response);
  }

};
