const mongoose = require('mongoose');

const { Schema } = mongoose;

const DeviceSchema = new Schema(
  {
    deviceId: { type: String, trim: true },
    status: { type: Boolean, default: false },
    host: { type: String, trim: true },
    authToken: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    datas: { type: Schema.Types.ObjectId, ref: 'Data' },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model('Device', DeviceSchema);

module.exports = { Device, DeviceSchema };
