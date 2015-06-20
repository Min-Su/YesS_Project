var ctx;

var socket;
var myUrl;
var tmpUrl;
var attention_flag = 0;

var i=0;

$(document).ready(function(){
	//jQuery 이용하여 canvas element 객체 얻기
	ctx = $('#cv').get(0).getContext('2d');
	
	//jQuery bind 이용하여 canvas에 마우스 시작,이동,끝 이벤트 핸들러 등록
	$('#cv').css('background-image', "url(img0.jpg)");
	i=0;
	//기본 모양 색상 설정
	shape.setShape();
	
	//clear 버튼에 이벤트 핸들러 등록
	$('#clear').bind('click',draw.clear);

	$('#prev').bind('click', page.prev);
	$('#prev').bind('click', draw.clear);
	$('#next').bind('click', page.next);
	$('#next').bind('click', draw.clear);
	
    $('#attention_show').bind('click', attention_function.attention_show);
    $('#attention_cancel').bind('click', attention_function.attention_cancel);
	
	//색상 선택 select 설정
	for(var key in color_map){
		$('#pen_color').append('<option value=' + color_map[key].value + '>' +  color_map[key].name + '</option>');
	}

	//색상 선택 select 설정
	for(var i = 2 ; i < 15 ; i++){
		$('#pen_width').append('<option value=' + i + '>' +  i + '</option>');
	}
	
	$('select').bind('change',shape.change);

	socket = io.connect('http://54.186.72.92');
	
	myUrl = window.location.pathname; 
	
	socket.on('linesend_toclient', function (data) {
			draw.drawfromServer(data);
	});
	
	socket.on('pagesend_toclient', function (data) {
			page.allocatedPage(data);
	});
    
    socket.on('attention_show_toclient', function (data) {
			attention_function.show_fromServer();
	});
    
    socket.on('attention_drop_toclient', function (data) {
			attention_function.drop_fromServer();
	});
	

});

var msg = {
	
	line : {
			send : function(type,x,y,url){
				url = myUrl;
				console.log(type,x,y);
			 	socket.emit('linesend', {'type': type , 'x':x , 'y':y , 'url': url, 'color': shape.color , 'width' : shape.width });
			}
	},
	page : {
			send : function(pageNum){
				console.log(pageNum);
				socket.emit('pagesend', pageNum);
			}
	},
    attention : {
            show : function(url){
                console.log('Attention');
                socket.emit('attention_show', url);
            },
        
            drop : function(url){
                console.log('Attention Cancel');
                socket.emit('attention_drop', url);
            }
    }
}

//색상 배열
var color_map = 
[
	{'value':'red','name':'빨간색'},
 	{'value':'white','name':'하얀색'},
 	{'value':'orange','name':'주황색'},
 	{'value':'yellow','name':'노란색'},
 	{'value':'blue','name':'파랑색'}, 	
 	{'value':'black','name':'검은색'}
];

var shape = {
	
	//기본 색상,두께 설정
	color : 'red',
	width : 3,
	
	change : function(){
		
		var color = $('#pen_color option:selected').val();
		var width = $('#pen_width option:selected').val();
	
		shape.setShape(color,width);
	},
	
	//모양 변경 메서드
	setShape : function(color,width){
		
		if(color != null)
			this.color = color;
		if(width != null)
			this.width = width;
	
		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.width;
		
		ctx.clearRect(703, 0, 860, 90);
		
	}
	
}

var page = {
		prev : function imgPrev(){
			i--;
			
			if(i>=0){
				$('#cv').css('background-image', "url(img" + i + ".jpg)");
			}
			else{
				i=0;
			}
			msg.page.send(i);
		},
		next : function imgNext(){
			i++;
			
			$('#cv').css('background-image',"url(img" + i + ".jpg)");
			msg.page.send(i);
		},
		allocatedPage : function(data){
			i = data;
			$('#cv').css('background-image', "url(img" + i + ".jpg)");
		}
}

//attention 관련

var attention_function = {
    attention_show : function() {
        if(attention_flag == 0) {
            msg.attention.show(myUrl);
            attention_flag = 1;
        }
    },
    
    attention_cancel : function() {
        if(attention_flag == 1) {
            msg.attention.drop(myUrl);
            attention_flag = 0;
        }
    },

    show_fromServer : function() {
        window.customPG.showActivity();
    },

    drop_fromServer : function() {
        window.customPG.dropActivity();
    }
}

//그리기 관련 
var draw = {
	
	drawing : null,
	
	start : function(e){
		ctx.beginPath(); 
		ctx.moveTo(e.pageX,e.pageY);
		this.drawing = true;
		
		msg.line.send('start',e.pageX,e.pageY);
	},
	
	move : function(e){
		if(this.drawing){
			ctx.lineTo(e.pageX,e.pageY);
			ctx.stroke();
			msg.line.send('move',e.pageX,e.pageY);
		}

	},
	
	end : function(e){
		this.drawing = false;
		msg.line.send('end');
	},
	
	clear : function(){
		//전체 지우기 
		ctx.clearRect(0, 0, cv.width,cv.height);
		shape.setShape();
		msg.line.send('clear');
	},
	
	drawfromServer : function(data){
		
		if(data.type == 'start'){
			ctx.beginPath(); 
			ctx.moveTo(data.x,data.y);
			ctx.strokeStyle = data.color;
			ctx.lineWidth = data.width;
		}
		
		if(data.type == 'move'){
			ctx.lineTo(data.x,data.y);
			ctx.stroke();
		}
		
		if(data.type == 'end'){
		}

		if(data.type == 'clear'){
			ctx.clearRect(0, 0, cv.width,cv.height);
			shape.setShape();
		}
	}

}
