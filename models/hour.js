const mongoose = require('mongoose');
const { MinuteSchema } = require('./minute');
const { SensorDataSchema } = require('./sensorData');
const { Schema } = mongoose;

const HourSchema = new Schema({
  deviceType: { type: String, required: true, trim: true },
  deviceId: { type: String, required: true, trim: true },
  data: [
    {
      type: MinuteSchema,
      default: () => ({}),
    },
  ],
  instanceData: {
    type: SensorDataSchema,
    default: () => ({}),
  },
  createdAt: { type: Number },
});

const Hour = mongoose.model('Hour', HourSchema);

module.exports = { Hour, HourSchema };
