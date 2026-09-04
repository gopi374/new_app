const mongoose = require('mongoose');

const geoLocationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function (val) {
          return (
            Array.isArray(val) &&
            val.length === 2 &&
            val[0] >= -180 &&
            val[0] <= 180 &&
            val[1] >= -90 &&
            val[1] <= 90
          );
        },
        message: 'Coordinates must be [longitude, latitude] within valid ranges',
      },
    },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, default: null },
    line2: { type: String, default: null },
    locality: { type: String, default: null },
    landmark: { type: String, default: null },
    pincode: { type: String, default: null },
    city_id: { type: String, default: null },
    state_id: { type: String, default: null },
    country_code: { type: String, default: 'IN' },
  },
  { _id: false }
);

const mediaSchema = new mongoose.Schema(
  {
    media_id: { type: String, required: true },
    type: {
      type: String,
      enum: ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT'],
      required: true,
    },
    url: { type: String, required: true },
    thumbnail_url: { type: String, default: null },
    caption: { type: String, default: null },
    alt_text: { type: String, default: null },
    credit: { type: String, default: null },
    source: { type: String, default: null },
    uploaded_by: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const verificationSchema = new mongoose.Schema(
  {
    verification_status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
      required: true,
    },
    verified_by: { type: String, default: null },
    verified_at: { type: Date, default: null },
    verification_notes: { type: String, default: null },
    sources: { type: [String], default: [] },
  },
  { _id: false }
);

const publicationSchema = new mongoose.Schema(
  {
    publication_status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
      required: true,
    },
    published_at: { type: Date, default: null },
    published_by: { type: String, default: null },
  },
  { _id: false }
);

const discoverySchema = new mongoose.Schema(
  {
    is_hidden_gem: { type: Boolean, default: false },
    discovery_level: {
      type: String,
      enum: ['MAINSTREAM', 'LESSER_KNOWN', 'LOCAL_SECRET'],
      default: 'MAINSTREAM',
    },
    why_visit: { type: String, default: null },
    local_secret: { type: Boolean, default: false },
  },
  { _id: false }
);

const entityRefSchema = new mongoose.Schema(
  {
    entity_type: {
      type: String,
      enum: [
        'PLACE',
        'MARKET',
        'FOOD',
        'FOOD_PLACE',
        'ARTISAN',
        'EVENT',
        'STORY',
        'COMMUNITY',
        'TRAIL',
      ],
      required: true,
    },
    entity_id: { type: String, required: true },
    name: { type: String, default: null },
    display_order: { type: Number, default: 0 },
  },
  { _id: false }
);

module.exports = {
  geoLocationSchema,
  addressSchema,
  mediaSchema,
  verificationSchema,
  publicationSchema,
  discoverySchema,
  entityRefSchema,
};
