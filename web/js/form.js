$(function() {
	
	$('.ips').bind('click',function(){
		// Getting the variable's value from a link 
		var ipBox  = $(this).attr('href');
		//Fade in the Popup and add close button
		$(ipBox).show();
      	//Set the center alignment padding + brder
	    var popMargTop2 = ($(ipBox).height() + 24) / 2; 
		var popMargLeft2 = ($(ipBox).width() + 24) / 2; 
	    $(ipBox).css({ 
			'margin-top' : -popMargTop2,
			'margin-left' : -popMargLeft2
		});
	 	return false;
	});
});
