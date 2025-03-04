const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busId: { type: String, required: true, unique: true },
  routeName: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  status: {
    type: String,
    enum: ['ON_TIME', 'DELAYED', 'OUT_OF_SERVICE'],
    default: 'ON_TIME'
  },
  lastUpdated: { type: Date, default: Date.now }
});

busSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Bus', busSchema);
