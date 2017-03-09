/**
 * Created by Administrator on 2015/12/7.
 */
/**
 * Created by Administrator on 2015/11/20.
 */
var mysql = require('mysql');

var TEST_TABLE = 'node_user';

//创建连接

var client = mysql.createConnection({

    user: 'root',

    password: '123456',
    database: 'test'

});

client.connect();

client.query(

    'SELECT * FROM '+TEST_TABLE,
function (err, results, fields) {

    if (err) {

        throw err;

    }
    var data ='';

    if (results) {

        for (var i = 0; i < results.length; i++) {

            var row=results[i];
            data+='id:'+row['id']+'title:'+row['title']+'<br/>';

        }
        res.render('test.ejs',{data:data});

    }
    client.end();


});








