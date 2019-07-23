var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");

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
 *  /users/{pk}/{user_token}:
 *    get:
 *      tags:
 *      - users
 *      description: 모든 게시글을 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: pk
 *         type: integer
 *         description: |
 *          사용자 아이디 전달
 *       - in: path
 *         name: user_token
 *         type: string
 *         description: |
 *          사용자 토큰 전달
 */
  app.get('/users/:pk/:user_token', function(req,res){
    jwt.verify(req.params.user_token,  secretObj.secret, function(err, decoded) {
      if(err) res.status(401).send({error:'invalid token'});
      else{
        var sql = " SELECT * from user where pk = ? ";
        var params = [req.params.pk];
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
  });

  /**
   * @swagger
   *  /users:
   *    post:
   *      tags:
   *      - users
   *      description: 글 작성
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
  /**
   * @swagger
   *  /login:
   *    post:
   *      tags:
   *      - users
   *      description: 로그인
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
   *             password:
   *               type: string
   */
  app.post('/login', function(req,res){
      console.log(req.body);
      var sql = " select count(*) as c from user where email = ? and password = ? ";
      var params = [req.body.email,req.body.password];
      connection.query(sql,params, function(err, rows, fields) {
              if (!err){
                console.log(JSON.stringify(rows[0].c));
                if(rows[0].c == 1){

                  let token = jwt.sign({
                    email : req.body.email
                  },
                  secretObj.secret ,
                  {
                    expiresIn: '5m'
                  })

                  console.log("ok");
                  res.cookie("email",token);
                  res.send({token: token});
                }else{
                  console.log("no");
                  res.send("no");
                }
                // res.json(rows);
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
