/**
 * Created by Administrator on 2015/11/13.
 */
exports.render=function(req,res){
    //res.render('test7',{title:'hello'})
   //res.render('test3',{title:'hello'})
   //res.render('test8',{title:'hello'})
    res.render('test19',{title:'hello'});
    //res.render('test11',{title:'hello'});
  //res.render('index1',{title:'hello'})

};

    /*var mysql = require('mysql');

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
        function selectcd(err, results, fields) {

            if (err) {

                throw err;

            }
            var data =' ';

            if (results) {

                for (var i = 0; i < results.length; i++) {

                    var row=results[i];
                    data+='id: '+row['id']+' title: '+row['name']+'<br/>';

                }


            }
            client.end();
            res.render('test.ejs',{data:data});


        });


    };*/