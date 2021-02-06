const mongoose = require('mongoose');
const { HourSchema } = require('./hour');
const { SensorDataSchema } = require('./sensorData');
const { Schema } = mongoose;

const DaySchema = new Schema(
  {
    deviceId: { type: String, required: true, trim: true },
    data: [
      {
        type: HourSchema,
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

const Day = mongoose.model('Day', DaySchema);

module.exports = Day;

// form data
// {
//   "deviceId" : 7564
//   "temperature" : 32,
//   "humidity": 68
// }

// new Date().toISOString()
