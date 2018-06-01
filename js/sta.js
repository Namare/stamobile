STA = {
    count_alert:[],
    FILTER:'',
    watchme:true,
	init:function(){
		STA.decor();
		STA.login();
		STA.stamenu();
		STA.radio();
		//STA.menuHide();
		STA.checkDistance();
		$('.page[data-id="login"]').show();
      //  cordova.plugins.backgroundMode.enable();
		$('.log_out').on('click',function(){
           var is_logout = confirm('Are you sure want to log out?');
            if(is_logout){
			window.localStorage.removeItem('prem_key');
			location.reload();
            }
		});

        if(window.localStorage.getItem("auth_login")!=''){
            $('.auth_login').val(window.localStorage.getItem("auth_login"));
        }

        if(STA.watchme){
            $('.set_my_pos').addClass('watchme');
        }


    },
	decor:function(){

		$('.menu-item-close').on('click',STA.menuHide);

		$('.open_menu').on('click',function(){
			if($('.left_menu').is(':visible')==false){
				$('.left_menu').show();
				$('.left_menu').animate({left:0},400);
			}else{
				STA.menuHide();
			}				

		});




            //Generic swipe handler for all directions


        $("body").swipe( { swipeRight:swipe1,swipeLeft:swipe1, allowPageScroll:"auto",  threshold:300} );

        function swipe1(event, direction, distance, duration, fingerCount) {
            if(direction=='right'){
                if($('.left_menu').is(':visible')==false){
                    $('.left_menu').show();
                    $('.left_menu').animate({left:0},400);
                }
            }
            if(direction=='left'){
                STA.menuHide();
            }
        }




        $('body').on('click','.item_order',function(){
			$(this).next('.item_order_info').slideToggle('fast');

		});


	},
	currentPage:'login',
	forumCounter:0,
	prevForum:'',
    user_id:'',
    forumCurrentthread:'',
	stamenu:function(){
		$('body').on('click','div.bottom_menu_item, div.menu-item, .app_menu',function(){
			$('.return_menu').unbind('click');
			$('.getOrder').unbind('click');
			 $('.markers_menu').hide();

			prevForum = '';		
			forumCounter = 0;
			$('.page').hide();
			
			var pageName =  $(this).data('id');
			if(STA.key_status==false){
					pageName = 'login';
			}			
			currentPage = $('.page[data-id="'+pageName+'"]');
			currentPage.show();
			STA.menuHide();


            switch (pageName){
				case 'map':
                    for(var i=0; i<map_markers.length; i++){
                        map_markers[i].setMap(null);
                        map_markers[i]= null;
                    }
                    map_markers.length = 0;
                    map_markers = [];
                    $('#markers_script').load( "https://stassociation.com/map/app_markers?k="+STA.key+'&ms='+icon_size_w);


					google.maps.event.trigger(addMAP, "resize");
                    addMAP.panTo(curr_position);
                    currentPage.on('click','.del_info_marker',function(){
                        $('.loading').show();
                       // map_markers[$(this).data('l')].setMap(null);
                       // map_markers[$(this).data('l')]=null;
                        $.ajax({
                            url:'https://stassociation.com/map/del_info_marker',
                            method:'POST',
                            data:'i='+$(this).data('id')+'&k='+STA.key,
                            success: function(){
                                for(var i=0; i<map_markers.length; i++){
                                    map_markers[i].setMap(null);
                                    map_markers[i]= null;
                                }
                                map_markers.length = 0;
                                map_markers = [];

                                $('#markers_script').load( "https://stassociation.com/map/app_markers?k="+STA.key+'&ms='+icon_size_w);

                                $('.loading').hide();
                            }


                        });
                        $(this).parent().parent().parent().parent().hide();



                    });
				break;
                case 'add_thread':
                    $.ajax({
                        method:"POST",
                        dataType: 'html',
                        url:'https://stassociation.com/forum/add_thread',
                        data:'key='+STA.key,
                        success:function(h){

                            var div = $(h).find('.app_list_forums').html();
                            currentPage.html(div);

                            $('.app_new_thread_btn').on('click',function(){
                                if($('form.app_new_thread input[name="title"]').val() == '' ){
                                    alert('Enter the title');
                                }
                                else{
                                $('form.app_new_thread').prepend('<input type="hidden" name="k" value="'+STA.key+'">');
                                var threaddata = new FormData($('form.app_new_thread')[0]);
                                var cur_url = 'https://stassociation.com/forum/view_forum/'+ $('form.app_new_thread select[name="id"]').val();


                                    $.ajax({
                                    url: "https://stassociation.com/forum/new_thread",
                                    type: "POST",
                                    data: threaddata,
                                    contentType: 'multipart/form-data',
                                    success: function (msg) {
                                        currentPage.load(cur_url+' .app_list_forums',STA.selectSubForum);
                                    },
                                    cache: false,
                                    contentType: false,
                                    processData: false
                                    });
                                }
                            });

                        }
                    });


                break;
                case 'support':
                    $('#woni_submit').on('click',function(){
                        $.ajax({
                            url:"https://stassociation.com/logistic/send_cons",
                            method:"POST",
                            data:'m='+$('#woni').val()+"&e="+$('#woni_id').val(),
                            success:function(){
                                alert("Data Send");
                                $('#woni').val('');
                                $('#woni_id').val('');
                            }
                        });
                    });
                break
				case 'disp':
					 
					 $.ajax({
					 	method:"POST",
					 	dataType: 'html',
					 	url:'https://stassociation.com/user',
					 	data:'k='+STA.key,
					 	success:function(h){					 		
					 		
					 		var div = $(h).find('#app_list_dispach').html();
        					currentPage.html(div);
        					$('#app_span5').attr('colspan','5');
        					$('.load_addition, .load_docs').on('click',function(){
        						window.open('https://stassociation.com/user', '_system');
        					});
					 	}
					 });

				break;
				case 'menu1':
				  currentPage.load('https://stassociation.com/logistic'+STA.FILTER+' .logistic_app',function(){
				  	var BASE_URL = 'https://stassociation.com/logistic';
                      var pickuploc2 =document.getElementById('filter_from');
                      var deliveryloc2 =document.getElementById('filter_to');
                      var autocompletef = new google.maps.places.Autocomplete(pickuploc2);
                      autocompletef.setComponentRestrictions(
                          {'country': ['us', 'ca']});

                      var autocomplete2f = new google.maps.places.Autocomplete(deliveryloc2);
                      autocomplete2f.setComponentRestrictions(
                          {'country': ['us', 'ca']});
                      $('.app_asap').attr('href','javascript:void(0)');
                      $('.app_filter').attr('action','javascript:void(0)');
                      $('.app_asap').on('click',function(){

                          STA.FILTER="?sort=asap&";
                          $('[data-id="login"]').trigger('click');
                          $('[data-id="menu1"]').trigger('click');
                      });

                      $('.app_search').on('click',function(){
                          var ff_from=encodeURIComponent($('[name="filter_from"]').val()),
                              ff_to=encodeURIComponent($('[name="filter_to"]').val());

                          STA.FILTER = "?f_f="+ff_from+"&f_t="+ff_to+"&f_a="+$('[name="filter_auto"]').val();

                          $('[data-id="login"]').trigger('click');
                          $('[data-id="menu1"]').trigger('click');
                      });
                      $('.app_clear').on('click',function(){
                          STA.FILTER = '';
                          $('[data-id="login"]').trigger('click');
                          $('[data-id="menu1"]').trigger('click');
                      });



				  	 $('.getOrder').on('click',function(){
				  	 	$('.alert-success').remove();

             			$('#getorderModal').modal();
             			$('#getorderModal').find('.orderName').text($(this).data('order_id'));
             			$('#getorderModal').find('#sendOrder').attr('rel',$(this).data('order_id'));
             			$('#getorderModal').find('#sendOrder').data('owner_id',$(this).data('owner_id'));

             			$('.get_phone span').load(BASE_URL+'/get_phone/'+$(this).data('owner_id'));
             			$('.get_email span').load(BASE_URL+'/get_email/'+$(this).data('owner_id'));
             			$('.get_name span').load(BASE_URL+'/get_name/'+$(this).data('owner_id'));

             			 $.ajax({
             			     method:"POST",
             			     url:BASE_URL+"/get_order",
               				 data:'k='+STA.key+'&order_id='+$(this).data('order_id') + '&owner_id='+$(this).data('owner_id'),
               				 success:function(b){

               				 	$('#getorderModal').find('.container-fluid').prepend('<div class="alert alert-success"><strong>'+b+'</strong></div>');                     			
               				 }
              			});
        			 });

						$('.app_trim').each(function(){
							var name_road = $(this).text().split(', ');
							$(this).text(name_road[1]+', '+name_road[2]);
						});	
						$('.add_arr_app').append(' <i class="fa fa-long-arrow-right" aria-hidden="true"></i>');
        			  $('#sendOrder').on('click',function(){
        			  	$('.alert-success').remove();

             			$.ajax({
                 			method:"POST",
                 			url:BASE_URL+"/get_order",
                 			data:'k='+STA.key+'&order_id='+$(this).attr('rel')+'&owner_id='+$(this).data('owner_id')+
                     			'&commentOrder='+$("textarea[name='commentOrder']").val(),
                 			success:function(){
                     			$('#getorderModal').find('.container-fluid').prepend('<div class="alert alert-success"><strong>You got new load!</strong> Your`s messege send.</div>');                     			
                     			$("textarea[name='commentOrder']").val();
                     			
                 			}
             			});
        		 	});

				  });
				break;

				case 'radio':
				  currentPage.load('https://stassociation.com/radio');
				break;

                case 'forum':
				currentPage.off('click');
				currentPage.off('change');
				 	$('body').on('click','.return_menu',function(){
				 		if(prevForum!==''){		
							if($(this).data('id')==1){
								currentPage.load('https://stassociation.com/forum .app_list_forums',STA.selectForum);

							}
							if($(this).data('id')==2){

								currentPage.load(prevForum +' .app_list_forums',STA.selectSubForum);
							}						
						}					
					});							 
				  	currentPage.load('https://stassociation.com/forum .app_list_forums',STA.selectForum);


                    currentPage.on('click','.mobile_del_com',function(){
                        var th =  $(this);
                        var com_id = th.data('id');
                        $.ajax({
                            method:'POST',
                            url: 'https://stassociation.com/forum/del_comment',
                            data: 'id='+com_id+'&k='+STA.key,
                            success:function(){
                                $('.comment_block[data-id="'+com_id+'"]').slideUp(300);

                            }
                        });
                    });

                    currentPage.on('change','#app_cam',function(){
                        $( ".app_audio_send" ).hide();
                        $( ".app_img_send" ).show();

                    });
                    currentPage.on('click','.forum_quote',function(){
                        $('.app_forum_send').prepend('<input type="hidden" id="new_comment_reply" name="new_comment_reply">');

                        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
                        var com = $(this).parent().parent().parent().find('.current_comment').html();
                        var com_autor = $(this).parent().parent().parent().find('.comment_autor').text();
                        console.log(com+com_autor);
                        $('#new_comment_reply').val('<blockquote class="blockquote"><p class="mb-0">'+$.trim(com)+'</p><footer class="blockquote-footer">'+$.trim(com_autor)+'</footer></blockquote>');

                    });

                    currentPage.on('click','.app_audio_send',function(){
                        $('.loading').show();
                       var cur_url = $(this).data('url');
                        $('form.forum_audio').prepend('<input type="hidden" name="key" value="'+STA.key+'">');
                        $('form.forum_audio').prepend('<input type="hidden" name="post_id" value="'+$(this).data('id')+'">');

                        var microData = new FormData($('form.forum_audio')[0]);
                        $.ajax({
                            url: "https://stassociation.com/forum/audio",
                            type: "POST",
                            data: microData,
                            contentType: 'multipart/form-data',
                            success: function (msg) {
                                currentPage.load(cur_url+' .app_list_forums',STA.selectSubForum);
                                $('.loading').hide();
                                $('html, body').animate({
                                    scrollTop: $(document).height()
                                }, 2000);
                            },
                            cache: false,
                            contentType: false,
                            processData: false
                        });
                    });
                    currentPage.on('click','.app_img_send',function(){
                        $('.loading').show();
                       var cur_url = $(this).data('url');
                        $('form.forum_photo').prepend('<input type="hidden" name="key" value="'+STA.key+'">');
                        $('form.forum_photo').prepend('<input type="hidden" name="post_id" value="'+$(this).data('id')+'">');
                        $('form.forum_photo').prepend('<input type="hidden" name="msg" value="'+$('.app_msg').val()+'">');


                        var photoData = new FormData($('form.forum_photo')[0]);
                        $.ajax({
                            url: "https://stassociation.com/forum/photo",
                            type: "POST",
                            data: photoData,
                            contentType: 'multipart/form-data',
                            success: function (msg) {
                                currentPage.load(cur_url+' .app_list_forums',STA.selectSubForum);
                                $('.loading').hide();
                                $('html, body').animate({
                                    scrollTop: $(document).height()
                                }, 2000);
                            },
                            cache: false,
                            contentType: false,
                            processData: false
                        });
                    });




	                currentPage.on('click','.app_cam',function(){
                        $( "#app_cam" ).trigger( "click" );
                    });

                    currentPage.on('click','.thumb_up',function(){
                        var th =  $(this).children('span');
                        $.ajax({
                            'method':'POST',
                            'url':'https://stassociation.com/forum/add_like',
                            'data':'i='+$(this).data('id')+'&k='+STA.key,
                            success:function(data){

                                if(data == 2){
                                    th.text(parseInt(th.text()) - parseInt(1));
                                }
                                else if(data == 1){
                                    th.text(parseInt(th.text()) + parseInt(1));
                                }
                            }
                        });
                    });

                    currentPage.on('click','.thumb_down',function(){
                        var th =  $(this).children('span');
                        $.ajax({
                            'method':'POST',
                            'url':'https://stassociation.com/forum/add_dislike',
                            'data':'i='+$(this).data('id')+'&k='+STA.key,
                            success:function(data){

                                if(data == 2){
                                    th.text(parseInt(th.text()) - parseInt(1));
                                }
                                else if(data == 1){
                                    th.text(parseInt(th.text()) + parseInt(1));
                                }
                            }
                        });
                    });



                    currentPage.on('click','.app_msg_send',function(){
                        $('.loading').show();
				  	 var th = $(this),
                     cur_url = $(this).data('url');
				  		$.ajax({
				  			method:'POST',
				  			url:'https://stassociation.com/forum/new_comment',
				  			data:'k='+STA.key+'&id='+$(this).data('id')+'&cm='+$('.app_msg').val()+'&new_comment_reply='+$('#new_comment_reply').val(),
				  			success:function(){
				  				$('.app_msg').val('');
				  				currentPage.load(cur_url+' .app_list_forums',STA.selectSubForum);


				  				$('html, body').animate({
        							scrollTop: $(document).height()
   								}, 2000,function(){
                                    $('.mobile_del_com[data-autor="'+STA.user_id+'"]').css('visibility', 'visible');
                                });
   								th.off('click');
                                $('.loading').hide();

                            }
				  		});
				  	});




                    break;
            }
		});
	},
	selectSubForum:function(){

		STA.deleteLinks();

		$('.sub_forum_href').on('click',function(){	
				forumCounter = 2;
            forumCurrentthread = $(this).data('target');
			currentPage.load($(this).data('target')+' .app_list_forums',function(){
	   		STA.deleteLinks();

                $('.mobile_del_com[data-autor="'+STA.user_id+'"]').css('visibility', 'visible');



            });
  		});
	},
	selectForum:function(){

		STA.deleteLinks();
        $('body').on('click','.sub_forum_href',function(){
            forumCounter = 2;
            currentPage.load($(this).attr('data_target')+' .app_list_forums',function(){
                STA.deleteLinks();
                $('.mobile_del_com[data-autor="'+STA.user_id+'"]').css('visibility', 'visible');


            });
        });

        $('.forum_href').on('click',function(){
			forumCounter = 1;


		  	prevForum = $(this).data('target');	
		  
			currentPage.load($(this).data('target')+' .app_list_forums',function(){
	   		STA.deleteLinks();
		  	STA.selectSubForum();

			});
  		});
	},
	deleteLinks:function(){		
		$('a').each(function(){
            if(!$(this).hasClass('menu-item')){
				  $(this).attr('href','javascript:void(0)');
            }
		});

        if($('.app-clock').data('time')!= undefined){

            $.each($('.app-clock'), function(){
                var timestamp =  $(this).data('time') * 1000;
                var date = new Date();
                date.setTime(parseInt(timestamp));
                $(this).find('span').text(
                    date.toLocaleDateString() +' ' + date.getHours()+':'+ date.getMinutes()
                );
            });
        }
	},
	radio:function(){
		$('.radio_play_btn').on('click',function(){
            $('.radio_player').animate({width:'100%',borderBottomRightRadius:'0',borderTopRightRadius:'0'},250);
            $('.radio_name').show(200);
            $('.radio_hide_btn').show(200);
            $('.radio_tray_btn').show(200);

			if($('#radio_player')[0].paused){
				document.getElementById('radio_player').play();

				$(this).find('i').removeClass('fa-play');
				$(this).find('i').addClass('fa-pause');
			}
			else{
				document.getElementById('radio_player').pause();			
				$(this).find('i').addClass('fa-play');
				$(this).find('i').removeClass('fa-pause');
			}
		});
		$('.radio_hide_btn').on('click',function(){$('.radio_player').slideUp()});
        $('.radio_tray_btn').on('click',function(){
            $('.radio_name').hide(200);
            $('.radio_hide_btn').hide(200);
            $('.radio_tray_btn').hide(200);
            $('.radio_player').animate({width:'17%',borderBottomRightRadius:'10',borderTopRightRadius:'10'},250);


        });

		$('body').on('click','.radio-block',function(){
			$('.radio_player').slideDown();
			var th = $(this);
		
			
			setTimeout(function () {    	
			$('.radio_name').text(th.find('.radio-head').text());
			$('#radio_player').attr('src',th.data('audio'));	
				if($('#radio_player')[0].paused){		
					document.getElementById('radio_player').play();
				}		
			},500);

		});

	},
	menuHide:function(){
				$('.left_menu').animate({left:'-'+$('.left_menu').width()},400);
				$('.left_menu').hide(100);	
	},
	get_user_data:function(key){
			if (key == undefined)
				key=STA.key;
		
	
			$.ajax({
				url:STA.ajax_url,
				method:'POST',
				dataType : "json",
				data:'k='+key,
				success:function(b){
					if(b.user_name == false){
						$('.login_block').show();
						return false;
					}
                    STA.user_id = b.user_id;
					STA.key_status = true;
					$('.user_data').slideDown();
					$('.user_name').text(b.user_name);
				}  

			});
	},
	key:window.localStorage.getItem("prem_key"),
	key_status:false,
	ajax_url:'https://stassociation.com/auth/app_login',
	base_url:'https://stassociation.com/',
	login:function(){
			

		if(STA.key!==undefined){
			$('.login_block').hide();
			STA.get_user_data();
		}


		$('.send_auth').on('click',function(){
			var login = $('.auth_login').val();
            window.localStorage.setItem("auth_login",login);
			var pass = $('.auth_pass').val();
			$.ajax({
				method:'POST',
				dataType : "json",  
				url:STA.ajax_url,
				data:'i='+login+'&p='+pass,
				success:function(d){
					if(d.err){						
						window.localStorage.setItem("prem_key", d.key);
						STA.key = window.localStorage.getItem("prem_key");
						STA.key_status = true;
						
						$('.login_block').slideUp();
						$('.user_data').slideDown();
						STA.get_user_data(d.key);
						STA.load_status();
					}else{
						$('.form_error').text(d.err);
					}
					$('.form_error').slideDown('slow');

				}
			})
		});

		$('.change_status').on('change',function(){
			$.ajax({
			method:'POST',
			url:STA.base_url+'auth/app_change_status',
			data:'k='+STA.key+'&s='+$(this).val()
			});
		});
		STA.load_status();

		
		

	},
	load_status:function(){
		$.ajax({
			method:'POST',
			url:STA.base_url+'auth/app_get_status',
			data:'k='+STA.key,
				success:function(b){
					$('.change_status').val(b);
				}
			});
	},
    checkDistance:function(){
        setInterval( function(){
            $('#markers_script').load( "https://stassociation.com/map/app_markers?k="+STA.key+'&ms='+icon_size_w);

            $('#markers_dist_script').load( "https://stassociation.com/map/app_markers_dist?k="+STA.key,function(){
            for (var i = 0; i < map_markers_dist.length; i++) {

                if(STA.count_alert.indexOf(map_markers_dist[i].id) != -1){
                    continue;
                }

                var myLatLng = new google.maps.LatLng(parseFloat(map_markers_dist[i].position.lat()),parseFloat(map_markers_dist[i].position.lng()));
                var myLatLng2 = new google.maps.LatLng(parseFloat(curr_position.lat),parseFloat(curr_position.lng));
                var calc1 = google.maps.geometry.spherical.computeDistanceBetween(myLatLng, myLatLng2);

               // if(calc1< 300){

                    cordova.plugins.notification.local.schedule({
                        id:map_markers_dist[i].id,
                        title: "You are close to the sign",
//                        smallIcon:'res://ic_dialog_map',
                        text: "Be aware: "+map_markers_dist[i].type
                    });

                //}

                STA.count_alert.push(map_markers_dist[i].id);
            }
            });
            $.ajax({
                url:STA.base_url+"map/app_notification_auto",
                method:"POST",
                data:'k='+STA.key,
                success:function(data){
                    if(data == '1'){
                        cordova.plugins.notification.local.schedule({
                            title: "You have a load",
                            smallIcon:'res://ic_menu_myplaces',
                            text: "Go to site for documents "
                        });
                    }
                }


            });

        }, 2000);
        setInterval( function(){
            for(var i=0; i<map_markers.length; i++){
                map_markers[i].setMap(null);
                map_markers[i]= null;
            }
            map_markers.length = 0;
            map_markers = [];
            $('#markers_script').load( "https://stassociation.com/map/app_markers?k="+STA.key+'&ms='+icon_size_w);


        },60000);
    }

}
$(function(){
STA.init();
});
