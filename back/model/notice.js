var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const TRUE = 1;
/**
 * @swagger
 * definitions:
 *   noticeInfo:
 *     type: object
 *     properties:
 *       pk:
 *         type: integer
 *         description: notice's id
 *       User:
 *         type: integer
 *         description: To user id
 *       Type:
 *         type: integer
 *         description: notice Type
 *       Body:
 *         type: string
 *         description: notice body
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



const initializeEndpoints = (app) => {

  /**
   * @swagger
   *  /notices:
   *    post:
   *      tags:
   *      - notice
   *      description: create notice
   *      responses:
   *        200:
   *      parameters:
   *      - name: noticeInfo
   *        in: body
   *        schema:
   *          $ref: '#/definitions/noticeInfo'
   */
  app.post('/notices', function(req, res) {
    var sql = " insert into notice(User,Type,createdUser,is_active,Body,info) values(?,?,?,0,?,?) ";
    var params = [req.body.User, req.body.Type, req.body.createdUser,req.body.Body,req.body.info];
    connection.query(sql, params, function(err, rows, fields) {
      if (!err) {
        res.json({status: "success"});
      } else {
        console.log('Error while performing Query.', err);
        res.send({status: "fail"});
      }
    });
  });

  /**
   * @swagger
   *  /notices/{User}:
   *    get:
   *      tags:
   *      - notice
   *      description: create notice
   *      responses:
   *        200:
   *      parameters:
   *       - in: path
   *         name: User
   *         type: integer
   *         description: |
   *          사용자 pk 전달   
   */
  app.get('/notices/:User', function(req, res) {
  var sql = " select * from notice where User = ? ";
  var params = [req.params.User];
  connection.query(sql, params, function(err, rows, fields) {
    if (!err) {
      res.json({status: "success", data: rows});
    } else {
      console.log('Error while performing Query.', err);
      res.send({status: "fail"});
    }
  });
});

  /**
   * @swagger
   *  /notices/reading/{pk}:
   *    put:
   *      tags:
   *      - notice
   *      description: notice 읽음처리
   *      responses:
   *        200:
   *      parameters:
   *       - in: path
   *         name: pk
   *         type: integer
   *         description: |
   *          notice pk 전달   
   */
  app.put('/notices/reading/:pk', function(req, res) {
    var sql = " update notice set is_active =1 where pk = ? ";
    var params = [req.params.pk];
    connection.query(sql, params, function(err, rows, fields) {
      if (!err) {
        res.json({status: "success"});
      } else {
        console.log('Error while performing Query.', err);
        res.send({status: "fail"});
      }
    });
  });

}

module.exports = initializeEndpoints;
