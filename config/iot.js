var Client = require('ibmiotf');
const { addDataByHour } = require('../helper/data_helper');
require('dotenv').config();

var appClientConfig = {
  org: process.env.ORG_NAME,
  id: process.env.NAME_OF_IOTF,
  'auth-key': process.env.AUTH_KEY,
  'auth-token': process.env.AUTH_TOKEN,
  type: 'shared',
};

var appClient = new Client.IotfApplication(appClientConfig);

const connectIoTF = () => {
  appClient.connect();

  appClient.on('connect', function () {
    appClient.subscribeToDeviceEvents();
    //Add your code here
  });

  appClient.on('deviceEvent', function (deviceType, deviceId, eventType, format, payload) {
    console.log(
      'Device Event from :: ' +
        deviceType +
        ' : ' +
        deviceId +
        ' of event ' +
        eventType +
        ' with payload : ' +
        payload
    );
    payload = '' + payload;
    payload = JSON.parse(payload);
    payload.deviceType = deviceType;
    payload.deviceId = deviceId;

    // public event
    global.io.sockets.emit(payload.deviceId, { message: payload });
    //insert to database
    // addDataByHour(payload);
  });
};

const registerDeviceType = async (typeId, description) => {
  try {
    let argument = await appClient.registerDeviceType(typeId, description); //{id, description}
    return {
      status: 200,
      typeId: argument.id,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const registerDevice = async (typeId, deviceId) => {
  try {
    let argument = await appClient.registerDevice(typeId, deviceId);
    argument.status = 200;
    return argument;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const unRegisterDevice = async (typeId, deviceId) => {
  try {
    let argument = await appClient.unregisterDevice(typeId, deviceId);
    return argument;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getDeviceStatus = () => {};

const publicEvent = async ({ typeId, deviceId, channel, command }) => {
  // {
  //   "typeId":"ESP8266",
  //   "deviceId":"test3",
  //   "channel":"control",
  //   "command":{"control":0}
  // }

  command = JSON.stringify(command);
  let res = await appClient.publishDeviceCommand(typeId, deviceId, channel, 'json', command);
  console.log(JSON.stringify(res._events));
  return 1;
};

const setIntervalForDevice = () => {};

module.exports = {
  connectIoTF,
  registerDeviceType,
  registerDevice,
  unRegisterDevice,
  getDeviceStatus,
  publicEvent,
  setIntervalForDevice,
  appClient,
};
