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
    'Sourced and verified from Omkareshwar Cultural Heritage Dossier',
  sources: [
    'Omkareshwar Cultural Heritage Dossier (SIH 2026 / Bhraman Archive)',
  ],
};

const SYSTEM_PUBLICATION = {
  publication_status: 'PUBLISHED',
  published_at: new Date('2026-08-02T00:00:00Z'),
  published_by: 'system',
};

const seedOmkareshwar = async () => {
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
          'Heart of India, rich in sacred river traditions, historic kingdoms, temples, tribal cultures, crafts, and diverse landscapes.',
        location: {
          type: 'Point',
          coordinates: [78.6569, 22.9734],
        },
      },
      { upsert: true, new: true }
    );

    await City.findOneAndUpdate(
      { _id: 'city_omkareshwar_mp' },
      {
        _id: 'city_omkareshwar_mp',
        name: 'Omkareshwar',
        normalized_name: 'omkareshwar',
        state_id: 'state_mp',
        country_code: 'IN',
        location: {
          type: 'Point',
          coordinates: [76.1500, 22.2420],
        },
        short_description:
          'A sacred Narmada island pilgrimage town centered around the revered Omkareshwar Jyotirlinga and ancient riverfront temples.',
        description:
          'Omkareshwar is a major Hindu pilgrimage destination on the Narmada River in Madhya Pradesh. The sacred island is associated with the Omkareshwar Jyotirlinga, Mamleshwar Temple, Narmada ghats, ancient shrines, Mahakaleshwar-related traditions, and the spiritual culture of the Narmada valley.',
        cultural_summary:
          'Known for Omkareshwar Jyotirlinga, Mamleshwar Temple, Narmada Parikrama traditions, sacred ghats, island temples, river worship, Mahashivratri celebrations, and the religious heritage of the Nimar region.',
        highlights: [
          'Omkareshwar Jyotirlinga Temple',
          'Mamleshwar Temple',
          'Narmada River Ghats',
          'Omkareshwar Parikrama',
          'Siddhanath Temple',
          'Kedareshwar Temple',
          'Gauri Somnath Temple',
        ],
        is_featured: true,
        tags: [
          'jyotirlinga',
          'narmada',
          'pilgrimage',
          'shiv_bhakti',
          'nimar_region',
          'temple_town',
        ],
        status: 'ACTIVE',
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Places...');

    const placesData = [
      {
        _id: 'place_omkareshwar_jyotirlinga',
        name: 'Omkareshwar Jyotirlinga Temple',
        normalized_name: 'omkareshwar jyotirlinga temple',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1511, 22.2417],
        },
        address: {
          line1: 'Mandhata Island, Omkareshwar',
          city_id: 'city_omkareshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'One of the twelve revered Jyotirlinga shrines of Shiva, located on the sacred Mandhata island in the Narmada River.',
        historical_significance:
          'Omkareshwar has been an important Shaiva pilgrimage centre for centuries and is deeply connected with the religious geography of the Narmada.',
        architectural_style: 'Central Indian Temple Architecture',
        visiting_hours: 'Temple timings vary by ritual schedule',
        entry_fee: 'Free; special darshan and services may have separate charges',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'jyotirlinga',
          'shiva',
          'temple',
          'narmada',
          'pilgrimage',
        ],
      },
      {
        _id: 'place_mamleshwar_temple',
        name: 'Mamleshwar Temple',
        normalized_name: 'mamleshwar temple',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1472, 22.2427],
        },
        address: {
          line1: 'South Bank of Narmada, Omkareshwar',
          city_id: 'city_omkareshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Ancient Shiva temple on the southern bank of the Narmada traditionally regarded as closely associated with the Omkareshwar Jyotirlinga tradition.',
        historical_significance:
          'The temple complex represents the long-standing Shaiva religious heritage of the Omkareshwar region.',
        architectural_style: 'Medieval Central Indian Temple Architecture',
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
          'narmada',
          'pilgrimage',
          'heritage',
        ],
      },
      {
        _id: 'place_siddhanath_temple_omkareshwar',
        name: 'Siddhanath Temple',
        normalized_name: 'siddhanath temple omkareshwar',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1489, 22.2447],
        },
        address: {
          line1: 'Mandhata Island, Omkareshwar',
          city_id: 'city_omkareshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic Shiva temple known for its sculptural details, stone carvings, and elevated position within the sacred landscape of Omkareshwar.',
        historical_significance:
          'The temple reflects the medieval temple-building traditions that developed around the Narmada pilgrimage centre.',
        architectural_style: 'Medieval Temple Architecture',
        visiting_hours: '06:00 AM - 07:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
          why_visit:
            'A quieter heritage temple for visitors interested in stone carving and the older sacred landscape beyond the main shrine.',
        },
        tags: [
          'temple',
          'shiva',
          'stone_carving',
          'heritage',
          'hidden_gem',
        ],
      },
      {
        _id: 'place_kedareshwar_temple_omkareshwar',
        name: 'Kedareshwar Temple',
        normalized_name: 'kedareshwar temple omkareshwar',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1480, 22.2438],
        },
        address: {
          line1: 'Mandhata Island, Omkareshwar',
          city_id: 'city_omkareshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic shrine dedicated to Shiva and associated with the sacred temple landscape surrounding Omkareshwar.',
        historical_significance:
          'The shrine contributes to the dense network of Shaiva temples and pilgrimage routes on the sacred island.',
        architectural_style: 'Traditional Hindu Temple Architecture',
        visiting_hours: '06:00 AM - 07:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
          why_visit:
            'Suitable for travellers exploring Omkareshwar beyond the main Jyotirlinga shrine.',
        },
        tags: [
          'temple',
          'shiva',
          'pilgrimage',
          'heritage',
          'island',
        ],
      },
      {
        _id: 'place_gouri_somnath_temple',
        name: 'Gauri Somnath Temple',
        normalized_name: 'gauri somnath temple omkareshwar',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1498, 22.2452],
        },
        address: {
          line1: 'Mandhata Island, Omkareshwar',
          city_id: 'city_omkareshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Ancient stone temple dedicated to Shiva and Gauri, noted for its large dark stone lingam and traditional temple setting.',
        historical_significance:
          'The temple is part of Omkareshwar’s historic network of Shaiva shrines and sacred sites.',
        architectural_style: 'Medieval Stone Temple Architecture',
        visiting_hours: '06:00 AM - 07:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
        },
        tags: [
          'temple',
          'shiva',
          'gauri',
          'stone_architecture',
          'heritage',
        ],
      },
      {
        _id: 'place_narmada_ghat_omkareshwar',
        name: 'Omkareshwar Narmada Ghats',
        normalized_name: 'omkareshwar narmada ghats',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1506, 22.2412],
        },
        address: {
          line1: 'Narmada Riverfront, Omkareshwar',
          city_id: 'city_omkareshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Sacred riverfront steps where pilgrims bathe, perform rituals, offer prayers, light lamps, and begin or complete parts of their pilgrimage.',
        historical_significance:
          'The ghats form part of the living Narmada pilgrimage tradition and connect the temples of Omkareshwar with the river.',
        visiting_hours: '05:00 AM - 10:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'Sunrise and evening',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'narmada',
          'ghat',
          'pilgrimage',
          'aarti',
          'river_culture',
        ],
      },
      {
        _id: 'place_omkareshwar_parikrama_path',
        name: 'Omkareshwar Parikrama Path',
        normalized_name: 'omkareshwar parikrama path',
        place_type: 'PILGRIMAGE_SITE',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1500, 22.2430],
        },
        address: {
          line1: 'Mandhata Island and surrounding Narmada route',
          city_id: 'city_omkareshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Sacred circumambulation route around the Omkareshwar island and associated religious landscape followed by pilgrims.',
        historical_significance:
          'The parikrama is an important expression of Narmada and Shaiva pilgrimage traditions and connects numerous shrines and sacred locations.',
        visiting_hours: 'Daytime; pilgrims may begin early morning',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'parikrama',
          'pilgrimage',
          'narmada',
          'walking',
          'spiritual_trail',
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
        _id: 'market_omkareshwar_main_bazaar',
        name: 'Omkareshwar Main Bazaar',
        normalized_name: 'omkareshwar main bazaar',
        market_type: 'PILGRIMAGE_MARKET',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1507, 22.2420],
        },
        address: {
          line1: 'Main Bazaar, Omkareshwar',
          city_id: 'city_omkareshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Busy pilgrimage bazaar surrounding the temple area with religious goods, flowers, prasad, sweets, snacks, souvenirs, and everyday visitor services.',
        operating_hours: '06:00 AM - 10:00 PM',
        best_known_for: [
          'Puja Items',
          'Prasad',
          'Rudraksha',
          'Religious Souvenirs',
          'Sweets',
        ],
        tags: [
          'pilgrimage_market',
          'temple_market',
          'shopping',
          'prasad',
        ],
      },
      {
        _id: 'market_omkareshwar_ghat_market',
        name: 'Narmada Ghat Market',
        normalized_name: 'narmada ghat market omkareshwar',
        market_type: 'RIVERFRONT_MARKET',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1505, 22.2410],
        },
        address: {
          line1: 'Narmada Ghat Area, Omkareshwar',
          city_id: 'city_omkareshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Small riverfront market serving pilgrims with flowers, lamps, puja materials, prasad, snacks, tea, and Narmada-related devotional items.',
        operating_hours: '05:00 AM - 10:00 PM',
        best_known_for: [
          'Narmada Puja Items',
          'Flowers',
          'Diyas',
          'Prasad',
          'Tea & Snacks',
        ],
        tags: [
          'narmada',
          'ghat',
          'pilgrimage',
          'market',
          'puja',
        ],
      },
      {
        _id: 'market_omkareshwar_handicraft_bazaar',
        name: 'Omkareshwar Handicraft Bazaar',
        normalized_name: 'omkareshwar handicraft bazaar',
        market_type: 'CRAFT_MARKET',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1495, 22.2425],
        },
        address: {
          line1: 'Temple Bazaar Area, Omkareshwar',
          city_id: 'city_omkareshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Small craft-focused shopping area featuring religious souvenirs, Narmada stones, local handicrafts, textiles, and decorative objects.',
        operating_hours: '09:00 AM - 09:00 PM',
        best_known_for: [
          'Narmada Stones',
          'Religious Souvenirs',
          'Handicrafts',
          'Textiles',
          'Wooden Crafts',
        ],
        tags: [
          'handicraft',
          'souvenirs',
          'narmada',
          'shopping',
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
        _id: 'food_omkareshwar_poha',
        name: 'Nimar-Style Poha',
        normalized_name: 'nimar style poha omkareshwar',
        food_category: 'STREET_FOOD',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        description:
          'Light flattened-rice breakfast prepared with onions, spices, coriander, lemon, and commonly served with sev or jalebi.',
        cultural_origin: 'Nimar / Western Madhya Pradesh',
        key_ingredients: [
          'Poha',
          'Onion',
          'Mustard Seeds',
          'Coriander',
          'Lemon',
          'Sev',
        ],
        tags: [
          'breakfast',
          'poha',
          'nimar',
          'street_food',
        ],
      },
      {
        _id: 'food_omkareshwar_sabudana_khichdi',
        name: 'Sabudana Khichdi',
        normalized_name: 'sabudana khichdi omkareshwar',
        food_category: 'FASTING_FOOD',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        description:
          'Tapioca pearl dish with roasted peanuts, potato, cumin, green chilli, and lemon, especially popular with pilgrims observing fasts.',
        cultural_origin: 'Central India / Pilgrimage Food Tradition',
        key_ingredients: [
          'Sabudana',
          'Potato',
          'Peanuts',
          'Cumin',
          'Green Chilli',
          'Lemon',
        ],
        tags: [
          'sabudana',
          'fasting',
          'pilgrimage_food',
          'vegetarian',
        ],
      },
      {
        _id: 'food_omkareshwar_khichdi',
        name: 'Temple-Style Khichdi',
        normalized_name: 'temple style khichdi omkareshwar',
        food_category: 'TEMPLE_FOOD',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        description:
          'Simple rice-and-lentil preparation associated with traditional vegetarian pilgrimage meals and community kitchens.',
        cultural_origin: 'Narmada Pilgrimage Tradition',
        key_ingredients: [
          'Rice',
          'Moong Dal',
          'Cumin',
          'Ghee',
          'Turmeric',
        ],
        tags: [
          'temple_food',
          'khichdi',
          'pilgrimage',
          'vegetarian',
        ],
      },
      {
        _id: 'food_omkareshwar_jalebi',
        name: 'Jalebi',
        normalized_name: 'jalebi omkareshwar',
        food_category: 'SWEET',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        description:
          'Crisp spiral-shaped sweet soaked in sugar syrup and commonly enjoyed with tea or as a breakfast accompaniment.',
        cultural_origin: 'Central India',
        key_ingredients: [
          'Refined Flour',
          'Sugar',
          'Ghee or Oil',
          'Cardamom',
        ],
        tags: [
          'sweet',
          'jalebi',
          'breakfast',
          'pilgrimage_food',
        ],
      },
      {
        _id: 'food_omkareshwar_lassi',
        name: 'Nimar Lassi',
        normalized_name: 'nimar lassi omkareshwar',
        food_category: 'BEVERAGE',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        description:
          'Cooling yogurt-based drink commonly enjoyed by pilgrims and travellers in the warm Narmada valley.',
        cultural_origin: 'Nimar Region',
        key_ingredients: [
          'Yogurt',
          'Water',
          'Sugar',
          'Cardamom',
        ],
        tags: [
          'lassi',
          'beverage',
          'nimar',
          'summer',
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
        _id: 'food_place_omkareshwar_temple_bazaar',
        name: 'Omkareshwar Temple Bazaar Food Stalls',
        normalized_name: 'omkareshwar temple bazaar food stalls',
        food_place_type: 'STALL',
        associated_food_ids: [
          'food_omkareshwar_poha',
          'food_omkareshwar_jalebi',
          'food_omkareshwar_lassi',
        ],
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1507, 22.2420],
        },
        address: {
          line1: 'Temple Bazaar, Omkareshwar',
          city_id: 'city_omkareshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Local food stalls around the pilgrimage bazaar serving breakfast, sweets, beverages, and quick vegetarian meals to pilgrims.',
        operating_hours: '06:00 AM - 10:00 PM',
        price_range: '₹30 - ₹200',
        is_heritage_vendor: false,
        est_year: 1980,
        tags: [
          'temple_bazaar',
          'street_food',
          'pilgrimage_food',
          'vegetarian',
        ],
      },
      {
        _id: 'food_place_narmada_ghat_food_stalls',
        name: 'Narmada Ghat Food Stalls',
        normalized_name: 'narmada ghat food stalls omkareshwar',
        food_place_type: 'STALL',
        associated_food_ids: [
          'food_omkareshwar_sabudana_khichdi',
          'food_omkareshwar_lassi',
          'food_omkareshwar_jalebi',
        ],
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1505, 22.2410],
        },
        address: {
          line1: 'Narmada Ghat Area, Omkareshwar',
          city_id: 'city_omkareshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Small riverfront vendors offering simple vegetarian snacks, fasting foods, sweets, tea, and cooling drinks.',
        operating_hours: '05:00 AM - 09:00 PM',
        price_range: '₹30 - ₹150',
        is_heritage_vendor: true,
        est_year: 1978,
        tags: [
          'narmada',
          'ghat',
          'street_food',
          'pilgrimage',
        ],
      },
      {
        _id: 'food_place_omkareshwar_prasad_shops',
        name: 'Omkareshwar Prasad & Sweet Shops',
        normalized_name: 'omkareshwar prasad sweet shops',
        food_place_type: 'SHOP',
        associated_food_ids: [
          'food_omkareshwar_jalebi',
          'food_omkareshwar_lassi',
        ],
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1504, 22.2421],
        },
        address: {
          line1: 'Main Temple Bazaar, Omkareshwar',
          city_id: 'city_omkareshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Traditional sweet and prasad shops serving pilgrims visiting the Omkareshwar temple complex.',
        operating_hours: '06:00 AM - 10:00 PM',
        price_range: '₹50 - ₹300',
        is_heritage_vendor: true,
        est_year: 1970,
        tags: [
          'prasad',
          'sweets',
          'temple',
          'pilgrimage',
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
      { _id: 'artisan_omkareshwar_stone_carvers' },
      {
        _id: 'artisan_omkareshwar_stone_carvers',
        name: 'Nimar Stone & Temple Craft Artisans',
        normalized_name: 'nimar stone temple craft artisans',
        specialization_type: 'STONE_CRAFT',
        craft_description:
          'Traditional stone workers producing religious sculptures, carved objects, temple-related decorative pieces, and Narmada-region souvenirs.',
        district: 'Khandwa',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1500, 22.2420],
        },
        is_master_craftsperson: true,
        awards: [],
        tags: [
          'stone_craft',
          'temple_craft',
          'nimar',
          'handicraft',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Artisan.findOneAndUpdate(
      { _id: 'artisan_nimar_handloom_omkareshwar' },
      {
        _id: 'artisan_nimar_handloom_omkareshwar',
        name: 'Nimar Handloom Artisans',
        normalized_name: 'nimar handloom artisans',
        specialization_type: 'TEXTILE',
        craft_description:
          'Regional textile artisans preserving traditional weaving practices and producing cotton fabrics, everyday textiles, and regional handloom products.',
        district: 'Khandwa',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1500, 22.2420],
        },
        is_master_craftsperson: false,
        awards: [],
        tags: [
          'handloom',
          'textile',
          'nimar',
          'weaving',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_omkareshwar_pilgrims' },
      {
        _id: 'community_omkareshwar_pilgrims',
        name: 'Omkareshwar Pilgrimage Community',
        normalized_name: 'omkareshwar pilgrimage community',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        description:
          'Temple priests, pilgrims, boatmen, vendors, guides, service providers, and local families whose lives are closely connected with the Omkareshwar pilgrimage economy and Narmada traditions.',
        cultural_contribution:
          'Maintained temple rituals, Narmada worship, pilgrimage customs, oral traditions, festival practices, and hospitality traditions surrounding one of central India’s major sacred sites.',
        heritage_crafts_or_foods: [
          'Temple Food',
          'Prasad Traditions',
          'Narmada Worship',
          'Pilgrimage Services',
          'Religious Handicrafts',
        ],
        tags: [
          'pilgrimage',
          'narmada',
          'temple',
          'community',
          'religious_heritage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_narmada_boatmen_omkareshwar' },
      {
        _id: 'community_narmada_boatmen_omkareshwar',
        name: 'Omkareshwar Narmada Boatmen',
        normalized_name: 'omkareshwar narmada boatmen',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        description:
          'Local boatmen and river-connected families who provide traditional river transport and maintain knowledge of the Narmada riverfront and sacred island landscape.',
        cultural_contribution:
          'Preserved traditional boating knowledge, river stories, pilgrimage routes, local geography, and the living relationship between Omkareshwar and the Narmada.',
        heritage_crafts_or_foods: [
          'Traditional Boatmanship',
          'Narmada River Lore',
          'Pilgrimage Boat Routes',
          'Riverfront Traditions',
        ],
        tags: [
          'boatmen',
          'narmada',
          'river_culture',
          'pilgrimage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Events & Stories...');

    await Event.findOneAndUpdate(
      { _id: 'event_mahashivratri_omkareshwar' },
      {
        _id: 'event_mahashivratri_omkareshwar',
        name: 'Mahashivratri at Omkareshwar',
        normalized_name: 'mahashivratri at omkareshwar',
        event_type: 'FESTIVAL',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1511, 22.2417],
        },
        recurrence: 'Annual',
        description:
          'Major Shaiva festival bringing large numbers of devotees to Omkareshwar for special worship, temple rituals, processions, night vigils, and Narmada-side devotional activities.',
        cultural_significance:
          'One of the most important annual expressions of Omkareshwar’s identity as a major Shaiva pilgrimage centre.',
        tags: [
          'mahashivratri',
          'shiva',
          'festival',
          'jyotirlinga',
          'pilgrimage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_narmada_jayanti_omkareshwar' },
      {
        _id: 'event_narmada_jayanti_omkareshwar',
        name: 'Narmada Jayanti at Omkareshwar',
        normalized_name: 'narmada jayanti at omkareshwar',
        event_type: 'FESTIVAL',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1505, 22.2410],
        },
        recurrence: 'Annual',
        description:
          'Celebrations along the Narmada involving decorated ghats, devotional ceremonies, lamps, prayers, processions, and community gatherings.',
        cultural_significance:
          'Celebrates the sacred identity of the Narmada and its central role in the religious landscape of Omkareshwar.',
        tags: [
          'narmada_jayanti',
          'festival',
          'narmada',
          'ghat',
          'pilgrimage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_shravan_omkareshwar' },
      {
        _id: 'event_shravan_omkareshwar',
        name: 'Shravan Month Pilgrimage',
        normalized_name: 'shravan month pilgrimage omkareshwar',
        event_type: 'RELIGIOUS_EVENT',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.1511, 22.2417],
        },
        recurrence: 'Annual during Shravan',
        description:
          'A period of heightened Shiva worship when devotees visit Omkareshwar for darshan, abhishekam, river rituals, fasting, and pilgrimage.',
        cultural_significance:
          'Shravan intensifies the city’s role as a Shaiva pilgrimage destination and strengthens the living connection between temple worship and Narmada traditions.',
        tags: [
          'shravan',
          'shiva',
          'pilgrimage',
          'narmada',
          'jyotirlinga',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_omkareshwar_om_shape_island' },
      {
        _id: 'story_omkareshwar_om_shape_island',
        title: 'The Sacred Om-Shaped Island',
        normalized_title: 'the sacred om shaped island of omkareshwar',
        story_type: 'LOCAL_HISTORY',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_omkareshwar_jyotirlinga',
          name: 'Omkareshwar Jyotirlinga Temple',
        },
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        narrative:
          'Omkareshwar’s sacred island in the Narmada is traditionally understood to resemble the sacred syllable Om. This association has become central to the spiritual identity of the town, linking the geography of the river island with Shaiva worship and pilgrimage.',
        submitted_by: 'system',
        tags: [
          'om',
          'narmada',
          'island',
          'jyotirlinga',
          'pilgrimage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_omkareshwar_jyotirlinga_legend' },
      {
        _id: 'story_omkareshwar_jyotirlinga_legend',
        title: 'The Legend of Omkareshwar Jyotirlinga',
        normalized_title: 'the legend of omkareshwar jyotirlinga',
        story_type: 'RELIGIOUS_LEGEND',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_omkareshwar_jyotirlinga',
          name: 'Omkareshwar Jyotirlinga Temple',
        },
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        narrative:
          'Omkareshwar is one of the twelve Jyotirlinga sites revered in Hindu tradition. Multiple sacred narratives connect the shrine with Shiva’s manifestation and the spiritual power of the Narmada. These traditions have helped establish Omkareshwar as one of the most important Shaiva pilgrimage centres in India.',
        submitted_by: 'system',
        tags: [
          'jyotirlinga',
          'shiva',
          'legend',
          'narmada',
          'pilgrimage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_narmada_parikrama_omkareshwar' },
      {
        _id: 'story_narmada_parikrama_omkareshwar',
        title: 'Omkareshwar and the Narmada Parikrama Tradition',
        normalized_title: 'omkareshwar and the narmada parikrama tradition',
        story_type: 'CULTURAL_HISTORY',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_omkareshwar_parikrama_path',
          name: 'Omkareshwar Parikrama Path',
        },
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        narrative:
          'Omkareshwar occupies an important place in the sacred geography of the Narmada. Pilgrims circumambulate the island and visit its temples as part of local pilgrimage practices, while the wider Narmada Parikrama tradition connects communities, temples, river ghats, and sacred landscapes across the length of the river.',
        submitted_by: 'system',
        tags: [
          'narmada_parikrama',
          'narmada',
          'pilgrimage',
          'omkareshwar',
          'river_culture',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Trails...');

    await Trail.findOneAndUpdate(
      { _id: 'trail_omkareshwar_jyotirlinga' },
      {
        _id: 'trail_omkareshwar_jyotirlinga',
        name: 'Omkareshwar Jyotirlinga & Narmada Trail',
        normalized_name: 'omkareshwar jyotirlinga & narmada trail',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        description:
          'A sacred walking trail through Omkareshwar’s principal temples, ancient shrines, Narmada ghats, and pilgrimage routes.',
        theme: 'Jyotirlinga, Shaiva Heritage & Narmada Spirituality',
        estimated_duration_mins: 210,
        distance_km: 5.5,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_omkareshwar_jyotirlinga',
            name: 'Omkareshwar Jyotirlinga Temple',
            display_order: 1,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_mamleshwar_temple',
            name: 'Mamleshwar Temple',
            display_order: 2,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_siddhanath_temple_omkareshwar',
            name: 'Siddhanath Temple',
            display_order: 3,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_gouri_somnath_temple',
            name: 'Gauri Somnath Temple',
            display_order: 4,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_narmada_ghat_omkareshwar',
            name: 'Omkareshwar Narmada Ghats',
            display_order: 5,
          },
        ],
        tags: [
          'trail',
          'jyotirlinga',
          'shiva',
          'narmada',
          'temple',
          'pilgrimage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Trail.findOneAndUpdate(
      { _id: 'trail_omkareshwar_parikrama' },
      {
        _id: 'trail_omkareshwar_parikrama',
        name: 'Omkareshwar Island Parikrama Trail',
        normalized_name: 'omkareshwar island parikrama trail',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        description:
          'A pilgrimage-focused walking route following the sacred island landscape, temples, river viewpoints, and Narmada-connected sites of Omkareshwar.',
        theme: 'Sacred Island, Narmada & Pilgrimage',
        estimated_duration_mins: 180,
        distance_km: 7.0,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_omkareshwar_parikrama_path',
            name: 'Omkareshwar Parikrama Path',
            display_order: 1,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_kedareshwar_temple_omkareshwar',
            name: 'Kedareshwar Temple',
            display_order: 2,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_siddhanath_temple_omkareshwar',
            name: 'Siddhanath Temple',
            display_order: 3,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_narmada_ghat_omkareshwar',
            name: 'Omkareshwar Narmada Ghats',
            display_order: 4,
          },
        ],
        tags: [
          'trail',
          'parikrama',
          'walking',
          'narmada',
          'pilgrimage',
          'spiritual',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Trail.findOneAndUpdate(
      { _id: 'trail_omkareshwar_food_culture' },
      {
        _id: 'trail_omkareshwar_food_culture',
        name: 'Omkareshwar Pilgrimage & Food Trail',
        normalized_name: 'omkareshwar pilgrimage & food trail',
        city_id: 'city_omkareshwar_mp',
        state_id: 'state_mp',
        description:
          'A relaxed food and culture trail combining temple markets, Narmada riverfront food stalls, traditional sweets, fasting foods, and the sacred riverfront.',
        theme: 'Pilgrimage Food, Temple Bazaar & Narmada Culture',
        estimated_duration_mins: 150,
        distance_km: 4.0,
        stops: [
          {
            entity_type: 'MARKET',
            entity_id: 'market_omkareshwar_main_bazaar',
            name: 'Omkareshwar Main Bazaar',
            display_order: 1,
          },
          {
            entity_type: 'FOOD_PLACE',
            entity_id: 'food_place_omkareshwar_temple_bazaar',
            name: 'Omkareshwar Temple Bazaar Food Stalls',
            display_order: 2,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_omkareshwar_ghat_market',
            name: 'Narmada Ghat Market',
            display_order: 3,
          },
          {
            entity_type: 'FOOD_PLACE',
            entity_id: 'food_place_narmada_ghat_food_stalls',
            name: 'Narmada Ghat Food Stalls',
            display_order: 4,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_narmada_ghat_omkareshwar',
            name: 'Omkareshwar Narmada Ghats',
            display_order: 5,
          },
        ],
        tags: [
          'trail',
          'food_trail',
          'pilgrimage',
          'street_food',
          'narmada',
          'markets',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Omkareshwar Pilot Data Seeded Successfully!');
  } catch (error) {
    console.error('[Seed] Error seeding Omkareshwar data:', error);
  } finally {
    await disconnectDB();
  }
};

seedOmkareshwar();
