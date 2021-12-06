import express from 'express';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import { createApi } from 'unsplash-js';
import { createClient } from 'pexels';
var router = express.Router();

main().catch(err => console.log(err));

const unsplash = createApi({
    accessKey: 'QZW4AaEVgbg7xXDgkiyPTxR0yNcaFZ_pwWz5E-ffJE4',
    fetch: fetch
});

const pexelClient = createClient('563492ad6f91700001000001ff1e428d3a5b4709897e430b5bc0d401');

const NOT_LOGGED_IN = "not logged in";

let User;
let Image;

async function main() {
  const LOCAL_URI = 'mongodb://localhost:27017/pictureperfect';
  const ONLINE_URI = 'mongodb+srv://bvt:Password123@info-441.ctuvu.mongodb.net/info-441?retryWrites=true&w=majority'

  await mongoose.connect(ONLINE_URI);

  const userSchema = new mongoose.Schema({
    username: String,
    favorites: [
      {
        name: String,
        url: String,
        date: { type: Date, default: Date.now },
      }
    ],
  });
  User = mongoose.model("User", userSchema)
}

router.get('/imagesUnsplash', async function(req, res, next) {
    try {
        let response = await unsplash.search.getPhotos({
            query: req.query.term,
            page: 1,
            perPage: 15,
            orientation: 'landscape'
        });
        let result = [];
        for (const photo of response.response.results) {
            let newEntry = {};
            newEntry['id'] = photo.id + 'unsplash';
            newEntry['downloadLink'] = photo.links.download;
            newEntry['url'] = photo.links.html;
            newEntry['preview'] = photo.urls.regular;
            result.push(newEntry);
        } 
        res.send(result);
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({status: "error", error: error}));
    }
});

router.get('/imagesPexel', async function (req, res, next) {
  try {
    let response = await pexelClient.photos.search({
        query: req.query.term,
        page: 1,
        per_page: 15,
        orientation: 'landscape'
    });
    let result = [];
    for (const photo of response.photos) {
        let newEntry = {};
        newEntry['id'] = photo.id + 'pexel';
        //download link here needs to be fixed
        newEntry['downloadLink'] = photo.url;
        newEntry['url'] = photo.url;
        newEntry['preview'] = photo.src.original;
        result.push(newEntry);
    } 
    res.send(result);
  } catch (error) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({status: "error", error: error}));
  }
})

/**
 * /users
 * POST
 * Params: username
 * Returns: JSON
 */
router.post('/', async function(req, res, next) {
  const session = req.session;
  const username = req.body.username;

  console.log("Username:", username);
  if (!username) {
    res.status(400).json({status: "missing username"});
    return;
  }

  if (!session.isAuthenticated && !session.username) {
    try {
      const user = await User.findOne({username: username});
      if (!user) {
        const newUser= new User({
          username: username,
          favorites: [],
        });
        const response = await newUser.save();
      }
      session.username = username;
      res.json({status: "success"});
    } catch (e) {
      console.log(e);
      res.status(500).json({status: "failed"});
    }
  } else {
    res.json({status: "already logged in"});
  }
});

router.post('/favorites', async function(req, res, next) {
  const session = req.session;
  if (session.username) {
    if (!req.body.url || !req.body.name) {
      res.status(400).json({status: "missing image info"});
      return;
    }

    try {
      const user = await User.findOne({username: session.username});
      const image = {
        name: req.body.name,
        url: req.body.url,
        date: new Date().toJSON(),
      };
      if (user.favorites.filter(image => image.name === req.body.name && image.url === req.body.url) == 0) {
        user.favorites.push(image);
      }
      const response = await user.save();
      res.json({status: "success"});
    } catch (e) {
      console.log(e);
      res.status(500).json({status: "failure"});
    }
  } else {
    res.status(400).json({status: NOT_LOGGED_IN});
  }
});

router.delete('/favorites', async function(req, res, next) {
  const session = req.session;
  if (session.username) {
    if (!req.query.name || !req.query.url) {
      res.status(400).json({status: "missing image info"});
      return;
    }

    try {
      const user = await User.findOne({username: session.username});
      let favorites = user.favorites;
      user.favorites = favorites.filter(image => image.name !== req.query.name || image.url !== req.query.url);
      const response = await user.save();
      res.json({status: "success"});
    } catch(e) {
      console.log(e);
      res.status(500).json({status: "failure"});
    }
  } else {
    res.status(400).json({status: NOT_LOGGED_IN});
  }
});

/**
 * /users/logout
 * GET
 * Params: NONE
 * Returns: Text
 */
router.get('/logout', async function(req, res, next) {
  req.session.destroy();
  res.send("logged out");
});

router.get('/favorites', async function(req, res, next) {
  const session = req.session;
  if (session.username) {
    try {
      const user = await User.findOne({username: session.username});
      console.log(user.favorites);
      res.json({favorites: user.favorites});
    } catch (e) {
      console.log(e);
      res.status(500).json({status: "failure"});
    }
  } else {
    res.status(400).json({status: NOT_LOGGED_IN});
  }
})

export default router;
