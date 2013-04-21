//https://www.googleapis.com/blogger/v3/blogs/8018322669329800421/posts?key=AIzaSyDigRVAKHvJomBgQgfOA7fXqnOSv2u5sfI
$(document).ready(function() {
	// Handler for .ready() called.
	var url = 'https://www.googleapis.com/blogger/v3/blogs/8018322669329800421/posts?key=AIzaSyDigRVAKHvJomBgQgfOA7fXqnOSv2u5sfI';
	$.getJSON(url, function(data) {

		$.each(data.items, function(key, val) {
			$('<div class="post"><h4>' + val.title + '</h4><div>' + val.content + '</div><div style="clear:both;"></div></div>', {
				'class': 'post'
			}).appendTo('#homePosts');
		});

	});
});