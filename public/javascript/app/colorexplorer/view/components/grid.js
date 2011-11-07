ColorExplorer.Views.Grid = Backbone.View.extend({
	
	events:{
		
	},
	
	initialize: function(){
		
		/*
		custom events:
			newPage - triggered when a new page is added; this.totalPages is sent along as data
		*/
		
		this.colors = this.options.collection;
		this.svg;//the canvas
		this.grid;//a g tag holding all the interactive objects
		this.interactiveObjects ={};//a hash of all the interactive objects
		
		this.shape = this.options.shape || 'square';
		
		//layout info
		this.startX = this.options.x || 0;
		this.gutter = this.options.gutter || 0;
		this.bottomGutter = this.options.bottomGutter || 0;
		this.pt = { x:this.startX , y:0 };
		this.rect = [ 0, 0, 500, 500 ];
		this.cols = this.options.cols || 5;
		this.rows = this.options.rows || 1;
		this.itemWidth = this.options.width || 25;
		this.itemHeight = this.options.height || this.itemWidth;
		this.maxX = this.startX + this.itemWidth * this.cols + this.gutter * this.cols;
		
		this.currentColumn = 0, this.currentRow = 0; this.totalPages = 0; this.currentPage = 0;
		
		this.pageHeight = this.rows * this.itemHeight + this.bottomGutter;
		
		_.bindAll( this );//ensures 'this' refers to this instance of this object
		this.colors.bind( "change", this.render );
		this.colors.bind( "add", this.render );
		this.colors.bind( "remove", this.render );

		this.render();
	},
	
	render:function(){
		//var out;
		//out = _.template( ColorExplorer.templates.grid, { colors: this.colors } );
		//console.log("out",out);
		if( this.svg ){
			if(!this.grid) this.grid = this.svg.group("grid");
			_.each( this.colors.models, function( color ) { 
				if( !this.interactiveObjects[ color.cid ] ){ 
					this.interactiveObjects[ color.cid ] = this.svg.rect( this.grid, this.pt.x, this.pt.y, this.itemWidth, this.itemHeight, { fill: color.hslToHex() } );
					$( this.interactiveObjects[ color.cid ] ).animate( { svgOpacity:1 }, 1000 );
					this.incrementColumn(); 
					} 
				}, this ) ;
		} 
		
	},
	
	incrementColumn: function(numCols){
		var cols = numCols || 1;
		this.currentColumn += cols;
		this.pt.x += cols * this.itemWidth + cols * this.gutter;
		//if the item would be located past the max x , the start a new row
		if(this.pt.x >= this.maxX){
			this.currentColumn = 0;
			this.pt.x = this.startX;
			this.incrementRow();
		}
	},
	
	incrementRow: function(numRows){
		var rows = numRows || 1;
		this.currentRow += rows;
		//if you are exceeding the number of rows, create a page
		//this just means you place a margin at the bottom and then start a new row
		if( this.currentRow % this.rows == 0 ){
			this.totalPages += 1;
			this.pt.y += rows * this.itemHeight + rows * this.gutter + this.bottomGutter;
			console.log("triggering");
			$(this.grid).trigger( 'newPage', [ this.totalPages, this.pageHeight, this.totalPages ] );
		}else{
			this.pt.y += rows * this.itemHeight + rows * this.gutter;
		}	
	},
	
	setPage: function(){
		
	}
	
});