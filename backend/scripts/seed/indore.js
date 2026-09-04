const { connectDB, disconnectDB } = require('../../src/config/db');
const {
  Country,
  State,
  City,
  Place,
  Market,
  Food,
  FoodPlace,
  Artisan,
  Community,
  Event,
  Story,
  Trail,
} = require('../../src/models');

const SYSTEM_VERIFICATION = {
  verification_status: 'VERIFIED',
  verified_by: 'system',
  verified_at: new Date('2026-08-01T00:00:00Z'),
  verification_notes: 'Sourced and verified from Indore Cultural Heritage Dossier',
  sources: ['Indore Cultural Heritage Dossier (SIH 2026 / Bhraman Archive)'],
};

const SYSTEM_PUBLICATION = {
  publication_status: 'PUBLISHED',
  published_at: new Date('2026-08-02T00:00:00Z'),
  published_by: 'system',
};

const seedIndore = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Seeding Reference Locations...');
    await Country.findOneAndUpdate(
      { _id: 'country_in' },
      { _id: 'country_in', code: 'IN', name: 'India' },
      { upsert: true, new: true }
    );

    await State.findOneAndUpdate(
      { _id: 'state_mp' },
      {
        _id: 'state_mp',
        name: 'Madhya Pradesh',
        normalized_name: 'madhya pradesh',
        country_code: 'IN',
        description: 'Heart of India, rich in Holkar heritage and natural landscapes.',
        location: { type: 'Point', coordinates: [78.6569, 22.9734] },
      },
      { upsert: true, new: true }
    );

    await City.findOneAndUpdate(
      { _id: 'city_indore_mp' },
      {
        _id: 'city_indore_mp',
        name: 'Indore',
        normalized_name: 'indore',
        state_id: 'state_mp',
        country_code: 'IN',
        location: { type: 'Point', coordinates: [75.8577, 22.7196] },
        short_description: 'The street food capital of Central India.',
        description:
          'Indore is the commercial capital of Madhya Pradesh, famous for its Holkar dynasty history, vibrant night markets like Sarafa Bazaar, 56 Dukan food strip, and clean civic culture.',
        cultural_summary:
          'Known for Sarafa Bazaar night food market, Rajwada Palace, Krishnapura Chhatris, Maheshwari weaving connections, and Malwa culinary heritage.',
        highlights: ['Sarafa Bazaar', 'Rajwada Palace', 'Chappan Dukan', 'Khajrana Ganesh Temple'],
        is_featured: true,
        tags: ['food_city', 'malwa_region', 'holkar_heritage'],
        status: 'ACTIVE',
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Places...');
    const placesData = [
      {
        _id: 'place_rajwada_palace',
        name: 'Rajwada Palace',
        normalized_name: 'rajwada palace',
        place_type: 'HERITAGE',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        location: { type: 'Point', coordinates: [75.8577, 22.7196] },
        address: { line1: 'MG Road, Rajwada', city_id: 'city_indore_mp', state_id: 'state_mp', country_code: 'IN' },
        description: 'A 7-story historical palace built by the Holkar Dynasty combining Maratha, Mughal, and French architectural styles.',
        historical_significance: 'Built by Malhar Rao Holkar in 1747, served as the royal residence of the Holkar rulers.',
        architectural_style: 'Maratha-Mughal-French Fusion',
        visiting_hours: '10:00 AM - 05:00 PM',
        entry_fee: '₹20 for Indians, ₹250 for Foreigners',
        best_time_to_visit: 'October to March',
        discovery: { is_hidden_gem: false, discovery_level: 'MAINSTREAM' },
        tags: ['palace', 'holkar', 'maratha_architecture', 'landmark'],
      },
      {
        _id: 'place_lal_bagh_palace',
        name: 'Lal Bagh Palace',
        normalized_name: 'lal bagh palace',
        place_type: 'HERITAGE',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        location: { type: 'Point', coordinates: [75.8364, 22.7003] },
        address: { line1: 'Nai Dunia, Lalbagh', city_id: 'city_indore_mp', state_id: 'state_mp', country_code: 'IN' },
        description: 'Grand 19th-century European style palace set amidst 28 acres of gardens, showcasing opulent Holkar royal artifacts.',
        historical_significance: 'Constructed by Maharaja Shivaji Rao Holkar between 1886 and 1921.',
        architectural_style: 'Italian Renaissance Revival',
        visiting_hours: '10:00 AM - 05:00 PM (Closed Mondays)',
        entry_fee: '₹20',
        best_time_to_visit: 'Winter months',
        discovery: { is_hidden_gem: false, discovery_level: 'MAINSTREAM' },
        tags: ['palace', 'museum', 'gardens'],
      },
      {
        _id: 'place_krishnapura_chhatris',
        name: 'Krishnapura Chhatris',
        normalized_name: 'krishnapura chhatris',
        place_type: 'HERITAGE',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        location: { type: 'Point', coordinates: [75.8589, 22.7181] },
        address: { line1: 'MG Road, Khan River bank', city_id: 'city_indore_mp', state_id: 'state_mp', country_code: 'IN' },
        description: 'Intricately carved stone cenotaphs dedicated to Holkar rulers on the banks of the Khan River.',
        historical_significance: 'Royal cenotaphs commemorating Maharani Krishna Bai and other Holkar rulers.',
        architectural_style: 'Maratha Rock Carving',
        visiting_hours: '09:00 AM - 06:00 PM',
        entry_fee: 'Free',
        discovery: { is_hidden_gem: false, discovery_level: 'MAINSTREAM' },
        tags: ['chhatri', 'cenotaph', 'architecture'],
      },
      {
        _id: 'place_khajrana_ganesh',
        name: 'Khajrana Ganesh Temple',
        normalized_name: 'khajrana ganesh temple',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        location: { type: 'Point', coordinates: [75.9085, 22.7298] },
        address: { line1: 'Khajrana Main Road', city_id: 'city_indore_mp', state_id: 'state_mp', country_code: 'IN' },
        description: 'Historic Ganesha temple built by Maharani Ahilyabai Holkar in 1735, deeply revered across Central India.',
        historical_significance: 'The Ganesha idol was hidden in a well to save it from Aurangzeb before Ahilyabai enshrined it.',
        visiting_hours: '05:00 AM - 11:00 PM',
        entry_fee: 'Free',
        discovery: { is_hidden_gem: false, discovery_level: 'MAINSTREAM' },
        tags: ['temple', 'ganesha', 'ahilyabai', 'pilgrimage'],
      },
      {
        _id: 'place_kanch_mandir',
        name: 'Kanch Mandir',
        normalized_name: 'kanch mandir',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        location: { type: 'Point', coordinates: [75.8522, 22.7169] },
        address: { line1: 'Itwaria Bazaar', city_id: 'city_indore_mp', state_id: 'state_mp', country_code: 'IN' },
        description: 'Exquisite Jain temple constructed entirely of glass mirrors, glass mosaics, and chandeliers.',
        historical_significance: 'Built by cotton merchant Sir Seth Hukumchand in the early 20th century.',
        architectural_style: 'Glass Mosaic Interior Architecture',
        visiting_hours: '05:00 AM - 12:00 PM, 04:00 PM - 08:00 PM',
        entry_fee: 'Free',
        discovery: { is_hidden_gem: false, discovery_level: 'LESSER_KNOWN' },
        tags: ['jain_temple', 'glass_work', 'hukumchand'],
      },
      {
        _id: 'place_patalpani_waterfall',
        name: 'Patalpani Waterfall',
        normalized_name: 'patalpani waterfall',
        place_type: 'HIDDEN_GEM',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        location: { type: 'Point', coordinates: [75.7891, 22.5028] },
        address: { line1: 'Dr. Ambedkar Nagar (Mhow)', city_id: 'city_indore_mp', state_id: 'state_mp', country_code: 'IN' },
        description: '300-foot scenic waterfall surrounded by lush green Malwa hills and heritage railway lines.',
        discovery: { is_hidden_gem: true, discovery_level: 'LOCAL_SECRET', why_visit: 'Scenic monsoon trek with heritage narrow-gauge rail history.' },
        tags: ['waterfall', 'nature', 'monsoon', 'hidden_gem'],
      },
    ];

    for (const p of placesData) {
      await Place.findOneAndUpdate(
        { _id: p._id },
        { ...p, verification: SYSTEM_VERIFICATION, publication: SYSTEM_PUBLICATION },
        { upsert: true, new: true }
      );
    }

    console.log('[Seed] Seeding Markets...');
    const marketsData = [
      {
        _id: 'market_sarafa_bazaar',
        name: 'Sarafa Bazaar',
        normalized_name: 'sarafa bazaar',
        market_type: 'NIGHT_MARKET',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        location: { type: 'Point', coordinates: [75.8560, 22.7188] },
        address: { line1: 'Sarafa, near Rajwada', city_id: 'city_indore_mp', state_id: 'state_mp', country_code: 'IN' },
        description: 'Jewellery market by day that transforms into Central India’s legendary midnight street food street by 8:00 PM.',
        operating_hours: '08:00 PM - 02:00 AM (Food Market)',
        best_known_for: ['Bhutte ka Kees', 'Garadu', 'Jaleba', 'Dahi Vada', 'Malpua'],
        tags: ['night_market', 'street_food', 'jewellery'],
      },
      {
        _id: 'market_chappan_dukan',
        name: 'Chappan Dukan',
        normalized_name: 'chappan dukan',
        market_type: 'FOOD_MARKET',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        location: { type: 'Point', coordinates: [75.8824, 22.7244] },
        address: { line1: 'New Palasia', city_id: 'city_indore_mp', state_id: 'state_mp', country_code: 'IN' },
        description: 'Clean pedestrian food strip featuring 56 legendary eateries offering breakfast poha, chaat, and sweets.',
        operating_hours: '06:00 AM - 11:00 PM',
        best_known_for: ['Poha Jalebi', 'Johny Hot Dog', 'Shikanji', 'Namkeen'],
        tags: ['food_strip', '56_dukan', 'breakfast'],
      },
    ];

    for (const m of marketsData) {
      await Market.findOneAndUpdate(
        { _id: m._id },
        { ...m, verification: SYSTEM_VERIFICATION, publication: SYSTEM_PUBLICATION },
        { upsert: true, new: true }
      );
    }

    console.log('[Seed] Seeding Foods...');
    const foodsData = [
      {
        _id: 'food_poha_jalebi',
        name: 'Indori Poha-Jalebi',
        normalized_name: 'indori poha-jalebi',
        food_category: 'STREET_FOOD',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        description: 'Steamed flattened rice spiced with Jeeravan powder, topped with crunchy Sev, raw onion, and paired with hot crispy Jalebis.',
        cultural_origin: 'Indore, Malwa Region',
        key_ingredients: ['Poha', 'Jeeravan Masala', 'Indori Sev', 'Jalebi', 'Pomegranate'],
        tags: ['breakfast', 'iconic', 'poha'],
      },
      {
        _id: 'food_bhutte_ka_kees',
        name: 'Bhutte Ka Kees',
        normalized_name: 'bhutte ka kees',
        food_category: 'STREET_FOOD',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        description: 'Grated corn cooked with milk, mustard seeds, green chillies, and coconut garnish.',
        cultural_origin: 'Sarafa Bazaar, Indore',
        key_ingredients: ['Sweet Corn', 'Milk', 'Ghee', 'Mustard Seeds', 'Coconut'],
        tags: ['sarafa_special', 'corn', 'winter_special'],
      },
      {
        _id: 'food_garadu',
        name: 'Garadu',
        normalized_name: 'garadu',
        food_category: 'SNACK',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        description: 'Deep-fried yam chunks tossed in fiery spices and freshly squeezed lemon juice.',
        cultural_origin: 'Malwa Winter Street Food',
        key_ingredients: ['Yam', 'Special Spices', 'Lemon'],
        tags: ['winter_food', 'spicy', 'sarafa'],
      },
    ];

    for (const f of foodsData) {
      await Food.findOneAndUpdate(
        { _id: f._id },
        { ...f, verification: SYSTEM_VERIFICATION, publication: SYSTEM_PUBLICATION },
        { upsert: true, new: true }
      );
    }

    console.log('[Seed] Seeding Food Places...');
    const foodPlacesData = [
      {
        _id: 'food_place_johny_hot_dog',
        name: 'Johny Hot Dog',
        normalized_name: 'johny hot dog',
        food_place_type: 'STALL',
        associated_food_ids: ['food_poha_jalebi'],
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        location: { type: 'Point', coordinates: [75.8824, 22.7244] },
        address: { line1: 'Shop 29, Chappan Dukan', city_id: 'city_indore_mp', state_id: 'state_mp', country_code: 'IN' },
        description: 'Famous single-item eatery serving legendary mutton and veg hot dogs cooked on buttered tawa since decades.',
        operating_hours: '09:00 AM - 10:30 PM',
        price_range: '₹50 - ₹100',
        is_heritage_vendor: true,
        est_year: 1978,
        tags: ['chappan_dukan', 'hot_dog', 'heritage_vendor'],
      },
    ];

    for (const fp of foodPlacesData) {
      await FoodPlace.findOneAndUpdate(
        { _id: fp._id },
        { ...fp, verification: SYSTEM_VERIFICATION, publication: SYSTEM_PUBLICATION },
        { upsert: true, new: true }
      );
    }

    console.log('[Seed] Seeding Artisans & Communities...');
    await Artisan.findOneAndUpdate(
      { _id: 'artisan_maheshwari_weavers' },
      {
        _id: 'artisan_maheshwari_weavers',
        name: 'Maheshwari Saree Weavers Guild',
        normalized_name: 'maheshwari saree weavers guild',
        specialization_type: 'TEXTILE',
        craft_description: 'Traditional silk and cotton saree weaving created under royal patronage of Devi Ahilyabai Holkar in Maheshwar.',
        district: 'Khargone / Indore',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        location: { type: 'Point', coordinates: [75.5833, 22.1833] },
        is_master_craftsperson: true,
        awards: ['National Handicraft Award'],
        tags: ['handloom', 'saree', 'ahilyabai', 'textile'],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_chippa_khatri' },
      {
        _id: 'community_chippa_khatri',
        name: 'Chippa/Khatri Block-Printing Community',
        normalized_name: 'chippa/khatri block-printing community',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        description: 'Traditional artisan community practicing natural-dye wooden block printing on fabrics in Malwa region.',
        cultural_contribution: 'Preserved 400-year-old Bagh block print techniques using natural mineral dyes.',
        heritage_crafts_or_foods: ['Bagh Block Print', 'Dabu Print'],
        tags: ['community', 'artisans', 'bagh_print'],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Events & Stories...');
    await Event.findOneAndUpdate(
      { _id: 'event_rangpanchami_gair' },
      {
        _id: 'event_rangpanchami_gair',
        name: 'Rangpanchami Gair Procession',
        normalized_name: 'rangpanchami gair procession',
        event_type: 'FESTIVAL',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        location: { type: 'Point', coordinates: [75.8577, 22.7196] },
        recurrence: 'Annual (5 days after Holi)',
        description: 'Historic Holkar-era procession through Rajwada where thousands gather under showers of herbal colors and water cannons.',
        cultural_significance: 'UNESCO Intangible Cultural Heritage nomination candidate reflecting Indore community harmony.',
        tags: ['festival', 'gair', 'rangpanchami', 'holkar_tradition'],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_buried_ganesha' },
      {
        _id: 'story_buried_ganesha',
        title: 'The Buried Ganesha of Khajrana',
        normalized_title: 'the buried ganesha of khajrana',
        story_type: 'LOCAL_HISTORY',
        associated_entity: { entity_type: 'PLACE', entity_id: 'place_khajrana_ganesh', name: 'Khajrana Ganesh Temple' },
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        narrative:
          'During the 18th century, priest Mangal Bhatt hid the sacred idol in a well to protect it. Devi Ahilyabai Holkar had a divine dream, excavated the idol, and built the famous Khajrana Mandir around it.',
        submitted_by: 'system',
        tags: ['legend', 'ahilyabai', 'khajrana'],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Trails...');
    await Trail.findOneAndUpdate(
      { _id: 'trail_indore_heritage_food' },
      {
        _id: 'trail_indore_heritage_food',
        name: 'Indore Heritage & Night Food Trail',
        normalized_name: 'indore heritage & night food trail',
        city_id: 'city_indore_mp',
        state_id: 'state_mp',
        description: 'A 5-stop evening trail starting at Rajwada Palace, passing Kanch Mandir, and ending at Sarafa Bazaar and Chappan Dukan.',
        theme: 'Heritage Architecture & Midnight Street Food',
        estimated_duration_mins: 180,
        distance_km: 6.5,
        stops: [
          { entity_type: 'PLACE', entity_id: 'place_rajwada_palace', name: 'Rajwada Palace', display_order: 1 },
          { entity_type: 'PLACE', entity_id: 'place_kanch_mandir', name: 'Kanch Mandir', display_order: 2 },
          { entity_type: 'MARKET', entity_id: 'market_sarafa_bazaar', name: 'Sarafa Bazaar', display_order: 3 },
          { entity_type: 'MARKET', entity_id: 'market_chappan_dukan', name: 'Chappan Dukan', display_order: 4 },
        ],
        tags: ['trail', 'walking_tour', 'food_trail', 'night_tour'],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Indore Pilot Data Seeded Successfully!');
  } catch (error) {
    console.error('[Seed] Error seeding Indore data:', error);
  } finally {
    await disconnectDB();
  }
};

seedIndore();
