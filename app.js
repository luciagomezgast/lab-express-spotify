require('dotenv').config();


const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get('/', (req, res, next)=>{
    res.render('home')
})

app.get('/artist-search', (req,res, next)=>{
    spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists);
    res.render('artist', data.body.artists)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res, next)=>{
    let id = req.params.id
    spotifyApi
    .getArtistAlbums(id)
    .then(artist => {
      res.render('albums', artist.body)
    })
    .catch(err => next(err));

})

app.get('/tracks/:trackId',(req, res,next)=>{
   let track = req.params.trackId
    spotifyApi
    .getAlbumTracks(track)
    .then(album => {
      res.render('tracks', album.body)
    })
    .catch(err => next(err));

})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
