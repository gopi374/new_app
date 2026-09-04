const { SavedItem } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

const getSavedItems = async (req, res, next) => {
  try {
    const items = await SavedItem.find({ user_id: req.user.userId }).sort('-created_at');
    res.status(200).json({
      success: true,
      data: { items },
    });
  } catch (error) {
    next(error);
  }
};

const addSavedItem = async (req, res, next) => {
  try {
    const { entity_type, entity_id, notes } = req.body;
    if (!entity_type || !entity_id) {
      throw new ApiError(400, 'entity_type and entity_id are required');
    }

    const savedItemId = `saved_${req.user.userId}_${entity_type}_${entity_id}`;

    const savedItem = await SavedItem.findOneAndUpdate(
      { user_id: req.user.userId, entity_type, entity_id },
      {
        _id: savedItemId,
        user_id: req.user.userId,
        entity_type,
        entity_id,
        notes: notes || null,
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      data: savedItem,
    });
  } catch (error) {
    next(error);
  }
};

const removeSavedItem = async (req, res, next) => {
  try {
    const result = await SavedItem.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.userId,
    });

    if (!result) {
      throw new ApiError(404, 'Saved item not found');
    }

    res.status(200).json({
      success: true,
      message: 'Item unsaved successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSavedItems,
  addSavedItem,
  removeSavedItem,
};
