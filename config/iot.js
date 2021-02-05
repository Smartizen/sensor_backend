var Client = require('ibmiotf');
const { addDataByMinute } = require('../helper/data_helper');
require('dotenv').config();

const connectIoTF = () => {
  var appClientConfig = {
    org: process.env.ORG_NAME,
    id: process.env.NAME_OF_IOTF,
    'auth-key': process.env.AUTH_KEY,
    'auth-token': process.env.AUTH_TOKEN,
    type: 'shared',
  };

  var appClient = new Client.IotfApplication(appClientConfig);

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
    payload.deviceId = deviceId;

    //insert to database
    addDataByMinute(payload);
  });
};

module.exports = { connectIoTF };
