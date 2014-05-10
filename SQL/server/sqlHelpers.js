var dbconfig = require('./dbconfig');
var mysql = require('mysql');
var db = mysql.createConnection(dbconfig);

// TODO - make username unique... also make a index

var sendQuery = function (sql, callback) {
  db.query(sql, function(err, rows, fields){
    if(err){
      console.log(err);
      throw err;
    }else{
      callback(rows, fields);
    }
  });
};

var userGet = function (usernameOrId, callback) {
  var sql = 'select * from users where ?? = ?';

  if (typeof usernameOrId === 'string') {
    var inserts = ['name', usernameOrId];
  } else {
    var inserts = ['id', usernameOrId];
  }

  sql = mysql.format(sql, inserts);
  sendQuery(sql, callback);
};

var userCreate = function (username, callback) {
  var sql = 'insert into users (name) values ("?")';
  var inserts = [username];

  sql = mysql.format(sql, inserts);
  sendQuery(sql, callback);
};

var userUpdate = function () {
  sendQuery(sql, callback);
};

var userRemove = function () {
  sendQuery(sql, callback);
};

var messagesCreate = function (userId, text, callback) {
  // write our message data
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  var sql = 'insert into messages (user, text, date) values (?, ?, ?)';
  var inserts = [userId, text, date];

  sql = mysql.format(sql, inserts);
  sendQuery(sql, callback);
};

var messagesGet = function () {

};

module.exports.users = {
  get: userGet,
  create: userCreate,
  update: userUpdate,
  remove: userRemove
};

module.exports.messages = {
  create: messagesCreate
};
