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
  verification_notes:
    'Sourced and verified from Sehore Cultural Heritage Dossier',
  sources: [
    'Sehore Cultural Heritage Dossier (SIH 2026 / Bhraman Archive)',
  ],
};

const SYSTEM_PUBLICATION = {
  publication_status: 'PUBLISHED',
  published_at: new Date('2026-08-02T00:00:00Z'),
  published_by: 'system',
};

const seedSehore = async () => {
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
          'Heart of India, rich in Malwa heritage, sacred traditions, forests, agriculture, and historic landscapes.',
        location: {
          type: 'Point',
          coordinates: [78.6569, 22.9734],
        },
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding City...');

    await City.findOneAndUpdate(
      { _id: 'city_sehore_mp' },
      {
        _id: 'city_sehore_mp',
        name: 'Sehore',
        normalized_name: 'sehore',
        state_id: 'state_mp',
        country_code: 'IN',
        location: {
          type: 'Point',
          coordinates: [77.0833, 23.2000],
        },
        short_description:
          'A historic Malwa town known for its ancient temples, Salkanpur pilgrimage, Narmada-linked cultural landscape, agriculture, and traditional rural heritage.',
        description:
          'Sehore is a historic town in Madhya Pradesh located near the state capital Bhopal. The district is known for its religious traditions, historic temples, agricultural landscape, Salkanpur Devi Temple, rural communities, and its position within the cultural region of Malwa and the Narmada basin.',
        cultural_summary:
          'Known for Salkanpur Vindhyavasini Temple, Kubereshwar Dham, historic Shiva temples, Sehore’s old town traditions, agricultural heritage, local fairs, and Malwa cuisine.',
        highlights: [
          'Salkanpur Vindhyavasini Temple',
          'Kubereshwar Dham',
          'Sehore Old Town',
          'Siddheshwar Mahadev Temple',
          'Malwa Rural Landscape',
          'Local Agricultural Heritage',
        ],
        is_featured: true,
        tags: [
          'malwa_region',
          'pilgrimage',
          'temples',
          'rural_heritage',
          'agriculture',
          'sehore_district',
        ],
        status: 'ACTIVE',
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Places...');

    const placesData = [
      {
        _id: 'place_salkanpur_vindhyavasini_temple',
        name: 'Salkanpur Vindhyavasini Temple',
        normalized_name: 'salkanpur vindhyavasini temple',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.2578, 22.8747],
        },
        address: {
          line1: 'Salkanpur, Rehti Tehsil',
          city_id: 'city_sehore_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'A major hilltop pilgrimage centre dedicated to Maa Vindhyavasini, located on a forested hill in the Sehore district.',
        historical_significance:
          'The shrine has long been associated with local Shakti worship and attracts devotees from Sehore, Bhopal, and surrounding regions.',
        architectural_style:
          'Traditional Hilltop Hindu Temple Architecture',
        visiting_hours: '05:00 AM - 10:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March; Navratri is especially significant',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'temple',
          'vindhyavasini',
          'devi',
          'pilgrimage',
          'salkanpur',
          'shakti',
        ],
      },
      {
        _id: 'place_kubereshwar_dham',
        name: 'Kubereshwar Dham',
        normalized_name: 'kubereshwar dham sehore',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.0978, 23.1695],
        },
        address: {
          line1: 'Kubereshwar Dham, Sehore',
          city_id: 'city_sehore_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'A prominent Shiva pilgrimage centre near Sehore known for religious gatherings, devotional programmes, and large annual events.',
        historical_significance:
          'The site has developed into an important contemporary pilgrimage destination in the Sehore region.',
        architectural_style:
          'Contemporary Hindu Temple Complex',
        visiting_hours: '05:00 AM - 10:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'shiva',
          'temple',
          'pilgrimage',
          'dham',
          'religious_event',
        ],
      },
      {
        _id: 'place_siddheshwar_mahadev_temple_sehore',
        name: 'Siddheshwar Mahadev Temple',
        normalized_name: 'siddheshwar mahadev temple sehore',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.0838, 23.1993],
        },
        address: {
          line1: 'Old Sehore',
          city_id: 'city_sehore_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic Shiva shrine associated with Sehore’s old religious landscape and local devotional traditions.',
        historical_significance:
          'The temple represents the long-standing Shaiva traditions of the Sehore region.',
        architectural_style:
          'Traditional Central Indian Temple Architecture',
        visiting_hours: '06:00 AM - 08:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'Mahashivratri and winter months',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
        },
        tags: [
          'shiva',
          'mahadev',
          'temple',
          'old_town',
          'heritage',
        ],
      },
      {
        _id: 'place_sehore_old_town',
        name: 'Sehore Old Town',
        normalized_name: 'sehore old town',
        place_type: 'HERITAGE',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.0830, 23.2000],
        },
        address: {
          line1: 'Old City, Sehore',
          city_id: 'city_sehore_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic urban area featuring traditional markets, old houses, religious sites, narrow streets, and everyday Malwa town life.',
        historical_significance:
          'The old settlement preserves layers of Sehore’s regional trading, administrative, religious, and community history.',
        architectural_style:
          'Traditional Malwa Town Architecture',
        visiting_hours: 'Open area; best explored during daylight',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
          why_visit:
            'A more authentic glimpse into everyday life, bazaars, food, and historic neighbourhoods away from major pilgrimage sites.',
        },
        tags: [
          'old_town',
          'heritage',
          'bazaar',
          'malwa',
          'architecture',
          'local_life',
        ],
      },
      {
        _id: 'place_sehore_kali_ghat',
        name: 'Sehore Kali Ghat',
        normalized_name: 'sehore kali ghat',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.0820, 23.2025],
        },
        address: {
          line1: 'Sehore Town',
          city_id: 'city_sehore_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Local devotional site associated with Kali worship and traditional religious activity in Sehore.',
        historical_significance:
          'The site reflects the continued importance of Shakti traditions in the Malwa cultural landscape.',
        architectural_style:
          'Traditional Hindu Shrine Architecture',
        visiting_hours: '06:00 AM - 09:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'Festival periods and evening',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LOCAL_SECRET',
        },
        tags: [
          'kali',
          'shakti',
          'temple',
          'local_heritage',
          'religion',
        ],
      },
      {
        _id: 'place_salkanpur_hill_landscape',
        name: 'Salkanpur Hill Landscape',
        normalized_name: 'salkanpur hill landscape',
        place_type: 'NATURE',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.2580, 22.8750],
        },
        address: {
          line1: 'Salkanpur Hills',
          city_id: 'city_sehore_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Forested hill landscape surrounding the Salkanpur pilgrimage area, offering elevated views and a seasonal green environment.',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
          why_visit:
            'Combines pilgrimage with a scenic hill and forest landscape, particularly attractive during and after the monsoon.',
        },
        tags: [
          'hills',
          'forest',
          'nature',
          'salkanpur',
          'monsoon',
          'viewpoint',
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
        _id: 'market_sehore_main_bazaar',
        name: 'Sehore Main Bazaar',
        normalized_name: 'sehore main bazaar',
        market_type: 'LOCAL_MARKET',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.0828, 23.2003],
        },
        address: {
          line1: 'Main Bazaar, Sehore',
          city_id: 'city_sehore_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Traditional town market serving local residents and pilgrims with clothing, groceries, religious items, sweets, snacks, and everyday goods.',
        operating_hours: '09:00 AM - 09:00 PM',
        best_known_for: [
          'Local Sweets',
          'Namkeen',
          'Puja Items',
          'Traditional Snacks',
          'Daily Market Goods',
        ],
        tags: [
          'bazaar',
          'local_market',
          'shopping',
          'street_food',
          'sehore',
        ],
      },
      {
        _id: 'market_salkanpur_pilgrimage_bazaar',
        name: 'Salkanpur Pilgrimage Bazaar',
        normalized_name: 'salkanpur pilgrimage bazaar',
        market_type: 'PILGRIMAGE_MARKET',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.2575, 22.8748],
        },
        address: {
          line1: 'Salkanpur Temple Approach',
          city_id: 'city_sehore_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Pilgrimage-oriented market around the Salkanpur temple approach selling devotional objects, flowers, prasad, toys, souvenirs, and local snacks.',
        operating_hours: '06:00 AM - 10:00 PM',
        best_known_for: [
          'Prasad',
          'Puja Items',
          'Devi Souvenirs',
          'Flowers',
          'Local Snacks',
        ],
        tags: [
          'pilgrimage',
          'bazaar',
          'salkanpur',
          'temple_market',
          'souvenirs',
        ],
      },
      {
        _id: 'market_sehore_anaj_mandi',
        name: 'Sehore Agricultural Market',
        normalized_name: 'sehore agricultural market',
        market_type: 'AGRICULTURAL_MARKET',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.0700, 23.2050],
        },
        address: {
          line1: 'Agricultural Market Area, Sehore',
          city_id: 'city_sehore_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Agricultural trading area reflecting Sehore district’s important farming economy and regional grain trade.',
        operating_hours: 'Market hours vary by season and commodity arrivals',
        best_known_for: [
          'Wheat',
          'Soybean',
          'Pulses',
          'Grains',
          'Regional Farm Produce',
        ],
        tags: [
          'agriculture',
          'mandi',
          'grain_market',
          'rural_economy',
          'farmers',
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
        _id: 'food_sehore_poha',
        name: 'Sehore Poha',
        normalized_name: 'sehore poha',
        food_category: 'STREET_FOOD',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        description:
          'Light flattened rice preparation cooked with onions, mustard seeds, turmeric, coriander, lemon, and regional spices, commonly finished with sev.',
        cultural_origin: 'Malwa Region',
        key_ingredients: [
          'Poha',
          'Onion',
          'Mustard Seeds',
          'Turmeric',
          'Coriander',
          'Lemon',
          'Sev',
        ],
        tags: [
          'breakfast',
          'poha',
          'malwa',
          'street_food',
        ],
      },
      {
        _id: 'food_sehore_dal_bafla',
        name: 'Sehore Dal Bafla',
        normalized_name: 'sehore dal bafla',
        food_category: 'REGIONAL_MAIN',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        description:
          'Traditional Malwa meal of baked wheat bafla served with dal, generous ghee, chutneys, and seasonal accompaniments.',
        cultural_origin: 'Malwa Region',
        key_ingredients: [
          'Wheat Flour',
          'Toor Dal',
          'Ghee',
          'Spices',
          'Chutneys',
        ],
        tags: [
          'dal_bafla',
          'malwa',
          'traditional',
          'regional_food',
        ],
      },
      {
        _id: 'food_sehore_kachori',
        name: 'Sehore Kachori',
        normalized_name: 'sehore kachori',
        food_category: 'SNACK',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        description:
          'Crisp fried pastry filled with a spiced lentil mixture and served with tangy or sweet chutneys.',
        cultural_origin: 'Malwa Region',
        key_ingredients: [
          'Wheat Flour',
          'Moong Dal',
          'Spices',
          'Oil',
          'Chutney',
        ],
        tags: [
          'kachori',
          'snack',
          'street_food',
          'malwa',
        ],
      },
      {
        _id: 'food_sehore_sabudana_khichdi',
        name: 'Sabudana Khichdi',
        normalized_name: 'sehore sabudana khichdi',
        food_category: 'FASTING_FOOD',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        description:
          'Popular fasting preparation of soaked tapioca pearls cooked with roasted peanuts, potatoes, green chilli, cumin, and lemon.',
        cultural_origin: 'Central India',
        key_ingredients: [
          'Sabudana',
          'Peanuts',
          'Potato',
          'Green Chilli',
          'Cumin',
          'Lemon',
        ],
        tags: [
          'fasting_food',
          'sabudana',
          'vegetarian',
          'pilgrimage',
        ],
      },
      {
        _id: 'food_sehore_jalebi',
        name: 'Sehore Jalebi',
        normalized_name: 'sehore jalebi',
        food_category: 'SWEET',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        description:
          'Crisp spiral sweet soaked in sugar syrup, commonly enjoyed with breakfast or as an evening treat.',
        cultural_origin: 'Malwa / Central India',
        key_ingredients: [
          'Refined Flour',
          'Sugar',
          'Oil',
          'Cardamom',
        ],
        tags: [
          'jalebi',
          'sweet',
          'breakfast',
          'local_food',
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
        _id: 'food_place_sehore_main_bazaar',
        name: 'Sehore Main Bazaar Food Stalls',
        normalized_name: 'sehore main bazaar food stalls',
        food_place_type: 'STALL',
        associated_food_ids: [
          'food_sehore_poha',
          'food_sehore_kachori',
          'food_sehore_jalebi',
        ],
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.0828, 23.2003],
        },
        address: {
          line1: 'Main Bazaar, Sehore',
          city_id: 'city_sehore_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Local breakfast and snack vendors serving poha, kachori, jalebi, tea, and everyday Malwa street food.',
        operating_hours: '07:00 AM - 10:00 PM',
        price_range: '₹30 - ₹200',
        is_heritage_vendor: true,
        est_year: 1980,
        tags: [
          'street_food',
          'breakfast',
          'bazaar',
          'malwa_food',
        ],
      },
      {
        _id: 'food_place_salkanpur_prasad_stalls',
        name: 'Salkanpur Prasad & Food Stalls',
        normalized_name: 'salkanpur prasad food stalls',
        food_place_type: 'STALL',
        associated_food_ids: [
          'food_sehore_poha',
          'food_sehore_jalebi',
          'food_sehore_sabudana_khichdi',
        ],
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.2575, 22.8748],
        },
        address: {
          line1: 'Salkanpur Temple Approach',
          city_id: 'city_sehore_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Pilgrimage food stalls and prasad shops serving quick vegetarian food, sweets, beverages, and fasting foods.',
        operating_hours: '06:00 AM - 10:00 PM',
        price_range: '₹20 - ₹150',
        is_heritage_vendor: true,
        est_year: 1970,
        tags: [
          'pilgrimage',
          'prasad',
          'street_food',
          'salkanpur',
          'vegetarian',
        ],
      },
      {
        _id: 'food_place_sehore_dal_bafla_house',
        name: 'Sehore Dal Bafla Houses',
        normalized_name: 'sehore dal bafla houses',
        food_place_type: 'RESTAURANT',
        associated_food_ids: [
          'food_sehore_dal_bafla',
          'food_sehore_poha',
        ],
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.0832, 23.1998],
        },
        address: {
          line1: 'Old Town Market Area, Sehore',
          city_id: 'city_sehore_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Traditional vegetarian eateries serving Malwa-style dal bafla and regional home-style dishes.',
        operating_hours: '11:00 AM - 10:00 PM',
        price_range: '₹100 - ₹300',
        is_heritage_vendor: false,
        est_year: 1990,
        tags: [
          'dal_bafla',
          'malwa_food',
          'vegetarian',
          'traditional',
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
      { _id: 'artisan_sehore_bamboo_craft' },
      {
        _id: 'artisan_sehore_bamboo_craft',
        name: 'Sehore Bamboo & Cane Craft Artisans',
        normalized_name: 'sehore bamboo cane craft artisans',
        specialization_type: 'CRAFT',
        craft_description:
          'Traditional rural artisans working with locally available bamboo and cane to produce household objects, baskets, agricultural implements, and decorative craft items.',
        district: 'Sehore',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.0833, 23.2000],
        },
        is_master_craftsperson: false,
        awards: [],
        tags: [
          'bamboo',
          'cane',
          'rural_craft',
          'handicraft',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Artisan.findOneAndUpdate(
      { _id: 'artisan_sehore_pottery' },
      {
        _id: 'artisan_sehore_pottery',
        name: 'Sehore Traditional Potters',
        normalized_name: 'sehore traditional potters',
        specialization_type: 'POTTERY',
        craft_description:
          'Local potters maintaining traditional clay-working practices for household vessels, diyas, festival objects, and decorative earthenware.',
        district: 'Sehore',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.0830, 23.2000],
        },
        is_master_craftsperson: false,
        awards: [],
        tags: [
          'pottery',
          'terracotta',
          'diyas',
          'rural_craft',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_sehore_farming_community' },
      {
        _id: 'community_sehore_farming_community',
        name: 'Sehore Farming Communities',
        normalized_name: 'sehore farming communities',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        description:
          'Agricultural communities across Sehore district whose livelihoods and seasonal traditions are closely connected with wheat, soybean, pulses, and other regional crops.',
        cultural_contribution:
          'Preserved Malwa agricultural knowledge, seasonal food traditions, village fairs, grain-related commerce, and rural community practices.',
        heritage_crafts_or_foods: [
          'Wheat-based Foods',
          'Dal Bafla',
          'Traditional Grain Processing',
          'Seasonal Village Foods',
        ],
        tags: [
          'community',
          'agriculture',
          'farmers',
          'malwa',
          'rural_heritage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_salkanpur_pilgrimage_workers' },
      {
        _id: 'community_salkanpur_pilgrimage_workers',
        name: 'Salkanpur Pilgrimage Service Community',
        normalized_name: 'salkanpur pilgrimage service community',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        description:
          'Local families, vendors, priests, flower sellers, food vendors, transport workers, and craftspeople whose livelihoods are connected with the Salkanpur pilgrimage economy.',
        cultural_contribution:
          'Sustains the living pilgrimage traditions of Salkanpur through temple services, devotional commerce, prasad preparation, seasonal fairs, and visitor hospitality.',
        heritage_crafts_or_foods: [
          'Temple Prasad',
          'Puja Materials',
          'Festival Food',
          'Religious Souvenirs',
        ],
        tags: [
          'community',
          'pilgrimage',
          'salkanpur',
          'temple',
          'local_economy',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Events & Stories...');

    await Event.findOneAndUpdate(
      { _id: 'event_salkanpur_navratri' },
      {
        _id: 'event_salkanpur_navratri',
        name: 'Salkanpur Navratri Festival',
        normalized_name: 'salkanpur navratri festival',
        event_type: 'FESTIVAL',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.2578, 22.8747],
        },
        recurrence: 'Annual - Chaitra and Sharad Navratri',
        description:
          'Major devotional gatherings at the Salkanpur Vindhyavasini Temple featuring worship, special rituals, devotional music, fairs, and large pilgrim crowds.',
        cultural_significance:
          'One of the most important living Shakti traditions of the Sehore region and a major expression of local pilgrimage culture.',
        tags: [
          'navratri',
          'salkanpur',
          'vindhyavasini',
          'devi',
          'pilgrimage',
          'festival',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_mahashivratri_sehore' },
      {
        _id: 'event_mahashivratri_sehore',
        name: 'Mahashivratri in Sehore',
        normalized_name: 'mahashivratri in sehore',
        event_type: 'FESTIVAL',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.0838, 23.1993],
        },
        recurrence: 'Annual',
        description:
          'Devotional celebrations at Shiva temples throughout Sehore involving night worship, fasting, processions, temple decorations, and community gatherings.',
        cultural_significance:
          'Reflects the deep Shaiva traditions of Sehore and the wider Malwa cultural region.',
        tags: [
          'mahashivratri',
          'shiva',
          'mahadev',
          'festival',
          'temple',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_kubereshwar_dham_shivmahapuran' },
      {
        _id: 'event_kubereshwar_dham_shivmahapuran',
        name: 'Kubereshwar Dham Religious Gathering',
        normalized_name: 'kubereshwar dham religious gathering',
        event_type: 'RELIGIOUS_EVENT',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.0978, 23.1695],
        },
        recurrence: 'Annual / Dates vary',
        description:
          'Large-scale religious gathering at Kubereshwar Dham featuring devotional programmes, scripture-related events, rituals, and community participation.',
        cultural_significance:
          'Represents Sehore’s growing role as a contemporary religious destination in Madhya Pradesh.',
        tags: [
          'kubereshwar_dham',
          'shiva',
          'religious_event',
          'pilgrimage',
          'sehore',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_salkanpur_vindhyavasini' },
      {
        _id: 'story_salkanpur_vindhyavasini',
        title: 'The Hill Shrine of Salkanpur',
        normalized_title: 'the hill shrine of salkanpur',
        story_type: 'LOCAL_HISTORY',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_salkanpur_vindhyavasini_temple',
          name: 'Salkanpur Vindhyavasini Temple',
        },
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        narrative:
          'On a forested hill near Sehore stands the shrine of Maa Vindhyavasini, a powerful centre of Shakti worship. Generations of devotees have travelled to the hill during Navratri and other auspicious occasions, making Salkanpur one of the most important pilgrimage landscapes of the region.',
        submitted_by: 'system',
        tags: [
          'salkanpur',
          'vindhyavasini',
          'devi',
          'pilgrimage',
          'local_history',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_sehore_malwa_agriculture' },
      {
        _id: 'story_sehore_malwa_agriculture',
        title: 'Sehore and the Agricultural Heartland of Malwa',
        normalized_title: 'sehore and the agricultural heartland of malwa',
        story_type: 'CULTURAL_HISTORY',
        associated_entity: {
          entity_type: 'MARKET',
          entity_id: 'market_sehore_anaj_mandi',
          name: 'Sehore Agricultural Market',
        },
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        narrative:
          'Sehore’s identity is deeply connected with the agricultural landscape surrounding the town. Wheat, soybean, pulses, and other crops shape local markets, seasonal rhythms, village food traditions, and the economy of the wider district. The agricultural landscape provides an important counterpoint to the region’s pilgrimage heritage.',
        submitted_by: 'system',
        tags: [
          'agriculture',
          'malwa',
          'farmers',
          'rural_heritage',
          'food',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_sehore_old_town' },
      {
        _id: 'story_sehore_old_town',
        title: 'Everyday Life in Old Sehore',
        normalized_title: 'everyday life in old sehore',
        story_type: 'CULTURAL_HISTORY',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_sehore_old_town',
          name: 'Sehore Old Town',
        },
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        narrative:
          'Beyond Sehore’s major pilgrimage destinations, the old town preserves the everyday cultural character of a Malwa settlement. Traditional markets, food stalls, temples, neighbourhood businesses, seasonal festivals, and community gatherings continue to connect present-day life with the town’s older traditions.',
        submitted_by: 'system',
        tags: [
          'old_town',
          'malwa',
          'local_life',
          'heritage',
          'bazaar',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Trails...');

    await Trail.findOneAndUpdate(
      { _id: 'trail_sehore_pilgrimage' },
      {
        _id: 'trail_sehore_pilgrimage',
        name: 'Sehore Sacred Temples & Pilgrimage Trail',
        normalized_name: 'sehore sacred temples & pilgrimage trail',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        description:
          'A pilgrimage-focused route connecting Sehore’s local Shiva traditions with the major Salkanpur Devi shrine and contemporary religious centres.',
        theme: 'Shakti, Shiva & Living Pilgrimage Traditions',
        estimated_duration_mins: 300,
        distance_km: 45,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_siddheshwar_mahadev_temple_sehore',
            name: 'Siddheshwar Mahadev Temple',
            display_order: 1,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_sehore_kali_ghat',
            name: 'Sehore Kali Ghat',
            display_order: 2,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_kubereshwar_dham',
            name: 'Kubereshwar Dham',
            display_order: 3,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_salkanpur_vindhyavasini_temple',
            name: 'Salkanpur Vindhyavasini Temple',
            display_order: 4,
          },
        ],
        tags: [
          'trail',
          'pilgrimage',
          'temples',
          'shakti',
          'shiva',
          'sehore',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Trail.findOneAndUpdate(
      { _id: 'trail_sehore_old_town_food' },
      {
        _id: 'trail_sehore_old_town_food',
        name: 'Sehore Old Town & Malwa Food Trail',
        normalized_name: 'sehore old town & malwa food trail',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        description:
          'A local experience through Sehore’s old town, traditional bazaar, breakfast stalls, Malwa cuisine, sweets, and everyday community life.',
        theme: 'Old Town, Local Markets & Malwa Cuisine',
        estimated_duration_mins: 150,
        distance_km: 3.0,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_sehore_old_town',
            name: 'Sehore Old Town',
            display_order: 1,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_sehore_main_bazaar',
            name: 'Sehore Main Bazaar',
            display_order: 2,
          },
          {
            entity_type: 'FOOD_PLACE',
            entity_id: 'food_place_sehore_main_bazaar',
            name: 'Sehore Main Bazaar Food Stalls',
            display_order: 3,
          },
          {
            entity_type: 'FOOD_PLACE',
            entity_id: 'food_place_sehore_dal_bafla_house',
            name: 'Sehore Dal Bafla Houses',
            display_order: 4,
          },
        ],
        tags: [
          'trail',
          'food_trail',
          'malwa_food',
          'street_food',
          'old_town',
          'bazaar',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Trail.findOneAndUpdate(
      { _id: 'trail_sehore_salkanpur' },
      {
        _id: 'trail_sehore_salkanpur',
        name: 'Salkanpur Temple & Hill Experience',
        normalized_name: 'salkanpur temple & hill experience',
        city_id: 'city_sehore_mp',
        state_id: 'state_mp',
        description:
          'A devotional and nature-oriented experience combining the Salkanpur Vindhyavasini Temple, hill landscape, pilgrimage bazaar, and local food stalls.',
        theme: 'Temple, Hills, Pilgrimage & Local Culture',
        estimated_duration_mins: 180,
        distance_km: 2.5,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_salkanpur_vindhyavasini_temple',
            name: 'Salkanpur Vindhyavasini Temple',
            display_order: 1,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_salkanpur_hill_landscape',
            name: 'Salkanpur Hill Landscape',
            display_order: 2,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_salkanpur_pilgrimage_bazaar',
            name: 'Salkanpur Pilgrimage Bazaar',
            display_order: 3,
          },
          {
            entity_type: 'FOOD_PLACE',
            entity_id: 'food_place_salkanpur_prasad_stalls',
            name: 'Salkanpur Prasad & Food Stalls',
            display_order: 4,
          },
        ],
        tags: [
          'trail',
          'salkanpur',
          'pilgrimage',
          'nature',
          'food',
          'devi',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Sehore Pilot Data Seeded Successfully!');
  } catch (error) {
    console.error('[Seed] Error seeding Sehore data:', error);
  } finally {
    await disconnectDB();
  }
};

seedSehore();
