
require("dotenv").config();

//Calls in the required node packages
var Spotify = require("node-spotify-api")
var request = require('request');
var moment = require('moment');
var fs = require("fs");

//Handles spotify keys within the .env file
var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });

//Sets up commands that user can enter.
var command = process.argv[2]
var searchValue = process.argv[3];

if (command === "concert-this") {
    bandSearch();
}
else if (command === "movie-this") {
    movieSearch();
}
else if (command === "do-what-it-says") {
    doWhatNow();
}
else if (command === "spotify-this-song") {
    musicSearch();
}

else {
    notRecognized();
}

//Bandsintown api request
function bandSearch() {

    let artistUrl = ("https://rest.bandsintown.com/artists/"+searchValue+"/events?app_id=codingbootcamp");

    request(artistUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {

        var data = JSON.parse(body)[0];


        console.log(`
${searchValue}'s next upcoming show is:
---------    
Venue: ${data.venue.name}
Location: ${data.venue.city}, ${data.venue.region}
Date: ${moment(data.datetime).format("MM/DD/YYYY")}
---------
        `)

        }
    })
}

//OMDB API search
function movieSearch() {
    let movieName = searchValue;

    if (searchValue == undefined) {
        movieName = "Mr. Nobody";
    }

    let movieUrl = ("http://www.omdbapi.com/?t="+movieName+"&y=&plot=short&apikey=trilogy");
    
    request(movieUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
        
            var data = JSON.parse(body)

            console.log(`
---------
Title: ${data.Title}
Year: ${data.Year}
IMDB Rating: ${data.Ratings[0].Value}
Rotten Tomatoes Rating: ${data.Ratings[1].Value}
Country: ${data.Country}
Language: ${data.Language}
Plot Summary: ${data.Plot}
Actors: ${data.Actors}
---------   
            `)
        }
    })
}

//Spotify API request
function musicSearch() {
    var songName = searchValue;
    
    if (searchValue == undefined) {
        songName = "The Sign Ace of Base"
    }

    spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        console.log(`
---------
Artist: ${data.tracks.items[0].artists[0].name}
Song Title: ${data.tracks.items[0].name}
Preview URL: ${data.tracks.items[0].preview_url}
Album: ${data.tracks.items[0].album.name}
---------
        `)
    })
}

// "Zhu Li, do the thing!"
function doWhatNow() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
          }

        var dataArray = data.split(",");
          
        command = dataArray[0];
        searchValue = dataArray[1];

        musicSearch();
    })
};

//In case the user enters a command other than the above
function notRecognized() {
    console.log("LIRI: I'm sorry, I didn't recognize that command.  Please see the Read Me for all available commands and try again.")
}