const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const port = process.env.PORT || 3000;

const CLIENT_ID = 'Ov23liiJwpCt2MVb19WH';  // Replace with your GitHub client ID
const CLIENT_SECRET = 'fb53483e1f95f96ee3ed2560d354dab17770d7d1';  // Replace with your GitHub client secret
const REDIRECT_URI = 'https://yourdomain.com/callback';  // Replace with your redirect URL

// Serve static files (like your admin portal)
app.use(express.static('public'));

// Route to check if user is logged in
app.get('/check-login-status', (req, res) => {
  const user = req.session?.user;  // Assuming you're using sessions
  if (user) {
    res.json({ loggedIn: true, profile: user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Route to handle the GitHub callback
app.get('/callback', async (req, res) => {
  const code = req.query.code;  // GitHub sends the code in the query string

  if (!code) {
    return res.status(400).send('Missing code');
  }

  try {
    // Step 1: Exchange the code for an access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', querystring.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI,
    }), {
      headers: {
        'Accept': 'application/json'
      }
    });

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.status(400).send('Error getting access token');
    }

    // Step 2: Use the access token to fetch the user's GitHub profile
    const profileResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const userProfile = profileResponse.data;

    // Step 3: Store user data (this is just an example; you would likely use a session or database)
    req.session.user = {
      username: userProfile.login,
      profileImage: userProfile.avatar_url
    };

    // Redirect to the admin portal
    res.redirect('/admin');
  } catch (err) {
    console.error('Error during GitHub callback', err);
    res.status(500).send('Internal Server Error');
  }
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy();  // Assuming you're using sessions
  res.redirect('/');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
