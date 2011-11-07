ColorExplorer.Views.Main = Backbone.View.extend({
	
	events:{
		"touchstart svg": "handle_touchstart",
		"touchmove svg": "handle_touchmove",
		"touchend svg": "handle_touchend",
		"mousedown svg": "handle_moseDown",
		"mousemove svg": "handle_move",
		"mouseup svg": "handle_moseUp"
	},
	
	tagName: "div",
	
	id: "main",
	
	initialize: function(){
		_.bindAll( this );
		
		this.mousePoint = { x:0, y:0 };
		this.touches;
		this.intervalID;
		this.svg;//the convas on which you render your magic 
		this.swipeSet = [];//most recent set of color representations from user interaction
		//the size of the ipad viewable area acocunting for Safari Chrome is about 750 * 930 (there's still maybe 10px of space on right and bottom with these dimensions)
		//interactice grid and the scrollbar; the interactive area
		this.viewRect = { top:0, right:750, bottom:930, left:0, gutterRight:35 }//ipad screen resolution
		this.scroller;
		this.colors = new ColorExplorer.Collections.Colors();
		
		this.unique = -1;
		this.render();
	},
	
	render:function(){
        $('body').append(this.el);

		$("#main").svg();

		this.viewRect.right = $( "svg" ).width();
		this.viewRect.bottom = $( "svg" ).height();

		/* note... this currently doesn't layout correctly with gutter. you needs to make some calculations based on a known gutter size*/
		this.grid = new ColorExplorer.Views.Grid({ 
			collection: this.colors, 
			width:100,
			gutter: 0,
			bottomGutter:150, 
			cols: Math.floor( ( this.viewRect.right - this.viewRect.gutterRight )/100 ),
			rows: Math.floor( this.viewRect.bottom/100 )
			 });
			
		this.svg = this.grid.svg = $("#main").svg('get');
		this.grid.render();//should create the grid. the scroller should only be rendered when there is more than one page.
		//create the scroller to scroll the grid
		this.scroller = new ColorExplorer.Views.Scroller( {
			scroller: this.svg.rect( this.viewRect.right-this.viewRect.gutterRight, 0, 100, this.viewRect.bottom, { fill:"#ccc" } ), 
			rect: this.viewRect,
			target: this.grid.grid
		});
	},
	
	handle_touchstart: function(e){
		if ( this.intervalID ) clearInterval( this.intervalID );
		this.intervalID = setInterval( this.update, 1 );//milliseconds
	},
	
	handle_touchmove: function(event){
		var e = event.originalEvent;//jquery, to save processing translates or clones the event, but not ALL of the event
		e.preventDefault();
		if( e.touches.length ){//could actually loop here and save in this.touches array
			this.mousePoint = this.scroller.mousePoint = { x:e.touches[0].pageX, y:e.touches[0].pageY };
		}
	},
	
	handle_touchend: function(e){
		clearInterval( this.intervalID );
	},
	
	
	handle_move: function(e){
		this.mousePoint = this.scroller.mousePoint = { x:e.pageX, y:e.pageY };
	},
	
	handle_moseDown: function(e){
		if ( this.intervalID ) clearInterval( this.intervalID );
		this.intervalID = setInterval( this.update, 1 );
	},
	
	handle_moseUp: function(e){
		clearInterval( this.intervalID );
	},
	
	handle_mouseout: function(e){
		console.log("mouseout")
		//clearInterval( this.intervalID );
	},
	
	handle_click: function(e){
		
	},
	
	fadeComplete: function( id ){//this callback does not work which is fristrating. I don't know why it won't work.
		console.log( id + " from fade complete" );
		var c = $("#"+id)
		$(c).animate( { svgOpacity: .1 }, 250 );
	},
	
	fadeOut: function( id ){
		
		console.log( id + " from fadeOut" );
		var c = $("#"+id)
		$(c).animate( { svgOpacity: 0 }, 25 );
		console.log( $("#"+id) );
	},
	
	circle: function( obj ){
		return this.svg.circle( obj.x, obj.y, obj.rad, {fill: obj.fill });
	},
	
	addCircle: function( pt ){
		c = this.circle( pt ); 
		this.unique ++;
		$(c).attr("id", this.unique );
		//this nesting sux. can't get the callbacks to work
		$(c).animate( { svgOpacity:1 }, 1000, function(){ $(this).animate( { svgOpacity: 0 }, 2000, function(){ $( this ).remove() } ) } );
		//$(c).fadeTo( 300, 1, this.fadeComplete( this.unique ) );
		this.swipeSet.push(c);
	},
	
	update:function(){
		if( this.mousePoint.x > this.viewRect.right-55 ) return;
		//see where the mouse is
		//will one overlap the previous? - don't draw
		//if not go ahead and draw
		var c, lastc;
		var pt, pt2;
		var dis;
		var rad = 25;
		
		//a random color
		var color = new Color({ hue: Math.random(), saturation:Math.random(), lightness:Math.random() });
		pt = { x: this.mousePoint.x, y: this.mousePoint.y, rad: rad, fill: color.hslToHex() }
		
		if( this.swipeSet.length ){
			lastc = this.swipeSet[ this.swipeSet.length-1 ];
			pt2 = { x: $(lastc).attr( "cx" ), y: $(lastc).attr( "cy" ) }
			dis = this.distanceBetweenPoints( pt, pt2 );
			if( dis > rad*2 ){
				this.colors.add( color );
				this.addCircle( pt );
			}
		}else{
			this.colors.add( color );
			this.addCircle( pt );
		}
			
	},
	
	distanceBetweenPoints: function( point1, point2 ){
		return Math.sqrt( this.squared(point2.x - point1.x) + this.squared(point2.y - point1.y) );
	},
	
	squared: function(num){ return num * num }
	
})