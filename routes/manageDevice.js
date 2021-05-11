const { publicEvent } = require('../config/iot');

const router = require('express').Router();

router.post('/commands', async (req, res) => {
  let { typeId, deviceId, channel, command } = req.body;
  let message = await publicEvent({ typeId, deviceId, channel, command });
  res.status(200).json({ status: 200, success: true, message: 'successfully' });
});

module.exports = router;
