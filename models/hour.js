const mongoose = require('mongoose');
const { MinuteSchema } = require('./minute');
const { Schema } = mongoose;

const HourSchema = new Schema({
  deviceId: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  data: [
    {
      type: MinuteSchema,
      default: () => ({}),
    },
  ],
  instanceData: {
    humidity: { type: Number },
    temperature: { type: Number },
  },
});

const Hour = mongoose.model('Hour', HourSchema);

module.exports = { Hour, HourSchema };
