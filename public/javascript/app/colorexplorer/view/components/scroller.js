ColorExplorer.Views.Scroller = Backbone.View.extend({
	
	events:{
	},
	
	initialize: function(){
		
		_.bindAll( this );
			
		this.mousePoint = { x:0, y:0 };
		this.intervalID;
		this.scroller = this.options.scroller || null;
		this.rect = this.options.rect || null;//{top:, right:, bottom:, left:}
		this.target = this.options.target || null;//an svg grouping <g>
		this.currentPage = 0;
		this.pageHeight = 0;
		this.totalPages = 0; //passed by the newpage event
		$(this.scroller).attr("id", jQuery.Guid.New() );
		this.yOffset = 0;
		
		$(this.scroller).bind("mousedown", this.handleMousedown );
		$(this.scroller).bind("mouseup", this.handleMouseup );
		$(this.scroller).bind("mousemove", this.handleMousemove );
		$(this.scroller).bind("touchstart", this.handleMousedown );
		$(this.scroller).bind("touchend", this.handleMouseup );
		$(this.target).bind( "newPage", this.handleNewPage );
		
		this.num = -800;//testing
	},
	
	render: function(){
		
	},
	
	setPage: function( page, pageHeight ){
		
		if( page != this.currentPage ){
			$(this.target).animate( 
				{ svgTransform: 'translate(0 ' + ( - page * pageHeight ) + ')'},
			300 );
			this.currentPage = page;
		}
	},
	
	handleNewPage: function(e,page,pageHeight,totalPages){
		this.setPage(page,pageHeight);
		this.pageHeight = pageHeight;
		this.totalPages = totalPages;
	},
	
	handleMousedown: function(){
		console.log( "scroller mousedown" );
		if ( this.intervalID ) clearInterval( this.intervalID );
		this.intervalID = setInterval( this.update, 100 );//milliseconds
	},
	
	handleMousemove: function(e){
		this.mousePoint = { x:e.pageX, y:e.pageY };
	},
	
	update: function(){
		console.log("UPDATE");
		var percent = this.mousePoint.y/this.rect.bottom;
		var whichPage = Math.round( this.totalPages * percent );
		this.setPage( whichPage, this.pageHeight )
		console.log( "--" );
		console.log( "this.totalPages", this.totalPages );
		console.log( "percent", percent );
		console.log( "whichPage", whichPage );
		
		
	},
	
	handleMouseup: function(e){
		if ( this.intervalID ) clearInterval( this.intervalID );
	}
})