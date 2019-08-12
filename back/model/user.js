var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const multer = require('multer');
const path = require("path");
const serverlog = require('./serverlog.js');
const crypto = require('crypto');

let storage = multer.diskStorage({
    destination: function(req, file ,callback){
        callback(null, "image/profile/")
    },
    filename: function(req, file, callback){
        callback(null, new Date().valueOf() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

/**
 * @swagger
 * definitions:
 *   userInfo:
 *     type: object
 *     properties:
 *       pk:
 *         type: integer
 *         description: user's id
 *       Permission:
 *         type: integer
 *         description: user's permission (0 일반 , 1 관리자)
 *       email:
 *         type: string
 *         description: user's email(unique)
 *       username:
 *         type: string
 *         description: user's name(unique)
 *       password:
 *         type: string
 *         description: user's password (암호화해서 저장)
 *       last_login:
 *         type: timestamp
 *         description: user's last login time
 *       createdUser:
 *         type: integer
 *         description: id of user who create the information
 *       updatedUser:
 *         type: integer
 *         description: id of user who update the information
 *       is_public:
 *         type: integer
 *         description: visibilty check
 *       is_active:
 *         type: integer
 *         description: activity check
 *       is_removed:
 *         type: integer
 *         description: remove check
 *       ip_address:
 *         type: string
 *         description: user's ip
 *       info:
 *         type: string
 *         description: information or detailed description
 *   user pofile Info:
 *     type: object
 *     properties:
 *       User:
 *         type: integer
 *         description: user's id
 *       profile_image:
 *         type: string
 *         description: user's profile image (경로)
 *       ssafy_years:
 *         type: integer
 *         description: user's ssafy year
 *       is_major:
 *         type: boolean
 *         description: user's major check
 *       region:
 *         type: string
 *         description: user's region
 *       grade:
 *         type: string
 *         description: user's SW grade
 *       intro:
 *         type: string
 *         description: user's intro
 *       gitUrl:
 *         type: string
 *         description: user's gitUrl
 *       createdUser:
 *         type: integer
 *         description: id of user who create the information
 *       updatedUser:
 *         type: integer
 *         description: id of user who update the information
 *       is_public:
 *         type: integer
 *         description: visibilty check
 *       is_active:
 *         type: integer
 *         description: activity check
 *       is_removed:
 *         type: integer
 *         description: remove check
 *       ip_address:
 *         type: string
 *         description: user's ip
 *       info:
 *         type: string
 *         description: information or detailed description
 */

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
      var sql = 
                `
                SELECT
                  U.PK
                  ,U.EMAIL
                  ,U.USERNAME
                  ,U.LAST_LOGIN
                  ,(SELECT
                        COUNT(*)*13
                    FROM
                        ARTICLE AS A
                    WHERE
                        A.ARTICLE != 0
                        AND A.CREATEDUSER = U.PK
                        AND A.IS_ACTIVE = 1) AS SCORE                     
                  ,(SELECT
                        COUNT(*)
                    FROM
                        ARTICLE AS A
                    WHERE
                        A.ARTICLE != 0
                        AND A.CREATEDUSER = U.PK
                        AND A.IS_ACTIVE = 1) AS SELECTED_ANSWER
                  ,(SELECT
                        COUNT(*)
                    FROM
                        ARTICLE AS A
                    WHERE
                        A.ARTICLE != 0
                        AND A.CREATEDUSER = U.PK) AS ANSWERS
                FROM
                  USER AS U
                WHERE
                  IS_REMOVED = 0
                `;
      connection.query(sql, function(err, rows, fields) {
              if (!err){
                res.json(rows);
                serverlog.log(connection,0,this.sql,"success",req.connection.remoteAddress);
              }
              else{
                serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
                res.send(err);
              }
            });
    }
);
/**
 * @swagger
 *  /email-checking/{email}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 이메일의 중복 체크
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: email
 *         type: string
 *         description: |
 *          사용자 이메일 전달
 */
app.get('/email-checking/:email', function(req,res){
    var sql = " select count(*) as checking from user where email like ? ";
    var params = [req.params.email];
    connection.query(sql,params, function(err, rows, fields) {
            if (!err){
              if(rows[0].checking == 0){
                res.send({status: "success"});
                serverlog.log(connection,0,this.sql,"success",req.connection.remoteAddress);
              }else{
                res.send({status: "fail"});
                serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
              }
            }
            else{
              serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
              res.send({status: "fail"});
            }
          });
  }
);
/**
 * @swagger
 *  /username-checking/{username}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 이름 중복 체크
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: username
 *         type: string
 *         description: |
 *          사용자 이름 전달
 */
app.get('/username-checking/:username', function(req,res){
    var sql = " select count(*) as checking from user where username like ? ";
    var params = [req.params.username];
    connection.query(sql,params, function(err, rows, fields) {
            if (!err){
              if(rows[0].checking == 0){
                serverlog.log(connection,0,this.sql,"success",req.connection.remoteAddress);
                res.send({status: "success"});
              }else{
                serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
                res.send({status: "fail"});
              }
            }
            else{
              serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
              res.send({status: "fail"});
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
      var sql = 
                `
                SELECT
                  U.PK
                  ,U.EMAIL
                  ,U.USERNAME
                  ,U.LAST_LOGIN
                  ,(SELECT
                        COUNT(*)*13
                    FROM
                        ARTICLE AS A
                    WHERE
                        A.ARTICLE != 0
                        AND A.CREATEDUSER = U.PK
                        AND A.IS_ACTIVE = 1) AS SCORE                     
                  ,(SELECT
                        COUNT(*)
                    FROM
                        ARTICLE AS A
                    WHERE
                        A.ARTICLE != 0
                        AND A.CREATEDUSER = U.PK
                        AND A.IS_ACTIVE = 1) AS SELECTED_ANSWER
                  ,(SELECT
                        COUNT(*)
                    FROM
                        ARTICLE AS A
                    WHERE
                        A.ARTICLE != 0
                        AND A.CREATEDUSER = U.PK) AS ANSWERS
                FROM
                  USER AS U
                WHERE
                  U.PK = ${req.params.pk}
                `;
    connection.query(sql, function(err, rows, fields) {
            if (!err){
              // return callback(null,rows);
              serverlog.log(connection,0,this.sql,"success",req.connection.remoteAddress);
              res.json({status: "success", data: rows});
            }
            else{
              serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
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
    connection.query(sql,params, function(err, rows, fields) {
            if (!err){
              // return callback(null,rows);
              serverlog.log(connection,0,this.sql,"success",req.connection.remoteAddress);
              res.json(rows);
            }
            else{
              serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
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
      if(req.body.email == null){
        serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
        res.status(200).send({status: "fail", error:' already used.'});
      }
      var usedcheck = " select count(*) as usedcheck from user where email like ? or username like ?";
      var checkparams = [req.body.email, req.body.username];
      connection.query(usedcheck,checkparams, function(err, rows, fields) {
              if (err){
                serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
                res.send(err);
              }
              else if(rows[0].usedcheck != 0){
                serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
                res.status(200).send({status: "fail", error:' already used.'});
              }else{
                var sql = " insert into user(email, username, password) values(?,?,?) ";
                var params = [req.body.email,req.body.username,req.body.password,req.body.status,req.body.profile,req.body.git_address];
                connection.query(sql,params, function(err, rows, fields) {
                        if (!err){
                            //user profile
                          sql = " insert into profile(User) values(?) ";
                          params = [rows.insertId];
                          connection.query(sql,params, function(err, rows, fields){});
                          serverlog.log(connection,0,this.sql,"success",req.connection.remoteAddress);
                          res.send({status: "success"});
                        }
                        else{
                          serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
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
      var sql = " select count(*) as checking, pk, username from user where email = ? and password = ? and is_removed = 0 ";
      var params = [req.body.email,req.body.password];
      connection.query(sql,params, function(err, rows, fields) {
              if (!err){
                if(rows[0].checking == 1){
                  var loginsql = " UPDATE user SET last_login = now() WHERE pk = ?";
                  var loginparams = [rows[0].pk];
                  connection.query(loginsql,loginparams, function(err, rows, fields) {
                          if (!err){
                            serverlog.log(connection,0,this.sql,"success",req.connection.remoteAddress);
                          }
                          else{
                            serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
                            res.send(err);
                          }
                        });

                  let token = jwt.sign({
                    pk : rows[0].pk
                  },
                  secretObj.secret ,
                  {
                    expiresIn: '10000m'
                  })
                  res.cookie("jwt",token);
                  serverlog.log(connection,0,this.sql,"success",req.connection.remoteAddress);
                  res.send({status:"success", jwt: token,pk: rows[0].pk, username: rows[0].username });
                }else{
                  serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
                  res.send({status: "fail"});
                }
                // res.json(rows);
              }
              else{
                serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
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
                serverlog.log(connection,0,this.sql,"success",req.connection.remoteAddress);
                res.json(rows);
              }
              else{
                serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
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
              // return callback(null,rows);
              serverlog.log(connection,0,this.sql,"success",req.connection.remoteAddress);
              res.json(rows);
            }
            else{
              serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
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
              serverlog.log(connection,0,this.sql,"success",req.connection.remoteAddress);
              res.json(rows);
            }
            else{
              serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
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
 *       - name: user_token
 *         in: header
 *         type: string
 *         description: 사용자의 token값을 전달.
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

 */
app.post('/follows', function(req,res){

  jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
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
                      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                      res.send({status: "fail"});
                    }else if(rows[0].checkfollow == 0){
                      var sql = " insert into follow(fromUser,toUser) values(?,?) ";
                      connection.query(sql,params, function(err, rows, fields) {
                        if(!err){
                          serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
                          res.send({status: "success"});
                        }else{
                          serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                          res.send({status: "fail"});
                        }
                      });
                    }else {
                      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                      res.send({status: "fail",data: "already following"});
                    }
                  });



                }else{
                  serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                  res.send({status: "fail"});
                }
              }
              else{
                serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                res.send({status: "fail"});
              }
            });
    }
  });
  }
);
/**
 * @swagger
 *  /follows:
 *    delete:
 *      tags:
 *      - users
 *      description: 회원 팔로우 정보 삭제
 *      responses:
 *       200:
 *      parameters:
 *      - name: user_token
 *        in: header
 *        type: string
 *        description: 사용자의 token값을 전달.
 *      - in: body
 *        name: follow
 *        description: follow
 *        schema:
 *           type: object
 *           properties:
 *             fromUser:
 *               type: integer
 *             toUser:
 *               type: integer
 */
app.delete('/follows', function(req,res){
  jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
    if(err) {
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
      res.status(401).send({error:'invalid token'});
     }else{
      var sql = "delete from follow where fromUser = ? and toUser = ? ";
      var params = [req.body.fromUser,req.body.toUser];
      connection.query(sql,params, function(err, rows, fields) {
        if (!err){
          serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
          res.send({status: "success"});
        }else{
          serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
          res.send({status: "fail"});
        }
      });
    }
  });
}
);

/**
 * @swagger
 *  /follows/{toUser}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 회원 팔로우 인원 정보를 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: toUser
 *         type: integer
 *       - in: header
 *         name: user_token
 *         type: string
 */
app.get('/follows/:toUser', function(req,res){
  jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
    if(err) {
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
      res.status(401).send({error:'invalid token'});
    }else{
      var sql = "select fromuser as PK from follow where toUser = ? ";
      var params = [req.params.toUser];
      connection.query(sql,params, function(err, rows, fields) {
        if (!err){
          serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
          res.send({status: "success", data: rows});
        }else{
          serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
          res.send({status: "fail"});
        }
      });
    }
  });
}
);

/**
 * @swagger
 *  /followings/{fromUser}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 회원 팔로우 인원 정보를 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: fromUser
 *         type: integer
 *       - in: header
 *         name: user_token
 *         type: string
 */
app.get('/followings/:fromUser', function(req,res){
  jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
    if(err) {
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
      res.status(401).send({error:'invalid token'});
    }else{
      var sql = "select toUser as PK from follow where fromUser = ? ";
      var params = [req.params.fromUser];
      connection.query(sql,params, function(err, rows, fields) {
        if (!err){
          serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
          res.send({status: "success", data: rows});
        }else{
          serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
          res.send({status: "fail"});
        }
      });
    }
  });
}
);

/**
 * @swagger
 *  /profile/images:
 *    post:
 *      tags:
 *      - users
 *      description: profile 이미지를 저장
 *      parameters:
 *      - in: formData
 *        name: image
 *        type: file
 *        description: profile 넣을 image
 *      - name: user_token
 *        in: header
 *        type: string
 *        description: 사용자의 token값을 전달.
 *      responses:
 *       200:
 */
app.post('/profile/images', upload.single('image'), function(req, res) {
  jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
    if(err){
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
      res.status(401).send({error:'invalid token'});
    }
    else{
      var filename = "default_profile.png";
      if(req.file){ // 이미지 파일이 첨부되었을 때
        filename = req.file.filename;
      var sql = 
              `
              UPDATE
                PROFILE
              SET
                PROFILE_IMAGE = '${filename}'
              WHERE USER = ${decoded.pk}
              `;
      connection.query(sql, function(err, rows, fields) {
        if(!err){
          serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
          res.send({status: "success"});
        } else{
          serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
          res.send({status: "fail",data:err});
        }       
      });
    }else{
      res.send({status: "fail"});
    }
  }
  });
});

/**
 * @swagger
 *  /profile:
 *    put:
 *      tags:
 *      - users
 *      description: 유저 프로필 등록, 수정
 *      responses:
 *       200:
 *      parameters:
 *       - name: user_token
 *         in: header
 *         type: string
 *         description: 사용자의 token값을 전달.
 *       - in: body
 *         name: contentsbody
 *         schema:
 *           type: object
 *           properties:
 *             User:
 *               type: integer
 *             ssafy_years:
 *               type: integer
 *             is_major:
 *               type: string
 *             region:
 *               type: string
 *             grade:
 *               type: string
 *             intro:
 *               type: string
 *             profile_image:
 *               type: string
 *             gitUrl:
 *               type: string
 */
app.put('/profile', function(req, res){
  jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
    if(err){
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
     res.status(401).send({error:'invalid token'});
    }else{
      var i = req.body;
      var sql =
      `
        UPDATE  PROFILE
        SET     SSAFY_YEARS   = ${i.ssafy_years}
              , IS_MAJOR      = '${i.is_major}'
              , REGION        = '${i.region}'
              , GRADE         = '${i.grade}'
              , INTRO         = '${i.intro}'
              , GITURL        = '${i.gitUrl}'
              , PROFILE_IMAGE = '${i.profile_image}'
              , UPDATED_AT    = NOW()
        WHERE   USER          = ${i.User}
      `;
      connection.query(sql, function(err, rows, fields) {
              if (err){
                serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                res.send({status: "fail",data: err});
              }else{
                serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
                res.send({status: "success"});
              }
      });
    }
  });
});

/**
 * @swagger
 *  /users/profile-image/{pk}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 회원 프로필 이미지를 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - name: user_token
 *         in: header
 *         type: string
 *         description: 사용자의 token값을 전달.
 *       - in: path
 *         name: pk
 *         type: integer
 *         description: |
 *          사용자 pk 전달
 */
app.get('/users/profile-image/:pk', function(req,res){
  jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
    if(err){
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
      res.status(401).send({error:'invalid token'});
    }else{
      var sql = " select count(*) as cheking, profile_image from profile where user = ? ";
      var params = [req.params.pk];
      connection.query(sql,params, function(err, rows, fields) {
        if (!err){
          // var img = '<img src="/'+rows[0].profile_image + '">';
          serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
          res.send({sattus: "success",data: rows[0].profile_image});
        }else{
          serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
          res.send({status: "fail"});
        }
      });
    }
  });

}
);

/**
 * @swagger
 *  /users/profile-image-name/{name}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 회원 프로필 이미지를 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - name: user_token
 *         in: header
 *         type: string
 *         description: 사용자의 token값을 전달.
 *       - in: path
 *         name: name
 *         type: string
 *         description: |
 *          사용자 닉네임 전달
 */
app.get('/users/profile-image-name/:name', function(req,res){
  jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
    if(err){
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
      res.status(401).send({error:'invalid token'});
    }else{
      var sql = 
                `
                SELECT
                  COUNT(*) AS CHEKING
                  ,P.PROFILE_IMAGE
                FROM
                  PROFILE AS P
                    RIGHT OUTER JOIN USER AS U ON U.PK = P.USER
                WHERE
                  U.USERNAME LIKE '${req.params.name}'
                `;
      connection.query(sql, function(err, rows, fields) {
        if (!err){
          // var img = '<img src="/'+rows[0].profile_image + '">';
          console.log(rows[0].PROFILE_IMAGE);
          serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
          res.send({sattus: "success",data: rows[0].PROFILE_IMAGE});
        }else{
          serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
          res.send({status: "fail"});
        }
      });
    }
  });

}
);



/**
 * @swagger
 *  /users/profile/{pk}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 회원 프로필 정보를 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - name: user_token
 *         in: header
 *         type: string
 *         description: 사용자의 token값을 전달.
 *       - in: path
 *         name: pk
 *         type: integer
 *         description: |
 *          사용자 pk 전달
 */
app.get('/users/profile/:pk', function(req,res){
  jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
    if(err){
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
      res.status(401).send({error:'invalid token'});
  } else{
      var sql = " select * from profile where user = ? ";
      var params = [req.params.pk];
      connection.query(sql,params, function(err, rows, fields) {
        if (!err){
          serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
          res.send(rows);
        }else{
          serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
          res.send({status: "fail"});
        }
      });
    }
  });
}
);

/**
 * @swagger
 *  /users/password/{pk}:
 *    put:
 *      tags:
 *      - users
 *      description: 해당 회원 비밀번호 '1234'로 초기화
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: pk
 *         type: integer
 *       - name: user_token
 *         in: header
 *         type: string
 *         description: 사용자의 token값을 전달.
 */
app.put('/users/password/:pk', function(req, res){

  var hash = crypto.createHash('sha512');
  var data = hash.update('1234','utf-8');
  var gen_hash= data.digest('hex');
  var sql = ` UPDATE user SET PASSWORD = '${gen_hash}' WHERE pk = ${req.params.pk}`;
  connection.query(sql, function(err, rows, fields) {
          if (!err){
            serverlog.log(connection,0,this.sql,"success",req.connection.remoteAddress);
            res.json(rows);
          }
          else{
            serverlog.log(connection,0,this.sql,"fail",req.connection.remoteAddress);
            res.send(err);
          }
        });
});

/**
 * @swagger
 *  /users/writing/{pk}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 회원이 쓴 모든 글을 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - name: user_token
 *         in: header
 *         type: string
 *         description: 사용자의 token값을 전달.
 *       - in: path
 *         name: pk
 *         type: integer
 *         description: |
 *          사용자 pk 전달
 */
app.get('/users/writing/:pk', function(req,res){
  jwt.verify(req.headers.user_token,  secretObj.secret, function(err, decoded) {
    if(err){
      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
      res.status(401).send({error:'invalid token'});
  } else{
    var json = {};

      var sql = `SELECT
                  A.PK
                  ,(
                    SELECT
                      C.TITLE
                    FROM
                      CONTENT AS C
                    WHERE
                      C.PK = A.CONTENT
                  ) AS TITLE
                FROM
                  ARTICLE AS A
                WHERE
                  1=1
                  AND A.TOPIC = 1
                  AND A.ARTICLE = 0
                  AND A.CREATEDUSER = ${req.params.pk}
                  `;
      connection.query(sql, function(err, question, fields) {
        if (!err){
          json.QUESTION = question;
          sql = 
              `
              SELECT
                A.ARTICLE AS PK
                ,(
                  SELECT
                    C.TITLE
                  FROM
                    CONTENT AS C
                  WHERE
                    C.PK = A.CONTENT
                ) AS TITLE
              FROM
                ARTICLE AS A
              WHERE
                1=1
                AND A.TOPIC = 1
                AND A.ARTICLE != 0
                AND A.CREATEDUSER = ${req.params.pk}
              `;
          connection.query(sql, function(err, answer, fields) {
            if(!err){
              json.ANSWER = answer;
              sql = 
                    `
                    SELECT
                      A.PK
                      ,(
                        SELECT
                          C.TITLE
                        FROM
                          CONTENT AS C
                        WHERE
                          C.PK = A.CONTENT
                      ) AS TITLE
                    FROM
                      ARTICLE AS A
                    WHERE
                      1=1
                      AND A.TOPIC NOT IN (1,2)
                      AND A.ARTICLE = 0
                      AND A.CREATEDUSER = ${req.params.pk}
                    `;
            connection.query(sql, function(err, board, fields) {
              if(!err){
                json.BOARD = board;

                sql = 
                      `
                      SELECT
                      CT.ARTICLE AS PK
                      ,CM.BODY
                    FROM
                      COMMENT AS CM
                        LEFT OUTER JOIN CONTENT AS CT ON CM.CONTENT = CT.PK
                    WHERE
                      1=1
                      AND CM.USER = ${req.params.pk}
                      `;
                  connection.query(sql, function(err, comment, fields) {
                    if(!err){
                      json.COMMENT = comment;
                      serverlog.log(connection,decoded.pk,this.sql,"success",req.connection.remoteAddress);
                      res.send({status:"success",data: json});
                    }else{
                      serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                      res.send({status: "fail"});
                    }
                  });
              }else{
                serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
                res.send({status: "fail"});
              }
            });  
            }else{
              serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
              res.send({status: "fail"});
            }
          });
        }else{
          serverlog.log(connection,decoded.pk,this.sql,"fail",req.connection.remoteAddress);
          res.send({status: "fail"});
        }
      });
    }
  });
}
);


};



module.exports = initializeEndpoints;
