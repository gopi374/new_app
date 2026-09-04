const models = require('../models');
const { ApiError } = require('../middleware/errorHandler');

const COLLECTION_MODEL_MAP = {
  places: models.Place,
  markets: models.Market,
  foods: models.Food,
  'food-places': models.FoodPlace,
  artisans: models.Artisan,
  communities: models.Community,
  events: models.Event,
  stories: models.Story,
  trails: models.Trail,
};

const updateVerificationStatus = async (req, res, next) => {
  try {
    const { collection, id } = req.params;
    const { verification_status, verification_notes, sources } = req.body;

    const Model = COLLECTION_MODEL_MAP[collection];
    if (!Model) {
      throw new ApiError(404, `Collection '${collection}' not found`);
    }

    if (!['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED'].includes(verification_status)) {
      throw new ApiError(400, 'Invalid verification_status value');
    }

    const item = await Model.findById(id);
    if (!item) {
      throw new ApiError(404, `${collection.slice(0, -1)} with ID '${id}' not found`);
    }

    item.verification = {
      verification_status,
      verified_by: req.user.userId,
      verified_at: new Date(),
      verification_notes: verification_notes || item.verification.verification_notes,
      sources: sources || item.verification.sources || [],
    };

    if (verification_status === 'REJECTED' && item.publication.publication_status === 'PUBLISHED') {
      item.publication.publication_status = 'ARCHIVED';
    }

    await item.save();

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const updatePublicationStatus = async (req, res, next) => {
  try {
    const { collection, id } = req.params;
    const { publication_status } = req.body;

    const Model = COLLECTION_MODEL_MAP[collection];
    if (!Model) {
      throw new ApiError(404, `Collection '${collection}' not found`);
    }

    if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(publication_status)) {
      throw new ApiError(400, 'Invalid publication_status value');
    }

    const item = await Model.findById(id);
    if (!item) {
      throw new ApiError(404, `${collection.slice(0, -1)} with ID '${id}' not found`);
    }

    // STRICT GUARDRAIL: Never allow PUBLISHED when verification_status is REJECTED
    if (
      publication_status === 'PUBLISHED' &&
      item.verification &&
      item.verification.verification_status === 'REJECTED'
    ) {
      throw new ApiError(
        400,
        'Cannot publish entity with REJECTED verification status. Update verification status first.'
      );
    }

    item.publication = {
      publication_status,
      published_at: publication_status === 'PUBLISHED' ? new Date() : item.publication.published_at,
      published_by: publication_status === 'PUBLISHED' ? req.user.userId : item.publication.published_by,
    };

    await item.save();

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateVerificationStatus,
  updatePublicationStatus,
};
