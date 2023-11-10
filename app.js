const express = require('express');
const axios = require('axios'); // Use the axios library
const app = express();
const port = 8080;

// Spotify API credentials
const clientId = '54fc5ed1a1ab427cae1f29d9029bb383';
const clientSecret = '500bed3f801f476fb1de49973b135bdb';


// Function to get an access token
async function getAccessToken() {
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 
    'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (tokenResponse.status === 200) {
      return tokenResponse.data.access_token;
    } else {
      throw new Error('Failed to get access token');
    }
  } catch (error) {
    throw new Error('Failed to get access token: ' + error.message);
    
  }
}

// search informasi lagu berdasarkan track lagu atau audio analysis
app.get('/api/track-info/:trackId', async (req, res) => {
    const trackId = req.params.trackId; // Get the track ID from the URL parameter
    console.log('im in track info')
  
    if (!trackId) {
      return res.status(400).json({ error: 'Track ID is required' });
    }
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const apiUrl = `https://api.spotify.com/v1/tracks/${trackId}`;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        res.json(response.data);
      } else {
        res.status(response.status).json({ error: 'Failed to fetch track information' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
app.listen(8080,() => {console.log('Server is running on port 8080')})
app.get("/api/hello", (req,res) => {
    res.json({ message:'tugas SpotifyAPI'});
} );

// Route to get song recommendations
app.get('/api/recommendations', async (req, res) => {
    const seedArtists = '4NHQUGzhtTLFvgF5SZesLK'; // Replace with actual artist IDs
    const seedGenres = 'rock'; // Replace with actual genre
    const seedTracks = '0c6xIDDpzE81m2q797ordA'; // Replace with actual track IDs
    const limit = 10; // Number of recommendations to retrieve
  
    const accessToken = await getAccessToken();
  
    if (!accessToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    const apiUrl = `https://api.spotify.com/v1/recommendations?seed_artists=${seedArtists}&seed_genres=${seedGenres}&seed_tracks=${seedTracks}&limit=${limit}`;
  
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
  
      if (response.status === 200) {
        res.json(response.data);
      } else {
        res.status(response.status).json({ error: 'Failed to fetch song recommendations' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });