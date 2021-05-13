const router = require('express').Router();
const axios = require('axios');
const DeviceType = require('../models/deviceType');

router.get('/video/:typeId/:deviceId', async (req, res) => {
  const { typeId, deviceId } = req.params;

  let device = await DeviceType.findOne({ typeId }).populate({
    path: 'devices',
    match: { deviceId },
    select: 'host',
  });
  if (!!device) {
    let target = `${device.devices[0].host}/video_feed`;
    axios
      .get(target, {
        responseType: 'stream',
      })
      .then((stream) => {
        res.writeHead(stream.status, stream.headers);
        stream.data.pipe(res);
      })
      .catch((err) => console.error(err.message));
  } else {
    res.status(400).json({ message: 'device does not exist' });
  }
});

module.exports = router;
