var x = 0;
var y = 0;    
var x_vel = 20;
var y_vel = 20; 
    function generateCoordinates(){
        

        if(x >= 360 || x <= -360){
            x_vel = x_vel * -1;
        } 

        if(y >= 180 || y <= -180){
            y_vel = y_vel * -1;
        } 
        x += x_vel;
        y += y_vel;

        var json = {
            x:          x,
            y:          y,
            device_id: $("#device_id").val(),
            time: new Date()
        };
        //console.log("posting: " + json.x);
        $.post("/coordinates", json, function(data){
            console.log(data);
        });
    }

$(function(){
    $("#device_id").val("device" + Math.floor(Math.random() * 1000));
    $("#start_fakephone").click(function(){
       interval_id = setInterval(generateCoordinates, 500); 
       $("#coordinate_list").append("<li>Generating Coordinates</li>");
       $("#device_id").attr("disabled", true);
    });
    $("#stop_fakephone").click(function(){
       clearInterval(interval_id); 
       $("#coordinate_list").append("<li>Stopping Coordinates</li>");
       $("#device_id").attr("disabled", false);
    });
});