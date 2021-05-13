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
  //TODO what happen when have 2 device same name
  let newDevice = new Device({
    deviceId,
    host,
    authToken,
  });

  let device = await newDevice.save();

  try {
    let updatedDevice = await DeviceType.updateOne({ typeId }, { $push: { devices: device._id } });
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
    let device = await DeviceType.findOne({ typeId }).populate({
      path: 'devices',
      match: { deviceId },
    });

    if (!!device) {
      await Device.remove({ deviceId });
      await DeviceType.findOneAndUpdate(
        { typeId },
        {
          $pull: { devices: device.devices[0]._id },
        }
      );
      res.json({ message: 'remove successfully !' });
    } else {
      res.json({ message: 'device does not exist' });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
