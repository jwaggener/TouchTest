var Utilities = {};
Utilities.colorUtils = {
	
	compliment: function (c) {
		
		var rgb = Utilities.colorUtils.toRGBhash( c );//{ r:00, g:00, b:00 }
		var r = rgb.r/255;//0,1,3,.03,.0333
		var g = rgb.g/255;
		var b = rgb.b/255;
		
		var hsl
		var h,s,l
		var h2
		
		hsl = Utilities.colorUtils.toHSL( c );
		h = hsl.hue;
		s = hsl.saturation;
		l = hsl.lightness
		
		// Calculate the opposite hue, h2
		h2 = h + 0.5;

		if (h2 > 1){
		  h2 -= 1;
		};
		
		//convert this back to RGB ex. 0.5, 1, .8
		var $var_1, $var_2
		if (s == 0){
			r = l * 255;
			g = l * 255;
			b = l * 255;
		}else{
			if (l < 0.5){
				$var_2 = l * (1 + s);
			}else{
				$var_2 = (l + s) - (s * l);
			};

			$var_1 = 2 * l - $var_2;
			r = 255 * Utilities.colorUtils.hue_2_rgb($var_1,$var_2,h2 + (1 / 3));
			g = 255 * Utilities.colorUtils.hue_2_rgb($var_1,$var_2,h2);
			b = 255 * Utilities.colorUtils.hue_2_rgb($var_1,$var_2,h2 - (1 / 3));
		};

		//then back to hex
		var rhex, ghex, bhex, rgbhex

		rhex = Utilities.colorUtils.decimalToHex( Math.round(r),2)
		ghex = Utilities.colorUtils.decimalToHex(Math.round(g),2)
		bhex = Utilities.colorUtils.decimalToHex(Math.round(b),2)

		rgbhex = rhex.toString() + ghex.toString() + bhex.toString();
		return rgbhex;
	},
	
	//takes {hue:, saturation:, lightness:} in decimals and converts to something css can use.
	hslToHex: function( c ){
		
		var h, s, l
		var r, g, b
		var $var_1, $var_2
		
		h = c.hue;
		s = c.saturation;
		l = c.lightness;
		
		//convert this back to RGB ex. 0.5, 1, .8
		var $var_1, $var_2
		if (s == 0){
			r = l * 255;
			g = l * 255;
			b = l * 255;
		}else{
			if (l < 0.5){
				$var_2 = l * (1 + s);
			}else{
				$var_2 = (l + s) - (s * l);
			};

			$var_1 = 2 * l - $var_2;
			r = 255 * Utilities.colorUtils.hue_2_rgb($var_1,$var_2,h + (1 / 3));
			g = 255 * Utilities.colorUtils.hue_2_rgb($var_1,$var_2,h);
			b = 255 * Utilities.colorUtils.hue_2_rgb($var_1,$var_2,h - (1 / 3));
		};
		
		//then back to hex
		var rhex, ghex, bhex, rgbhex

		rhex = Utilities.colorUtils.decimalToHex( Math.round(r),2)
		ghex = Utilities.colorUtils.decimalToHex(Math.round(g),2)
		bhex = Utilities.colorUtils.decimalToHex(Math.round(b),2)

		rgbhex = rhex.toString() + ghex.toString() + bhex.toString();
		
		return "#" + rgbhex;
		
	},
	
	toRGBhash: function (c) {	
		var red, green, blue;
		if (c.substr(0, 1) === '#')
		{
			red = Utilities.colorUtils.hexToR(c);
			green = Utilities.colorUtils.hexToG(c);
			blue = Utilities.colorUtils.hexToB(c);
		}
		else if (c.indexOf('rgb') > -1)
		{
			var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(c);
			var red = parseInt(digits[2]);
			var green = parseInt(digits[3]);
			var blue = parseInt(digits[4]);
		}else{
			return 'color is not a recognized format.'
		}
		return { r:red, g:green, b:blue };
	},
	
	toHSL: function ( c ) {

		var color
		var r, g, b
		var h,s,l
		var del_r, del_g, del_b
		var min, max
		var delMax

		color = Utilities.colorUtils.toRGBhash( c );// returns { r:00, g:00, b:00 } for example
		r = color.r/255;//example 0,1,3,.03,.0333
		g = color.g/255;
		b = color.b/255;

		min = Math.min(r,g,b);
		max = Math.max(r,g,b);
		delMax = max - min;

		l = (max + min) / 2;

		if (max == 0)
		{
			h = 0;
			s = 0;
		}else{
			if ( l < 0.5 ){
				s = delMax / (max + min);
			}else{
				s = delMax / (2 - max - min);
			};

			del_r = (((max - r) / 6) + (delMax / 2)) / delMax;
			del_g = (((max - g) / 6) + (delMax / 2)) / delMax;
			del_b = (((max - b) / 6) + (delMax / 2)) / delMax;

			if (r == max){
				h = del_b - del_g;
			}else if (g == max){
				h = (1 / 3) + del_r - del_b;
			}else if (b == max){
				h = (2 / 3) + del_g - del_r;
			};
			if (h < 0){
				h += 1;
			};
			if (h > 1){
				h -= 1;
			};
		};

		return { hue: h , saturation: s , lightness: l }; //{ hue: 1, saturation: .5 , lightness: .5 } for example
	},
	
	//the rest are helper functions. you may never use them directly
	//returns a result between 0 - 255
	hexToR: function (h) {return parseInt((Utilities.colorUtils.cutHex(h)).substring(0,2),16)},
	hexToG: function(h) {return parseInt((Utilities.colorUtils.cutHex(h)).substring(2,4),16)},
	hexToB: function(h) {return parseInt((Utilities.colorUtils.cutHex(h)).substring(4,6),16)},
	cutHex: function(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h},
	
	hue_2_rgb: function ($v1,$v2,$vh) {
		if ($vh < 0){
			$vh += 1;
		};

		if ($vh > 1){
			$vh -= 1;
		};

		if ((6 * $vh) < 1){
			return ($v1 + ($v2 - $v1) * 6 * $vh);
		};

		if ((2 * $vh) < 1){
			return ($v2);
		};

		if ((3 * $vh) < 2){
			return ($v1 + ($v2 - $v1) * ((2 / 3 - $vh) * 6));
		};

		return ($v1);
	},
	
	decimalToHex: function (d, padding) {
	    var hex = Number(d).toString(16);
	    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

	    while (hex.length < padding) {
	        hex = "0" + hex;
	    }

	    return hex;
	}
}