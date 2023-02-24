var request = require('request');
var cheerio = require('cheerio');

let artist = process.argv[2];


request('https://www.popvortex.com/music/charts/top-rap-songs.php', function (error, response, html) {
    console.log(artist);
	if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        // Not to be confused with forEach, this is jQuery
        $('td.title').each(function(i, element) {
            if (i % 2 == 1 && i < 20) {
                console.log($(this).text());
            }
        });
	}
});