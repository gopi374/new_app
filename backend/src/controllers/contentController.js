const models = require('../models');
const { applyPublicationGating } = require('../utils/queryHelper');
const { ApiError } = require('../middleware/errorHandler');

const COLLECTION_MODEL_MAP = {
  countries: models.Country,
  states: models.State,
  cities: models.City,
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

const listItems = async (req, res, next) => {
  try {
    const { collection } = req.params;
    const Model = COLLECTION_MODEL_MAP[collection];

    if (!Model) {
      return next(new ApiError(404, `Collection '${collection}' not found`));
    }

    const { city_id, state_id, tag, page = 1, limit = 20, sort = '-created_at' } = req.query;

    let filter = {};
    if (city_id) filter.city_id = city_id;
    if (state_id) filter.state_id = state_id;
    if (tag) filter.tags = tag;

    if (!['countries', 'states', 'cities'].includes(collection)) {
      const userRole = req.user ? req.user.role : 'VISITOR';
      filter = applyPublicationGating(filter, userRole);
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Model.find(filter).sort(sort).skip(skip).limit(limitNum),
      Model.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        items,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getItemById = async (req, res, next) => {
  try {
    const { collection, id } = req.params;
    const Model = COLLECTION_MODEL_MAP[collection];

    if (!Model) {
      return next(new ApiError(404, `Collection '${collection}' not found`));
    }

    let filter = { _id: id };
    if (!['countries', 'states', 'cities'].includes(collection)) {
      const userRole = req.user ? req.user.role : 'VISITOR';
      filter = applyPublicationGating(filter, userRole);
    }

    const item = await Model.findOne(filter);
    if (!item) {
      return next(new ApiError(404, `${collection.slice(0, -1)} with ID '${id}' not found`));
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listItems,
  getItemById,
};
