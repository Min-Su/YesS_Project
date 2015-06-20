$(function() {

$('.notep').bind('click',function(){
	// Getting the variable's value from a link 
		var noteBox  = $(this).attr('href');
		//Fade in the Popup and add close button
		$(noteBox).show();
      	//Set the center alignment padding + brder
	    var popMargTop = ($(noteBox).height() + 40) / 2; 
		var popMargLeft = ($(noteBox).width() + 70) / 2; 
	    $(noteBox).css({ 
			'margin-top' : -popMargTop,
			'margin-left' : -popMargLeft
		});
	  return false;
	});
	  
});
