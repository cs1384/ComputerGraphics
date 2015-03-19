
	function Matrix4() {
    	this.M = [[0,0,0,0],
    			  [0,0,0,0],
    			  [0,0,0,0],
    			  [0,0,0,0]];
      this.identity();
	}

	Matrix4.prototype = {
		copy : function(m) {
			for(var i=0;i<4;i++) {
 				for(var j=0;j<4;j++) {
 					this.M[i][j] = m.M[i][j];
 				}
 			}
		},

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
			//alert(this.M);
      	},

      	translate : function(x, y, z) {
      		this.M[0][3] = x;
      		this.M[1][3] = y;
      		this.M[2][3] = z;
      		//alert(this.M);
      	},

      	rotateX : function(theta) {
      		this.M[1][1] = Math.cos(theta)
      		this.M[1][2] = -Math.sin(theta)
      		this.M[2][1] = Math.sin(theta)
      		this.M[2][2] = Math.cos(theta)
      		//alert(this.M);
      	},

      	rotateY : function(theta) {
      		this.M[0][0] = Math.cos(theta)
      		this.M[0][2] = -Math.sin(theta)
      		this.M[2][0] = Math.sin(theta)
      		this.M[2][2] = Math.cos(theta)
		},

		rotateZ : function(theta) {
      		this.M[0][0] = Math.cos(theta)
      		this.M[0][1] = -Math.sin(theta)
      		this.M[1][0] = Math.sin(theta)
      		this.M[1][1] = Math.cos(theta)
		},

		scale : function(x, y, z) {
			this.M[0][0] = x;
			this.M[1][1] = y;
			this.M[2][2] = z;
		},

		transform : function(src, dst){
			newX = this.M[0][0] * src.x + this.M[0][1] * src.y + this.M[0][2] * src.z + this.M[0][3];
			newY = this.M[1][0] * src.x + this.M[1][1] * src.y + this.M[1][2] * src.z + this.M[1][3];
			newZ = this.M[2][0] * src.x + this.M[2][1] * src.y + this.M[2][2] * src.z + this.M[2][3];
			dst.x = newX; 
			dst.y = newY;
			dst.z = newZ;
			//alert(dst.y);
		}

  }

    
