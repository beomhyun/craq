var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();


const initializeEndpoints = (app)=>{
  /**
   * @swagger
   *  /users:
   *    get:
   *      tags:
   *      - users
   *      description: 모든 게시글을 가져온다.
   *      responses:
   *       200:
   */
  app.get('/users', function(req,res){
      var sql = " SELECT * FROM user ";
      connection.query(sql, function(err, rows, fields) {
              if (!err){
                // console.log('The solution is: ', rows);
                // return callback(null,rows);
                res.json(rows);
              }
              else{
                console.log('Error while performing Query.', err);
                res.send(err);
              }
            });
    }
);

/**
 * @swagger
 *  /users/{id}/{user_token}:
 *    get:
 *      tags:
 *      - users
 *      description: 모든 게시글을 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: id
 *         type: integer
 *         description: |
 *          사용자 아이디 전달
 *       - in: path
 *         name: user_token
 *         type: string
 *         description: |
 *          사용자 토큰 전달
 */
  app.get('/users/:id/:user_token', function(req,res){
    if(req.params.user_token != "abcd"){
      res.send("잘못된 접근입니다.")
    }else{
      var sql = " SELECT * from user where id = ? ";
      var params = [req.params.id];
      connection.query(sql,params, function(err, rows, fields) {
        if (!err){
          // console.log('The solution is: ', rows);
          res.json(rows);
        }
        else{
          console.log('Error while performing Query.', err);
          res.send(err);
        }
      });
    }

  });

  /**
   * @swagger
   *  /users:
   *    post:
   *      tags:
   *      - users
   *      description: 모든 게시글을 가져온다.
   *      responses:
   *       200:
   *      parameters:
   *       - in: body
   *         name: user
   *         description: user_info
   *         schema:
   *           type: object
   *           properties:
   *             email:
   *               type: string
   *             username:
   *               type: string
   *             password:
   *               type: string
   *             status:
   *               type: integer
   *             profile:
   *               type: string
   *             git_address:
   *               type: string
   */
  app.post('/users', function(req,res){
      console.log(req.body);
      var sql = " insert into user(email, username, password, status, last_login, created_at, profile, updated_at, git_address) values(?,?,?,?,now(),now(),?,now(),?) ";
      var params = [req.body.email,req.body.username,req.body.password,req.body.status,req.body.profile,req.body.git_address];
      connection.query(sql,params, function(err, rows, fields) {
              if (!err){
                res.json(rows);
              }
              else{
                console.log('Error while performing Query.', err);
                res.send(err);
              }
            });
    }
  );

};



module.exports = initializeEndpoints;
