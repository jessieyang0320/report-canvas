/* 折线图 component object*/ 

var H5ComponentPolyline = function(name,cfg){

  var component =  new H5ComponentBase( name ,cfg );
  
  //  绘制网格线 - 背景层
  var w = cfg.width;
  var h = cfg.height;

  //  加入一个画布（数据背景）

  var cns = document.createElement('canvas');

  var ctx = cns.getContext('2d');
  cns.width = ctx.width = w;
  cns.height = ctx.height =h;
  component.append(cns);


  //水平网格线, 这里定义为10份 

  var step = 10;
  ctx.beginPath() //开始划线
  ctx.lineWidth = 1; //画笔宽度
  ctx.strokeStyle = '#AAAAAA'; //画笔颜色

  window.ctx = ctx;
  for(var i=0;i<step+1; i++){
  	var y = (h/step) * i //
  	ctx.moveTo(0,y); //画笔起点是原点
  	ctx.lineTo(w,y)
  }


  //垂直 vertical line (based on items in data array)
 
  step = cfg.data.length + 1; 
  //n项数据应该画出n+2条线，左右各留出一条线空着
  // 所以step上+1， 循环上再+1 
  var text_w = w/step>>0; //不要小数的偷懒写法

  for(var i=0;i<step+1; i++){
  	var x = (w/step)*i
  	ctx.moveTo(x,0);
  	ctx.lineTo(x,h);
	  if( cfg.data[i]){
	  	var text = $('<div class="text">');
	  	text.text(cfg.data[i][0]);

	  	text.css('width',text_w/2).css('left',x/2+text_w/4)


	  	component.append(text);
	    }
  } 

  ctx.stroke(); //收笔


// 加入画布 --数据层 
  var cns = document.createElement('canvas');
  var ctx = cns.getContext('2d');
  cns.width = ctx.width = w;
  cns.height = ctx.height =h; 
  component.append(cns);
/**
* 绘制折线以及对应数据和阴影 draw function
*@param {float} per 0 - 1 之间的数据，会根据这个值来绘制各个状态 
* return {DOM} component element


*/ 

var draw = function( per ){
// 清空画布
  ctx.clearRect(0,0,w,h);
//绘制折现数据  
  ctx.beginPath() 
  ctx.lineWidth = 3; 
  ctx.strokeStyle = '#ff8878'; 


 // var x=0;
 // var y=0;
 // ctx.moveTo(10,10);
 // ctx.arc(10,10,5,0,2*Math.PI)
 
 // step = cfg.data.length+1;

 // 画点 
 var row_w = w/(cfg.data.length + 1);
 for(i in cfg.data){
 	var item = cfg.data[i];
 	x = row_w*i + row_w ;
 	y = h-(item[1]*h*per);
 	ctx.moveTo(x,y)
 	ctx.arc(x,y,5,0,2*Math.PI)
 }

 // 连线
   // 移动画笔到第一个数据的点位,用上面的参数，i=0 所以x就只是row_w

   ctx.moveTo( row_w , h-(cfg.data[0][1]*h*per) );
   for(i in cfg.data){
	   	var item = cfg.data[i];
	 	x = row_w*i + row_w ;
	 	y = h-(item[1]*h*per);
	 	ctx.lineTo(x,y);
   }


   // 绘制阴影
   ctx.lineTo(x,h);
   ctx.lineTo(row_w,h);
   ctx.fillStyle = 'rgba(241, 112, 112, 0.54)';
   ctx.fill();
   ctx.stroke();
   ctx.lineWidth = 1; 


   // 写数据额
   for(i in cfg.data){
	   	var item = cfg.data[i];
	 	x = row_w*i + row_w ;
	 	y = h-(item[1]*h*per);

	 	ctx.fillStyle = item[2] ? item[2] : '#595959';
	 	
	 	ctx.fillText((item[1]*100 + '%'),x-10,y-10);
   }

ctx.stroke();
}



component.on('onLoad',function(){
	// 折线图生长动画
	var s = 0;
	for(i=0; i<100;i++){
		setTimeout(function(){
			s+=.01;
			draw(s);
		},i*10+500)
	}
})

component.on('onLeave',function(){
	// 折线图退场动画
	var s = 1;
	for(i=0; i<100;i++){
		setTimeout(function(){
			s-=.01;
			draw(s);
		},i*10)
	}
})







	
	return component
}