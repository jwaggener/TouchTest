var Color = Backbone.Model.extend({
	defaults:{
		color: "#ccccff"//kind of a light purple
	},
	
    url : function() {
      var base = 'color';
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
    },
	
	hslToHex: function(){//a simple porxy so that it's all contained on the model
	
		if( this.get("hue") && this.get("saturation") && this.get("lightness") ){
			return Utilities.colorUtils.hslToHex ( { hue: this.get("hue") , saturation: this.get("saturation"), lightness: this.get("lightness") } );
		}
		
		return null;
	}
	
});