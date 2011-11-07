ColorExplorer.templates = {
	
	grid: '<% _.each(colors.models, function(color) { %> <rect x="20" y="20" rx="0" ry="0" width="160" height="160" fill="<%= color.hslToHex() %>" /> <% }); %>'
	
}