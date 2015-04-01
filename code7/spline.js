function Vector4(x, y, z, w) {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.w = 0;
	this.setAll(x, y, z, w);
}
Vector4.prototype = {
	setAll : function(x, y, z, w) {
		if (x !== undefined) this.x = x;
		if (y !== undefined) this.y = y;
		if (z !== undefined) this.z = z;
		if (w !== undefined) this.w = w;
	},
	set : function(index, value) {
		switch(index) {
			case 0:
				this.x = value;
				break;
			case 1:
				this.y = value;
				break;
			case 2:
				this.z = value;
				break;
			case 3:
				this.w = value;
				break;
		}
	}
}

function Hermite() {
    this.M = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    this.V = new Vector4(0,0,0,0);
    this.C = [0,0,0,0];
}
Hermite.prototype = {
    setColumn : function(column, coefficients){
        //alert(column);
        this.M[0][column] = coefficients.x;
        this.M[1][column] = coefficients.y;
        this.M[2][column] = coefficients.z;
        this.M[3][column] = coefficients.w;
        //alert(this.M[1][column]);
    },
    setPositions : function(begin, end){
    	this.V.set(0, begin);
    	this.V.set(1, end);
    },
    setRates : function(begin, end){
    	this.V.set(2, begin);
    	this.V.set(3, end);
    },
    getCoefficients : function(){
    	var temp = [this.V.x, this.V.y, this.V.z, this.V.w];
    	for(var i=0;i<4;i++){
    		var value = 0;
    		for(var j=0;j<4;j++){
    			value += this.M[i][j] * temp[j];
    		}
    		this.C[i] = value;
    	}
    },
    getCoordinate : function(t){
    	//var coefficients = this.getCoefficients();
    	var res = 0;
    	for(var i=0;i<4;i++){
    		res += this.C[i] * Math.pow(t,3-i);
    	}
    	return res;
    }
}



