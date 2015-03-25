function Matrix4() {
this.M = [[0,0,0,0],
		  [0,0,0,0],
		  [0,0,0,0],
		  [0,0,0,0]];
this.identity();
}
Matrix4.prototype = {
    identity : function() {
        for(var i=0;i<4;i++) {
        	for(var j=0;j<4;j++) {
        		if(i==j){
        			this.M[i][j] = 1;
        		}else{
        			this.M[i][j] = 0;
        		}
        	}
        }
    },
    copy : function(matrix){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                this.M[i][j] = matrix.M[i][j];
            }
        }
    },
    multiply : function(matrix){
        var m = new Matrix4();
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                var temp = 0;
                for(var k=0;k<4;k++){
                    temp += this.M[k][i] * matrix.M[j][k];
                }
                m.M[i][j] = temp;
            }
        }
        this.copy(m);
    },
    translate : function(x, y, z) {
        var m = new Matrix4();
        
		this.M[0][3] = x;
		this.M[1][3] = y;
		this.M[2][3] = z;
        /*
        m.M[0][3] = x;
        m.M[1][3] = y;
        m.M[2][3] = z;
        this.multiply(m);
        */
    },
    rotateX : function(theta) {
        var m = new Matrix4();
		m.M[1][1] = Math.cos(theta)
		m.M[1][2] = -Math.sin(theta)
		m.M[2][1] = Math.sin(theta)
		m.M[2][2] = Math.cos(theta)
        this.multiply(m);
    },
    rotateY : function(theta) {
        var m = new Matrix4();
		m.M[0][0] = Math.cos(theta)
		m.M[0][2] = -Math.sin(theta)
		m.M[2][0] = Math.sin(theta)
		m.M[2][2] = Math.cos(theta)
        this.multiply(m);
    },
    rotateZ : function(theta) {
        var m = new Matrix4();
		m.M[0][0] = Math.cos(theta)
		m.M[0][1] = -Math.sin(theta)
		m.M[1][0] = Math.sin(theta)
		m.M[1][1] = Math.cos(theta)
        this.multiply(m);
    },
    scale : function(x, y, z) {
        var m = new Matrix4();
    	m.M[0][0] = x;
    	m.M[1][1] = y;
    	m.M[2][2] = z;
        this.multiply(m);
    },
    transform : function(src, dst){
    	newX = this.M[0][0] * src.x + this.M[0][1] * src.y + this.M[0][2] * src.z + this.M[0][3];
    	newY = this.M[1][0] * src.x + this.M[1][1] * src.y + this.M[1][2] * src.z + this.M[1][3];
    	newZ = this.M[2][0] * src.x + this.M[2][1] * src.y + this.M[2][2] * src.z + this.M[2][3];
        newZ = this.M[3][0] * src.x + this.M[3][1] * src.y + this.M[3][2] * src.z + this.M[3][3];
    	dst.x = newX / newZ; 
    	dst.y = newY / newZ;
    	dst.z = newZ / newZ;
    },
    perspective : function(x, y, z){
        var m = new Matrix4();
        m.M[3][0] = x;
        m.M[3][1] = y;
        m.M[3][2] = z;
        this.multiply(m);
    }
}


