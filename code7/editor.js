function Editor(canvasId){
	this.canvas = initCanvas(canvasId);
	var lines = [];
	var pointR = 5;
	var pointN = 0;
	var curPoint = undefined;
	var color = ['blue', 'orange', 'green', 'gray']

	this.canvas.getMousePos = function(evt) {
      	var rect = this.getBoundingClientRect();
      	return {
        	x: evt.clientX - rect.left,
        	y: evt.clientY - rect.top
      	};
    }

    this.canvas.addEventListener('mousedown', function(evt) {
        var mousePos = this.getMousePos(evt);
        var existing = false;
        for(var i=0;i<lines.length;i++){
        	var line = lines[i];
        	for(var j=0;j<line.points.length;j++){
        		var p = line.points[j];
        		var dist = Math.abs(p.x - mousePos.x) + Math.abs(p.y - mousePos.y);
        		if(dist<pointR*2){
        			curPoint = p;
        			existing = true;
        			break;
        		}
        	}
        	if(existing) break;
        }
        if(!existing){
        	var index = Math.floor(pointN/4);
        	if(pointN%4==0){
        		lines.push(new Spline(index));
        	}
        	lines[index].addPoint(new Point(index, mousePos.x, mousePos.y, 0));
        	pointN++;
        }
    }, false);

    this.canvas.addEventListener('mouseup', function(evt) {
        curPoint = undefined;
    }, false);

    this.canvas.addEventListener('dblclick', function(evt) {
    	var mousePos = this.getMousePos(evt);
        var existing = false;
        for(var i=0;i<lines.length;i++){
        	var line = lines[i];
        	for(var j=0;j<line.points.length;j++){
        		var p = line.points[j];
        		var dist = Math.abs(p.x - mousePos.x) + Math.abs(p.y - mousePos.y);
        		if(dist<pointR*2){
        			lines[p.lineId].deletePoint(p);
        			return;
        		}
        	}
        }
    }, false);

    this.canvas.addEventListener('mousemove', function(evt) {
        if(curPoint !== undefined){
        	var mousePos = this.getMousePos(evt);
        	curPoint.x = mousePos.x;
        	curPoint.y = mousePos.y;
        }
    }, false);

    this.canvas.addEventListener('mouseup', function(evt) {
        curPoint = undefined;
    }, false);

	this.canvas.update = function(g){

		for(var i=0;i<lines.length;i++){
        	var line = lines[i];
        	for(var j=0;j<line.points.length;j++){
        		var p = line.points[j];
        		g.beginPath();
                g.arc(p.x, p.y, pointR, 0, 2 * Math.PI, false);
                g.fillStyle = color[i%4];
                g.fill();
        	}
        }

        for(var i=0;i<lines.length;i++){
        	lines[i].draw(g);
        }

		g.lineWidth = 1;
	    g.strokeStyle = 'blue';
	    g.beginPath();
	    g.moveTo(0,0);
	    g.lineTo(this.width,0);
	    g.lineTo(this.width,this.height);
	    g.lineTo(0,this.height);
	    g.lineTo(0,0);
	    g.stroke();
	}
}

function Point(id, x, y, z){
	this.lineId = id;
	this.x = x;
	this.y = y;
	this.z = z;
}
Point.prototype = {
	isTheSame : function(point){
		if(this.x == point.x && this.y == point.y && this.z == point.z) return true;
		return false;
	},
	multiply : function(m){
		return new Point(this.id, this.x*m, this.y*m, this.z*m);
	},
	add : function(point){
		return new Point((this.id+point.id)/2,
						this.x+point.x, this.y+point.y, this.z+point.z);
	}
}

function Spline(id){
	this.points = [];
	this.id = id;
}
Spline.prototype = {
	addPoint : function(point){
		this.points.push(point);
		//alert("addes");
	},
	deletePoint : function(point){
		for(var i=0;i<this.points.length;i++){
			if(this.points[i].isTheSame(point)){
				this.points.splice(i,1);
				return;
			}
		}
	},
	getDot : function(t){
		if(this.points.length<2) return new Point(this.id, 0, 0, 0);
		var arr = this.points;
		while(arr.length>1){
			var temp = [];
			for(var i=0;i<arr.length-1;i++){
				var newPoint = arr[i].multiply(1-t).add(arr[i+1].multiply(t));
				temp.push(newPoint);
			}
			arr = temp;
		}
		return arr[0];
	},
	draw : function(g){
		if(this.points.length<2) return;
		g.lineWidth = 3;
        g.strokeStyle = "black";
        g.beginPath();
        var dot = this.getDot(0);
        g.moveTo(dot.x, dot.y);
        for(var t = 0.01 ; t <= 1.0 ; t += 0.01){
            dot = this.getDot(t);
            g.lineTo(dot.x, dot.y);
        }
        g.stroke();
	},
}