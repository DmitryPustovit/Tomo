var canvas = document.getElementById("picker");
var ctx = canvas.getContext("2d");
canvas.height = 140;
canvas.width = 140;
var x = canvas.height / 2;
var y = canvas.width / 2;

var radius = canvas.height / 2;
var counterClockwise = false;

for(var angle=0; angle<=360; angle++)
{
  var startAngle = (angle-2)*Math.PI/180;
  var endAngle = angle * Math.PI/180;
  ctx.beginPath();
  ctx.moveTo(x, y);
    /*
    context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
    context.closePath();
    var gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0,'hsl('+angle+', 10%, 100%)');
    gradient.addColorStop(1,'hsl('+angle+', 100%, 50%)');
    context.fillStyle = gradient;
    */
  ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise);
  ctx.closePath();
  var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0,'hsl('+angle+', 100%, 100%)');
  gradient.addColorStop(1,'hsl('+angle+', 100%, 50%)');
  ctx.fillStyle = gradient;
  ctx.fill();

  //ctx.lineWidth = 1;
  //ctx.strokeRect(220,20,60,60);
}

var red = document.getElementById('red');
var green = document.getElementById('green');
var blue = document.getElementById('blue');
var hue = document.getElementById('hue');
var sat = document.getElementById('sat');
var value = document.getElementById('val');
var alpha = document.getElementById('alpha');

$(document).mousedown(function(e) {
  pick(e);
  document.addEventListener('mousemove', pick, false);
});

$(document).mouseup(function(e) {
	 document.removeEventListener('mousemove', pick, false);
});

function pick(event) {
    var mouseX = event.pageX;
    var mouseY = event.pageY;
    if(Math.sqrt( (mouseX - x)*(mouseX - x) + (mouseY - y)*(mouseY - y)) > radius )
      canvas.removeEventListener('mousemove', pick, false);
    else{
    var pixel = ctx.getImageData(mouseX, mouseY, 1, 1);
    var data = pixel.data;
    data[3] = document.getElementById("alphaSlider").value;
    setColor(data);
  }
}

function setColor(data){
  localStorage.setItem("color", JSON.stringify(data));
  var hsv = RGBToHSV(data[0], data[1], data[2]);
  document.getElementById('color1').style.backgroundColor = 'rgba(' + data[0] + ',' + data[1] +',' + data[2] + ',' + (data[3] / 255) + ')';
  document.getElementById('redSlider').style.background = 'linear-gradient(to right, ' +
  'rgba( 0,' + data[1] +',' + data[2] + ', 255 )' + ',' +
  'rgba( 255' + ',' + data[1] +',' + data[2] + ', 255 ))';
  document.getElementById("redSlider").value = data[0] ;

  document.getElementById('greenSlider').style.background = 'linear-gradient(to right, ' +
  'rgba(' +  data[0] + ', 0 ,' + data[2] + ', 255 )' + ',' +
  'rgba(' +  data[0] + ', 255 ,' + data[2] + ', 255 ))';
  document.getElementById("greenSlider").value = data[1] ;

  document.getElementById('blueSlider').style.background = 'linear-gradient(to right, ' +
  'rgba(' +  data[0] + ', ' + data[1] + ' , 0 , 255 )' + ',' +
  'rgba(' +  data[0] + ', ' + data[1] + ' , 255 , 255 ))';
  document.getElementById("blueSlider").value = data[2] ;

  var tempHSV1 = HSVToRGB(hsv[0] / 360, 0 ,hsv[2] / 100);
  var tempHSV2 = HSVToRGB(hsv[0] / 360, 1, hsv[2] / 100);

  document.getElementById('satSlider').style.background = 'linear-gradient(to right, ' +
  'rgba(' +  tempHSV1[0] + ', ' + tempHSV1[1] + ' , ' + tempHSV1[2] + ' , 255 )' + ',' +
  'rgba(' +  tempHSV2[0] + ', ' + tempHSV2[1] + ' , '+ tempHSV2[2] + ' , 255 ))';
  document.getElementById("satSlider").value = hsv[1]; ;

  document.getElementById('alphaSlider').style.background = 'linear-gradient(to right, ' +
  'rgba(' +  data[0] + ', ' + data[1] + ' , ' + data[2] + ' , 0 )' + ',' +
  'rgba(' +  data[0] + ', ' + data[1] + ' , '+ data[2] + ' , 255 ))';
  document.getElementById("alphaSlider").value = data[3] ;


  red.value = data[0];
  green.value = data[1];
  blue.value = data[2];
  hue.value = hsv[0];
  sat.value = hsv[1];
  value.value = hsv[2];
  alpha.value = data[3];

  document.getElementById("hueSlider").value = hsv[0] ;
  document.getElementById("satSlider").value = hsv[1] ;
  document.getElementById("valueSlider").value = hsv[2] ;
}

if (localStorage.getItem("color") === null) {
  localStorage.setItem("color", JSON.stringify([255,255,255,1]));
}
else{
  var storedColor = JSON.parse(localStorage.getItem("color"));
  setColor(storedColor);
}

document.getElementById('redSlider').addEventListener("input", function() {
    setColor([this.value, document.getElementById('green').value, document.getElementById('blue').value, document.getElementById('alpha').value])
}, false);

document.getElementById('greenSlider').addEventListener("input", function() {
    setColor([document.getElementById('red').value, this.value, document.getElementById('blue').value, document.getElementById('alpha').value])
}, false);

document.getElementById('blueSlider').addEventListener("input", function() {
    setColor([document.getElementById('red').value, document.getElementById('green').value, this.value, document.getElementById('alpha').value])
}, false);

document.getElementById('alphaSlider').addEventListener("input", function() {
    setColor([document.getElementById('red').value, document.getElementById('green').value, document.getElementById('blue').value, this.value])
}, false);

document.getElementById('red').addEventListener("input", function() {
  setColor([document.getElementById('red').value, document.getElementById('green').value, document.getElementById('blue').value, document.getElementById('alpha').value])
});

document.getElementById('green').addEventListener("input", function() {
  setColor([document.getElementById('red').value, document.getElementById('green').value, document.getElementById('blue').value, document.getElementById('alpha').value])
});

document.getElementById('blue').addEventListener("input", function() {
  setColor([document.getElementById('red').value, document.getElementById('green').value, document.getElementById('blue').value, document.getElementById('alpha').value])
});

document.getElementById('alpha').addEventListener("input", function() {
  setColor([document.getElementById('red').value, document.getElementById('green').value, document.getElementById('blue').value, document.getElementById('alpha').value])
});

function HSVToRGB(h, s, v)
{
  var r,g,b;
  console.log([h,s,v]);
  if((Math.floor(h * 6) % 6) == 0)
  {
    r = v;
    g = v * (1 - (1 - (h * 6 - (Math.floor(h * 6)))) * s);
    b = v * (1 - s);
  }

  else if((Math.floor(h * 6) % 6) == 1)
  {
    r = v * (1 - (h * 6 - (Math.floor(h * 6))) * s);
    g = v;
    b = v * (1 - s);
  }

  else if((Math.floor(h * 6) % 6) == 2)
  {
    r = v * (1 - s);
    g = v;
    b = v * (1 - (1 - (h * 6 - (Math.floor(h * 6)))) * s);
  }

  else if((Math.floor(h * 6) % 6) == 3)
  {
    r = v * (1 - s);
    g = v * (1 - (h * 6 - (Math.floor(h * 6))) * s);
    b = v;
  }

  else if((Math.floor(h * 6) % 6) == 4)
  {
    r = v * (1 - (1 - (h * 6 - (Math.floor(h * 6)))) * s);
    g = v * (1 - s);
    b = v;
  }

  else if((Math.floor(h * 6) % 6) == 5)
  {
    r = v;
    g = v * (1 - s);
    b = v * (1 - (h * 6 - (Math.floor(h * 6))) * s);
  }

  r *= 255;
  g *= 255;
  b *= 255;

  return [ r, g, b ];
}


function RGBToHSV(r, g, b)
{
  r /= 255;
  g /= 255;
  b /= 255;

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, v;
  v = max;

  var diff = max - min;

  if(max == 0)
    s = 0;
  else
    s = diff / max;

  if(min == max)
    h  = 0;
  else{
    if(max == r){
      var val = 0;

        if( b > g)
          val = 6;

          h = ((g - b) / diff) + val;
    }

    if(max == g)
      h = ((b - r) / diff) + 2;

    if(max == b)
      h = ((r - g) / diff) + 4;
  }

  return [Math.round((h / 6) * 360), Math.round(s * 100), Math.round(v * 100), h, s, v];
}

window.addEventListener('message', receiver, false);

function receiver(e) {
   if (e.origin == '*') {
     console.log("baka");
     return;
   } else {
     var data = e.data.split(',');

    //if(data[0] == 'eyedropper')
      //setColor([data[1], data[2], data[3], data[4]]);
   }
   console.log([data[1], data[2], data[3], data[4]]);
}




//TODO
//Get Color indicator circle working
//Get HSV fully working
