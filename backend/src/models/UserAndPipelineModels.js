const mongoose = require('mongoose');
const { mediaSchema, entityRefSchema } = require('./commonSchemas');

// User Model
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password_hash: { type: String, required: true },
    full_name: { type: String, required: true },
    user_role: {
      type: String,
      enum: ['VISITOR', 'CONTRIBUTOR', 'LOCAL_EXPERT', 'MODERATOR', 'ADMIN'],
      default: 'VISITOR',
      required: true,
    },
    bio: { type: String, default: null },
    home_city_id: { type: String, default: null },
    avatar_media: { type: mediaSchema, default: null },
    contributions_count: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// SavedItem Model
const savedItemSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    user_id: { type: String, required: true, ref: 'User', index: true },
    entity_type: {
      type: String,
      enum: [
        'PLACE',
        'MARKET',
        'FOOD',
        'FOOD_PLACE',
        'ARTISAN',
        'COMMUNITY',
        'EVENT',
        'STORY',
        'TRAIL',
      ],
      required: true,
    },
    entity_id: { type: String, required: true },
    notes: { type: String, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

savedItemSchema.index({ user_id: 1, entity_type: 1, entity_id: 1 }, { unique: true });

// Contribution Model
const contributionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    user_id: { type: String, required: true, ref: 'User', index: true },
    contribution_type: {
      type: String,
      enum: [
        'PLACE_SUBMISSION',
        'HIDDEN_GEM_SUBMISSION',
        'STORY_SUBMISSION',
        'FOOD_SUBMISSION',
        'ARTISAN_SUBMISSION',
        'EVENT_SUBMISSION',
        'EDIT_SUGGESTION',
        'MEDIA_UPLOAD',
        'OTHER',
      ],
      required: true,
    },
    contribution_status: {
      type: String,
      enum: ['SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'MERGED'],
      default: 'SUBMITTED',
      index: true,
    },
    target_entity: { type: entityRefSchema, default: null },
    proposed_data: { type: mongoose.Schema.Types.Mixed, required: true },
    review_notes: { type: String, default: null },
    reviewed_by: { type: String, default: null },
    reviewed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// Report Model
const reportSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    user_id: { type: String, required: true, ref: 'User', index: true },
    report_type: {
      type: String,
      enum: [
        'INCORRECT_INFORMATION',
        'OUTDATED_INFORMATION',
        'OFFENSIVE_CONTENT',
        'DUPLICATE_ENTITY',
        'CLOSED_OR_NONEXISTENT',
        'COPYRIGHT_ISSUE',
        'OTHER',
      ],
      required: true,
    },
    report_status: {
      type: String,
      enum: ['OPEN', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'],
      default: 'OPEN',
      index: true,
    },
    target_entity: { type: entityRefSchema, required: true },
    description: { type: String, required: true },
    resolution_notes: { type: String, default: null },
    resolved_by: { type: String, default: null },
    resolved_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// ActivityLog Model
const activityLogSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    user_id: { type: String, default: null, index: true },
    action: { type: String, required: true }, // VIEW, SAVE, CONTRIBUTE, VERIFY, etc.
    entity_type: { type: String, default: null },
    entity_id: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip_address: { type: String, default: null },
    user_agent: { type: String, default: null },
    created_at: { type: Date, default: Date.now, expires: '180d' }, // 180-day TTL index
  }
);

const User = mongoose.model('User', userSchema);
const SavedItem = mongoose.model('SavedItem', savedItemSchema);
const Contribution = mongoose.model('Contribution', contributionSchema);
const Report = mongoose.model('Report', reportSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = {
  User,
  SavedItem,
  Contribution,
  Report,
  ActivityLog,
};
