import express from 'express';
import mongoose from 'mongoose';
var router = express.Router();

main().catch(err => console.log(err));

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
