var cheerio = require('cheerio');
var request = require('request');
var nodemailer = require('nodemailer');

let jsonData = require("./credentials.json");

let artists = [];
var words = [];
var words2 = [];
var foundItems = [];
var found = false;

//pushes all artist named in command line to an array
process.argv.forEach(function(element, index) {
    if(index >= 2) {
        artists.push(element);
    }
});



if(process.argv[2] == undefined) {
    console.log("You did not specify an artist(s)");
} else {
    request('https://www.popvortex.com/music/charts/top-rap-songs.php' , function(error, response, html) {
        if(!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            artists.forEach(function(artist) {
                $('em.artist').each(function(i, element) {  
                    if(i<25){
                        words = $(this).text().split(" ");
                        word2 = $(this).siblings('cite.title').text().replaceAll("[", "");
                        word2 = word2.replaceAll("]", "");
                        word2 = word2.replaceAll("(", "");
                        word2 = word2.replaceAll(")", "");
                        words2 = word2.split(" ");
                        if(words2.includes(artist)) {
                            foundItems.push($(this).text() +": " + $(this).siblings('cite.title').text());
                            found = true;
                        }

                        if (found == false) {
                            if(words.includes(artist)){
                                foundItems.push($(this).text() +": " + $(this).siblings('cite.title').text());
                            }
                        }
                            found = false;
                    }
                })
            })
            if(foundItems.length == 0) {
                console.log("No Songs were found by the specified artist(s). No email will be sent out.")
            } else {
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: jsonData.sender_email,
                        pass: jsonData.sender_password
                    }

                });
                var subjectText = "";
                artists.forEach(function(artist, i){
                    if(i == 0)
                        subjectText = artist
                    else
                        subjectText = subjectText + " and " + artist
                });
                var bodytext = "";
                foundItems.forEach(function(element){
                    var spot = element.indexOf(":")
                    element = element.substring(0,spot+1).bold() + element.substring(spot+1, element.length)
                    bodytext = bodytext + element + "\n"
                });


                let mailOptions = {
                    from: jsonData.from,
                    to: jsonData.to,
                    subject: "Your artists are: " + subjectText,
                    text: bodytext
                };
                transporter.sendMail(mailOptions);
                console.log("Email was sent");
            }
        }
    });
}




