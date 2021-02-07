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

    //insert to database
    addDataByHour(payload);
  });
};

const registerDeviceType = async (typeId, description) => {
  try {
    let argument = await appClient.registerDeviceType(typeId, description); //{id, description}
    return {
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
    return {
      typeId: argument.typeId,
      deviceId: argument.deviceId,
      authToken: argument.authToken,
    };
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

const publicEvent = () => {};

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
