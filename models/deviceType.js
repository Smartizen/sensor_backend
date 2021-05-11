const mongoose = require('mongoose');
const { DeviceSchema } = require('./device');

const { Schema } = mongoose;

const DeviceTypeSchema = new Schema(
  {
    typeId: { type: String, unique: true, required: true, trim: true },
    description: { type: String, trim: true },
    devices: [{ type: DeviceSchema, required: false }],
  },
  {
    timestamps: true,
  }
);

const DeviceType = mongoose.model('DeviceType', DeviceTypeSchema);

module.exports = DeviceType;
