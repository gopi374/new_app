const models = require('../models');
const { ApiError } = require('../middleware/errorHandler');

const TYPE_MODEL_MAP = {
  PLACE_SUBMISSION: models.Place,
  HIDDEN_GEM_SUBMISSION: models.Place,
  STORY_SUBMISSION: models.Story,
  FOOD_SUBMISSION: models.Food,
  ARTISAN_SUBMISSION: models.Artisan,
  EVENT_SUBMISSION: models.Event,
};

const submitContribution = async (req, res, next) => {
  try {
    const { contribution_type, target_entity, proposed_data } = req.body;

    if (!contribution_type || !proposed_data) {
      throw new ApiError(400, 'contribution_type and proposed_data are required');
    }

    const contributionId = `contrib_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const contribution = await models.Contribution.create({
      _id: contributionId,
      user_id: req.user.userId,
      contribution_type,
      contribution_status: 'SUBMITTED',
      target_entity: target_entity || null,
      proposed_data,
    });

    res.status(201).json({
      success: true,
      data: contribution,
    });
  } catch (error) {
    next(error);
  }
};

const getPendingContributions = async (req, res, next) => {
  try {
    const contributions = await models.Contribution.find({
      contribution_status: { $in: ['SUBMITTED', 'IN_REVIEW'] },
    }).sort('-created_at');

    res.status(200).json({
      success: true,
      data: { contributions },
    });
  } catch (error) {
    next(error);
  }
};

const approveContribution = async (req, res, next) => {
  try {
    const contribution = await models.Contribution.findById(req.params.id);
    if (!contribution) {
      throw new ApiError(404, 'Contribution not found');
    }

    const TargetModel = TYPE_MODEL_MAP[contribution.contribution_type];

    let mergedDocument = null;
    if (TargetModel) {
      const entityId =
        (contribution.target_entity && contribution.target_entity.entity_id) ||
        contribution.proposed_data._id ||
        `entity_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

      const dataToMerge = {
        ...contribution.proposed_data,
        _id: entityId,
        verification: {
          verification_status: 'PENDING',
          verified_by: null,
          verified_at: null,
          verification_notes: 'Created via community contribution',
        },
        publication: {
          publication_status: 'DRAFT',
          published_at: null,
          published_by: null,
        },
        created_by: contribution.user_id,
        updated_by: req.user.userId,
      };

      mergedDocument = await TargetModel.findOneAndUpdate(
        { _id: entityId },
        dataToMerge,
        { upsert: true, new: true, runValidators: true }
      );
    }

    contribution.contribution_status = 'MERGED';
    contribution.reviewed_by = req.user.userId;
    contribution.reviewed_at = new Date();
    contribution.review_notes = req.body.review_notes || 'Approved and merged';
    await contribution.save();

    res.status(200).json({
      success: true,
      message: 'Contribution approved and merged',
      data: {
        contribution,
        merged_document: mergedDocument,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContribution,
  getPendingContributions,
  approveContribution,
};
