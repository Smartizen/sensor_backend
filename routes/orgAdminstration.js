const { registerDeviceType, registerDevice, unRegisterDevice } = require('../config/iot');
const DeviceType = require('../models/deviceType');
const { Device } = require('../models/device');
const generateUUID = require('../utils/genAuthToken');

const router = require('express').Router();

/// IBM IOT WATSON
//////////////////

router.post('/registerDeviceType/:platform', async (req, res) => {
  let { typeId, description } = req.body;
  const { platform } = req.params;
  if (platform === 'watson') {
    let message = await registerDeviceType(typeId, description);
    let newDeviceType = new DeviceType({
      typeId,
      description,
      platform: 'watson',
    });
    try {
      await newDeviceType.save();
      res.json(message);
    } catch (error) {
      res.status(400).json({ error });
    }
  } else if (platform === 'smartizen') {
    let newDeviceType = new DeviceType({
      typeId,
      description,
      platform: 'smartizen',
    });
    try {
      res.json(await newDeviceType.save());
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    return res.status(500).end();
  }
});

router.post('/registerDevice/:platform', async (req, res) => {
  const { platform } = req.params;
  if (platform === 'watson') {
    let { typeId, deviceId } = req.body;
    let message = await registerDevice(typeId, deviceId);
    let { authToken } = message;
    let newDevice = new Device({
      deviceId,
      host,
      authToken,
    });

    let device = await newDevice.save();

    try {
      let updatedDevice = await DeviceType.updateOne(
        { typeId },
        { $push: { devices: device._id } }
      );
      if (updatedDevice) res.json({ typeId, deviceId, authToken });
      else res.status(400).json({ error: "can't update" });
    } catch (error) {
      res.status(400).json({ error });
    }
  } else if (platform === 'smartizen') {
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
      let updatedDevice = await DeviceType.updateOne(
        { typeId },
        { $push: { devices: device._id } }
      );
      if (updatedDevice) res.json({ typeId, deviceId, authToken });
      else res.status(400).json({ error: "can't update" });
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    return res.status(500).end();
  }
  //         "typeId": "raspi",
  //         "deviceId": "new01012220",
  //         "authToken": "bcP3*bgo*pb3f4AmUO",
});

router.post('/unRegisterDevice/:platform', async (req, res) => {
  const { platform } = req.params;
  let { typeId, deviceId } = req.body;

  if (platform === 'watson') {
    let message = await unRegisterDevice(typeId, deviceId);
    if (!!(message.status === 404)) return res.status(404).json(message);
    else {
      try {
        let device = await DeviceType.findOne({ typeId }).populate({
          path: 'devices',
          match: { deviceId },
        });

        if (!!device) {
          await Device.deleteOne({ deviceId });
          await DeviceType.findOneAndUpdate(
            { typeId },
            {
              $pull: { devices: device.devices[0]._id },
            }
          );
          res.json({ message: 'remove successfully !' });
        } else {
          res.status(404).json({ message: 'device does not exist' });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
    }
  } else if (platform === 'smartizen') {
    try {
      let device = await DeviceType.findOne({ typeId }).populate({
        path: 'devices',
        match: { deviceId },
      });

      if (!!device) {
        await Device.deleteOne({ deviceId });
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
      console.log({ error });
      res.status(400).json({ error });
    }
  } else {
    return res.status(500).end();
  }
});

module.exports = router;
