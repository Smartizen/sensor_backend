const mongoose = require('mongoose');
const { SensorDataSchema } = require('./sensorData');
const { Schema } = mongoose;

const MinuteSchema = new Schema(
  {
    deviceId: { type: String, required: true, trim: true },
    data: [
      {
        type: SensorDataSchema,
        default: () => ({}),
      },
    ],
    instanceData: {
      type: SensorDataSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

const Minute = mongoose.model('Minute', MinuteSchema);

module.exports = { Minute, MinuteSchema };
