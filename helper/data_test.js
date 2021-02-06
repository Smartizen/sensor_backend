const { Minute } = require('../models/minute');
const { Hour } = require('../models/hour');
const Day = require('../models/day');

const addDataByMinute = async (data) => {
  //interface
  let { deviceId, humidity, temperature } = data;
  let now = new Date();

  let minuteDocs = null;
  lastData = await Minute.findOne({ deviceId }).sort({ date: '-1' });
  if (!lastData || now.getMinutes() !== lastData.date.getMinutes()) {
    //update in minute
    let minute = new Minute({
      deviceId,
      data: [
        {
          humidity,
          temperature,
          now: new Date().toJSON(),
        },
      ],
      instanceData: {
        humidity,
        temperature,
      },
    });

    minuteDocs = await minute.save();
    if (!!lastData) addDataByHour(lastData);
  } else {
    minuteDocs = await Minute.updateOne(
      { deviceId, _id: lastData._id },
      {
        $push: { data: { humidity, temperature, now: new Date().toJSON() } },
        $set: { instanceData: updateInstance({ humidity, temperature, lastData }) },
      },
      { new: true }
    );
  }

  // addDataByDay(lastData);
};

const addDataByHour = async (minuteDocs) => {
  console.log(minuteDocs);
  let { humidity, temperature } = minuteDocs.instanceData;
  let now = new Date();
  lastData = await Hour.findOne({ deviceId: minuteDocs.deviceId }).sort({ date: '-1' });

  if (!lastData || now.getHours() !== lastData.date.getHours()) {
    //update in hours
    let hour = new Hour({
      deviceId: minuteDocs.deviceId,
      data: [
        {
          _id: minuteDocs._id,
          deviceId: minuteDocs.deviceId,
          humidity,
          temperature,
        },
      ],
      instanceData: {
        humidity,
        temperature,
      },
    });

    await hour.save();
  } else {
    let update = await Hour.updateOne(
      { deviceId: minuteDocs.deviceId, _id: lastData._id },
      {
        $push: {
          data: {
            _id: minuteDocs._id,
            deviceId: minuteDocs.deviceId,
            humidity,
            temperature,
          },
        },
        $set: { instanceData: updateInstance({ humidity, temperature, lastData }) },
      }
    );
    console.log({ update });
  }
};

const addDataByDay = async (lastData) => {};

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
  addDataByMinute,
  addDataByHour,
  addDataByDay,
};

let queryUpdate = JSON.parse(`{
  "data.$[${element}].data": ${JSON.stringify(sensorData)}
}`);
let querySet = JSON.parse(`{
  "data.$[${element}].instanceData": ${JSON.stringify(instanceData)}
}`);

await Hour.updateOne(
  { deviceId, _id: lastData._id },
  {
    $push: queryUpdate,
    $set: querySet,
  }
);
