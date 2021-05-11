const mongoose = require('mongoose');

const { Schema } = mongoose;

const DeviceSchema = new Schema(
  {
    deviceId: { type: String, trim: true },
    host: { type: String, trim: true },
    authToken: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model('Device', DeviceSchema);

module.exports = { Device, DeviceSchema };
