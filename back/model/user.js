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
   *      description: 모든 회원정보를 가져온다.
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
 *  /users/{pk}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 유저의 정보를 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: pk
 *         type: integer
 *         description: |
 *          사용자 아이디 전달
 */
app.get('/users/:pk', function(req,res){
    var sql = " SELECT * FROM user WHERE pk = ? ";
    var params = [req.params.pk];
    connection.query(sql,params, function(err, rows, fields) {
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
 *  /users/email/{email}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 유저의 정보를 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: email
 *         type: String
 *         description: |
 *          사용자 이메일 전달
 */
app.get('/users/email/:email', function(req,res){
    var sql = " SELECT * FROM user WHERE email like ? ";
    var params = [req.params.email];
    console.log(sql);
    connection.query(sql,params, function(err, rows, fields) {
            if (!err){
              console.log('The solution is: ', rows);
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
   *  /users:
   *    post:
   *      tags:
   *      - users
   *      description: 회원 가입. <br><br>  중복체크 <br> - This email is already in use.
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
   */
  app.post('/users', function(req,res){
      console.log(req.body);
      if(req.body.email == null){
        res.status(400).send({error:'email value need'});
      }
      var usedcheck = " select count(*) as usedcheck from user where email like ? or username like ?";
      var checkparams = [req.body.email, req.body.username];
      connection.query(usedcheck,checkparams, function(err, rows, fields) {
              if (err){
                res.send(err);
              }
              else if(rows[0].usedcheck != 0){
                res.status(400).send({error:' already used.'});
              }else{
                var sql = " insert into user(email, username, password) values(?,?,?) ";
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
      var sql = " select count(*) as c from user where email = ? and password = ? and is_removed = 0 ";
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
                    expiresIn: '10000m'
                  })

                  console.log("ok");
                  res.cookie("email",token);
                  res.send({status:"success", data: token});
                }else{
                  console.log("fail");
                  res.send({status: "fail"});
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
  /**
   * @swagger
   *  /users:
   *    delete:
   *      tags:
   *      - users
   *      description: 모든 회원정보를 가져온다.
   *      responses:
   *       200:
   */
  app.delete('/users', function(req,res){
      var sql = " UPDATE user SET is_removed = 1, updated_at = now() ";
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
 *  /users/{pk}:
 *    delete:
 *      tags:
 *      - users
 *      description: 해당 유저의 정보를 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: pk
 *         type: integer
 *         description: |
 *          사용자 아이디 전달
 */
app.delete('/users/:pk', function(req,res){
    var sql = " UPDATE user SET is_removed = 1, updated_at = now() WHERE pk = ?";
    var params = [req.params.pk];
    connection.query(sql,params, function(err, rows, fields) {
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
 *  /users/last-login/{pk}:
 *    put:
 *      tags:
 *      - users
 *      description: 마지막 로그인 시간 업데이트
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: pk
 *         type: integer
 *         description: |
 *          사용자 아이디 전달
 */
app.put('/users/last-login/:pk', function(req,res){
    var sql = " UPDATE user SET last_login = now() WHERE pk = ?";
    var params = [req.params.pk];
    connection.query(sql,params, function(err, rows, fields) {
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
 *  /follows:
 *    post:
 *      tags:
 *      - users
 *      description: 회원 팔로우 정보 등록
 *      responses:
 *       200:
 *      parameters:
 *       - in: body
 *         name: follow
 *         description: follow
 *         schema:
 *           type: object
 *           properties:
 *             fromUser:
 *               type: integer
 *             toUser:
 *               type: integer
 *             user_token:
 *               type: string
 */
app.post('/follows', function(req,res){
  jwt.verify(req.body.user_token,  secretObj.secret, function(err, decoded) {
    if(err) res.status(401).send({error:'invalid token'});
    else{
      var usercheck = " select count(*) as checkUser from user where pk in (?,?) ";
      var params = [req.body.fromUser,req.body.toUser];
      connection.query(usercheck,params, function(err, rows, fields) {
              if (!err){
                if(rows[0].checkUser == 2){
                  var followcheck = " select count(*) as checkfollow from follow where fromUser = ? and toUser = ? ";
                  connection.query(followcheck,params, function(err, rows, fields) {
                    if(err){
                      console.log('Error while performing Query.', err);
                      res.send({status: "fail"});
                    }else if(rows[0].checkfollow == 0){
                      var sql = " insert into follow(fromUser,toUser) values(?,?) ";
                      connection.query(sql,params, function(err, rows, fields) {
                        if(!err){
                          console.log(rows);
                          res.send({status: "success"});
                        }else{
                          console.log('Error while performing Query.', err);
                          res.send({status: "fail"});
                        }
                      });
                    }else {
                      res.send({status: "fail",data: "already following"});
                    }
                  });



                }else{
                  res.send({status: "fail"});
                }
              }
              else{
                console.log('Error while performing Query.', err);
                res.send({status: "fail"});
              }
            });
    }
  });


  }
);

};



module.exports = initializeEndpoints;
