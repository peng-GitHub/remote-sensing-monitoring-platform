module.exports=function(app){
    var index1=require('../controllers/index1.server.controller.js');
    //app.get('/',index.render);
    var index=require('../controllers/index.server.controller.js');
    var index2=require('../controllers/index2.server.controller.js');
   //app.get('/sou',index1.render);
    app.get('/',index.render);
    app.get('/2',index2.render);
    app.get('/sou',index1.render);

};
