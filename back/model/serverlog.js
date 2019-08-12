var log = function(con, user_id, query, result, ip){
    // Inner logic
      var sql = " insert into serverlog(who,request,result,ip_address) values(?,?,?,?) "
      var params = [user_id, query, result,ip];
      con.query(sql, params, function(err, rows, fields) {
        if (!err){
            // console.log("success write log");
        }
        else{
          console.log(err);
        }
      })
  };
  module.exports={
    log : log
 };
 