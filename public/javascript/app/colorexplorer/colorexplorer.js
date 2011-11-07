var ColorExplorer = {
    Views: {},
    Routers: {},
	Collections: {},
    init: function() {
		console.log("init the app");
		new ColorExplorer.Routers.Colors();
        Backbone.history.start();
    }
};