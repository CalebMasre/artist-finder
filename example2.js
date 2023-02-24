var request = require('request');
var cheerio = require('cheerio');


request('https://news.ycombinator.com', function (error, response, html) {
	if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var total = 0;
        $('span.score').each(function(i, element) {
        	var points = parseInt($(this).text().replace(' points', ''));
        	total += points;
        	console.log(points);
        });
        console.log("The total points on this page are: " + String(total));
	}
});