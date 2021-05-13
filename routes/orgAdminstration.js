const { registerDeviceType, registerDevice, unRegisterDevice } = require('../config/iot');
const DeviceType = require('../models/deviceType');
const { Device } = require('../models/device');
const generateUUID = require('../utils/genAuthToken');

const router = require('express').Router();

/// IBM IOT WATSON
//////////////////

router.post('/registerDeviceType/watson', async (req, res) => {
  let { typeId, description } = req.body;

  let message = await registerDeviceType(typeId, description);
  res.json(message);
});

router.post('/registerDevice/watson', async (req, res) => {
  let { typeId, deviceId } = req.body;
  let message = await registerDevice(typeId, deviceId);
  res.json('message');

  //         "typeId": "raspi",
  //         "deviceId": "new01012220",
  //         "authToken": "bcP3*bgo*pb3f4AmUO",
});

router.post('/unRegisterDevice/watson', async (req, res) => {
  let { typeId, deviceId } = req.body;
  let message = await unRegisterDevice(typeId, deviceId);
  if (!!(message.status === 404)) return res.status(404).json(message);
  else return res.status(200).json({ status: 200, success: true, message: 'Delete successfully' });
});

/// Smartizen platform
//////////////////////

router.post('/registerDeviceType/smartizen', async (req, res) => {
  let { typeId, description } = req.body;

  let newDeviceType = new DeviceType({
    typeId,
    description,
  });
  try {
    res.json(await newDeviceType.save());
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

router.post('/registerDevice/smartizen', async (req, res) => {
  let { typeId, deviceId, host } = req.body;

  let authToken = generateUUID();

  let newDevice = new Device({
    deviceId,
    host,
    authToken,
  });

  try {
    let updatedDevice = await DeviceType.findOneAndUpdate(
      { typeId, 'devices.deviceId': { $ne: deviceId } },
      {
        $addToSet: { devices: newDevice },
      }
    );
    if (updatedDevice) res.json({ typeId, deviceId, authToken });
    else res.status(400).json({ error: "can't update" });
  } catch (error) {
    res.status(400).json({ error });
  }

  //         "typeId": "raspi",
  //         "deviceId": "new01012220",
  //         "authToken": "bcP3*bgo*pb3f4AmUO",
});

// TODO remove
router.post('/unRegisterDevice/smartizen', async (req, res) => {
  let { typeId, deviceId } = req.body;
  try {
    let updatedDevice = await DeviceType.findOneAndUpdate(
      { typeId },
      {
        $pull: { devices: { deviceId: deviceId } },
      }
    );
    res.json({ message: 'delete successfully' });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
