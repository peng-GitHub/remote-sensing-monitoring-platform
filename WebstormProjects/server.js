var express=require('./config/express');
var app=express();
//var server = require('http').create(app);

app.listen(3000);

module.exports=app;//���ڷ���Ӧ�ó������ģ��������ڼ��غͲ���ExpressӦ�á�
console.log('server running at http://localhost:3000/');
/*process.on('uncaughtException', function (err) {
    console.log(err);

    try {
        var killTimer = setTimeout(function () {
            process.exit(1);
        }, 30000);
        killTimer.unref();

        server.close();
    } catch (e) {
        console.log('error when exit', e.stack);
    }
});*/


process.on('uncaughtException', function (err) {
    //��ӡ������
    console.log(err);
    //��ӡ������ĵ���ջ�������
    //console.log(err.stack);
    //alert('err')
});






/**
 * Created by Administrator on 2015/11/13.
 */
