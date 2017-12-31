$(function(){
            mapCanvas = document.getElementById("map");
            curr_position = null;
            var myCenter=new google.maps.LatLng(48.5,35);
            var mapOptions = {
                center: myCenter,            
                zoom: 17,
                zoomControl: false,
                scaleControl: false,
                disableDefaultUI: true
            };

            addMAP = new google.maps.Map(mapCanvas, mapOptions);
            var image = 'https://stassociation.com/icon/track.png';
            var marker = new google.maps.Marker({
                    position:  {lat: 0, lng:0},
                    map: addMAP,
                    icon:image
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
                            for(i=0; i<map_markers.length; i++){
                                map_markers[i].setMap(null);
                            }
                            map_markers = [];
                            $('#markers_script').load( "https://stassociation.com/map/app_markers?k="+STA.key);}
                    });

                    current_marker = null;
                    
                }
            });

  setInterval( start_geo, 3000);
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
  function start_geo () {
  if ( navigator.geolocation ) {
     navigator.geolocation.getCurrentPosition(function(p){
         curr_position = {lat: p.coords.latitude, lng:p.coords.longitude};
         marker.setPosition({lat: p.coords.latitude, lng:p.coords.longitude});

         if(STA.watchme){
            addMAP.setCenter(curr_position);
         }

         var  st = ''
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
          marker.setIcon('https://stassociation.com/icon/track'+st+'.png');
         $.ajax({
             url: "https://stassociation.com/map/update_coords",
             type: "POST",
             data: "lat="+p.coords.latitude+"&lng="+p.coords.longitude+"&k="+STA.key
         });

         $.each($('.change_time'), function(){
             var timestamp =  $(this).data('time') * 1000;
             var date = new Date();
             date.setTime(parseInt(timestamp));
             $(this).text(
                 date.toLocaleString()
             );
         });

         //$('#markers_script').load( "https://stassociation.com/map/app_markers?k="+STA.key);




     },function(err){
          //  $('body').text(err.message+err.code);
     },{ enableHighAccuracy: true});     
    } 
  }


});