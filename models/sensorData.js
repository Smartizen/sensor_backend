const mongoose = require('mongoose');
const { Schema } = mongoose;

const SensorDataSchema = new Schema(
  {
    humidity: { type: Number },
    temperature: { type: Number },
  },
  {
    timestamps: true,
  }
);

const SensorData = mongoose.model('SensorData', SensorDataSchema);

module.exports = { SensorData, SensorDataSchema };
