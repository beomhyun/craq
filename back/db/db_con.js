var mysql = require('mysql');
var config = require('./db_info').local;
var log = function(){
  // Inner logic
  function write_log(con,user_id,query){
    var sql = " insert into weblog(user_id,log,time) values( ? , ? ,now()) "
    var params = [user_id, query];
    con.query(sql, params, function(err, rows, fields) {
      if (!err){
      }
      else{
        console.log('Error while performing Query.', err);
      }
    })
  }
  // Expose API
  return {
    write_log: write_log
  }
}()
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
