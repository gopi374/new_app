const { randomUUID } = require('crypto');
const models = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Log a monument visit / check-in
 */
const logVisit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { place_id, notes, rating, verified_by_gps } = req.body;

    if (!place_id) {
      throw new ApiError(400, 'place_id is required');
    }

    const place = await models.Place.findById(place_id);
    if (!place) {
      throw new ApiError(404, `Place with ID '${place_id}' not found`);
    }

    let visit = await models.VisitedPlace.findOne({ user_id: userId, place_id });

    if (visit) {
      // Update existing visit
      visit.notes = notes !== undefined ? notes : visit.notes;
      visit.rating = rating !== undefined ? rating : visit.rating;
      visit.verified_by_gps = verified_by_gps !== undefined ? verified_by_gps : visit.verified_by_gps;
      visit.visited_at = new Date();
      await visit.save();
    } else {
      // Create new visit record
      visit = await models.VisitedPlace.create({
        _id: randomUUID(),
        user_id: userId,
        place_id,
        notes,
        rating,
        verified_by_gps: !!verified_by_gps,
      });

      // Award points & increment user stats
      await models.User.findByIdAndUpdate(userId, {
        $inc: { points: 50, monuments_visited: 1 },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Visit logged successfully',
      data: visit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle visited status (log or remove visit)
 */
const toggleVisit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { place_id } = req.body;

    if (!place_id) {
      throw new ApiError(400, 'place_id is required');
    }

    const existingVisit = await models.VisitedPlace.findOne({ user_id: userId, place_id });

    if (existingVisit) {
      await models.VisitedPlace.deleteOne({ _id: existingVisit._id });
      await models.User.findByIdAndUpdate(userId, {
        $inc: { points: -50 },
      });

      return res.status(200).json({
        success: true,
        action: 'removed',
        message: 'Place marked as unvisited',
      });
    } else {
      const visit = await models.VisitedPlace.create({
        _id: randomUUID(),
        user_id: userId,
        place_id,
      });

      await models.User.findByIdAndUpdate(userId, {
        $inc: { points: 50 },
      });

      return res.status(201).json({
        success: true,
        action: 'added',
        message: 'Place marked as visited',
        data: visit,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get Digital Passport overview for user
 */
const getPassportSummary = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      const stamps = await models.VirtualStamp.find().lean();
      return res.status(200).json({
        success: true,
        data: {
          user_id: 'guest',
          name: 'Heritage Explorer',
          role: 'Heritage Explorer',
          level: 'Novice Explorer • Lvl 1',
          points: 0,
          explorer_id: 'IH-GUEST-001',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
          stats: {
            monuments_visited: 0,
            badges_count: 0,
            saved_count: 0,
          },
          visited_places: [],
          available_stamps: stamps,
        },
      });
    }

    const user = await models.User.findById(userId).lean();
    if (!user) {
      throw new ApiError(404, 'User profile not found');
    }

    const visits = await models.VisitedPlace.find({ user_id: userId })
      .populate('place_id')
      .sort('-visited_at')
      .lean();

    const savedCount = await models.SavedItem.countDocuments({ user_id: userId });
    const stamps = await models.VirtualStamp.find().lean();

    // Determine explorer level based on points
    const points = user.points || 0;
    let level = 'Novice Explorer • Lvl 1';
    if (points >= 300) level = 'Master Explorer • Lvl 4';
    else if (points >= 200) level = 'Senior Explorer • Lvl 3';
    else if (points >= 100) level = 'Heritage Explorer • Lvl 2';

    res.status(200).json({
      success: true,
      data: {
        user_id: user._id,
        name: user.full_name,
        role: 'Heritage Explorer',
        level,
        points,
        explorer_id: `IH-${(user.full_name || 'EXPLORER').toUpperCase().replace(/\s+/g, '')}-001`,
        avatar_url: user.avatar_media?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        stats: {
          monuments_visited: visits.length,
          badges_count: user.badges?.length || 0,
          saved_count: savedCount,
        },
        visited_places: visits,
        available_stamps: stamps,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  logVisit,
  toggleVisit,
  getPassportSummary,
};
