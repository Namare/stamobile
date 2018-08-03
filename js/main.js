function initMap (){
    // window.alert = function (txt) {
    //     navigator.notification.alert(txt, null, "Alert", "Close");
    // }
   // cordova.plugins.backgroundMode.setEnabled(true);
    icon_size_w =60;
    icon_size_h =60;
    all_drivers = [];
    st = '';
            mapCanvas = document.getElementById("map");
            curr_position = null;
            var myCenter= new google.maps.LatLng(48.5,35);
            var mapOptions = {
                center: {lat: 48.5, lng: 35.1},
                zoom: 17,
                zoomControl: false,
                scaleControl: false,
                mapTypeId: 'roadmap',
                disableDefaultUI: true
            };

            addMAP = new google.maps.Map(mapCanvas, mapOptions);
            var image = {
                url: 'https://stassociation.com/icon/track'+st+'.png',
                size: new google.maps.Size(icon_size_w, icon_size_w),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 0),
                scaledSize: new google.maps.Size(icon_size_w, icon_size_w)
            };
            var marker = new google.maps.Marker({
                    position:  {lat: 0, lng:0},
                    map: addMAP,
                    icon:image
                });
    var user_info = new google.maps.InfoWindow({
        content:'<table class="small_table" >' +
            '<tr><td><b>Me</b></td></tr></table>'
        ,
        maxWidth: 320
    });
    google.maps.event.addListener(marker,'click',function() {
        user_info.open(addMAP, marker);
    });


            $('.set_markers').on('click',function(){

              $('.markers_menu').toggle();
                if($('.markers_menu').css('display')=='block'){
                    $('.map_menu:eq(0)').animate({bottom:"275"});
                    $('.map_menu:eq(1)').animate({bottom:"205"});
              }else{
                    $('.map_menu:eq(0)').animate({bottom:"175"});
                    $('.map_menu:eq(1)').animate({bottom:"105"});
                }

            });

           
            current_marker = null;
            $('.marker_icon').on('click',function(){
                current_marker = {
                    id:$(this).data('id'),
                    name:$(this).data('name')
                };
                $('tr.mid').css({"background-color":"#fff"});
                $('tr.mid'+current_marker.id+'').css({"background-color":"#ececec"})
            });
            addMAP.addListener('click',function(e) {
                $('.markers_menu').hide();
                $('.map_menu:eq(0)').animate({bottom:"175"});
                $('.map_menu:eq(1)').animate({bottom:"105"});
                if(current_marker!=null){

                    $.ajax({
                        url:"https://stassociation.com/map/add_marker_app",
                        method:'POST',
                        data:'k='+STA.key+"&id="+current_marker.id+"" +
                            "&lat="+e.latLng.lat()+
                            "&lng="+e.latLng.lng(),
                        success: function(){
                            for(var i=0; i<map_markers.length; i++){
                                map_markers[i].setMap(null);
                                map_markers[i]= null;
                            }
                            map_markers.length = 0;
                            map_markers = [];

                            $('#markers_script').load( "https://stassociation.com/map/app_markers?k="+STA.key+'&ms='+icon_size_w);}
                    });

                    current_marker = null;
                    
                }
            });

  //setInterval( start_geo, 1500);
   // $('#markers_script').load( "https://stassociation.com/map/app_markers?k="+STA.key);
//  var markers_visible = 0;
//  $('.hide_markers').on('click',function(){
//    if(markers_visible == 0){
//      $('#markers_script').load( "https://stassociation.com/map/app_markers");
//      markers_visible =1;
//    }else{
//       for (var i = 0; i < map_markers.length; i++) {
//           map_markers[i].setMap(null);
//
//        }
//        markers_visible = 0;
//
//    }
//
//  });



    $('.set_my_pos').on('click',function(){

     if(STA.watchme){
         $(this).removeClass('watchme');
         STA.watchme = false;
     }else{
         $(this).addClass('watchme');
         STA.watchme = true;
     }

 });
//  function start_geo () {
//  if ( navigator.geolocation ) {
//     navigator.geolocation.getCurrentPosition(function(p){
//         curr_position = {lat: p.coords.latitude, lng:p.coords.longitude};
//         marker.setPosition({lat: p.coords.latitude, lng:p.coords.longitude});
//
//         if(STA.watchme !=false){
//            addMAP.setCenter(curr_position);
//            addMAP.panTo(curr_position);
//         }
//
//         var  st = ''
//         if($('.change_status').val() == 1){
//             st = '';
//         }
//         else if($('.change_status').val()== 2){
//             st = '1';
//         }
//         else if($('.change_status').val()== 3){
//             st = '3';
//         }
//         else if($('.change_status').val()== 5){
//             st = '2';
//         }
//         if(   addMAP.getZoom() < 15){
//             marker.setIcon('https://stassociation.com/icon/track'+st+'z.png');
//         }else{
//             marker.setIcon('https://stassociation.com/icon/track'+st+'.png');
//         }
//
//         $.ajax({
//             url: "https://stassociation.com/map/update_coords",
//             type: "POST",
//             data: "lat="+p.coords.latitude+"&lng="+p.coords.longitude+"&k="+STA.key
//         });
//
////         $.each($('.change_time'), function(){
////             var timestamp =  $(this).data('time') * 1000;
////             var date = new Date();
////             date.setTime(parseInt(timestamp));
////             $(this).text(
////                 date.toLocaleString()
////             );
////         });
//
//         //$('#markers_script').load( "https://stassociation.com/map/app_markers?k="+STA.key);
//
//
//
//
//     },function(err){
//          //  $('body').text(err.message+err.code);
//     },{ enableHighAccuracy: false});
//    }
//  }
    $('.bottom_menu_item[data-id="map"]').on('click',function(){
        if($('.change_status').val() == 1){
            st = '';
        }
        else if($('.change_status').val()== 2){
            st = '1';
        }
        else if($('.change_status').val()== 3){
            st = '3';
        }
        else if($('.change_status').val()== 5){
            st = '2';
        }
        marker.setIcon({
            url: 'https://stassociation.com/icon/track'+st+'.png',
            size: new google.maps.Size(icon_size_w, icon_size_w),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(icon_size_w, icon_size_w)
        });
    });

    addMAP.addListener( 'zoom_changed', function() {

        if(  addMAP.getZoom() == 17 ){
             icon_size_w =45;

        }else if(  addMAP.getZoom() == 16 ){
             icon_size_w =40;

        }else if(  addMAP.getZoom() == 15 ){
             icon_size_w =35;

        }else if(  addMAP.getZoom() == 14 ){
             icon_size_w = 30;

        }else if(  addMAP.getZoom() == 13 ){
             icon_size_w = 25;

        }else if(  addMAP.getZoom() == 12 ){
             icon_size_w = 20;

        }else if(  addMAP.getZoom() == 11 ){
             icon_size_w = 15;

        }else if(  addMAP.getZoom() < 10 ){
             icon_size_w = 15;

        }else if(  addMAP.getZoom() > 17 ){
             icon_size_w = 50;

        }

        marker.setIcon({
            url: 'https://stassociation.com/icon/track'+st+'.png',
            size: new google.maps.Size(icon_size_w, icon_size_w),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(icon_size_w, icon_size_w)
        });
        $.each(all_drivers,function(a){
            all_drivers[a].setIcon({
                url: all_drivers[a].icon.url,
                size: new google.maps.Size(icon_size_w, icon_size_w),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 0),
                scaledSize: new google.maps.Size(icon_size_w, icon_size_w)
            });
        });

    });

    function onSuccess(p) {
       // $('#markers_script').load( "https://stassociation.com/map/app_markers?k="+STA.key);
        curr_position = {lat: p.coords.latitude, lng:p.coords.longitude};
        marker.setPosition({lat: p.coords.latitude, lng:p.coords.longitude});

        if(STA.watchme !=false){
           // addMAP.setCenter(curr_position);
            addMAP.panTo(curr_position);
        }



        if($('.change_status').val() == 1){
            st = '';
        }
        else if($('.change_status').val()== 2){
            st = '1';
        }
        else if($('.change_status').val()== 3){
            st = '3';
        }
        else if($('.change_status').val()== 5){
            st = '2';
        }



            marker.setIcon({
                url: 'https://stassociation.com/icon/track'+st+'.png',
                size: new google.maps.Size(icon_size_w, icon_size_w),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 0),
                title:'mww',
                scaledSize: new google.maps.Size(icon_size_w, icon_size_w)
            });

        $.ajax({
            url: "https://stassociation.com/map/update_coords",
            type: "POST",
            data: "lat="+p.coords.latitude+"&lng="+p.coords.longitude+"&k="+STA.key
        });



        //$('#markers_script').load( "https://stassociation.com/map/app_markers?k="+STA.key);

    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
       // alert('code: '    + error.code    + '\n' +
        //    'message: ' + error.message + '\n');
    }

    // Options: throw an error if no update is received every 30 seconds.
    //
    var watchID = navigator.geolocation.watchPosition(onSuccess, onError,  { maximumAge: 1000, timeout: 300, enableHighAccuracy: true });
    var bgGeo = window.plugins.backgroundGeoLocation;

    var callbackFn = function(location) {
        console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
        // Do your HTTP request here to POST location to your server.
        //
        //

        alert(location.latitude);
        alert(location.speed);

        $.ajax({
            url: "https://stassociation.com/map/update_coords",
            type: "POST",
            data: "lat="+location.latitude+"&lng="+location.longitude+"&k="+STA.key
        });

    };

    var failureFn = function(error) {
        console.log('BackgroundGeoLocation error');
    }

    bgGeo.configure(callbackFn, failureFn, {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
        notificationText: 'ENABLED', // <-- android only, customize the text of the notification
        activityType: 'AutomotiveNavigation',
        debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates
    });

    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
    bgGeo.start();

};

