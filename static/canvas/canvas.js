
//Onload Code
var canvas, ctx, width = document.documentElement.clientWidth, height = document.documentElement.clientHeight;
createLayer(1);
selectLayer(1);

el = document.getElementById("1");
bPencil = new Brush(el, pencil);
bPen = new Brush(el, pen);
bHorizontalBar = new Brush(el, horizontalBar);
bVerticalBar = new Brush(el, verticalBar);
bBubbles = new Brush(el, bubbles);
bClouds = new Brush(el, clouds);
blank = new Brush(el, blank);

updateColor();

if (localStorage.getItem("tool") === null) {
	ctx.strokeStyle = 'pencil';
}


//Univeral Mouse Movement Tracker
var mouse = {x: 0, y: 0, oX: 0, oY: 0};
$(document).mousemove(function(e) {
  mouse.x = e.pageX;
	mouse.y = e.pageY;
});

var brush;

$(document).mousedown(function(e) {
		if (localStorage.getItem("tool") != "none")
		{
				blank.assign();
		}
		console.log("nouse down");
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
		updateColor();
		mouse.oX = mouse.x;
		mouse.oY = mouse.y;``
		//$(document).mousemove(function(e) { onPaint();});
		document.addEventListener('mousemove', onPaint, false);
});

$(document).mouseup(function(e) {
	console.log("nouse up");
    //$(document).off('mousemove');
		document.removeEventListener('mousemove', onPaint, false);
});

//Paint feature
		var onPaint = function() {
			ctx.lineWidth = 1;
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			ctx.imageSmoothingEnabled = true;
			ctx.beginPath();
			console.log(localStorage.getItem("tool"));
			if(localStorage.getItem("tool") == "pencil"){
				ctx.globalCompositeOperation = "source-over";
				ctx.moveTo(mouse.oX,mouse.oY);
				ctx.lineTo(mouse.x,mouse.y);
				ctx.stroke();
			}
			if (localStorage.getItem("tool") == "er")
			{
	      ctx.globalCompositeOperation = "destination-out";
	      ctx.arc(mouse.oX,mouse.oY,8,0,Math.PI*2,false);
	      ctx.fill();
	    }
			if (localStorage.getItem("tool") == "eyedropper")
			{
				var pixel = ctx.getImageData(mouse.x, mouse.y, 1, 1);
	      var data = pixel.data;
				parent.eyedropper(data);
				console.log("eyedropper drag");
			}
			mouse.oX = mouse.x;
			mouse.oY = mouse.y;

		    //ctx.lineTo(mouse.x, mouse.y);
		    //ctx.stroke();
		};

//Change Color Feature
		function updateColor(){
			var storedNames = JSON.parse(localStorage.getItem("color"));
			ctx.strokeStyle = 'rgba(' +storedNames[0] + ',' + storedNames[1] + ',' + storedNames[2] + ',1)';
		}

//Paste img feature
		window.addEventListener('paste', pasteHere);

		function pasteHere(e) {
			if(e.clipboardData == false) {
				return false; //there is nothing to paste
			}
		    	var paste = e.clipboardData.items;
		    	if(paste == undefined) {
				return false //there is nothing to paste
			}
		    	for (var i = 0; i < paste.length; i++) {
		        if (paste[i].type.indexOf("image") == -1) {
				continue; //means there is no image
			}
		        var blob = paste[i].getAsFile();
		        var URLObj = window.URL || window.webkitURL;
		        var source = URLObj.createObjectURL(blob);
		        pasteTheImage(source);
		        }
		}
			//draw pasted object
		function pasteTheImage(source) {
			var pastedImage = new Image();
			pastedImage.onload = function() {
		        	ctx.drawImage(pastedImage, mouse.x, mouse.y);
			}
			pastedImage.src = source;
		}

//Layers!
		function createLayer(number) {
			console.log("layer created!");
			var canvas = document.createElement('canvas');
			canvas.id = number;
			canvas.width = width;
			canvas.height = height;
			canvas.style.zIndex = number ;
			$('#sketch').append(canvas);
		}

		function selectLayer(number)
		{
			canvas = document.getElementById(number);
			ctx = canvas.getContext('2d');
		}

		function mergeLayers(top, bottom){
			console.log(top + " " + bottom);
			var ctx = document.getElementById(bottom).getContext('2d');
			//ctx.setOpacity(top.getOpacity, bottom);
			ctx.drawImage(document.getElementById(top), 0, 0);
			//ctx.setOpacity(1, bottom);
			//TODO layer opactiy HERE
			$(document.getElementById(top)).remove();
		}

		function removeLayer(num)
		{
			$(document.getElementById(num)).remove();
		}

		function flattenLayers()
		{
			var layers = [];
			$('#sketch').children('canvas').each(function () {
    		layers.push($(this).attr('id'));
			});

			if(layers.length > 1)
			{
				for(var i = layers.length - 1; i > 0; i--)
					mergeLayers(layers[i], layers[i-1]);
			}
		}

		function hideLayer(num, val)
		{
				$(document.getElementById(num)).toggle();
		}
		var brushWorking = false;
		function assignBrush(brush)
 	 {
		 brushWorking = true;
		 console.log(brush);
		 if(brush == "pencil")
 		 	bPencil.assign();
		if(brush == "pen")
			 bPen.assign();
		if(brush == "h")
	 		bHorizontalBar.assign();
		if(brush == "v")
		 		bVerticalBar.assign();
				if(brush == "b")
				{
			 		bBubbles.assign();
					bBubbles.setColor('blue');
				}
				if(brush == "c")
				{
				 		bClouds.assign();
					}
 		 //brush = new Brush(canvas, localStorage.getItem("cat"));
 	 }


//Universal Listerer
window.addEventListener('message', receiver, false);

function receiver(e) {
   if (e.origin == '*') {
     return;
   } else {
		 var data = e.data.split(',');
		 if(data[0] == 'createLayer')
		 		createLayer(data[1]);

		if(data[0] == 'selectLayer')
	 		 selectLayer(data[1]);

		if(data[0] == 'mergeLayer')
			mergeLayers(data[1], data[2]);

		if(data[0] == 'flattenLayers')
			flattenLayers();

		if(data[0] == 'removeLayer')
				removeLayer(data[1]);

		if(data[0] == 'hideLayer')
				hideLayer(data[1], data[1]);

		if(data[0] == 'assign')
			assignBrush(data[1]);

		 console.log(data);
   }
}






///JUNK
//var img = new Image();

 //drawing of the test image - img1
 //img.onload = function () {
	 //draw background image
		 //ctx.drawImage(img, 0, canvas.height - 500);
		 //draw a box over the top
		 //ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
		 //ctx.fillRect(0, 0, 500, 500);
 //};

 //img.src = 'intro.jpg';