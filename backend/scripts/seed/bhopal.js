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
  verification_notes: 'Sourced and verified from Bhopal Cultural Heritage Dossier',
  sources: ['Bhopal Cultural Heritage Dossier (SIH 2026 / Bhraman Archive)'],
};

const SYSTEM_PUBLICATION = {
  publication_status: 'PUBLISHED',
  published_at: new Date('2026-08-02T00:00:00Z'),
  published_by: 'system',
};

const seedBhopal = async () => {
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
          'Heart of India, known for its diverse tribal cultures, historic kingdoms, Buddhist heritage, lakes, forests, and rich Central Indian traditions.',
        location: {
          type: 'Point',
          coordinates: [78.6569, 22.9734],
        },
      },
      { upsert: true, new: true }
    );

    await City.findOneAndUpdate(
      { _id: 'city_bhopal_mp' },
      {
        _id: 'city_bhopal_mp',
        name: 'Bhopal',
        normalized_name: 'bhopal',
        state_id: 'state_mp',
        country_code: 'IN',
        location: {
          type: 'Point',
          coordinates: [77.4126, 23.2599],
        },
        short_description:
          'The City of Lakes, known for royal heritage, Islamic architecture, museums, crafts, and vibrant Central Indian culture.',
        description:
          'Bhopal is the capital of Madhya Pradesh, celebrated for its historic lakes, Begum-era heritage, grand mosques, museums, tribal art, handicrafts, and its proximity to the prehistoric rock shelters of Bhimbetka.',
        cultural_summary:
          'Known for Upper Lake and Lower Lake, Taj-ul-Masajid, Moti Masjid, Gauhar Mahal, Bharat Bhavan, Tribal Museum, Begum-era history, Bhopali cuisine, and traditional crafts.',
        highlights: [
          'Upper Lake',
          'Taj-ul-Masajid',
          'Bharat Bhavan',
          'Tribal Museum',
          'Gauhar Mahal',
          'Sanchi & Bhimbetka Circuit',
        ],
        is_featured: true,
        tags: [
          'city_of_lakes',
          'begum_heritage',
          'central_india',
          'arts_and_culture',
          'lake_city',
        ],
        status: 'ACTIVE',
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Places...');

    const placesData = [
      {
        _id: 'place_taj_ul_masajid',
        name: 'Taj-ul-Masajid',
        normalized_name: 'taj ul masajid',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.4016, 23.2621],
        },
        address: {
          line1: 'NH 12, Kohefiza, Bhopal',
          city_id: 'city_bhopal_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'One of India’s most prominent mosques, distinguished by its enormous courtyard, pink facade, tall minarets, and grand domes.',
        historical_significance:
          'Construction began during the reign of Nawab Shah Jahan Begum of Bhopal and continued through later periods.',
        architectural_style:
          'Indo-Islamic and Mughal-inspired Architecture',
        visiting_hours:
          'Generally open outside prayer times; timings may vary',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'mosque',
          'islamic_architecture',
          'begum_heritage',
          'heritage',
        ],
      },
      {
        _id: 'place_gauhar_mahal',
        name: 'Gauhar Mahal',
        normalized_name: 'gauhar mahal',
        place_type: 'HERITAGE',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.4029, 23.2579],
        },
        address: {
          line1: 'VIP Road, Near Upper Lake, Bhopal',
          city_id: 'city_bhopal_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic palace overlooking the Upper Lake, blending Indian and European architectural influences and associated with Bhopal’s first female ruler, Qudsia Begum.',
        historical_significance:
          'Built in the early 19th century by Qudsia Begum, the founder of the Begum dynasty’s rule in Bhopal.',
        architectural_style:
          'Indo-European Palace Architecture',
        visiting_hours: '10:00 AM - 06:00 PM',
        entry_fee: 'Free / Event-specific charges may apply',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'LESSER_KNOWN',
        },
        tags: [
          'palace',
          'begum',
          'heritage',
          'crafts',
          'upper_lake',
        ],
      },
      {
        _id: 'place_moti_masjid_bhopal',
        name: 'Moti Masjid',
        normalized_name: 'moti masjid bhopal',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.4072, 23.2614],
        },
        address: {
          line1: 'Near Moti Masjid, Old Bhopal',
          city_id: 'city_bhopal_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic mosque built during the Begum era and notable for its simple yet elegant red-and-white architectural character.',
        historical_significance:
          'Built in 1860 by Sikandar Jahan Begum, an important ruler of the Bhopal princely state.',
        architectural_style:
          '19th-century Indo-Islamic Architecture',
        visiting_hours:
          'Generally open outside prayer times; timings may vary',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
        },
        tags: [
          'mosque',
          'begum_heritage',
          'old_bhopal',
          'architecture',
        ],
      },
      {
        _id: 'place_bharat_bhavan',
        name: 'Bharat Bhavan',
        normalized_name: 'bharat bhavan',
        place_type: 'CULTURAL_CENTER',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.3797, 23.2417],
        },
        address: {
          line1: 'J. Swaminathan Marg, Shamla Hills, Bhopal',
          city_id: 'city_bhopal_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Multidisciplinary arts centre overlooking Upper Lake, housing galleries, theatres, libraries, and spaces dedicated to Indian contemporary and traditional arts.',
        historical_significance:
          'Established in 1982 as a major cultural institution dedicated to visual arts, theatre, poetry, and Indian artistic traditions.',
        architectural_style:
          'Modern Indian Architecture Integrated with Landscape',
        visiting_hours: '02:00 PM - 08:00 PM',
        entry_fee: 'Nominal / Exhibition dependent',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'arts',
          'culture',
          'theatre',
          'museum',
          'bharat_bhavan',
        ],
      },
      {
        _id: 'place_tribal_museum_bhopal',
        name: 'Tribal Museum Bhopal',
        normalized_name: 'tribal museum bhopal',
        place_type: 'MUSEUM',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.3739, 23.2148],
        },
        address: {
          line1: 'Shyamla Hills, Bhopal',
          city_id: 'city_bhopal_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Immersive museum showcasing the lives, homes, rituals, art, mythology, and material culture of Madhya Pradesh’s tribal communities.',
        historical_significance:
          'Established to document and present the diverse cultural traditions of Madhya Pradesh and neighbouring tribal communities.',
        architectural_style:
          'Contemporary Museum Architecture Inspired by Tribal Landscapes',
        visiting_hours: '12:00 PM - 08:00 PM (Closed Mondays)',
        entry_fee: 'Nominal entry fee',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'tribal_art',
          'museum',
          'culture',
          'madhya_pradesh',
          'crafts',
        ],
      },
      {
        _id: 'place_upper_lake_bhopal',
        name: 'Upper Lake',
        normalized_name: 'upper lake bhopal',
        place_type: 'NATURAL_SITE',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.345, 23.2504],
        },
        address: {
          line1: 'Upper Lake, Bhopal',
          city_id: 'city_bhopal_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic and expansive lake forming the defining landscape of Bhopal, with promenades, boating areas, birdlife, and scenic views.',
        historical_significance:
          'Traditionally attributed to the Paramara ruler Raja Bhoj, who is associated with the creation of the original reservoir.',
        architectural_style: 'Historic Water Infrastructure',
        visiting_hours: 'Open throughout the day',
        entry_fee: 'Free; boating charges may apply',
        best_time_to_visit: 'October to February and early morning',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'lake',
          'nature',
          'boating',
          'raja_bhoj',
          'city_of_lakes',
        ],
      },
      {
        _id: 'place_shahpura_lake',
        name: 'Shahpura Lake',
        normalized_name: 'shahpura lake',
        place_type: 'NATURAL_SITE',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.3669, 23.1918],
        },
        address: {
          line1: 'Shahpura Lake, Bhopal',
          city_id: 'city_bhopal_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Large urban lake and green recreational zone popular for walks, birdwatching, and sunset views.',
        historical_significance:
          'An important part of modern Bhopal’s lake network and urban ecological landscape.',
        architectural_style: 'Urban Lake Landscape',
        visiting_hours: 'Open throughout the day',
        entry_fee: 'Free',
        best_time_to_visit: 'Early morning and evening',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
        },
        tags: [
          'lake',
          'nature',
          'birdwatching',
          'sunset',
          'local_life',
        ],
      },
      {
        _id: 'place_sadar_man_ka_mahal',
        name: 'Sadar Manzil',
        normalized_name: 'sadar manzil bhopal',
        place_type: 'HERITAGE',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.4047, 23.2588],
        },
        address: {
          line1: 'Old Bhopal',
          city_id: 'city_bhopal_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic red-brick palace and public audience hall associated with the Nawabs and Begums of Bhopal.',
        historical_significance:
          'Served as a venue for royal audiences and public functions during the princely-state period.',
        architectural_style:
          'Indo-Islamic Palace Architecture',
        visiting_hours: '10:00 AM - 05:00 PM',
        entry_fee: 'Nominal / subject to access',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LOCAL_SECRET',
        },
        tags: [
          'palace',
          'old_bhopal',
          'nawab',
          'begum',
          'heritage',
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
        _id: 'market_chowk_bazaar_bhopal',
        name: 'Chowk Bazaar',
        normalized_name: 'chowk bazaar bhopal',
        market_type: 'TRADITIONAL_MARKET',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.4018, 23.2594],
        },
        address: {
          line1: 'Chowk Bazaar, Old Bhopal',
          city_id: 'city_bhopal_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic Old Bhopal market known for traditional shopping, embroidered textiles, jewellery, perfumes, handicrafts, and local food.',
        operating_hours: '10:00 AM - 09:00 PM',
        best_known_for: [
          'Zari Work',
          'Bhopali Jewellery',
          'Traditional Clothing',
          'Puja Items',
          'Local Snacks',
        ],
        tags: [
          'old_bhopal',
          'traditional_market',
          'shopping',
          'zari',
          'handicrafts',
        ],
      },
      {
        _id: 'market_itwara_bhopal',
        name: 'Itwara Market',
        normalized_name: 'itwara market bhopal',
        market_type: 'TRADITIONAL_MARKET',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.4071, 23.2648],
        },
        address: {
          line1: 'Itwara, Old Bhopal',
          city_id: 'city_bhopal_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Dense traditional bazaar in Old Bhopal featuring wholesale and retail goods, fabrics, spices, household products, and street food.',
        operating_hours: '10:00 AM - 09:00 PM',
        best_known_for: [
          'Spices',
          'Fabrics',
          'Dry Fruits',
          'Street Food',
          'Traditional Goods',
        ],
        tags: [
          'old_bhopal',
          'bazaar',
          'spices',
          'food',
          'shopping',
        ],
      },
      {
        _id: 'market_new_market_bhopal',
        name: 'New Market',
        normalized_name: 'new market bhopal',
        market_type: 'FOOD_MARKET',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.4045, 23.2332],
        },
        address: {
          line1: 'New Market, TT Nagar, Bhopal',
          city_id: 'city_bhopal_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Busy modern shopping district with clothing, local eateries, sweets, snacks, cafés, and everyday shopping.',
        operating_hours: '10:00 AM - 10:00 PM',
        best_known_for: [
          'Chaat',
          'Sweets',
          'Namkeen',
          'Shopping',
          'Local Snacks',
        ],
        tags: [
          'shopping',
          'food',
          'market',
          'street_food',
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
        _id: 'food_bhopali_gosht_korma',
        name: 'Bhopali Gosht Korma',
        normalized_name: 'bhopali gosht korma',
        food_category: 'TRADITIONAL_FOOD',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        description:
          'Slow-cooked meat preparation associated with the royal culinary traditions of Bhopal, featuring aromatic spices and a rich gravy.',
        cultural_origin: 'Bhopal Nawabi Cuisine',
        key_ingredients: [
          'Mutton',
          'Onion',
          'Yogurt',
          'Ginger',
          'Garlic',
          'Aromatic Spices',
        ],
        tags: [
          'nawabi',
          'bhopali_cuisine',
          'non_vegetarian',
          'royal_food',
        ],
      },
      {
        _id: 'food_bhopali_poha',
        name: 'Bhopali Poha',
        normalized_name: 'bhopali poha',
        food_category: 'STREET_FOOD',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        description:
          'Light flattened-rice breakfast commonly served across Bhopal with sev, onion, coriander, lemon, and local spice blends.',
        cultural_origin: 'Madhya Pradesh / Bhopal',
        key_ingredients: [
          'Poha',
          'Onion',
          'Sev',
          'Coriander',
          'Lemon',
          'Spices',
        ],
        tags: [
          'breakfast',
          'street_food',
          'poha',
          'local_food',
        ],
      },
      {
        _id: 'food_bhopali_samosa',
        name: 'Bhopali Samosa',
        normalized_name: 'bhopali samosa',
        food_category: 'SNACK',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        description:
          'Crisp fried pastry filled with spiced potato and other savory fillings, widely enjoyed as a Bhopal tea-time and street snack.',
        cultural_origin: 'Bhopal / Central India',
        key_ingredients: [
          'Refined Flour',
          'Potato',
          'Peas',
          'Chilli',
          'Cumin',
          'Spices',
        ],
        tags: [
          'snack',
          'street_food',
          'samosa',
          'tea_time',
        ],
      },
      {
        _id: 'food_shahi_tukda_bhopal',
        name: 'Shahi Tukda',
        normalized_name: 'shahi tukda bhopal',
        food_category: 'SWEET',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        description:
          'Royal-style bread dessert prepared with fried bread, sweetened milk, cardamom, nuts, and saffron, reflecting the region’s Mughlai culinary influence.',
        cultural_origin: 'Nawabi / Mughlai Culinary Tradition',
        key_ingredients: [
          'Bread',
          'Milk',
          'Sugar',
          'Cardamom',
          'Saffron',
          'Nuts',
        ],
        tags: [
          'sweet',
          'nawabi',
          'dessert',
          'mughlai',
        ],
      },
      {
        _id: 'food_bhopali_jalebi',
        name: 'Bhopali Jalebi',
        normalized_name: 'bhopali jalebi',
        food_category: 'SWEET',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        description:
          'Crisp spiral-shaped jalebi soaked in fragrant sugar syrup and commonly enjoyed with tea or breakfast snacks.',
        cultural_origin: 'Bhopal / Central India',
        key_ingredients: [
          'Refined Flour',
          'Sugar',
          'Ghee',
          'Saffron',
          'Cardamom',
        ],
        tags: [
          'jalebi',
          'sweet',
          'breakfast',
          'street_food',
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
        _id: 'food_place_old_bhopal_street_food',
        name: 'Old Bhopal Street Food Vendors',
        normalized_name: 'old bhopal street food vendors',
        food_place_type: 'STALL',
        associated_food_ids: [
          'food_bhopali_samosa',
          'food_bhopali_jalebi',
          'food_bhopali_poha',
        ],
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.4031, 23.2602],
        },
        address: {
          line1: 'Chowk Bazaar, Old Bhopal',
          city_id: 'city_bhopal_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Cluster of traditional food stalls around Old Bhopal serving breakfast items, fried snacks, sweets, tea, and local specialties.',
        operating_hours: '07:00 AM - 10:00 PM',
        price_range: '₹30 - ₹200',
        is_heritage_vendor: true,
        est_year: 1980,
        tags: [
          'old_bhopal',
          'street_food',
          'heritage_vendor',
          'local_food',
        ],
      },
      {
        _id: 'food_place_bhopali_nawabi_eateries',
        name: 'Bhopali Nawabi Cuisine Eateries',
        normalized_name: 'bhopali nawabi cuisine eateries',
        food_place_type: 'RESTAURANT',
        associated_food_ids: [
          'food_bhopali_gosht_korma',
          'food_shahi_tukda_bhopal',
        ],
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.4015, 23.2610],
        },
        address: {
          line1: 'Old Bhopal',
          city_id: 'city_bhopal_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Traditional-style eateries in Old Bhopal where visitors can explore the city’s Mughlai and Nawabi culinary traditions.',
        operating_hours: '12:00 PM - 11:00 PM',
        price_range: '₹200 - ₹600',
        is_heritage_vendor: true,
        est_year: 1975,
        tags: [
          'nawabi_cuisine',
          'mughlai',
          'old_bhopal',
          'traditional_food',
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
      { _id: 'artisan_bhopal_zari_zardozi' },
      {
        _id: 'artisan_bhopal_zari_zardozi',
        name: 'Bhopal Zari and Zardozi Artisans',
        normalized_name: 'bhopal zari and zardozi artisans',
        specialization_type: 'TEXTILE',
        craft_description:
          'Traditional artisans practicing zari, zardozi, and ornamental embroidery techniques associated with Bhopal’s textile and ceremonial clothing traditions.',
        district: 'Bhopal',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.4030, 23.2600],
        },
        is_master_craftsperson: false,
        awards: [],
        tags: [
          'zari',
          'zardozi',
          'embroidery',
          'textile',
          'handicraft',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Artisan.findOneAndUpdate(
      { _id: 'artisan_bhopal_bamboo_craft' },
      {
        _id: 'artisan_bhopal_bamboo_craft',
        name: 'Bhopal Bamboo and Cane Craft Artisans',
        normalized_name: 'bhopal bamboo and cane craft artisans',
        specialization_type: 'WOOD_AND_NATURAL_FIBER',
        craft_description:
          'Local craftspeople creating baskets, utility objects, decorative products, and traditional household items using bamboo, cane, and natural fibres.',
        district: 'Bhopal',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.4126, 23.2599],
        },
        is_master_craftsperson: false,
        awards: [],
        tags: [
          'bamboo',
          'cane',
          'handicraft',
          'natural_fiber',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_bhopal_begum_heritage' },
      {
        _id: 'community_bhopal_begum_heritage',
        name: 'Bhopal Begum Heritage Community',
        normalized_name: 'bhopal begum heritage community',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        description:
          'Cultural communities, institutions, artisans, and local custodians connected with the architectural, culinary, textile, and social heritage of the Begums of Bhopal.',
        cultural_contribution:
          'Preserved the distinctive Indo-Islamic architecture, food traditions, crafts, literature, and social heritage associated with Bhopal’s historic Begum rulers.',
        heritage_crafts_or_foods: [
          'Zari and Zardozi',
          'Nawabi Cuisine',
          'Traditional Textiles',
          'Architectural Heritage',
        ],
        tags: [
          'community',
          'begum',
          'nawabi',
          'heritage',
          'crafts',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_bhopal_tribal_artists' },
      {
        _id: 'community_bhopal_tribal_artists',
        name: 'Madhya Pradesh Tribal Art Community',
        normalized_name: 'madhya pradesh tribal art community',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        description:
          'Artists and cultural practitioners representing the diverse tribal traditions of Madhya Pradesh, including Gond, Bhil, Baiga, and related artistic traditions.',
        cultural_contribution:
          'Preserved traditional visual storytelling, ritual art, mythology, natural-material crafts, and community knowledge through generations.',
        heritage_crafts_or_foods: [
          'Gond Art',
          'Bhil Art',
          'Tribal Woodcraft',
          'Traditional Natural-Dye Crafts',
        ],
        tags: [
          'tribal_art',
          'gond',
          'bhil',
          'crafts',
          'community',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Events & Stories...');

    await Event.findOneAndUpdate(
      { _id: 'event_bhopal_utsav' },
      {
        _id: 'event_bhopal_utsav',
        name: 'Bhopal Utsav',
        normalized_name: 'bhopal utsav',
        event_type: 'CULTURAL_FESTIVAL',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.4126, 23.2599],
        },
        recurrence: 'Annual / dates vary',
        description:
          'Cultural celebration featuring local arts, crafts, music, food, performances, and community activities showcasing Bhopal and Madhya Pradesh traditions.',
        cultural_significance:
          'Provides a platform for local artists, artisans, performers, food traditions, and cultural institutions to present Bhopal’s diverse heritage.',
        tags: [
          'festival',
          'culture',
          'arts',
          'crafts',
          'bhopal',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_bhopal_lokrang' },
      {
        _id: 'event_bhopal_lokrang',
        name: 'Lokrang Festival',
        normalized_name: 'lokrang festival',
        event_type: 'CULTURAL_FESTIVAL',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.3739, 23.2148],
        },
        recurrence: 'Annual',
        description:
          'Major cultural festival presenting folk and tribal traditions of India through music, dance, crafts, visual arts, and cultural performances.',
        cultural_significance:
          'Highlights the diversity of India’s folk and tribal heritage and provides a prominent platform for traditional artists and craftspeople.',
        tags: [
          'lokrang',
          'folk',
          'tribal',
          'festival',
          'dance',
          'music',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_bhopal_world_hindi_conference' },
      {
        _id: 'event_bhopal_world_hindi_conference',
        name: 'World Hindi Conference',
        normalized_name: 'world hindi conference bhopal',
        event_type: 'LITERARY_EVENT',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [77.4126, 23.2599],
        },
        recurrence: 'Occasional / international event',
        description:
          'International literary and linguistic gathering bringing together Hindi scholars, writers, academics, and cultural practitioners.',
        cultural_significance:
          'Reflects Bhopal’s role as a major cultural and literary centre of Madhya Pradesh.',
        tags: [
          'hindi',
          'literature',
          'conference',
          'language',
          'culture',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_begums_of_bhopal' },
      {
        _id: 'story_begums_of_bhopal',
        title: 'The Begums of Bhopal',
        normalized_title: 'the begums of bhopal',
        story_type: 'LOCAL_HISTORY',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_gauhar_mahal',
          name: 'Gauhar Mahal',
        },
        city_id: 'city_bhopal_mp',
        narrative:
          'Bhopal is unusual in the history of princely India for the long period during which it was ruled by a succession of women. Qudsia Begum, Sikandar Jahan Begum, Shah Jahan Begum, and Sultan Jahan Begum shaped the city through architecture, public institutions, education, water infrastructure, and cultural patronage. Their legacy remains visible throughout the old city.',
        submitted_by: 'system',
        tags: [
          'begums',
          'nawabs',
          'women_rulers',
          'bhopal',
          'history',
          'heritage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_raja_bhoj_lake' },
      {
        _id: 'story_raja_bhoj_lake',
        title: 'Raja Bhoj and the City of Lakes',
        normalized_title: 'raja bhoj and the city of lakes',
        story_type: 'LOCAL_HISTORY',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_upper_lake_bhopal',
          name: 'Upper Lake',
        },
        city_id: 'city_bhopal_mp',
        narrative:
          'A popular historical tradition connects the creation of Bhopal’s great lake with Paramara ruler Raja Bhoj. The reservoir became central to the settlement’s identity and helped shape Bhopal’s enduring reputation as the City of Lakes. Today, the Upper Lake remains one of the defining landscapes of the capital.',
        submitted_by: 'system',
        tags: [
          'raja_bhoj',
          'upper_lake',
          'lake',
          'bhopal',
          'history',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_bhopal_tribal_art' },
      {
        _id: 'story_bhopal_tribal_art',
        title: 'Stories Painted by Madhya Pradesh Tribal Artists',
        normalized_title: 'stories painted by madhya pradesh tribal artists',
        story_type: 'CULTURAL_TRADITION',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_tribal_museum_bhopal',
          name: 'Tribal Museum Bhopal',
        },
        city_id: 'city_bhopal_mp',
        narrative:
          'Bhopal has become an important centre for presenting the artistic traditions of Madhya Pradesh’s tribal communities. Gond, Bhil, Baiga, and other traditions use visual motifs, nature, mythology, memory, and community life to communicate stories across generations. The city’s cultural institutions have played an important role in bringing these traditions to wider audiences.',
        submitted_by: 'system',
        tags: [
          'tribal_art',
          'gond',
          'bhil',
          'baiga',
          'culture',
          'storytelling',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Trails...');

    await Trail.findOneAndUpdate(
      { _id: 'trail_bhopal_lakes_heritage' },
      {
        _id: 'trail_bhopal_lakes_heritage',
        name: 'Bhopal Lakes & Heritage Trail',
        normalized_name: 'bhopal lakes & heritage trail',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        description:
          'A city heritage trail combining Bhopal’s historic lakes, Begum-era architecture, cultural institutions, and Old Bhopal landmarks.',
        theme: 'Lakes, Begum Heritage & Old Bhopal',
        estimated_duration_mins: 240,
        distance_km: 9.5,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_upper_lake_bhopal',
            name: 'Upper Lake',
            display_order: 1,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_gauhar_mahal',
            name: 'Gauhar Mahal',
            display_order: 2,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_taj_ul_masajid',
            name: 'Taj-ul-Masajid',
            display_order: 3,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_moti_masjid_bhopal',
            name: 'Moti Masjid',
            display_order: 4,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_chowk_bazaar_bhopal',
            name: 'Chowk Bazaar',
            display_order: 5,
          },
        ],
        tags: [
          'trail',
          'heritage',
          'lakes',
          'begum',
          'old_bhopal',
          'architecture',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Trail.findOneAndUpdate(
      { _id: 'trail_bhopal_art_culture' },
      {
        _id: 'trail_bhopal_art_culture',
        name: 'Bhopal Art, Tribal Culture & Craft Trail',
        normalized_name: 'bhopal art tribal culture & craft trail',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        description:
          'A cultural trail focused on Bhopal’s contemporary arts, tribal heritage, museums, traditional crafts, and cultural institutions.',
        theme: 'Tribal Art, Contemporary Culture & Handicrafts',
        estimated_duration_mins: 210,
        distance_km: 7.0,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_tribal_museum_bhopal',
            name: 'Tribal Museum Bhopal',
            display_order: 1,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_bharat_bhavan',
            name: 'Bharat Bhavan',
            display_order: 2,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_gauhar_mahal',
            name: 'Gauhar Mahal',
            display_order: 3,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_chowk_bazaar_bhopal',
            name: 'Chowk Bazaar',
            display_order: 4,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_new_market_bhopal',
            name: 'New Market',
            display_order: 5,
          },
        ],
        tags: [
          'trail',
          'art',
          'tribal',
          'culture',
          'crafts',
          'museum',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Trail.findOneAndUpdate(
      { _id: 'trail_bhopal_food_old_city' },
      {
        _id: 'trail_bhopal_food_old_city',
        name: 'Old Bhopal Food & Bazaar Trail',
        normalized_name: 'old bhopal food & bazaar trail',
        city_id: 'city_bhopal_mp',
        state_id: 'state_mp',
        description:
          'A food-focused exploration of Old Bhopal combining traditional bazaars, street snacks, sweets, and the city’s Nawabi culinary heritage.',
        theme: 'Old City Bazaars & Bhopali Cuisine',
        estimated_duration_mins: 180,
        distance_km: 4.5,
        stops: [
          {
            entity_type: 'MARKET',
            entity_id: 'market_chowk_bazaar_bhopal',
            name: 'Chowk Bazaar',
            display_order: 1,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_itwara_bhopal',
            name: 'Itwara Market',
            display_order: 2,
          },
          {
            entity_type: 'FOOD_PLACE',
            entity_id: 'food_place_old_bhopal_street_food',
            name: 'Old Bhopal Street Food Vendors',
            display_order: 3,
          },
          {
            entity_type: 'FOOD_PLACE',
            entity_id: 'food_place_bhopali_nawabi_eateries',
            name: 'Bhopali Nawabi Cuisine Eateries',
            display_order: 4,
          },
        ],
        tags: [
          'trail',
          'food_trail',
          'old_bhopal',
          'nawabi_food',
          'street_food',
          'bazaar',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Bhopal Pilot Data Seeded Successfully!');
  } catch (error) {
    console.error('[Seed] Error seeding Bhopal data:', error);
  } finally {
    await disconnectDB();
  }
};

seedBhopal();
