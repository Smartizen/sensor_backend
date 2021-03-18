const { Minute } = require('../models/minute');
const { Hour } = require('../models/hour');
const { SensorData } = require('../models/sensorData');

const addDataByHour = async (data) => {
  let { deviceType, deviceId, humidity, temperature } = data;
  let now = new Date().getTime();

  let sensorData = new SensorData({
    humidity,
    temperature,
    createdAt: new Date().getTime(),
  });

  lastData = await Hour.findOne({ deviceId }).sort({ createdAt: '-1' });

  if (!lastData || new Date(now).getHours() !== new Date(lastData.createdAt).getHours()) {
    let minute = new Minute({
      deviceId,
      data: [sensorData],
      instanceData: sensorData,
    });

    let hour = new Hour({
      deviceType,
      deviceId,
      data: [minute],
      instanceData: sensorData,
      createdAt: now,
    });

    await hour.save();
  } else {
    if (
      new Date(now).getMinutes() !== new Date(lastData.data.slice(-1)[0].createdAt).getMinutes()
    ) {
      let minute = new Minute({
        deviceId,
        data: [sensorData],
        instanceData: sensorData,
      });

      // need rewrite this shit
      let instanceData = {
        humidity:
          (lastData.instanceData.humidity * (lastData.data.length - 1) +
            lastData.data.slice(-1)[0].instanceData.humidity) /
          lastData.data.length,
        temperature:
          (lastData.instanceData.temperature * (lastData.data.length - 1) +
            lastData.data.slice(-1)[0].instanceData.temperature) /
          lastData.data.length,
      };

      await Hour.updateOne(
        { deviceId, _id: lastData._id },
        {
          $push: {
            data: minute,
          },
          $set: { instanceData },
        }
      );
    } else {
      let instanceData = updateInstance({
        humidity,
        temperature,
        lastData: lastData.data.slice(-1)[0],
      });

      await Hour.updateOne(
        { deviceId, _id: lastData._id },
        {
          $push: { 'data.$[element].data': sensorData },
          $set: { 'data.$[element].instanceData': instanceData },
        },
        {
          arrayFilters: [{ 'element._id': lastData.data.slice(-1)[0]._id }],
        }
      );
    }
  }
};

const updateInstance = ({ humidity, temperature, lastData }) => {
  let instanceData = {
    humidity:
      (lastData.instanceData.humidity * lastData.data.length + humidity) /
      (lastData.data.length + 1),
    temperature:
      (lastData.instanceData.temperature * lastData.data.length + temperature) /
      (lastData.data.length + 1),
  };
  return instanceData;
};

module.exports = {
  addDataByHour,
};
