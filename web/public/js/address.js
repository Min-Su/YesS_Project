var socket;
var tmp;

$(document).ready(function(){
	$('#aquireAddr').bind('click',post.path);
	
	socket = io.connect('http://54.186.72.92');
	
	socket.on('addr_toclient', function (data) {
		showPath.show(data);	
	});	
});

var post = {
	
	path : function(){
		socket.emit('address');
	}
}

var showPath = {
		
	show : function(data){
		tmp=data;
		$('#addr').val(tmp);
	}
}
