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
  verification_notes: 'Sourced and verified from Jabalpur Cultural Heritage Dossier',
  sources: ['Jabalpur Cultural Heritage Dossier (SIH 2026 / Bhraman Archive)'],
};

const SYSTEM_PUBLICATION = {
  publication_status: 'PUBLISHED',
  published_at: new Date('2026-08-02T00:00:00Z'),
  published_by: 'system',
};

const seedJabalpur = async () => {
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
          'Heart of India, known for its rich heritage, forests, rivers, temples, forts, tribal traditions, and diverse regional cuisines.',
        location: {
          type: 'Point',
          coordinates: [78.6569, 22.9734],
        },
      },
      { upsert: true, new: true }
    );

    await City.findOneAndUpdate(
      { _id: 'city_jabalpur_mp' },
      {
        _id: 'city_jabalpur_mp',
        name: 'Jabalpur',
        normalized_name: 'jabalpur',
        state_id: 'state_mp',
        country_code: 'IN',
        location: {
          type: 'Point',
          coordinates: [79.9864, 23.1815],
        },
        short_description:
          'A historic Narmada city known for Marble Rocks, Bhedaghat, Dhuandhar Falls, Gond heritage, temples, and the cuisine of Mahakoshal.',
        description:
          'Jabalpur is a major city of eastern Madhya Pradesh situated on the Narmada River. It is renowned for the Marble Rocks at Bhedaghat, Dhuandhar Falls, Madan Mahal Fort, Chausath Yogini Temple, Rani Durgavati heritage, Gond culture, traditional crafts, and the food traditions of the Mahakoshal region.',
        cultural_summary:
          'Known for Bhedaghat Marble Rocks, Dhuandhar Falls, Madan Mahal Fort, Rani Durgavati heritage, Chausath Yogini Temple, Gond and tribal traditions, Narmada culture, and Mahakoshal cuisine.',
        highlights: [
          'Bhedaghat Marble Rocks',
          'Dhuandhar Falls',
          'Madan Mahal Fort',
          'Chausath Yogini Temple',
          'Rani Durgavati Museum',
          'Gwarighat Narmada',
        ],
        is_featured: true,
        tags: [
          'narmada',
          'mahakoshal',
          'gond_heritage',
          'marble_rocks',
          'waterfalls',
          'heritage_city',
        ],
        status: 'ACTIVE',
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Places...');

    const placesData = [
      {
        _id: 'place_bhedaghat_marble_rocks',
        name: 'Bhedaghat Marble Rocks',
        normalized_name: 'bhedaghat marble rocks',
        place_type: 'NATURAL_SITE',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.8001, 23.1307],
        },
        address: {
          line1: 'Bhedaghat, Jabalpur',
          city_id: 'city_jabalpur_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Dramatic white marble cliffs rising along the Narmada River, forming one of the most iconic landscapes of Madhya Pradesh.',
        historical_significance:
          'The Narmada gorge and Marble Rocks have long been associated with local pilgrimage, river culture, tourism, and traditional boatmen communities.',
        architectural_style: 'Natural Marble Gorge Landscape',
        visiting_hours: 'Daytime; boating timings vary seasonally',
        entry_fee: 'Varies',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'marble_rocks',
          'narmada',
          'bhedaghat',
          'nature',
          'landmark',
        ],
      },
      {
        _id: 'place_dhuandhar_falls',
        name: 'Dhuandhar Falls',
        normalized_name: 'dhuandhar falls',
        place_type: 'NATURAL_SITE',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.8081, 23.1235],
        },
        address: {
          line1: 'Bhedaghat, Jabalpur',
          city_id: 'city_jabalpur_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Powerful waterfall on the Narmada River where the river plunges through the Marble Rocks gorge and creates a mist-like spray.',
        historical_significance:
          'A major natural landmark of the Narmada valley and an important destination within the Bhedaghat pilgrimage and tourism landscape.',
        visiting_hours: '06:00 AM - 08:00 PM',
        entry_fee: 'Free; nearby attractions may have separate fees',
        best_time_to_visit: 'Monsoon and winter',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'waterfall',
          'narmada',
          'bhedaghat',
          'nature',
          'monsoon',
        ],
      },
      {
        _id: 'place_madan_mahal_fort',
        name: 'Madan Mahal Fort',
        normalized_name: 'madan mahal fort',
        place_type: 'HERITAGE',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.9246, 23.1525],
        },
        address: {
          line1: 'Madan Mahal Hill, Jabalpur',
          city_id: 'city_jabalpur_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic hilltop fort associated with the Gond rulers and the medieval history of Jabalpur.',
        historical_significance:
          'Built during the Gond period and traditionally associated with Raja Madan Singh, the fort served as a strategic military and observation point.',
        architectural_style: 'Gond Fort Architecture',
        visiting_hours: '08:00 AM - 06:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'fort',
          'gond',
          'heritage',
          'hilltop',
          'medieval_history',
        ],
      },
      {
        _id: 'place_chausath_yogini_temple',
        name: 'Chausath Yogini Temple',
        normalized_name: 'chausath yogini temple jabalpur',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.7932, 23.1300],
        },
        address: {
          line1: 'Bhedaghat, Jabalpur',
          city_id: 'city_jabalpur_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Ancient hilltop temple dedicated to the sixty-four Yoginis, overlooking the Narmada River near Bhedaghat.',
        historical_significance:
          'An important medieval sacred site traditionally dated to the Kalachuri period and one of the prominent Yogini temples of central India.',
        architectural_style: 'Circular Yogini Temple Architecture',
        visiting_hours: '07:00 AM - 07:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'LESSER_KNOWN',
        },
        tags: [
          'temple',
          'yogini',
          'kalachuri',
          'bhedaghat',
          'heritage',
        ],
      },
      {
        _id: 'place_rani_durgavati_museum',
        name: 'Rani Durgavati Museum',
        normalized_name: 'rani durgavati museum',
        place_type: 'MUSEUM',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.9395, 23.1662],
        },
        address: {
          line1: 'Civil Lines, Jabalpur',
          city_id: 'city_jabalpur_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Museum documenting the archaeological, cultural, and tribal heritage of Jabalpur and the surrounding regions.',
        historical_significance:
          'Named after Rani Durgavati and associated with the preservation of archaeological material and cultural heritage from the Mahakoshal region.',
        architectural_style: 'Modern Museum Architecture',
        visiting_hours: '10:30 AM - 05:30 PM',
        entry_fee: 'Nominal entry fee',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'LESSER_KNOWN',
        },
        tags: [
          'museum',
          'rani_durgavati',
          'tribal_heritage',
          'archaeology',
          'culture',
        ],
      },
      {
        _id: 'place_gwarighat_narmada',
        name: 'Gwarighat',
        normalized_name: 'gwarighat jabalpur',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.9208, 23.1317],
        },
        address: {
          line1: 'Gwarighat, Jabalpur',
          city_id: 'city_jabalpur_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Sacred Narmada riverfront known for evening aarti, temples, devotional gatherings, and the living river culture of Jabalpur.',
        historical_significance:
          'Gwarighat has long been an important Narmada pilgrimage centre and remains one of the city’s principal sites of religious and community life.',
        architectural_style: 'Narmada Riverfront Temple Architecture',
        visiting_hours: '05:00 AM - 10:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'Evening aarti; October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'narmada',
          'ghat',
          'aarti',
          'pilgrimage',
          'river_culture',
        ],
      },
      {
        _id: 'place_balancing_rock_jabalpur',
        name: 'Balancing Rock',
        normalized_name: 'balancing rock jabalpur',
        place_type: 'NATURAL_SITE',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.9227, 23.1575],
        },
        address: {
          line1: 'Madan Mahal area, Jabalpur',
          city_id: 'city_jabalpur_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Distinctive naturally balanced rock formation near Madan Mahal, locally regarded as a geological curiosity and landmark.',
        historical_significance:
          'The formation has become a recognizable part of Jabalpur’s local landscape and informal tourism heritage.',
        visiting_hours: 'Daytime',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LOCAL_SECRET',
          why_visit:
            'A compact and unusual geological landmark that can be combined with the Madan Mahal heritage area.',
        },
        tags: [
          'natural_landmark',
          'balancing_rock',
          'geology',
          'hidden_gem',
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
        _id: 'market_sadar_bazaar_jabalpur',
        name: 'Sadar Bazaar',
        normalized_name: 'sadar bazaar jabalpur',
        market_type: 'TRADITIONAL_MARKET',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.9461, 23.1705],
        },
        address: {
          line1: 'Sadar Bazaar, Jabalpur',
          city_id: 'city_jabalpur_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic commercial district with food shops, clothing, household goods, sweets, snacks, and everyday local commerce.',
        operating_hours: '10:00 AM - 09:00 PM',
        best_known_for: [
          'Sweets',
          'Namkeen',
          'Traditional Clothing',
          'Street Snacks',
          'Local Shopping',
        ],
        tags: [
          'traditional_market',
          'shopping',
          'street_food',
          'jabalpur',
        ],
      },
      {
        _id: 'market_adhartal_bazaar',
        name: 'Adhartal Bazaar',
        normalized_name: 'adhartal bazaar jabalpur',
        market_type: 'TRADITIONAL_MARKET',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.9508, 23.1972],
        },
        address: {
          line1: 'Adhartal, Jabalpur',
          city_id: 'city_jabalpur_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Busy local market serving surrounding neighbourhoods with groceries, snacks, sweets, clothing, and traditional goods.',
        operating_hours: '09:00 AM - 09:00 PM',
        best_known_for: [
          'Kachori',
          'Samosa',
          'Jalebi',
          'Namkeen',
          'Local Produce',
        ],
        tags: [
          'local_market',
          'food',
          'shopping',
          'neighbourhood',
        ],
      },
      {
        _id: 'market_gwarighat_food_market',
        name: 'Gwarighat Food & Pilgrimage Market',
        normalized_name: 'gwarighat food pilgrimage market',
        market_type: 'PILGRIMAGE_MARKET',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.9206, 23.1318],
        },
        address: {
          line1: 'Gwarighat, Jabalpur',
          city_id: 'city_jabalpur_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Riverfront market area around Gwarighat featuring devotional items, flowers, sweets, snacks, tea, and small local food vendors.',
        operating_hours: '06:00 AM - 10:00 PM',
        best_known_for: [
          'Prasad',
          'Jalebi',
          'Tea',
          'Sweets',
          'Devotional Items',
        ],
        tags: [
          'pilgrimage',
          'narmada',
          'food',
          'market',
          'gwarighat',
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
        _id: 'food_jabalpur_poha',
        name: 'Jabalpur Poha',
        normalized_name: 'jabalpur poha',
        food_category: 'STREET_FOOD',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        description:
          'Light flattened-rice breakfast prepared with onions, mustard seeds, curry leaves, spices, and commonly finished with sev and coriander.',
        cultural_origin: 'Jabalpur / Mahakoshal Region',
        key_ingredients: [
          'Poha',
          'Onion',
          'Mustard Seeds',
          'Curry Leaves',
          'Sev',
          'Coriander',
        ],
        tags: [
          'breakfast',
          'poha',
          'street_food',
          'mahakoshal',
        ],
      },
      {
        _id: 'food_dal_bafla_jabalpur',
        name: 'Mahakoshal Dal Bafla',
        normalized_name: 'mahakoshal dal bafla',
        food_category: 'TRADITIONAL_FOOD',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        description:
          'Traditional wheat-based bafla served with dal, ghee, chutneys, and vegetable accompaniments, popular across central Madhya Pradesh.',
        cultural_origin: 'Mahakoshal / Madhya Pradesh',
        key_ingredients: [
          'Wheat',
          'Toor Dal',
          'Ghee',
          'Spices',
          'Chutneys',
        ],
        tags: [
          'dal_bafla',
          'traditional_food',
          'mahakoshal',
          'vegetarian',
        ],
      },
      {
        _id: 'food_jabalpur_khoya_jalebi',
        name: 'Jalebi',
        normalized_name: 'jalebi jabalpur',
        food_category: 'SWEET',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        description:
          'Crisp spiral-shaped sweet soaked in sugar syrup and widely enjoyed as a breakfast accompaniment and festive dessert.',
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
          'street_food',
        ],
      },
      {
        _id: 'food_sabudana_khichdi_jabalpur',
        name: 'Sabudana Khichdi',
        normalized_name: 'sabudana khichdi jabalpur',
        food_category: 'FASTING_FOOD',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        description:
          'Tapioca pearl dish prepared with roasted peanuts, potatoes, green chilli, cumin, and lemon, especially popular during fasting periods.',
        cultural_origin: 'Central India',
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
          'vegetarian',
          'breakfast',
        ],
      },
      {
        _id: 'food_mahua_laddoo',
        name: 'Mahua Laddoo',
        normalized_name: 'mahua laddoo jabalpur',
        food_category: 'SWEET',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        description:
          'Traditional sweet associated with tribal food culture of central India, using mahua flowers and locally available ingredients.',
        cultural_origin: 'Mahakoshal / Central Indian Tribal Regions',
        key_ingredients: [
          'Mahua Flowers',
          'Jaggery',
          'Millets or Flour',
          'Ghee',
        ],
        tags: [
          'mahua',
          'tribal_food',
          'sweet',
          'heritage_food',
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
        _id: 'food_place_bhedaghat_food_stalls',
        name: 'Bhedaghat Food Stalls',
        normalized_name: 'bhedaghat food stalls',
        food_place_type: 'STALL',
        associated_food_ids: [
          'food_jabalpur_poha',
          'food_dal_bafla_jabalpur',
          'food_jabalpur_khoya_jalebi',
        ],
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.8002, 23.1305],
        },
        address: {
          line1: 'Bhedaghat Tourist Area, Jabalpur',
          city_id: 'city_jabalpur_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Small local food vendors serving snacks, sweets, tea, and simple meals around the Bhedaghat tourist and pilgrimage area.',
        operating_hours: '08:00 AM - 09:00 PM',
        price_range: '₹30 - ₹250',
        is_heritage_vendor: false,
        est_year: 1985,
        tags: [
          'bhedaghat',
          'street_food',
          'tourist_food',
          'narmada',
        ],
      },
      {
        _id: 'food_place_gwarighat_prasad_shops',
        name: 'Gwarighat Prasad & Sweet Shops',
        normalized_name: 'gwarighat prasad sweet shops',
        food_place_type: 'SHOP',
        associated_food_ids: [
          'food_jabalpur_khoya_jalebi',
          'food_jabalpur_poha',
        ],
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.9207, 23.1319],
        },
        address: {
          line1: 'Gwarighat, Jabalpur',
          city_id: 'city_jabalpur_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Traditional sweet and prasad shops serving pilgrims and visitors around the Narmada riverfront.',
        operating_hours: '06:00 AM - 10:00 PM',
        price_range: '₹50 - ₹300',
        is_heritage_vendor: true,
        est_year: 1975,
        tags: [
          'gwarighat',
          'prasad',
          'sweets',
          'heritage_vendor',
        ],
      },
      {
        _id: 'food_place_jabalpur_breakfast_stalls',
        name: 'Jabalpur Breakfast Vendors',
        normalized_name: 'jabalpur breakfast vendors',
        food_place_type: 'STALL',
        associated_food_ids: [
          'food_jabalpur_poha',
          'food_jabalpur_khoya_jalebi',
          'food_sabudana_khichdi_jabalpur',
        ],
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.9440, 23.1710],
        },
        address: {
          line1: 'Central Jabalpur',
          city_id: 'city_jabalpur_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Local breakfast stalls serving poha, jalebi, sabudana khichdi, tea, and everyday Mahakoshal breakfast favourites.',
        operating_hours: '07:00 AM - 11:00 AM',
        price_range: '₹30 - ₹150',
        is_heritage_vendor: false,
        est_year: 1980,
        tags: [
          'breakfast',
          'poha',
          'jalebi',
          'street_food',
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
      { _id: 'artisan_jabalpur_marble_carvers' },
      {
        _id: 'artisan_jabalpur_marble_carvers',
        name: 'Bhedaghat Marble Craft Artisans',
        normalized_name: 'bhedaghat marble craft artisans',
        specialization_type: 'STONE_CRAFT',
        craft_description:
          'Traditional stone artisans working with locally sourced marble and other stone to create decorative objects, sculptures, household items, and souvenir crafts.',
        district: 'Jabalpur',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.8000, 23.1305],
        },
        is_master_craftsperson: true,
        awards: [],
        tags: [
          'marble',
          'stone_craft',
          'bhedaghat',
          'handicraft',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Artisan.findOneAndUpdate(
      { _id: 'artisan_gond_artists_jabalpur' },
      {
        _id: 'artisan_gond_artists_jabalpur',
        name: 'Gond Folk Artisans of Mahakoshal',
        normalized_name: 'gond folk artisans of mahakoshal',
        specialization_type: 'FOLK_ART',
        craft_description:
          'Gond artists preserving traditional visual storytelling through distinctive patterns, nature-inspired motifs, animals, trees, and oral narratives represented through contemporary folk painting.',
        district: 'Jabalpur',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.9864, 23.1815],
        },
        is_master_craftsperson: true,
        awards: [],
        tags: [
          'gond_art',
          'tribal_art',
          'folk_art',
          'painting',
          'mahakoshal',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_gond_jabalpur' },
      {
        _id: 'community_gond_jabalpur',
        name: 'Gond Communities of Mahakoshal',
        normalized_name: 'gond communities of mahakoshal',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        description:
          'Gond communities of the Mahakoshal region maintain rich traditions of oral storytelling, music, dance, visual art, seasonal rituals, agriculture, and forest-based knowledge.',
        cultural_contribution:
          'Preserved Gond mythology, folk narratives, music, dance, visual art traditions, traditional ecological knowledge, and seasonal community festivals.',
        heritage_crafts_or_foods: [
          'Gond Folk Art',
          'Tribal Music',
          'Folk Dance',
          'Mahua-based Foods',
          'Forest Food Traditions',
        ],
        tags: [
          'gond',
          'tribal',
          'community',
          'folk_art',
          'mahakoshal',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_bhedaghat_boatmen' },
      {
        _id: 'community_bhedaghat_boatmen',
        name: 'Bhedaghat Boatmen Community',
        normalized_name: 'bhedaghat boatmen community',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        description:
          'Local boatmen and river-based families whose livelihoods and cultural knowledge are closely connected with the Narmada and the Marble Rocks at Bhedaghat.',
        cultural_contribution:
          'Preserved traditional river knowledge, boating practices, local stories, landscape interpretation, and visitor traditions associated with the Narmada gorge.',
        heritage_crafts_or_foods: [
          'Traditional Boatmanship',
          'Narmada River Lore',
          'Local Storytelling',
          'River Tourism Traditions',
        ],
        tags: [
          'boatmen',
          'narmada',
          'bhedaghat',
          'community',
          'river_culture',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Events & Stories...');

    await Event.findOneAndUpdate(
      { _id: 'event_narmada_maha_aarti_jabalpur' },
      {
        _id: 'event_narmada_maha_aarti_jabalpur',
        name: 'Narmada Aarti at Gwarighat',
        normalized_name: 'narmada aarti at gwarighat',
        event_type: 'RELIGIOUS_EVENT',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.9208, 23.1317],
        },
        recurrence: 'Daily / Special ceremonies on festivals',
        description:
          'Devotional evening ceremony on the banks of the Narmada at Gwarighat, featuring lamps, prayers, music, and participation by pilgrims and local residents.',
        cultural_significance:
          'Represents the living spiritual relationship between Jabalpur and the Narmada River and forms an important part of the city’s religious culture.',
        tags: [
          'narmada',
          'aarti',
          'gwarighat',
          'religion',
          'river_culture',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_narmada_jayanti_jabalpur' },
      {
        _id: 'event_narmada_jayanti_jabalpur',
        name: 'Narmada Jayanti Celebrations',
        normalized_name: 'narmada jayanti celebrations jabalpur',
        event_type: 'FESTIVAL',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.9208, 23.1317],
        },
        recurrence: 'Annual',
        description:
          'Religious and cultural celebrations along the Narmada featuring decorated ghats, devotional programmes, processions, lamps, and community gatherings.',
        cultural_significance:
          'Celebrates the sacred identity of the Narmada and its central role in the religious and cultural life of Jabalpur and Mahakoshal.',
        tags: [
          'narmada_jayanti',
          'festival',
          'narmada',
          'gwarighat',
          'pilgrimage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_jabalpur_lokrang' },
      {
        _id: 'event_jabalpur_lokrang',
        name: 'Jabalpur Tribal & Folk Cultural Festival',
        normalized_name: 'jabalpur tribal folk cultural festival',
        event_type: 'CULTURAL_FESTIVAL',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [79.9864, 23.1815],
        },
        recurrence: 'Annual / Occasional cultural programming',
        description:
          'Cultural programming showcasing tribal and folk traditions from Madhya Pradesh through music, dance, visual arts, crafts, food, and storytelling.',
        cultural_significance:
          'Provides a platform for the diverse tribal and folk cultures of Mahakoshal and surrounding regions.',
        tags: [
          'tribal',
          'folk',
          'culture',
          'gond',
          'mahakoshal',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_rani_durgavati_jabalpur' },
      {
        _id: 'story_rani_durgavati_jabalpur',
        title: 'Rani Durgavati and the Gond Kingdom',
        normalized_title: 'rani durgavati and the gond kingdom',
        story_type: 'LOCAL_HISTORY',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_madan_mahal_fort',
          name: 'Madan Mahal Fort',
        },
        city_id: 'city_jabalpur_mp',
        narrative:
          'Rani Durgavati is one of the most celebrated historical figures associated with the Gond kingdom of Garha-Katanga. Her reign and resistance against Mughal expansion remain central to the historical identity of the Jabalpur and Mahakoshal region. The surviving forts, monuments, museums, and oral traditions of the area continue to preserve memories of the Gond period.',
        submitted_by: 'system',
        tags: [
          'rani_durgavati',
          'gond',
          'history',
          'jabalpur',
          'mahakoshal',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_marble_rocks_narmada' },
      {
        _id: 'story_marble_rocks_narmada',
        title: 'The Marble Rocks of Bhedaghat',
        normalized_title: 'the marble rocks of bhedaghat',
        story_type: 'NATURAL_HISTORY',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_bhedaghat_marble_rocks',
          name: 'Bhedaghat Marble Rocks',
        },
        city_id: 'city_jabalpur_mp',
        narrative:
          'The Narmada cuts through a dramatic gorge of pale marble at Bhedaghat, creating one of the most recognizable landscapes in central India. The cliffs change character with the light and seasons, while generations of local boatmen have developed stories and traditions around the river, rocks, and surrounding landscape.',
        submitted_by: 'system',
        tags: [
          'bhedaghat',
          'marble_rocks',
          'narmada',
          'nature',
          'boatmen',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_gond_art_mahakoshal' },
      {
        _id: 'story_gond_art_mahakoshal',
        title: 'Gond Art: Stories from the Forest',
        normalized_title: 'gond art stories from the forest',
        story_type: 'CULTURAL_HISTORY',
        associated_entity: {
          entity_type: 'COMMUNITY',
          entity_id: 'community_gond_jabalpur',
          name: 'Gond Communities of Mahakoshal',
        },
        city_id: 'city_jabalpur_mp',
        narrative:
          'Gond visual traditions transform stories about forests, animals, ancestors, plants, seasons, and spiritual life into distinctive patterns and imagery. In the Mahakoshal region, this artistic heritage forms part of a much wider cultural system of oral storytelling, music, ritual, and knowledge of the natural environment.',
        submitted_by: 'system',
        tags: [
          'gond_art',
          'tribal_art',
          'folk_art',
          'forest',
          'mahakoshal',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Trails...');

    await Trail.findOneAndUpdate(
      { _id: 'trail_jabalpur_narmada_heritage' },
      {
        _id: 'trail_jabalpur_narmada_heritage',
        name: 'Jabalpur Narmada & Marble Heritage Trail',
        normalized_name: 'jabalpur narmada & marble heritage trail',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        description:
          'A scenic heritage trail following Jabalpur’s Narmada identity from the Marble Rocks and Dhuandhar Falls to the ancient Chausath Yogini Temple and the sacred riverfront at Gwarighat.',
        theme: 'Narmada River, Marble Landscapes & Sacred Heritage',
        estimated_duration_mins: 240,
        distance_km: 18.0,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_bhedaghat_marble_rocks',
            name: 'Bhedaghat Marble Rocks',
            display_order: 1,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_dhuandhar_falls',
            name: 'Dhuandhar Falls',
            display_order: 2,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_chausath_yogini_temple',
            name: 'Chausath Yogini Temple',
            display_order: 3,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_gwarighat_narmada',
            name: 'Gwarighat',
            display_order: 4,
          },
        ],
        tags: [
          'trail',
          'narmada',
          'bhedaghat',
          'marble_rocks',
          'temples',
          'waterfall',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Trail.findOneAndUpdate(
      { _id: 'trail_jabalpur_gond_heritage' },
      {
        _id: 'trail_jabalpur_gond_heritage',
        name: 'Jabalpur Gond & Royal Heritage Trail',
        normalized_name: 'jabalpur gond & royal heritage trail',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        description:
          'A cultural trail exploring Jabalpur’s Gond history, Rani Durgavati legacy, museums, hilltop forts, and the living artistic traditions of Mahakoshal.',
        theme: 'Gond History, Rani Durgavati & Tribal Culture',
        estimated_duration_mins: 210,
        distance_km: 10.0,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_madan_mahal_fort',
            name: 'Madan Mahal Fort',
            display_order: 1,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_rani_durgavati_museum',
            name: 'Rani Durgavati Museum',
            display_order: 2,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_balancing_rock_jabalpur',
            name: 'Balancing Rock',
            display_order: 3,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_sadar_bazaar_jabalpur',
            name: 'Sadar Bazaar',
            display_order: 4,
          },
        ],
        tags: [
          'trail',
          'gond',
          'rani_durgavati',
          'fort',
          'museum',
          'tribal_culture',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Trail.findOneAndUpdate(
      { _id: 'trail_jabalpur_food_culture' },
      {
        _id: 'trail_jabalpur_food_culture',
        name: 'Jabalpur Food & Local Culture Trail',
        normalized_name: 'jabalpur food & local culture trail',
        city_id: 'city_jabalpur_mp',
        state_id: 'state_mp',
        description:
          'A food-focused trail through Jabalpur’s breakfast culture, traditional markets, Narmada pilgrimage food, and Mahakoshal culinary traditions.',
        theme: 'Mahakoshal Food, Markets & Narmada Culture',
        estimated_duration_mins: 180,
        distance_km: 8.0,
        stops: [
          {
            entity_type: 'FOOD_PLACE',
            entity_id: 'food_place_jabalpur_breakfast_stalls',
            name: 'Jabalpur Breakfast Vendors',
            display_order: 1,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_sadar_bazaar_jabalpur',
            name: 'Sadar Bazaar',
            display_order: 2,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_gwarighat_food_market',
            name: 'Gwarighat Food & Pilgrimage Market',
            display_order: 3,
          },
          {
            entity_type: 'FOOD_PLACE',
            entity_id: 'food_place_gwarighat_prasad_shops',
            name: 'Gwarighat Prasad & Sweet Shops',
            display_order: 4,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_gwarighat_narmada',
            name: 'Gwarighat',
            display_order: 5,
          },
        ],
        tags: [
          'trail',
          'food_trail',
          'street_food',
          'mahakoshal',
          'narmada',
          'markets',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Jabalpur Pilot Data Seeded Successfully!');
  } catch (error) {
    console.error('[Seed] Error seeding Jabalpur data:', error);
  } finally {
    await disconnectDB();
  }
};

seedJabalpur();
