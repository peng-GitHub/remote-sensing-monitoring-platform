/**
 * Created by Administrator on 2015/12/9.
 */
/**
 * Created by Administrator on 2015/11/13.
 */
exports.render=function(req,res){
  var mysql = require('mysql');
    var client = mysql.createConnection({
       //host:'90.0.0.203',
        user: 'root',
        password: '123456',
        database: 'test'
    });
    client.connect();
    var number1=req.param("DataType");
    var number2=req.param("CheckTimeStart");
    var number3=req.param("CheckTimeEnd");

    //var sql = 'SELECT * FROM `node_user` WHERE `date`= ?';
    //var sql = 'SELECT * FROM `node_user` WHERE `name`=? and `date`= ?';
      //var sql = 'SELECT * FROM `node_user` WHERE  `date`BETWEEN ? AND ?';
    var sql = 'SELECT * FROM `node_user` WHERE `name`=? and `date`BETWEEN ? AND ?';

    client.query(
        sql,[number1,number2,number3],
        function selectcd(err, results, fields) {

            if (err) {

                throw err;
            }
            else{res.json({code: 200, msg: {url:  results[0].url },FullData:results});
                console.log(results);
                //console.log(fields)
                console.log(results[0])
            }
            client.end();
})
 };
