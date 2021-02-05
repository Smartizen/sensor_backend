const mongoose = require('mongoose');
const { Schema } = mongoose;

const MinuteSchema = new Schema({
  deviceId: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  data: [
    {
      humidity: { type: Number },
      temperature: { type: Number },
      now: { type: Date },
    },
  ],
  instanceData: {
    humidity: { type: Number },
    temperature: { type: Number },
  },
});

const Minute = mongoose.model('Minute', MinuteSchema);

module.exports = { Minute, MinuteSchema };
