
var map = new OpenLayers.Map({
    div: "mapDiv",
    layers: [
        new OpenLayers.Layer.Image(
            "Single Tile", 
            "ens_2.jpg",
            new OpenLayers.Bounds(-640, -898, 640, 898),
            new OpenLayers.Size(425, 318) //1279 1795
        )
    ],
    center: new OpenLayers.LonLat(6.5, 40.5),
    zoom: 1
});

map.addControl(new OpenLayers.Control.LayerSwitcher());

 var markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);
  
   var x = 0;
    var y = 0;
    var x_vel = 20;
    var y_vel = 20;
  var marker = new OpenLayers.Marker(new OpenLayers.LonLat(x, y));
    markers.addMarker(marker);

    //setInterval(moveMarker, 100);

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
            device_id: "gumbo",
            time: new Date()
        };
        //console.log("posting: " + json.x);
        $.post("/coordinates", json, function(data){
            console.log(data);
        });
    }


    //called on map page to draw marker
    function setCoordinates(x, y, device_id){
        marker.moveTo( 
                map.getLayerPxFromViewPortPx(
                    map.getPixelFromLonLat(
                        new OpenLayers.LonLat(x, y)
                    )
                )
            );
        $("#coordinates").text("x: " + x + " y: " + y);
    }
    $(function(){
        var interval_id;
        $("#move_marker").click(function(){
           marker.draw();
            x = $("#x_pos").val();
            y = $("#y_pos").val();
            marker.moveTo( 
                map.getLayerPxFromViewPortPx(
                    map.getPixelFromLonLat(
                        new OpenLayers.LonLat(x, y)
                    )
                )
            );
            $("#coordinates").text("x: " + x + " y: " + y);
        });

        $("#start_fakephone").click(function(){
           interval_id = setInterval(generateCoordinates, 500); 
           $("#coordinate_list").append("<li>Generating Coordinates</li>");
        });
        $("#stop_fakephone").click(function(){
           clearInterval(interval_id); 
           $("#coordinate_list").append("<li>Stopping Coordinates</li>");
        });



        var socket = io.connect('http://trillworks.com:3010');
        
        socket.on('coordinates', function (data) {
            //console.log("data returned: " + data);
            //console.log("coordinates event: " + data.x);
            setCoordinates(data.x, data.y, data.device_id);
        });
    });
