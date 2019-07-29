var mysql = require('mysql');
var config = require('./db_info').local;

var  Connection;
module.exports = function () {
  return {
    init: function () {
      if(Connection) return Connection;
      else{
        Connection = mysql.createConnection({
          host: config.host,
          port: config.port,
          user: config.user,
          password: config.password,
          database: config.database
        })
        return Connection;
      }
    },
  }
};
