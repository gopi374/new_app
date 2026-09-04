const mongoose = require('mongoose');

// Visited Place Schema
const visitedPlaceSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    user_id: { type: String, required: true, ref: 'User', index: true },
    place_id: { type: String, required: true, ref: 'Place', index: true },
    visited_at: { type: Date, default: Date.now },
    notes: { type: String, default: null },
    rating: { type: Number, min: 1, max: 5, default: null },
    verified_by_gps: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

visitedPlaceSchema.index({ user_id: 1, place_id: 1 }, { unique: true });

// Virtual Stamp Schema
const virtualStampSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    monument_id: { type: String, required: true, ref: 'Place' },
    category: { type: String, default: 'HERITAGE' },
    icon_url: { type: String, default: null },
    description: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

const VisitedPlace = mongoose.model('VisitedPlace', visitedPlaceSchema);
const VirtualStamp = mongoose.model('VirtualStamp', virtualStampSchema);

module.exports = {
  VisitedPlace,
  VirtualStamp,
};
