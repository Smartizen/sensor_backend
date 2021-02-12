const { publicEvent } = require('../config/iot');

const router = require('express').Router();

router.post('/commands', async (req, res) => {
  let { typeId, deviceId, channel, command } = req.body;
  let message = await publicEvent({ typeId, deviceId, channel, command });
  res.json(message);
});

module.exports = router;
