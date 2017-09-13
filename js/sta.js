STA = {
    count_alert:[],
	init:function(){
		STA.decor();
		STA.login();
		STA.stamenu();
		STA.radio();
		STA.menuHide();
		STA.checkDistance();
		$('.page[data-id="login"]').show();
      //  cordova.plugins.backgroundMode.enable();
		$('.log_out').on('click',function(){
			window.localStorage.removeItem('prem_key');
			location.reload();
		});



		
		
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

		$('body').on('click','.item_order',function(){
			$(this).next('.item_order_info').slideToggle('fast');

		});


	},
	currentPage:'login',
	forumCounter:0,
	prevForum:'',
    forumCurrentthread:'',
	stamenu:function(){
		$('div.menu-item, .bottom_menu_item').on('click',function(){
			$('.return_menu').unbind('click');
			$('.getOrder').unbind('click');
			 $('.markers_menu').hide();

			prevForum = '';		
			forumCounter = 0;
			$('.return_menu').hide();
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
					google.maps.event.trigger(mapCanvas, "resize");
                    currentPage.on('click','.del_info_marker',function(){
                        $.ajax({
                            url:'https://stassociation.com/map/del_info_marker',
                            method:'POST',
                            data:'i='+$(this).data('id')

                        });
                        $(this).parent().parent().parent().parent().hide()
                    });
				break;

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
				  currentPage.load('https://stassociation.com/logistic .list_order_content',function(){
				  	var BASE_URL = 'http://stassociation.com/logistic';

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
							$(this).text(name_road[0]+', '+name_road[1]);
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
				 	$('.return_menu').on('click',function(){
				 		if(prevForum!==''){		
							if(forumCounter==1){
								currentPage.load('https://stassociation.com/forum .app_list_forums',STA.selectForum);
								$('.return_menu').hide();
							}
							if(forumCounter==2){
								forumCounter = 1;
								currentPage.load(prevForum +' .app_list_forums',STA.selectSubForum);
							}						
						}					
					});							 
				  	currentPage.load('https://stassociation.com/forum .app_list_forums',STA.selectForum);

				  	currentPage.on('change','#app_mic',function(){
                        $( ".app_img_send" ).hide();
                        $( ".app_audio_send" ).show();
                    });
				  	currentPage.on('change','#app_cam',function(){
                        $( ".app_audio_send" ).hide();
                        $( ".app_img_send" ).show();
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
                        $('form.forum_audio').prepend('<input type="hidden" name="msg" value="'+$('.app_msg').val()+'">');
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


				  	currentPage.on('click','.app_mic',function(){
                        $( "#app_mic" ).trigger( "click" );
                    });
	                currentPage.on('click','.app_cam',function(){
                        $( "#app_cam" ).trigger( "click" );
                    });


				  	currentPage.on('click','.app_msg_send',function(){
                        $('.loading').show();
				  	 var th = $(this),
                     cur_url = $(this).data('url');
				  		$.ajax({
				  			method:'POST',
				  			url:'https://stassociation.com/forum/new_comment',
				  			data:'k='+STA.key+'&id='+$(this).data('id')+'&cm='+$('.app_msg').val(),
				  			success:function(){
				  				$('.app_msg').val('');
				  				currentPage.load(cur_url+' .app_list_forums',STA.selectSubForum);
				  				$('html, body').animate({
        							scrollTop: $(document).height()
   								}, 2000);
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
		  		$('.return_menu').show();		  						  			 
			});
  		});
	},
	selectForum:function(){		
	
		STA.deleteLinks();
        $('body').on('click','.sub_forum_href',function(){
            forumCounter = 2;
            currentPage.load($(this).attr('data_target')+' .app_list_forums',function(){
                STA.deleteLinks();
                $('.return_menu').show();
            });
        });

        $('.forum_href').on('click',function(){
			forumCounter = 1;
		
		  	prevForum = $(this).data('target');	
		  
			currentPage.load($(this).data('target')+' .app_list_forums',function(){
	   		STA.deleteLinks();
		  	$('.return_menu').show();
		  		STA.selectSubForum();				  			 
			});
  		});	
	},
	deleteLinks:function(){		
		$('a').each(function(){
				  $(this).attr('href','javascript:void(0)');
		});
	},
	radio:function(){
		$('.radio_play_btn').on('click',function(){


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
            $('#markers_dist_script').load( "https://stassociation.com/map/app_markers_dist");
            for (var i = 0; i < map_markers_dist.length; i++) {

                if(STA.count_alert.indexOf(map_markers_dist[i].id) != -1){
                    continue;
                }

                var myLatLng = new google.maps.LatLng(parseFloat(map_markers_dist[i].position.lat()),parseFloat(map_markers_dist[i].position.lng()));
                var myLatLng2 = new google.maps.LatLng(parseFloat(curr_position.lat),parseFloat(curr_position.lng));
                var calc1 = google.maps.geometry.spherical.computeDistanceBetween(myLatLng, myLatLng2);

                if(calc1< 300){
                    cordova.plugins.notification.local.schedule({
                        id:map_markers_dist[i].id,
                        title: "You are close to the sign",
                        smallIcon:'res://ic_dialog_map',
                        text: "Sign type: "+map_markers_dist[i].type
                    });
                }

                STA.count_alert.push(map_markers_dist[i].id);
            }
        }, 20000);
    }

}
$(function(){
STA.init();
});
