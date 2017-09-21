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
                var st = '';
                 if($('.change_status').val() == 1){
                  st = ''
                 }

                if($('.change_status').val()== 2){
                  st = '1'
                 }

                 if($('.change_status').val()== 3){
                   st = '3'
                 }

                 if($('.change_status').val()== 4){
                       st = '2'
                  }
            var image = 'https://stassociation.com/icon/track'+st+'.png';

            var marker = new google.maps.Marker({
                    position:  {lat: 0, lng:0},
                    map: addMAP,                    
                    icon:image                 
                });


            $('.set_markers').on('click',function(){
              $('.markers_menu').toggle();
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
                if(current_marker!=null){
                    var new_marker = new google.maps.Marker({
                        position:  e.latLng,
                        map: addMAP,
                        animation: google.maps.Animation.DROP,
                        icon:'http://sta.namgam.com/icon/'+current_marker.name+'.png'
                    });

                    $.ajax({
                        url:"https://stassociation.com/map/add_marker_app",
                        method:'POST',
                        data:'k='+STA.key+"&id="+current_marker.id+"" +
                            "&lat="+e.latLng.lat()+
                            "&lng="+e.latLng.lng()
                    });
                    current_marker = null;
                    
                }
            });

  setInterval( start_geo, 2000);

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
     addMAP.setCenter(curr_position);
     addMAP.setZoom(17);
 });
  function start_geo () {

      $('#markers_script').load( "https://stassociation.com/map/app_markers");
  if ( navigator.geolocation ) {
     navigator.geolocation.getCurrentPosition(function(p){
         curr_position = {lat: p.coords.latitude, lng:p.coords.longitude};
          
          marker.setPosition({lat: p.coords.latitude, lng:p.coords.longitude});
          marker.setIcon('https://stassociation.com/icon/track'+$('.change_status').val()+'.png');
         $.ajax({
             url: "https://stassociation.com/map/update_coords",
             type: "POST",
             data: "lat="+p.coords.latitude+"&lng="+p.coords.longitude+"&k="+STA.key
         });


     },function(err){
          //  $('body').text(err.message+err.code);
     },{ enableHighAccuracy: true});     
    } 
  }


});