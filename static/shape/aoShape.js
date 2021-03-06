/*
	By: aowolfie (Brandon Beckwith)
                      .
                     / V\
                   / '  /
                  < <  |
       .          /    |
      / \        /      |
     /  /      /        |
    |  |     /    \  \ /
     \  \   (      ) | |
      \  \__|   _/__/| |
       \____\______) \__)
*/


/* Add some nice functions to the Math Library */

/* Convert degrees to radians */
Math.radians = function(degrees){
	return degrees * Math.PI / 180;
}

/* Convert radians to degrees */
Math.degrees = function(radians){
	return radians * 180 / Math.PI;
}

/* Tan function using degrees */
Math.cosd = function(degrees){
	return Math.cos(Math.radians(degrees));
}

/* Sin function using degrees */
Math.sind = function(degrees){
	return Math.sin(Math.radians(degrees));
}

/* Tan function using degrees */
Math.tand = function(degrees){
	return Math.tan(Math.radians(degrees));
}


/** Start of Shape **/


/* Draws a rectangle given two points */
function drawRectangle(context, brush, p1, p2){
	brush.draw(context, [p1, new Point(p2.x,p1.y), p2, new Point(p1.x,p2.y), p1]);
}

/* Draws a circle */
function drawCircle(context, brush, topLeftPoint, radius){
	var center = new Point(topLeftPoint.x + r, topLeftPoint.y + r);
	var firstP = new Point(center.x + radius * Math.cosd(0), center.y + radius * Math.sind(theta));
	var path = [];
	path.push(firstP);
	for (var theta = 1; theta < 359; theta++){
		x = center.x + radius * Math.cosd(theta);
		y = center.y + radius * Math.sind(theta);
		point = new Point(x,y);
		if (distBetween(path[path.length-1], point) > 0){
			path.add(point);
		}
	}
	path.push(firstP);
	brush.draw(context, path);
}

/* Draws a circle given two points */
function drawCircleFromPoints(context, brush, p1, p2){
	drawCircle(context, brush, p1, Math.floor(Math.min(Math.min(p1.x,p2.x), Math.min(p1.y,p2.y)) / 2));
}

/* Draws a triangle */
function drawTriangle(context, brush, p1, p2){
	var point = new Point(p1.x,p2,y);
	brush.draw(context, [point, new Point(p1.x + Math.floor(Math.abs(p1.x - p2.x) / 2), p2, point]);
}









