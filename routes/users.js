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
        id: String,
        downloadLink: String,
        preview: String,
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
  const accountUsername = session.account ? session.account.username : undefined;
  const username = accountUsername ? accountUsername : req.body.username;

  if (!username) {
    res.status(400).json({status: "missing username"});
    return;
  }

  if (!session.username) {
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

router.get('/getIdentity', (req, res) => {
  const session = req.session;
  let resp = {};
  if (session.isAuthenticated) {
    resp.status = "loggedin";
    const userInfo = {
      name: session.account.name,
      username: session.account.username
    }
    resp.userInfo = userInfo;
  } else {
    resp.status = "loggedout";
    res.status(401);
  }
  res.json(resp);
});

router.post('/favorites', async function(req, res, next) {
  const session = req.session;
  if (session.username) {
    const id = req.body.id;
    const downloadLink = req.body.downloadLink;
    const preview = req.body.preview;
    const url = req.body.url;
    if (!id || !downloadLink || !preview) {
      res.status(400).json({status: "missing image info"});
      return;
    }

    try {
      const user = await User.findOne({username: session.username});
      const image = {
        id: id,
        downloadLink: downloadLink,
        preview: preview,
        url: url,
        date: new Date().toJSON(),
      };
      if (user.favorites.filter(image => image.id === id) == 0) {
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
    const id = req.query.id;
    if (!id) {
      res.status(400).json({status: "missing image info"});
      return;
    }

    try {
      const user = await User.findOne({username: session.username});
      let favorites = user.favorites;
      user.favorites = favorites.filter(image => image.id !== id);
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
