const models = require('../models');

/**
 * Get featured documentary reels & live loops
 */
const getFeaturedReels = async (req, res, next) => {
  try {
    const reels = await models.Reel.find({ is_featured: true }).lean();

    // Fallback default featured reel if db is empty
    const defaultReel = {
      id: 'reel-rajwada-01',
      title: 'Rajwada Palace & The Royal Heart',
      category_tag: 'ARCHITECTURAL LEGACY',
      city: 'Indore',
      state: 'Madhya Pradesh',
      description: 'Cinematic visual chronicle of the 7-story Maratha fortress & living heritage',
      thumbnail_url: 'https://images.unsplash.com/photo-1599831104321-4f10115e5743?w=800&auto=format&fit=crop&q=80',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      is_4k_hdr: true,
      is_live_loop: true,
      chapters: [
        { id: 'c1', title: '01 Rajwada Palace', start_time_seconds: 0, place_id: 'rajwada-palace' },
        { id: 'c2', title: '02 Sarafa By Night', start_time_seconds: 45, place_id: 'sarafa-bazaar' },
        { id: 'c3', title: '03 Mandu Gates', start_time_seconds: 90, place_id: 'mandu-fort' },
      ],
    };

    res.status(200).json({
      success: true,
      data: reels.length > 0 ? reels : [defaultReel],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeaturedReels,
};
