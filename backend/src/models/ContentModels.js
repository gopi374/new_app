const mongoose = require('mongoose');
const {
  geoLocationSchema,
  addressSchema,
  mediaSchema,
  verificationSchema,
  publicationSchema,
  discoverySchema,
  entityRefSchema,
} = require('./commonSchemas');

// Place Model
const placeSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    normalized_name: { type: String, required: true, lowercase: true, index: true },
    place_type: {
      type: String,
      enum: [
        'HERITAGE',
        'HIDDEN_GEM',
        'CULTURAL_SITE',
        'HISTORICAL_SITE',
        'ARCHAEOLOGICAL_SITE',
        'RELIGIOUS_SITE',
        'CULTURAL_LANDSCAPE',
        'VIEWPOINT',
        'OTHER',
      ],
      required: true,
      index: true,
    },
    city_id: { type: String, required: true, ref: 'City', index: true },
    state_id: { type: String, required: true, ref: 'State', index: true },
    country_code: { type: String, default: 'IN' },
    location: { type: geoLocationSchema, required: true },
    address: { type: addressSchema, default: () => ({}) },
    short_description: { type: String, default: null },
    description: { type: String, required: true },
    historical_significance: { type: String, default: null },
    architectural_style: { type: String, default: null },
    visiting_hours: { type: String, default: null },
    entry_fee: { type: String, default: null },
    best_time_to_visit: { type: String, default: null },
    discovery: { type: discoverySchema, default: () => ({}) },
    media: { type: [mediaSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    verification: { type: verificationSchema, default: () => ({}) },
    publication: { type: publicationSchema, default: () => ({}) },
    created_by: { type: String, default: 'system' },
    updated_by: { type: String, default: 'system' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

placeSchema.index({ location: '2dsphere' });
placeSchema.index({ name: 'text', description: 'text', historical_significance: 'text' });
placeSchema.index({ 'publication.publication_status': 1, city_id: 1 });

// Market Model
const marketSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    normalized_name: { type: String, required: true, lowercase: true, index: true },
    market_type: {
      type: String,
      enum: [
        'TRADITIONAL_MARKET',
        'FOOD_MARKET',
        'NIGHT_MARKET',
        'CRAFT_MARKET',
        'TEXTILE_MARKET',
        'JEWELLERY_MARKET',
        'SPICE_MARKET',
        'OTHER',
      ],
      required: true,
      index: true,
    },
    city_id: { type: String, required: true, ref: 'City', index: true },
    state_id: { type: String, required: true, ref: 'State', index: true },
    country_code: { type: String, default: 'IN' },
    location: { type: geoLocationSchema, required: true },
    address: { type: addressSchema, default: () => ({}) },
    description: { type: String, required: true },
    operating_hours: { type: String, default: null },
    best_known_for: { type: [String], default: [] },
    media: { type: [mediaSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    verification: { type: verificationSchema, default: () => ({}) },
    publication: { type: publicationSchema, default: () => ({}) },
    created_by: { type: String, default: 'system' },
    updated_by: { type: String, default: 'system' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

marketSchema.index({ location: '2dsphere' });
marketSchema.index({ name: 'text', description: 'text' });
marketSchema.index({ 'publication.publication_status': 1, city_id: 1 });

// Food Model
const foodSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    normalized_name: { type: String, required: true, lowercase: true, index: true },
    food_category: {
      type: String,
      enum: [
        'STREET_FOOD',
        'SWEET',
        'SNACK',
        'MAIN_COURSE',
        'BEVERAGE',
        'FESTIVAL_FOOD',
        'THALI',
        'OTHER',
      ],
      required: true,
      index: true,
    },
    city_id: { type: String, required: true, ref: 'City', index: true },
    state_id: { type: String, required: true, ref: 'State', index: true },
    description: { type: String, required: true },
    cultural_origin: { type: String, default: null },
    key_ingredients: { type: [String], default: [] },
    media: { type: [mediaSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    verification: { type: verificationSchema, default: () => ({}) },
    publication: { type: publicationSchema, default: () => ({}) },
    created_by: { type: String, default: 'system' },
    updated_by: { type: String, default: 'system' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

foodSchema.index({ name: 'text', description: 'text' });
foodSchema.index({ 'publication.publication_status': 1, city_id: 1 });

// FoodPlace Model
const foodPlaceSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    normalized_name: { type: String, required: true, lowercase: true, index: true },
    food_place_type: {
      type: String,
      enum: [
        'STREET_VENDOR',
        'STALL',
        'RESTAURANT',
        'SWEET_SHOP',
        'DHABA',
        'HOME_KITCHEN',
        'MARKET_STALL',
        'OTHER',
      ],
      required: true,
      index: true,
    },
    associated_food_ids: { type: [String], default: [], index: true },
    city_id: { type: String, required: true, ref: 'City', index: true },
    state_id: { type: String, required: true, ref: 'State', index: true },
    country_code: { type: String, default: 'IN' },
    location: { type: geoLocationSchema, required: true },
    address: { type: addressSchema, default: () => ({}) },
    description: { type: String, required: true },
    operating_hours: { type: String, default: null },
    price_range: { type: String, default: null },
    is_heritage_vendor: { type: Boolean, default: false },
    est_year: { type: Number, default: null },
    media: { type: [mediaSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    verification: { type: verificationSchema, default: () => ({}) },
    publication: { type: publicationSchema, default: () => ({}) },
    created_by: { type: String, default: 'system' },
    updated_by: { type: String, default: 'system' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

foodPlaceSchema.index({ location: '2dsphere' });
foodPlaceSchema.index({ name: 'text', description: 'text' });
foodPlaceSchema.index({ 'publication.publication_status': 1, city_id: 1 });

// Artisan Model
const artisanSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    normalized_name: { type: String, required: true, lowercase: true, index: true },
    specialization_type: {
      type: String,
      enum: [
        'TEXTILE',
        'POTTERY',
        'METALWORK',
        'WOODWORK',
        'PAINTING',
        'JEWELLERY',
        'LEATHERWORK',
        'PAPER_CRAFT',
        'MUSIC_INSTRUMENT',
        'PERFORMING_ART',
        'OTHER',
      ],
      required: true,
      index: true,
    },
    craft_description: { type: String, required: true },
    district: { type: String, default: null },
    city_id: { type: String, required: true, ref: 'City', index: true },
    state_id: { type: String, required: true, ref: 'State', index: true },
    country_code: { type: String, default: 'IN' },
    location: { type: geoLocationSchema, default: null },
    address: { type: addressSchema, default: () => ({}) },
    contact_info: { type: mongoose.Schema.Types.Mixed, default: {} },
    is_master_craftsperson: { type: Boolean, default: false },
    awards: { type: [String], default: [] },
    media: { type: [mediaSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    verification: { type: verificationSchema, default: () => ({}) },
    publication: { type: publicationSchema, default: () => ({}) },
    created_by: { type: String, default: 'system' },
    updated_by: { type: String, default: 'system' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

artisanSchema.index({ location: '2dsphere' });
artisanSchema.index({ name: 'text', craft_description: 'text' });
artisanSchema.index({ 'publication.publication_status': 1, city_id: 1 });

// Community Model
const communitySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    normalized_name: { type: String, required: true, lowercase: true, index: true },
    city_id: { type: String, required: true, ref: 'City', index: true },
    state_id: { type: String, required: true, ref: 'State', index: true },
    description: { type: String, required: true },
    cultural_contribution: { type: String, default: null },
    heritage_crafts_or_foods: { type: [String], default: [] },
    media: { type: [mediaSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    verification: { type: verificationSchema, default: () => ({}) },
    publication: { type: publicationSchema, default: () => ({}) },
    created_by: { type: String, default: 'system' },
    updated_by: { type: String, default: 'system' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

communitySchema.index({ name: 'text', description: 'text' });

// Event Model
const eventSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    normalized_name: { type: String, required: true, lowercase: true, index: true },
    event_type: {
      type: String,
      enum: [
        'FESTIVAL',
        'PERFORMANCE',
        'WORKSHOP',
        'EXHIBITION',
        'CULTURAL_PROGRAM',
        'CEREMONY',
        'OTHER',
      ],
      required: true,
      index: true,
    },
    city_id: { type: String, required: true, ref: 'City', index: true },
    state_id: { type: String, required: true, ref: 'State', index: true },
    location: { type: geoLocationSchema, default: null },
    address: { type: addressSchema, default: () => ({}) },
    start_date: { type: Date, default: null },
    end_date: { type: Date, default: null },
    recurrence: { type: String, default: null },
    description: { type: String, required: true },
    cultural_significance: { type: String, default: null },
    media: { type: [mediaSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    verification: { type: verificationSchema, default: () => ({}) },
    publication: { type: publicationSchema, default: () => ({}) },
    created_by: { type: String, default: 'system' },
    updated_by: { type: String, default: 'system' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

eventSchema.index({ location: '2dsphere' });
eventSchema.index({ name: 'text', description: 'text' });

// Story Model
const storySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    normalized_title: { type: String, required: true, lowercase: true, index: true },
    story_type: {
      type: String,
      enum: [
        'FOLKLORE',
        'LOCAL_HISTORY',
        'ORAL_HISTORY',
        'TRADITION',
        'PERSONAL_MEMORY',
        'CRAFT_STORY',
        'FOOD_STORY',
        'OTHER',
      ],
      required: true,
      index: true,
    },
    associated_entity: { type: entityRefSchema, default: null },
    city_id: { type: String, required: true, ref: 'City', index: true },
    state_id: { type: String, required: true, ref: 'State', index: true },
    narrative: { type: String, required: true },
    submitted_by: { type: String, default: 'system' },
    media: { type: [mediaSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    verification: { type: verificationSchema, default: () => ({}) },
    publication: { type: publicationSchema, default: () => ({}) },
    created_by: { type: String, default: 'system' },
    updated_by: { type: String, default: 'system' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

storySchema.index({ title: 'text', narrative: 'text' });

// Trail Model
const trailSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    normalized_name: { type: String, required: true, lowercase: true, index: true },
    city_id: { type: String, required: true, ref: 'City', index: true },
    state_id: { type: String, required: true, ref: 'State', index: true },
    description: { type: String, required: true },
    theme: { type: String, default: null },
    estimated_duration_mins: { type: Number, default: 60 },
    distance_km: { type: Number, default: 0 },
    stops: { type: [entityRefSchema], default: [] },
    media: { type: [mediaSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    verification: { type: verificationSchema, default: () => ({}) },
    publication: { type: publicationSchema, default: () => ({}) },
    created_by: { type: String, default: 'system' },
    updated_by: { type: String, default: 'system' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

trailSchema.index({ name: 'text', description: 'text' });

const Place = mongoose.model('Place', placeSchema);
const Market = mongoose.model('Market', marketSchema);
const Food = mongoose.model('Food', foodSchema);
const FoodPlace = mongoose.model('FoodPlace', foodPlaceSchema);
const Artisan = mongoose.model('Artisan', artisanSchema);
const Community = mongoose.model('Community', communitySchema);
const Event = mongoose.model('Event', eventSchema);
const Story = mongoose.model('Story', storySchema);
const Trail = mongoose.model('Trail', trailSchema);

module.exports = {
  Place,
  Market,
  Food,
  FoodPlace,
  Artisan,
  Community,
  Event,
  Story,
  Trail,
};
