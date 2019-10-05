require("dotenv").config();

let request = require("request");
const moment = require("moment");
const fs = require("fs");
// link keys
const keys = require("./keys.js");
// initialize axios
const axios = require("axios");
// initialize spotify
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
// OMDB and Bands in Town API
let omdb = (keys.omdb);
let bandsintown = (keys.bandsintown);
// Take user input
let appCommand = process.argv[2];
let userSearch = process.argv.slice(3).join(" ");
// App logic
function userCommand(appCommand, userSearch) {
    // take command and make decision
    switch (appCommand) {
        case "concert-this":
            concertThis(userSearch);
            break;
        case "spotify-this":
            spotifyThisSong(userSearch);
            break;
        case "movie-this":
            movieThis(userSearch);
            break;
        case "do-this":
            doThis(userSearch);
            break;
        default:
            console.log("No Comprende");
            break;
    }
}
userCommand(appCommand, userSearch);
function concertThis(artist) {
    if (!artist) {
    artist = userSearch;
    };
    const bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    axios.get(bandQueryURL).then(
        function (response) {
            console.log("=============");
            // console.log(response);
            console.log("Name of the Venue: " + response.data[0].venue.name + "\r\n");
            console.log("Venue Location: " + response.data[0].venue.city + "\r\n");
            console.log("Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\r\n");

            const logConcert = "===Begin concert log entry===" + "\nName of the musician: " + artist + "\nName of the Venue: " + "\r\n"

            fs.appendFile("log.txt", logConcert, function (err) {
                if (err) throw err;
            });
            logResults(response)
        }
    )
};
// function spotifyThisSong() {
// Spotify API
function spotifyThisSong(songName) {
    const spotify = new Spotify(keys.spotify);
    console.log("Spotify key: " + spotify);
    if (!songName) {
        songName = userSearch;
    };
    console.log("SongName if not a song name: " + songName);
    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        }
        console.log("Data for searched song: " + data.tracks.items[0]);
        console.log("=====================");
        //return song and artists info
        console.log("Artist(s) Name: " + data.tracks.items[0].album.artists[0].name + "\r\n");
        console.log("Song Name: " + data.tracks.items[0].name + "\r\n");
        console.log("Song Preview Link: " + data.tracks.items[0].href + "\r\n");
        console.log("Album: " + data.tracks.items[0].album.name + "\r\n");

         let logSong = "===Begin Spotify Log Entry===" + "\nArtist: " + data.tracks.items[0].album.artists[0].name + "\r\n"

         fs.appendFile("log.txt", logSong, function (err) {
             if (err) throw err;
         });
         logResults(data)
    });
};
function movieThis(movie){
    if (!movie) {
        movie = userSearch;
    }
    let movieQueryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=c21b2973";
    console.log(movieQueryURL);

    axios.request(movieQueryURL).then(
        function (response) {
            console.log(response.data);
            console.log("===========================");
            console.log("* Title: " + response.data.Title + "\r\n");
            console.log("* Year Released: " + response.data.Year + "\r\n");
            console.log("* IMDB Rating: " + response.data.imdbRating + "\r\n");
            console.log("* Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
            console.log("* Country Where Produced: " + response.data.Country + "\r\n");
            console.log("* Language: " + response.data.Language + "\r\n");
            console.log("* Plot: " + response.data.Plot + "\r\n");
            console.log("* Actors: " + response.data.Actors + "\r\n");

            // let logMovie = "===Begin Movie Log Entry===" + "\nTitle: " + "\nYear Released: " + "\r\n"

            // fs.appendFile("log.txt", logMovie, function (err) {
            //     if (err) throw err;
            // });
            // logResults(data)
        }
    )
};
function doThis() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            return console.log(error);

        } else {
            console.log(data);
            const randomData = data.split(',');
            liriRun(randomData[0], randomData[1]);
        }
    });
};
function logResults(data) {
    fs.appendFile('log.txt', data, function (err) {
        if (err) throw err;
    });
};
