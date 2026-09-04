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
  verification_notes: 'Sourced and verified from Ratlam Cultural Heritage Dossier',
  sources: ['Ratlam Cultural Heritage Dossier (SIH 2026 / Bhraman Archive)'],
};

const SYSTEM_PUBLICATION = {
  publication_status: 'PUBLISHED',
  published_at: new Date('2026-08-02T00:00:00Z'),
  published_by: 'system',
};

const seedRatlam = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Seeding Reference Locations...');

    await Country.findOneAndUpdate(
      { _id: 'country_in' },
      {
        _id: 'country_in',
        code: 'IN',
        name: 'India',
      },
      { upsert: true, new: true }
    );

    await State.findOneAndUpdate(
      { _id: 'state_mp' },
      {
        _id: 'state_mp',
        name: 'Madhya Pradesh',
        normalized_name: 'madhya pradesh',
        country_code: 'IN',
        description:
          'Heart of India, known for its Malwa heritage, historic cities, tribal traditions, temples, forts, crafts, and distinctive cuisine.',
        location: {
          type: 'Point',
          coordinates: [78.6569, 22.9734],
        },
      },
      { upsert: true, new: true }
    );

    await City.findOneAndUpdate(
      { _id: 'city_ratlam_mp' },
      {
        _id: 'city_ratlam_mp',
        name: 'Ratlam',
        normalized_name: 'ratlam',
        state_id: 'state_mp',
        country_code: 'IN',
        location: {
          type: 'Point',
          coordinates: [75.0367, 23.3315],
        },
        short_description:
          'A Malwa city famous for Ratlami Sev, royal heritage, traditional markets, temples, and tribal culture.',
        description:
          'Ratlam is an important city in the Malwa region of Madhya Pradesh, known for its distinctive Ratlami Sev, historic royal associations, railway heritage, traditional bazaars, temples, and proximity to the tribal and natural landscapes of western Madhya Pradesh.',
        cultural_summary:
          'Known for Ratlami Sev, Ratlam Palace, Kalika Mata Temple, Cactus Garden, traditional Malwa food, Jain and Hindu pilgrimage sites, and Bhil and tribal cultural traditions.',
        highlights: [
          'Ratlami Sev',
          'Ratlam Palace',
          'Kalika Mata Temple',
          'Cactus Garden',
          'Dhosla / Hussain Tekri',
          'Traditional Ratlam Bazaars',
        ],
        is_featured: true,
        tags: [
          'malwa_region',
          'ratlami_sev',
          'food_city',
          'royal_heritage',
          'tribal_culture',
        ],
        status: 'ACTIVE',
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Places...');

    const placesData = [
      {
        _id: 'place_ratlam_palace',
        name: 'Ratlam Palace',
        normalized_name: 'ratlam palace',
        place_type: 'HERITAGE',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.0337, 23.3311],
        },
        address: {
          line1: 'Ratlam Palace, Ratlam',
          city_id: 'city_ratlam_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic palace associated with the royal family of Ratlam and the former princely state of Ratlam.',
        historical_significance:
          'The palace represents the heritage of the Ratlam royal house, which was part of the historic Malwa political landscape.',
        architectural_style:
          'Rajput and Central Indian Palace Architecture',
        visiting_hours:
          'Access may be restricted; timings vary according to current management',
        entry_fee: 'Varies',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
        },
        tags: [
          'palace',
          'royal_heritage',
          'ratlam',
          'malwa',
        ],
      },
      {
        _id: 'place_kalika_mata_temple_ratlam',
        name: 'Kalika Mata Temple',
        normalized_name: 'kalika mata temple ratlam',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.0387, 23.3365],
        },
        address: {
          line1: 'Kalika Mata Temple, Ratlam',
          city_id: 'city_ratlam_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Prominent temple dedicated to Goddess Kalika and an important religious site for residents and pilgrims in Ratlam.',
        historical_significance:
          'The temple has longstanding religious importance in Ratlam and forms part of the city’s living Hindu heritage.',
        architectural_style:
          'Traditional Hindu Temple Architecture',
        visiting_hours: '05:00 AM - 10:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'Navratri and October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'temple',
          'kalika_mata',
          'navratri',
          'pilgrimage',
        ],
      },
      {
        _id: 'place_hussain_tekri_sharif',
        name: 'Hussain Tekri Sharif',
        normalized_name: 'hussain tekri sharif',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.0881, 23.2982],
        },
        address: {
          line1: 'Jaora, Ratlam District',
          city_id: 'city_ratlam_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Important Sufi pilgrimage site near Jaora known for its shrines, spiritual traditions, and large gatherings of devotees.',
        historical_significance:
          'A prominent shrine complex associated with Hussain Ali Shah and an important centre of Sufi devotion in the region.',
        architectural_style:
          'Indo-Islamic Shrine Architecture',
        visiting_hours: 'Open throughout the day; shrine timings may vary',
        entry_fee: 'Free',
        best_time_to_visit: 'Throughout the year; annual gatherings are especially significant',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'sufi',
          'shrine',
          'pilgrimage',
          'jaora',
          'ratlam_district',
        ],
      },
      {
        _id: 'place_gyaras_ka_mela_ground',
        name: 'Gyaras Mela Grounds',
        normalized_name: 'gyaras mela grounds ratlam',
        place_type: 'CULTURAL_SITE',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.0335, 23.3298],
        },
        address: {
          line1: 'Ratlam City',
          city_id: 'city_ratlam_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Traditional public gathering space associated with Ratlam’s fairs, seasonal celebrations, local commerce, and community events.',
        historical_significance:
          'Reflects the longstanding fair and bazaar culture of Ratlam and the wider Malwa region.',
        architectural_style: 'Traditional Fairground Landscape',
        visiting_hours: 'Event dependent',
        entry_fee: 'Event dependent',
        best_time_to_visit: 'During annual fair periods',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LOCAL_SECRET',
        },
        tags: [
          'fair',
          'local_culture',
          'festival',
          'community',
        ],
      },
      {
        _id: 'place_cactus_garden_ratlam',
        name: 'Cactus Garden Sailana',
        normalized_name: 'cactus garden sailana',
        place_type: 'NATURAL_SITE',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [74.9983, 23.4615],
        },
        address: {
          line1: 'Sailana, Ratlam District',
          city_id: 'city_ratlam_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Specialized garden near Sailana showcasing a wide collection of cactus and succulent plants in the semi-arid Malwa landscape.',
        historical_significance:
          'Associated with the horticultural interests and heritage of the Sailana royal family.',
        architectural_style:
          'Historic Garden and Horticultural Landscape',
        visiting_hours: '09:00 AM - 05:00 PM',
        entry_fee: 'Nominal entry fee',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
          why_visit:
            'A distinctive garden combining royal heritage, horticulture, and the dry landscape of western Malwa.',
        },
        tags: [
          'cactus',
          'garden',
          'sailana',
          'royal_heritage',
          'nature',
        ],
      },
      {
        _id: 'place_sailana_palace',
        name: 'Sailana Palace',
        normalized_name: 'sailana palace',
        place_type: 'HERITAGE',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [74.9994, 23.4632],
        },
        address: {
          line1: 'Sailana, Ratlam District',
          city_id: 'city_ratlam_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic royal residence associated with the former princely state of Sailana and its culinary and cultural legacy.',
        historical_significance:
          'The palace reflects the heritage of the Sailana royal family, renowned for its patronage of food, arts, and regional culture.',
        architectural_style:
          'Rajput and Central Indian Palace Architecture',
        visiting_hours:
          'Access may vary depending on current use and management',
        entry_fee: 'Varies',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
        },
        tags: [
          'palace',
          'sailana',
          'royal_heritage',
          'malwa',
          'food_heritage',
        ],
      },
    ];

    for (const p of placesData) {
      await Place.findOneAndUpdate(
        { _id: p._id },
        {
          ...p,
          verification: SYSTEM_VERIFICATION,
          publication: SYSTEM_PUBLICATION,
        },
        { upsert: true, new: true }
      );
    }

    console.log('[Seed] Seeding Markets...');

    const marketsData = [
      {
        _id: 'market_ratlam_sailana_road',
        name: 'Ratlam Main Bazaar',
        normalized_name: 'ratlam main bazaar',
        market_type: 'TRADITIONAL_MARKET',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.0347, 23.3317],
        },
        address: {
          line1: 'Main Bazaar, Ratlam',
          city_id: 'city_ratlam_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Traditional central market featuring Ratlami Sev shops, sweets, spices, textiles, jewellery, household goods, and everyday local commerce.',
        operating_hours: '10:00 AM - 09:00 PM',
        best_known_for: [
          'Ratlami Sev',
          'Namkeen',
          'Sweets',
          'Spices',
          'Traditional Clothing',
        ],
        tags: [
          'traditional_market',
          'ratlami_sev',
          'namkeen',
          'shopping',
        ],
      },
      {
        _id: 'market_dalumodi_bazaar',
        name: 'Dalumodi Bazaar',
        normalized_name: 'dalumodi bazaar ratlam',
        market_type: 'FOOD_MARKET',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.0382, 23.3344],
        },
        address: {
          line1: 'Dalumodi Bazaar, Ratlam',
          city_id: 'city_ratlam_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Local commercial area with traditional snack shops, namkeen sellers, sweets, tea stalls, and everyday market activity.',
        operating_hours: '08:00 AM - 10:00 PM',
        best_known_for: [
          'Ratlami Sev',
          'Kachori',
          'Samosa',
          'Jalebi',
          'Namkeen',
        ],
        tags: [
          'food_market',
          'street_food',
          'ratlami_sev',
          'local_market',
        ],
      },
      {
        _id: 'market_sailana_food_bazaar',
        name: 'Sailana Food Bazaar',
        normalized_name: 'sailana food bazaar',
        market_type: 'FOOD_MARKET',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [74.9989, 23.4629],
        },
        address: {
          line1: 'Sailana, Ratlam District',
          city_id: 'city_ratlam_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Local food area associated with Sailana’s celebrated culinary traditions, snacks, sweets, and royal-inspired cuisine.',
        operating_hours: '10:00 AM - 10:00 PM',
        best_known_for: [
          'Dal Bafla',
          'Malwa Snacks',
          'Sweets',
          'Namkeen',
        ],
        tags: [
          'sailana',
          'food',
          'malwa',
          'royal_cuisine',
        ],
      },
    ];

    for (const m of marketsData) {
      await Market.findOneAndUpdate(
        { _id: m._id },
        {
          ...m,
          verification: SYSTEM_VERIFICATION,
          publication: SYSTEM_PUBLICATION,
        },
        { upsert: true, new: true }
      );
    }

    console.log('[Seed] Seeding Foods...');

    const foodsData = [
      {
        _id: 'food_ratlami_sev',
        name: 'Ratlami Sev',
        normalized_name: 'ratlami sev',
        food_category: 'SNACK',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        description:
          'Thin, crisp noodle-shaped savoury snack made from gram flour and a distinctive blend of spices, especially associated with Ratlam.',
        cultural_origin: 'Ratlam, Malwa Region',
        key_ingredients: [
          'Gram Flour',
          'Black Pepper',
          'Clove',
          'Spices',
          'Oil',
        ],
        tags: [
          'ratlami_sev',
          'namkeen',
          'iconic',
          'snack',
          'malwa',
        ],
      },
      {
        _id: 'food_dal_bafla_ratlam',
        name: 'Malwa Dal Bafla',
        normalized_name: 'malwa dal bafla ratlam',
        food_category: 'TRADITIONAL_FOOD',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        description:
          'Traditional Malwa meal of wheat-based bafla served with dal, generous ghee, chutneys, and seasonal accompaniments.',
        cultural_origin: 'Malwa Region',
        key_ingredients: [
          'Wheat',
          'Toor Dal',
          'Ghee',
          'Spices',
          'Chutneys',
        ],
        tags: [
          'dal_bafla',
          'malwa',
          'traditional_food',
          'vegetarian',
        ],
      },
      {
        _id: 'food_ratlami_kachori',
        name: 'Ratlami Kachori',
        normalized_name: 'ratlami kachori',
        food_category: 'SNACK',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        description:
          'Crisp, spiced pastry snack enjoyed across Ratlam and the Malwa region, commonly paired with chutneys and tea.',
        cultural_origin: 'Ratlam / Malwa Region',
        key_ingredients: [
          'Refined Flour',
          'Moong Dal',
          'Fennel',
          'Chilli',
          'Spices',
        ],
        tags: [
          'kachori',
          'snack',
          'street_food',
          'malwa',
        ],
      },
      {
        _id: 'food_bhutte_ka_kees_ratlam',
        name: 'Bhutte Ka Kees',
        normalized_name: 'bhutte ka kees ratlam',
        food_category: 'STREET_FOOD',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        description:
          'Grated corn cooked with milk, spices, and ghee, representing the wider vegetarian street-food traditions of Malwa.',
        cultural_origin: 'Malwa Region',
        key_ingredients: [
          'Sweet Corn',
          'Milk',
          'Ghee',
          'Mustard Seeds',
          'Green Chilli',
          'Coconut',
        ],
        tags: [
          'corn',
          'malwa',
          'street_food',
          'vegetarian',
        ],
      },
      {
        _id: 'food_malpua_ratlam',
        name: 'Malpua',
        normalized_name: 'malpua ratlam',
        food_category: 'SWEET',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        description:
          'Traditional sweet pancake soaked in sugar syrup and served as a festive and celebratory dessert in the Malwa region.',
        cultural_origin: 'Malwa / Central India',
        key_ingredients: [
          'Wheat Flour',
          'Milk',
          'Sugar',
          'Cardamom',
          'Ghee',
        ],
        tags: [
          'sweet',
          'dessert',
          'malwa',
          'festival',
        ],
      },
    ];

    for (const f of foodsData) {
      await Food.findOneAndUpdate(
        { _id: f._id },
        {
          ...f,
          verification: SYSTEM_VERIFICATION,
          publication: SYSTEM_PUBLICATION,
        },
        { upsert: true, new: true }
      );
    }

    console.log('[Seed] Seeding Food Places...');

    const foodPlacesData = [
      {
        _id: 'food_place_ratlam_sev_vendors',
        name: 'Ratlami Sev Vendors',
        normalized_name: 'ratlami sev vendors',
        food_place_type: 'STALL',
        associated_food_ids: [
          'food_ratlami_sev',
          'food_ratlami_kachori',
        ],
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.0350, 23.3320],
        },
        address: {
          line1: 'Main Bazaar, Ratlam',
          city_id: 'city_ratlam_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Traditional namkeen shops and small vendors specializing in Ratlami Sev and other local savoury snacks.',
        operating_hours: '09:00 AM - 09:00 PM',
        price_range: '₹50 - ₹300',
        is_heritage_vendor: true,
        est_year: 1970,
        tags: [
          'ratlami_sev',
          'namkeen',
          'heritage_vendor',
          'ratlam',
        ],
      },
      {
        _id: 'food_place_sailana_royal_cuisine',
        name: 'Sailana Royal Cuisine Eateries',
        normalized_name: 'sailana royal cuisine eateries',
        food_place_type: 'RESTAURANT',
        associated_food_ids: [
          'food_dal_bafla_ratlam',
          'food_bhutte_ka_kees_ratlam',
          'food_malpua_ratlam',
        ],
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [74.9990, 23.4630],
        },
        address: {
          line1: 'Sailana, Ratlam District',
          city_id: 'city_ratlam_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Local eateries around Sailana offering Malwa dishes and food traditions associated with the region’s historic royal culinary culture.',
        operating_hours: '11:00 AM - 10:00 PM',
        price_range: '₹150 - ₹500',
        is_heritage_vendor: true,
        est_year: 1980,
        tags: [
          'sailana',
          'royal_cuisine',
          'malwa_food',
          'traditional_food',
        ],
      },
      {
        _id: 'food_place_ratlam_breakfast_stalls',
        name: 'Ratlam Breakfast Street Vendors',
        normalized_name: 'ratlam breakfast street vendors',
        food_place_type: 'STALL',
        associated_food_ids: [
          'food_ratlami_kachori',
          'food_ratlami_sev',
        ],
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.0342, 23.3309],
        },
        address: {
          line1: 'Central Ratlam',
          city_id: 'city_ratlam_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Morning street-food stalls serving kachori, namkeen, tea, sweets, and other everyday Malwa breakfast snacks.',
        operating_hours: '07:00 AM - 11:00 AM',
        price_range: '₹30 - ₹150',
        is_heritage_vendor: false,
        est_year: 1985,
        tags: [
          'breakfast',
          'street_food',
          'kachori',
          'namkeen',
        ],
      },
    ];

    for (const fp of foodPlacesData) {
      await FoodPlace.findOneAndUpdate(
        { _id: fp._id },
        {
          ...fp,
          verification: SYSTEM_VERIFICATION,
          publication: SYSTEM_PUBLICATION,
        },
        { upsert: true, new: true }
      );
    }

    console.log('[Seed] Seeding Artisans & Communities...');

    await Artisan.findOneAndUpdate(
      { _id: 'artisan_ratlam_ratlami_sev' },
      {
        _id: 'artisan_ratlam_ratlami_sev',
        name: 'Ratlami Sev Traditional Makers',
        normalized_name: 'ratlami sev traditional makers',
        specialization_type: 'FOOD_CRAFT',
        craft_description:
          'Traditional food makers preserving the distinctive spice blends, preparation techniques, and small-scale production traditions of Ratlami Sev.',
        district: 'Ratlam',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.0367, 23.3315],
        },
        is_master_craftsperson: true,
        awards: [],
        tags: [
          'ratlami_sev',
          'namkeen',
          'food_craft',
          'malwa',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Artisan.findOneAndUpdate(
      { _id: 'artisan_ratlam_handloom' },
      {
        _id: 'artisan_ratlam_handloom',
        name: 'Ratlam Handloom and Textile Artisans',
        normalized_name: 'ratlam handloom and textile artisans',
        specialization_type: 'TEXTILE',
        craft_description:
          'Local textile artisans working with traditional fabrics, embroidery, handloom products, and regional textile decoration techniques.',
        district: 'Ratlam',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.0367, 23.3315],
        },
        is_master_craftsperson: false,
        awards: [],
        tags: [
          'handloom',
          'textile',
          'embroidery',
          'crafts',
          'malwa',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_ratlam_bhil_tribal' },
      {
        _id: 'community_ratlam_bhil_tribal',
        name: 'Bhil Tribal Communities of Ratlam',
        normalized_name: 'bhil tribal communities of ratlam',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        description:
          'Bhil and related tribal communities living across the Ratlam and western Madhya Pradesh region, maintaining distinctive traditions of art, music, festivals, agriculture, and oral storytelling.',
        cultural_contribution:
          'Preserved traditional tribal art, folk music, dance, seasonal festivals, oral histories, and indigenous knowledge connected with the Malwa landscape.',
        heritage_crafts_or_foods: [
          'Bhil Folk Art',
          'Traditional Tribal Music',
          'Folk Dance',
          'Seasonal Foods',
        ],
        tags: [
          'bhil',
          'tribal',
          'community',
          'folk_art',
          'malwa',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_ratlam_sev_makers' },
      {
        _id: 'community_ratlam_sev_makers',
        name: 'Ratlami Namkeen Maker Community',
        normalized_name: 'ratlami namkeen maker community',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        description:
          'Small food businesses and traditional snack makers responsible for preserving Ratlam’s distinctive namkeen-making culture.',
        cultural_contribution:
          'Preserved Ratlami Sev and associated snack-making knowledge through family recipes, spice blends, preparation methods, and local food businesses.',
        heritage_crafts_or_foods: [
          'Ratlami Sev',
          'Namkeen',
          'Kachori',
          'Traditional Snack Making',
        ],
        tags: [
          'community',
          'ratlami_sev',
          'namkeen',
          'food_heritage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Events & Stories...');

    await Event.findOneAndUpdate(
      { _id: 'event_ratlam_dussehra_mela' },
      {
        _id: 'event_ratlam_dussehra_mela',
        name: 'Ratlam Dussehra Mela',
        normalized_name: 'ratlam dussehra mela',
        event_type: 'FESTIVAL',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.0340, 23.3305],
        },
        recurrence: 'Annual',
        description:
          'Annual festive gathering featuring religious celebrations, fairs, entertainment, local commerce, food stalls, and community activities.',
        cultural_significance:
          'Brings together Ratlam’s neighbourhoods and surrounding communities through a combination of religious celebration, fair culture, food, and public entertainment.',
        tags: [
          'dussehra',
          'mela',
          'festival',
          'community',
          'ratlam',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_sailana_food_festival' },
      {
        _id: 'event_sailana_food_festival',
        name: 'Sailana Food & Culinary Heritage Festival',
        normalized_name: 'sailana food culinary heritage festival',
        event_type: 'FOOD_FESTIVAL',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [74.9990, 23.4630],
        },
        recurrence: 'Occasional / Annual local celebration',
        description:
          'Food-focused cultural gathering celebrating the culinary traditions of Sailana and the wider Malwa region.',
        cultural_significance:
          'Highlights the region’s royal culinary legacy, traditional Malwa dishes, local ingredients, and food knowledge.',
        tags: [
          'food_festival',
          'sailana',
          'malwa_food',
          'royal_cuisine',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_ratlam_ganeshotsav' },
      {
        _id: 'event_ratlam_ganeshotsav',
        name: 'Ratlam Ganeshotsav',
        normalized_name: 'ratlam ganeshotsav',
        event_type: 'FESTIVAL',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.0367, 23.3315],
        },
        recurrence: 'Annual',
        description:
          'Community celebration of Ganesh Chaturthi featuring decorated pandals, devotional programmes, processions, music, and neighbourhood gatherings.',
        cultural_significance:
          'Reflects Ratlam’s living festival culture and the role of community organisations in maintaining local religious and artistic traditions.',
        tags: [
          'ganesh',
          'festival',
          'community',
          'procession',
          'ratlam',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_origin_of_ratlami_sev' },
      {
        _id: 'story_origin_of_ratlami_sev',
        title: 'The Story of Ratlami Sev',
        normalized_title: 'the story of ratlami sev',
        story_type: 'FOOD_HISTORY',
        associated_entity: {
          entity_type: 'FOOD',
          entity_id: 'food_ratlami_sev',
          name: 'Ratlami Sev',
        },
        city_id: 'city_ratlam_mp',
        narrative:
          'Ratlami Sev became one of the defining foods of Ratlam through the city’s long tradition of savoury snack making. Its thin texture and distinctive combination of spices give it a character different from many other sev varieties. Over generations, local makers refined their recipes and turned the snack into one of Ratlam’s best-known cultural symbols.',
        submitted_by: 'system',
        tags: [
          'ratlami_sev',
          'food_history',
          'namkeen',
          'ratlam',
          'malwa',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_sailana_royal_cuisine' },
      {
        _id: 'story_sailana_royal_cuisine',
        title: 'The Royal Kitchen of Sailana',
        normalized_title: 'the royal kitchen of sailana',
        story_type: 'FOOD_HISTORY',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_sailana_palace',
          name: 'Sailana Palace',
        },
        city_id: 'city_ratlam_mp',
        narrative:
          'Sailana developed a distinctive reputation for its royal culinary traditions. The kitchens of the former princely state experimented with local Malwa ingredients alongside techniques and influences from across India. This culinary heritage helped establish Sailana as an important destination for traditional food lovers in the Ratlam region.',
        submitted_by: 'system',
        tags: [
          'sailana',
          'royal_food',
          'culinary_history',
          'malwa',
          'palace',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_ratlam_malwa_railway' },
      {
        _id: 'story_ratlam_malwa_railway',
        title: 'Ratlam and the Malwa Railway Heritage',
        normalized_title: 'ratlam and the malwa railway heritage',
        story_type: 'LOCAL_HISTORY',
        associated_entity: {
          entity_type: 'CITY',
          entity_id: 'city_ratlam_mp',
          name: 'Ratlam',
        },
        city_id: 'city_ratlam_mp',
        narrative:
          'Ratlam developed into an important railway junction connecting western and central India. The railway transformed the city’s commercial importance and strengthened its connections with Mumbai, Delhi, Rajasthan, Gujarat, and other parts of Madhya Pradesh. This transport heritage remains an important part of Ratlam’s modern identity.',
        submitted_by: 'system',
        tags: [
          'railway',
          'history',
          'ratlam',
          'commerce',
          'malwa',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Trails...');

    await Trail.findOneAndUpdate(
      { _id: 'trail_ratlam_food_heritage' },
      {
        _id: 'trail_ratlam_food_heritage',
        name: 'Ratlam Food & Heritage Trail',
        normalized_name: 'ratlam food & heritage trail',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        description:
          'A food and heritage trail exploring Ratlam’s royal history, traditional markets, Ratlami Sev culture, and Malwa cuisine.',
        theme: 'Ratlami Sev, Royal Heritage & Malwa Food',
        estimated_duration_mins: 210,
        distance_km: 7.0,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_ratlam_palace',
            name: 'Ratlam Palace',
            display_order: 1,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_kalika_mata_temple_ratlam',
            name: 'Kalika Mata Temple',
            display_order: 2,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_ratlam_sailana_road',
            name: 'Ratlam Main Bazaar',
            display_order: 3,
          },
          {
            entity_type: 'FOOD_PLACE',
            entity_id: 'food_place_ratlam_sev_vendors',
            name: 'Ratlami Sev Vendors',
            display_order: 4,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_dalumodi_bazaar',
            name: 'Dalumodi Bazaar',
            display_order: 5,
          },
        ],
        tags: [
          'trail',
          'food_trail',
          'heritage',
          'ratlami_sev',
          'malwa',
          'markets',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Trail.findOneAndUpdate(
      { _id: 'trail_sailana_royal_food' },
      {
        _id: 'trail_sailana_royal_food',
        name: 'Sailana Royal Food & Garden Trail',
        normalized_name: 'sailana royal food & garden trail',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        description:
          'A heritage excursion to Sailana exploring the former royal palace, cactus garden, and the culinary traditions associated with the Sailana royal household.',
        theme: 'Royal Heritage, Gardens & Culinary Traditions',
        estimated_duration_mins: 180,
        distance_km: 4.0,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_sailana_palace',
            name: 'Sailana Palace',
            display_order: 1,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_cactus_garden_ratlam',
            name: 'Cactus Garden Sailana',
            display_order: 2,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_sailana_food_bazaar',
            name: 'Sailana Food Bazaar',
            display_order: 3,
          },
          {
            entity_type: 'FOOD_PLACE',
            entity_id: 'food_place_sailana_royal_cuisine',
            name: 'Sailana Royal Cuisine Eateries',
            display_order: 4,
          },
        ],
        tags: [
          'trail',
          'sailana',
          'royal_heritage',
          'food_trail',
          'garden',
          'malwa',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Trail.findOneAndUpdate(
      { _id: 'trail_ratlam_spiritual_culture' },
      {
        _id: 'trail_ratlam_spiritual_culture',
        name: 'Ratlam Spiritual & Cultural Trail',
        normalized_name: 'ratlam spiritual & cultural trail',
        city_id: 'city_ratlam_mp',
        state_id: 'state_mp',
        description:
          'A cultural journey through Ratlam’s religious landmarks, community traditions, historic sites, and the diverse spiritual heritage of western Malwa.',
        theme: 'Temples, Sufi Heritage & Community Culture',
        estimated_duration_mins: 240,
        distance_km: 12.0,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_kalika_mata_temple_ratlam',
            name: 'Kalika Mata Temple',
            display_order: 1,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_ratlam_palace',
            name: 'Ratlam Palace',
            display_order: 2,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_hussain_tekri_sharif',
            name: 'Hussain Tekri Sharif',
            display_order: 3,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_ratlam_sailana_road',
            name: 'Ratlam Main Bazaar',
            display_order: 4,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_dalumodi_bazaar',
            name: 'Dalumodi Bazaar',
            display_order: 5,
          },
        ],
        tags: [
          'trail',
          'spiritual',
          'temples',
          'sufi',
          'heritage',
          'culture',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Ratlam Pilot Data Seeded Successfully!');
  } catch (error) {
    console.error('[Seed] Error seeding Ratlam data:', error);
  } finally {
    await disconnectDB();
  }
};

seedRatlam();
