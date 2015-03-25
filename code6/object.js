function Object() {
	this.vertices = [];
    this.effectiveV = [];
    this.edges = [];
}
Object.prototype = {
	addVertex : function(vertex){
		this.vertices.push(vertex);
		this.effectiveV.push(vertex);
		//this.effectiveV.push(new Vector3(vertex.x, vertex.y, vertex.z));
	},
	changeVertex : function(idx, vertex){
		this.vertices[idx] = vertex;
		this.effectiveV[idx] = vertex
	},
	addEdge : function(idx1, idx2){
		this.edges.push([idx1, idx2]);
	},
	transform : function(matrix){
		for(var i=0;i<this.vertices.length;i++){
			matrix.transform(this.vertices[i], this.effectiveV[i]);
		}
	},
	draw : function(g, color, converterX, converterY, height, width){
		g.strokeStyle = color;
		for(var i=0;i<this.edges.length;i++){
			g.beginPath();

			var v = this.effectiveV[this.edges[i][0]];
			var x = converterX(v.x, width);
			var y = converterY(v.y, width, height);
			g.moveTo(x,y);

			v = this.effectiveV[this.edges[i][1]];
			x = converterX(v.x, width);
			y = converterY(v.y, width, height);
			g.lineTo(x,y);
			
			g.stroke();
		}
	}
}

function Pyramid() {
	this.set();
}
Pyramid.prototype = {
	set : function(){
		this.obj = new Object();
		this.obj.addEdge(0,1);
   		this.obj.addEdge(1,2);
   		this.obj.addEdge(2,3);
   		this.obj.addEdge(3,0);
   		this.obj.addEdge(0,4);
   		this.obj.addEdge(1,4);
   		this.obj.addEdge(2,4);
   		this.obj.addEdge(3,4);
	},
	addVertex : function(vertex){
		this.obj.addVertex(vertex);
	},
	changeVertex : function(idx, vertex){
		this.obj.changeVertex(idx, vertex);	
	},
	transform : function(matrix){
		this.obj.transform(matrix);
	},
	draw : function(g, color, converterX, converterY, height, width){
		this.obj.draw(g, color, converterX, converterY, height, width);
	}
}

function Cube() {
	this.set();
}
Cube.prototype = {
	set : function(){
		this.obj = new Object();
		this.obj.addEdge(0,1);
   		this.obj.addEdge(1,2);
   		this.obj.addEdge(2,3);
   		this.obj.addEdge(3,0);

   		this.obj.addEdge(4,5);
   		this.obj.addEdge(5,6);
   		this.obj.addEdge(6,7);
   		this.obj.addEdge(7,4);

   		this.obj.addEdge(0,4);
   		this.obj.addEdge(1,5);
   		this.obj.addEdge(2,6);
   		this.obj.addEdge(3,7);
	},
	addVertex : function(vertex){
		this.obj.addVertex(vertex);
	},
	changeVertex : function(idx, vertex){
		this.obj.changeVertex(idx, vertex);	
	},
	transform : function(matrix){
		this.obj.transform(matrix);
	},
	draw : function(g, color, converterX, converterY, height, width){
		this.obj.draw(g, color, converterX, converterY, height, width);
	}
}

function Square(){
	this.set();
}
Square.prototype = {
	set : function(){
		this.obj = new Object();
		this.obj.addEdge(0,1);
   		this.obj.addEdge(1,2);
   		this.obj.addEdge(2,3);
   		this.obj.addEdge(3,0);
	},
	addVertex : function(vertex){
		this.obj.addVertex(vertex);
	},
	changeVertex : function(idx, vertex){
		this.obj.changeVertex(idx, vertex);	
	},
	transform : function(matrix){
		this.obj.transform(matrix);
	},
	draw : function(g, color, converterX, converterY, height, width){
		g.fillStyle = color;
		g.beginPath();
		
		var v = this.obj.effectiveV[this.obj.edges[0][0]];
		//alert(v.x);
		//alert(v.y);
		var x = converterX(v.x, width);
		var y = converterY(v.y, width, height);
		g.moveTo(x,y);

		v = this.obj.effectiveV[this.obj.edges[0][1]];
		x = converterX(v.x, width);
		y = converterY(v.y, width, height);
		g.lineTo(x,y);

		for(var i=1;i<this.obj.edges.length;i++){
			v = this.obj.effectiveV[this.obj.edges[i][0]];
			x = converterX(v.x, width);
			y = converterY(v.y, width, height);
			g.lineTo(x,y);

			v = this.obj.effectiveV[this.obj.edges[i][1]];
			x = converterX(v.x, width);
			y = converterY(v.y, width, height);
			g.lineTo(x,y);
		}
		g.fill();
		g.closePath();
		//g.stroke();
	}
}


