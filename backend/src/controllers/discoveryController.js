const models = require('../models');
const { applyPublicationGating } = require('../utils/queryHelper');
const { ApiError } = require('../middleware/errorHandler');

const GEO_COLLECTION_MAP = {
  places: { Model: models.Place, entityType: 'PLACE' },
  markets: { Model: models.Market, entityType: 'MARKET' },
  'food-places': { Model: models.FoodPlace, entityType: 'FOOD_PLACE' },
  artisans: { Model: models.Artisan, entityType: 'ARTISAN' },
  events: { Model: models.Event, entityType: 'EVENT' },
};

const getNear = async (req, res, next) => {
  try {
    const { lng, lat, radiusMeters = 5000, type = 'places' } = req.query;

    if (!lng || !lat) {
      throw new ApiError(400, 'lng and lat query parameters are required');
    }

    const longitude = parseFloat(lng);
    const latitude = parseFloat(lat);
    const maxDistance = parseInt(radiusMeters, 10);

    const geoConfig = GEO_COLLECTION_MAP[type];
    if (!geoConfig) {
      throw new ApiError(400, `Invalid geo search type '${type}'. Allowed: places, markets, food-places, artisans, events`);
    }

    const { Model, entityType } = geoConfig;
    const userRole = req.user ? req.user.role : 'VISITOR';

    let matchStage = {};
    if (!['ADMIN', 'MODERATOR'].includes(userRole)) {
      matchStage['publication.publication_status'] = 'PUBLISHED';
    }

    const pipeline = [
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'distance_meters',
          maxDistance: maxDistance,
          spherical: true,
          query: matchStage,
        },
      },
      { $limit: 50 },
    ];

    const results = await Model.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: {
        entity_type: entityType,
        count: results.length,
        center: [longitude, latitude],
        radius_meters: maxDistance,
        results,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBBox = async (req, res, next) => {
  try {
    const { minLng, minLat, maxLng, maxLat, type = 'places' } = req.query;

    if (!minLng || !minLat || !maxLng || !maxLat) {
      throw new ApiError(400, 'minLng, minLat, maxLng, maxLat parameters are required');
    }

    const bounds = [
      [parseFloat(minLng), parseFloat(minLat)],
      [parseFloat(maxLng), parseFloat(maxLat)],
    ];

    const geoConfig = GEO_COLLECTION_MAP[type];
    if (!geoConfig) {
      throw new ApiError(400, `Invalid geo search type '${type}'`);
    }

    const { Model, entityType } = geoConfig;
    const userRole = req.user ? req.user.role : 'VISITOR';

    let filter = {
      location: {
        $geoWithin: {
          $box: bounds,
        },
      },
    };

    filter = applyPublicationGating(filter, userRole);

    const results = await Model.find(filter).limit(100);

    res.status(200).json({
      success: true,
      data: {
        entity_type: entityType,
        bounds,
        count: results.length,
        results,
      },
    });
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;
    if (!q || typeof q !== 'string') {
      throw new ApiError(400, "Query parameter 'q' is required");
    }

    const userRole = req.user ? req.user.role : 'VISITOR';
    const limitNum = parseInt(limit, 10);
    const regexPattern = new RegExp(q, 'i');

    const searchableModels = [
      { name: 'places', Model: models.Place, entityType: 'PLACE' },
      { name: 'markets', Model: models.Market, entityType: 'MARKET' },
      { name: 'foods', Model: models.Food, entityType: 'FOOD' },
      { name: 'food-places', Model: models.FoodPlace, entityType: 'FOOD_PLACE' },
      { name: 'artisans', Model: models.Artisan, entityType: 'ARTISAN' },
      { name: 'communities', Model: models.Community, entityType: 'COMMUNITY' },
      { name: 'events', Model: models.Event, entityType: 'EVENT' },
      { name: 'stories', Model: models.Story, entityType: 'STORY' },
      { name: 'trails', Model: models.Trail, entityType: 'TRAIL' },
    ];

    const searchPromises = searchableModels.map(async ({ Model, entityType }) => {
      let filter = {
        $or: [
          { name: regexPattern },
          { title: regexPattern },
          { description: regexPattern },
          { tags: regexPattern },
        ],
      };
      filter = applyPublicationGating(filter, userRole);
      const items = await Model.find(filter).limit(limitNum).lean();
      return items.map((item) => ({
        entity_type: entityType,
        ...item,
      }));
    });

    const allResultsNested = await Promise.all(searchPromises);
    const searchResults = allResultsNested.flat();

    res.status(200).json({
      success: true,
      data: {
        query: q,
        total_results: searchResults.length,
        results: searchResults,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNear,
  getBBox,
  search,
};
