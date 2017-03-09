/**
 * Created by Administrator on 2015/12/7.
 */

function sou(){

    var id= $("#text1").val();

    $.ajax({
        url: '/sou',
        type: 'get',

        data:"name="+id+"&location=Boston",
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data){
            if(200 === data.code) {
               $("#banner").attr('src', data.msg.url);

            } else {
                $("#spanMessage").html("fail");
            }
            console.log('imgUploader upload success, data:', data);
        },
        error: function(){
            $("#spanMessage").html("mistake");
        }
    });
}