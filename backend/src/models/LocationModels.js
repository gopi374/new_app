const mongoose = require('mongoose');
const { geoLocationSchema, mediaSchema } = require('./commonSchemas');

const countrySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // e.g. "country_in"
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const stateSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // e.g. "state_mp"
    name: { type: String, required: true },
    normalized_name: { type: String, required: true, lowercase: true, index: true },
    country_code: { type: String, required: true, default: 'IN' },
    description: { type: String, default: null },
    location: { type: geoLocationSchema, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const citySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // e.g. "city_indore_mp"
    name: { type: String, required: true },
    normalized_name: { type: String, required: true, lowercase: true, index: true },
    state_id: { type: String, required: true, ref: 'State', index: true },
    country_code: { type: String, required: true, default: 'IN' },
    location: { type: geoLocationSchema, required: true },
    short_description: { type: String, default: null },
    description: { type: String, required: true },
    cultural_summary: { type: String, default: null },
    cover_media: { type: [mediaSchema], default: [] },
    highlights: { type: [String], default: [] },
    is_featured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    analytics_cache: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

citySchema.index({ location: '2dsphere' });
citySchema.index({ name: 'text', description: 'text', cultural_summary: 'text' });

const Country = mongoose.model('Country', countrySchema);
const State = mongoose.model('State', stateSchema);
const City = mongoose.model('City', citySchema);

module.exports = { Country, State, City };
