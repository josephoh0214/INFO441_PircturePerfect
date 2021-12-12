import express from 'express';
import fetch from 'node-fetch';
import { createApi } from 'unsplash-js';
import { createClient } from 'pexels';
var router = express.Router();

const unsplash = createApi({
    accessKey: 'QZW4AaEVgbg7xXDgkiyPTxR0yNcaFZ_pwWz5E-ffJE4',
    fetch: fetch
});

const pexelClient = createClient('563492ad6f91700001000001ff1e428d3a5b4709897e430b5bc0d401');

const NOT_LOGGED_IN = "not logged in";

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

export default router;
