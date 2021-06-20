const mongoose = require('mongoose');
const { DeviceSchema } = require('./device');

const { Schema } = mongoose;

const DeviceTypeSchema = new Schema(
  {
    typeId: { type: String, unique: true, required: true, trim: true },
    platform: { type: String, required: true },
    description: { type: String, trim: true },
    devices: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
  },
  {
    timestamps: true,
  }
);

const DeviceType = mongoose.model('DeviceType', DeviceTypeSchema);

module.exports = DeviceType;
