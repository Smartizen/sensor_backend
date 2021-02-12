const { registerDeviceType, registerDevice, unRegisterDevice } = require('../config/iot');

const router = require('express').Router();

router.post('/registerDeviceType', async (req, res) => {
  let { typeId, description } = req.body;

  let message = await registerDeviceType(typeId, description);
  res.json(message);
});

router.post('/registerDevice', async (req, res) => {
  let { typeId, deviceId } = req.body;
  let message = await registerDevice(typeId, deviceId);
  res.json(message);

  //         "typeId": "raspi",
  //         "deviceId": "new01012220",
  //         "authToken": "bcP3*bgo*pb3f4AmUO",
});

router.post('/unRegisterDevice', async (req, res) => {
  let { typeId, deviceId } = req.body;
  let message = await unRegisterDevice(typeId, deviceId);
  if (!!(message.status === 404)) return res.status(404).json(message);
  else return res.status(200).json({ status: 200, success: true, message: 'Delete successfully' });
});

module.exports = router;
