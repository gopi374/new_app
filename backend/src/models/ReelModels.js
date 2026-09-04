const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    start_time_seconds: { type: Number, default: 0 },
    place_id: { type: String, default: null },
  },
  { _id: false }
);

const reelSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    category_tag: { type: String, default: 'ARCHITECTURAL LEGACY' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    thumbnail_url: { type: String, required: true },
    video_url: { type: String, default: '' },
    is_4k_hdr: { type: Boolean, default: true },
    is_live_loop: { type: Boolean, default: true },
    chapters: [chapterSchema],
    is_featured: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Reel = mongoose.model('Reel', reelSchema);

module.exports = {
  Reel,
};
