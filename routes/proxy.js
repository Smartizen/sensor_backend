const router = require('express').Router();
const axios = require('axios');
require('dotenv').config();

router.get('/video', async (req, res) => {
  let target = `${process.env.VIDEO_PROXY_SERVER}/video_feed`;
  axios
    .get(target, {
      responseType: 'stream',
    })
    .then((stream) => {
      res.writeHead(stream.status, stream.headers);
      stream.data.pipe(res);
    })
    .catch((err) => console.error(err.message));
});

module.exports = router;
