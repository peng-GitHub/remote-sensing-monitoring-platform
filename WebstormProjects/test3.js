/**
 * Created by Administrator on 2015/11/26.
 */
/**
 * Created by Administrator on 2015/11/20.
 */



var mysql = require('mysql');

var TEST_DATABASE = 'test';



//创建连接

var client = mysql.createConnection({

    user: 'root',

    password: '123456'

});

client.connect();

client.query("use " + TEST_DATABASE);
client.query('SELECT * FROM  node_user ',function select(err,results,fields){
    console.log(results);
    console.log(fields);
    });










