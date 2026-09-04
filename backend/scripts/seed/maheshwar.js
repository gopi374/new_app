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
    'Sourced and verified from Maheshwar Cultural Heritage Dossier',
  sources: [
    'Maheshwar Cultural Heritage Dossier (SIH 2026 / Bhraman Archive)',
  ],
};

const SYSTEM_PUBLICATION = {
  publication_status: 'PUBLISHED',
  published_at: new Date('2026-08-02T00:00:00Z'),
  published_by: 'system',
};

const seedMaheshwar = async () => {
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
          'Heart of India, rich in sacred river traditions, Holkar heritage, historic towns, crafts, and diverse landscapes.',
        location: {
          type: 'Point',
          coordinates: [78.6569, 22.9734],
        },
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding City...');

    await City.findOneAndUpdate(
      { _id: 'city_maheshwar_mp' },
      {
        _id: 'city_maheshwar_mp',
        name: 'Maheshwar',
        normalized_name: 'maheshwar',
        state_id: 'state_mp',
        country_code: 'IN',
        location: {
          type: 'Point',
          coordinates: [75.5833, 22.1833],
        },
        short_description:
          'A historic Narmada riverfront town renowned for Ahilyabai Holkar, Maheshwar Fort, ancient temples, ghats, and its distinctive handwoven Maheshwari sarees.',
        description:
          'Maheshwar is a historic temple town on the banks of the Narmada River in Madhya Pradesh. It was developed as a major cultural and administrative centre under Maharani Ahilyabai Holkar and is celebrated for its riverside fort, temples, ghats, handloom tradition, and spiritual heritage.',
        cultural_summary:
          'Known for Maheshwar Fort, Ahilyabai Holkar, Narmada Ghats, Ahilyeshwar Temple, Rajwada, Rehwa Society, Maheshwari handloom sarees, and the sacred riverfront landscape.',
        highlights: [
          'Maheshwar Fort',
          'Ahilyabai Holkar Rajwada',
          'Ahilyeshwar Temple',
          'Narmada Ghats',
          'Kashi Vishwanath Temple',
          'Rehwa Society',
          'Maheshwari Sarees',
        ],
        is_featured: true,
        tags: [
          'holkar_heritage',
          'narmada',
          'handloom',
          'maheshwari_saree',
          'temple_town',
          'heritage_city',
        ],
        status: 'ACTIVE',
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Places...');

    const placesData = [
      {
        _id: 'place_maheshwar_fort',
        name: 'Maheshwar Fort',
        normalized_name: 'maheshwar fort',
        place_type: 'HERITAGE',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5838, 22.1768],
        },
        address: {
          line1: 'Maheshwar Fort, Narmada Riverfront',
          city_id: 'city_maheshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic hilltop fort overlooking the Narmada, associated with the reign of Maharani Ahilyabai Holkar and the development of Maheshwar as a cultural centre.',
        historical_significance:
          'The fort became the principal residence and administrative centre of Maharani Ahilyabai Holkar, who transformed Maheshwar into an important pilgrimage and cultural town.',
        architectural_style:
          'Maratha Fort Architecture with Rajput and Regional Influences',
        visiting_hours: '06:00 AM - 06:00 PM',
        entry_fee: 'Free; some attractions within the complex may have separate charges',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'fort',
          'ahilyabai_holkar',
          'holkar',
          'narmada',
          'heritage',
          'landmark',
        ],
      },
      {
        _id: 'place_ahilyabai_holkar_rajwada',
        name: 'Ahilyabai Holkar Rajwada',
        normalized_name: 'ahilyabai holkar rajwada maheshwar',
        place_type: 'HERITAGE',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5837, 22.1776],
        },
        address: {
          line1: 'Maheshwar Fort Complex',
          city_id: 'city_maheshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic palace residence of Maharani Ahilyabai Holkar within the Maheshwar Fort complex.',
        historical_significance:
          'The Rajwada was the residence of Ahilyabai Holkar during her rule from Maheshwar and remains one of the most important places associated with her legacy.',
        architectural_style:
          'Maratha Palace Architecture',
        visiting_hours: '07:00 AM - 06:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'rajwada',
          'ahilyabai',
          'holkar',
          'palace',
          'heritage',
        ],
      },
      {
        _id: 'place_ahilyeshwar_temple',
        name: 'Ahilyeshwar Temple',
        normalized_name: 'ahilyeshwar temple maheshwar',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5841, 22.1778],
        },
        address: {
          line1: 'Maheshwar Fort and Ghat Complex',
          city_id: 'city_maheshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Beautiful riverside temple dedicated to Shiva, built as part of the sacred architectural landscape developed under Ahilyabai Holkar.',
        historical_significance:
          'The temple reflects Ahilyabai Holkar’s extensive patronage of temples and pilgrimage infrastructure across central India.',
        architectural_style:
          'Maratha Temple Architecture with Intricate Stone Carving',
        visiting_hours: '06:00 AM - 08:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'shiva',
          'temple',
          'ahilyabai',
          'narmada',
          'architecture',
        ],
      },
      {
        _id: 'place_kashi_vishwanath_temple_maheshwar',
        name: 'Kashi Vishwanath Temple',
        normalized_name: 'kashi vishwanath temple maheshwar',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5848, 22.1771],
        },
        address: {
          line1: 'Maheshwar Fort and Narmada Ghats',
          city_id: 'city_maheshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Riverside Shiva temple associated with the sacred temple complex of Maheshwar and Ahilyabai Holkar’s temple-building legacy.',
        historical_significance:
          'Part of the religious landscape developed and patronized during Ahilyabai Holkar’s reign.',
        architectural_style:
          'Maratha Temple Architecture',
        visiting_hours: '06:00 AM - 08:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
          why_visit:
            'A quieter temple experience within the historic fort and riverfront complex.',
        },
        tags: [
          'shiva',
          'temple',
          'narmada',
          'ahilyabai',
          'heritage',
        ],
      },
      {
        _id: 'place_narmada_ghats_maheshwar',
        name: 'Maheshwar Narmada Ghats',
        normalized_name: 'maheshwar narmada ghats',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5840, 22.1762],
        },
        address: {
          line1: 'Narmada Riverfront, Maheshwar',
          city_id: 'city_maheshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'A spectacular sequence of stone ghats along the Narmada, surrounded by temples, shrines, cenotaphs, and historic architecture.',
        historical_significance:
          'The ghats were extensively developed under Ahilyabai Holkar and became a defining feature of Maheshwar’s sacred riverfront.',
        architectural_style:
          'Maratha Riverfront Architecture',
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
          'riverfront',
          'ahilyabai',
          'temples',
          'aarti',
        ],
      },
      {
        _id: 'place_baneshwar_temple_maheshwar',
        name: 'Baneshwar Temple',
        normalized_name: 'baneshwar temple maheshwar',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5850, 22.1759],
        },
        address: {
          line1: 'Narmada Riverfront, Maheshwar',
          city_id: 'city_maheshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Small riverside Shiva shrine forming part of Maheshwar’s dense network of sacred temples and riverfront monuments.',
        historical_significance:
          'The shrine contributes to the living Shaiva traditions of the Maheshwar Narmada riverfront.',
        architectural_style:
          'Traditional Central Indian Temple Architecture',
        visiting_hours: '06:00 AM - 07:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LOCAL_SECRET',
        },
        tags: [
          'shiva',
          'temple',
          'narmada',
          'hidden_gem',
          'riverfront',
        ],
      },
      {
        _id: 'place_rehwa_society',
        name: 'Rehwa Society',
        normalized_name: 'rehwa society maheshwar',
        place_type: 'CULTURAL_SITE',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5832, 22.1791],
        },
        address: {
          line1: 'Maheshwar Fort Complex',
          city_id: 'city_maheshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Handloom organization preserving and promoting Maheshwari weaving traditions through traditional looms and artisan livelihoods.',
        historical_significance:
          'Rehwa has played an important role in sustaining the Maheshwari handloom tradition and creating opportunities for local weavers.',
        architectural_style:
          'Historic Fort-Complex Workshop',
        visiting_hours: '10:00 AM - 05:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'handloom',
          'maheshwari_saree',
          'weaving',
          'craft',
          'artisan',
        ],
      },
      {
        _id: 'place_maheshwar_cenotaphs',
        name: 'Maheshwar Holkar Cenotaphs',
        normalized_name: 'maheshwar holkar cenotaphs',
        place_type: 'HERITAGE',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5851, 22.1764],
        },
        address: {
          line1: 'Narmada Riverfront, Maheshwar',
          city_id: 'city_maheshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic memorial structures and royal monuments along the Narmada associated with the Holkar dynasty.',
        historical_significance:
          'The cenotaphs preserve the memory of the Holkar rulers and form an important part of Maheshwar’s riverside heritage landscape.',
        architectural_style:
          'Maratha Memorial Architecture',
        visiting_hours: '06:00 AM - 06:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
        },
        tags: [
          'cenotaph',
          'holkar',
          'heritage',
          'narmada',
          'architecture',
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
        _id: 'market_maheshwar_main_bazaar',
        name: 'Maheshwar Main Bazaar',
        normalized_name: 'maheshwar main bazaar',
        market_type: 'LOCAL_MARKET',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5828, 22.1800],
        },
        address: {
          line1: 'Main Bazaar, Maheshwar',
          city_id: 'city_maheshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Traditional town market selling daily necessities, religious goods, sweets, snacks, textiles, and local souvenirs.',
        operating_hours: '09:00 AM - 09:00 PM',
        best_known_for: [
          'Maheshwari Sarees',
          'Puja Items',
          'Local Sweets',
          'Handicrafts',
          'Narmada Souvenirs',
        ],
        tags: [
          'bazaar',
          'local_market',
          'textiles',
          'shopping',
        ],
      },
      {
        _id: 'market_maheshwari_handloom_market',
        name: 'Maheshwari Handloom Market',
        normalized_name: 'maheshwari handloom market',
        market_type: 'CRAFT_MARKET',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5830, 22.1790],
        },
        address: {
          line1: 'Fort and Handloom Area, Maheshwar',
          city_id: 'city_maheshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Cluster of handloom shops and artisan outlets showcasing Maheshwari sarees, dupattas, stoles, and handwoven textiles.',
        operating_hours: '10:00 AM - 08:00 PM',
        best_known_for: [
          'Maheshwari Sarees',
          'Handwoven Cotton',
          'Silk Sarees',
          'Dupattas',
          'Stoles',
        ],
        tags: [
          'handloom',
          'maheshwari_saree',
          'weaving',
          'craft_market',
        ],
      },
      {
        _id: 'market_maheshwar_ghat_market',
        name: 'Maheshwar Ghat Bazaar',
        normalized_name: 'maheshwar ghat bazaar',
        market_type: 'PILGRIMAGE_MARKET',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5840, 22.1763],
        },
        address: {
          line1: 'Narmada Ghat Area, Maheshwar',
          city_id: 'city_maheshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Small riverfront shopping area serving pilgrims and visitors with puja materials, flowers, religious objects, snacks, and souvenirs.',
        operating_hours: '06:00 AM - 09:00 PM',
        best_known_for: [
          'Puja Items',
          'Flowers',
          'Diyas',
          'Religious Souvenirs',
          'Local Snacks',
        ],
        tags: [
          'ghat',
          'narmada',
          'pilgrimage',
          'market',
          'souvenirs',
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
        _id: 'food_maheshwar_poha',
        name: 'Maheshwari Poha',
        normalized_name: 'maheshwari poha',
        food_category: 'STREET_FOOD',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        description:
          'Light flattened rice breakfast prepared with onions, mustard seeds, turmeric, coriander, lemon, and regional spices, commonly served with sev.',
        cultural_origin: 'Nimar / Western Madhya Pradesh',
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
          'nimar',
          'street_food',
        ],
      },
      {
        _id: 'food_maheshwar_dal_bafla',
        name: 'Dal Bafla',
        normalized_name: 'dal bafla maheshwar',
        food_category: 'REGIONAL_MAIN',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        description:
          'Traditional Malwa preparation of baked wheat dumplings served with dal, ghee, chutneys, and vegetable accompaniments.',
        cultural_origin: 'Malwa Region',
        key_ingredients: [
          'Wheat Flour',
          'Toor Dal',
          'Ghee',
          'Spices',
          'Chutney',
        ],
        tags: [
          'malwa',
          'dal_bafla',
          'regional_food',
          'traditional',
        ],
      },
      {
        _id: 'food_maheshwar_kachori',
        name: 'Maheshwari Kachori',
        normalized_name: 'maheshwari kachori',
        food_category: 'SNACK',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        description:
          'Crisp deep-fried pastry filled with spiced lentils or regional savory fillings and served with chutneys.',
        cultural_origin: 'Malwa / Nimar Region',
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
        _id: 'food_maheshwar_jalebi',
        name: 'Jalebi',
        normalized_name: 'jalebi maheshwar',
        food_category: 'SWEET',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        description:
          'Crisp spiral sweet soaked in sugar syrup, commonly enjoyed as a breakfast accompaniment or evening snack.',
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
          'local_food',
        ],
      },
      {
        _id: 'food_maheshwar_lassi',
        name: 'Nimar Lassi',
        normalized_name: 'nimar lassi maheshwar',
        food_category: 'BEVERAGE',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        description:
          'Cooling yogurt-based drink popular across the warm Nimar region and commonly served to visitors and pilgrims.',
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
        _id: 'food_place_maheshwar_main_bazaar',
        name: 'Maheshwar Main Bazaar Food Stalls',
        normalized_name: 'maheshwar main bazaar food stalls',
        food_place_type: 'STALL',
        associated_food_ids: [
          'food_maheshwar_poha',
          'food_maheshwar_kachori',
          'food_maheshwar_jalebi',
        ],
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5828, 22.1800],
        },
        address: {
          line1: 'Main Bazaar, Maheshwar',
          city_id: 'city_maheshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Local breakfast and snack vendors serving poha, kachori, jalebi, tea, and other everyday foods.',
        operating_hours: '07:00 AM - 10:00 PM',
        price_range: '₹30 - ₹200',
        is_heritage_vendor: true,
        est_year: 1980,
        tags: [
          'bazaar',
          'street_food',
          'breakfast',
          'local_food',
        ],
      },
      {
        _id: 'food_place_maheshwar_ghat_food_stalls',
        name: 'Maheshwar Ghat Food Stalls',
        normalized_name: 'maheshwar ghat food stalls',
        food_place_type: 'STALL',
        associated_food_ids: [
          'food_maheshwar_poha',
          'food_maheshwar_jalebi',
          'food_maheshwar_lassi',
        ],
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5840, 22.1763],
        },
        address: {
          line1: 'Narmada Ghat Area, Maheshwar',
          city_id: 'city_maheshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Small food vendors along the historic riverfront serving tea, lassi, sweets, breakfast foods, and quick vegetarian snacks.',
        operating_hours: '06:00 AM - 09:00 PM',
        price_range: '₹30 - ₹150',
        is_heritage_vendor: true,
        est_year: 1975,
        tags: [
          'narmada',
          'ghat',
          'street_food',
          'vegetarian',
        ],
      },
      {
        _id: 'food_place_maheshwar_dal_bafla_house',
        name: 'Maheshwar Dal Bafla Houses',
        normalized_name: 'maheshwar dal bafla houses',
        food_place_type: 'RESTAURANT',
        associated_food_ids: [
          'food_maheshwar_dal_bafla',
          'food_maheshwar_poha',
        ],
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5829, 22.1795],
        },
        address: {
          line1: 'Town Market Area, Maheshwar',
          city_id: 'city_maheshwar_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Traditional vegetarian eateries serving Malwa-style dal bafla and other regional dishes.',
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
      { _id: 'artisan_maheshwari_weavers' },
      {
        _id: 'artisan_maheshwari_weavers',
        name: 'Maheshwari Handloom Weavers',
        normalized_name: 'maheshwari handloom weavers',
        specialization_type: 'TEXTILE',
        craft_description:
          'Traditional handloom weavers producing lightweight Maheshwari sarees and textiles using distinctive cotton and silk combinations, fine borders, stripes, checks, and traditional motifs.',
        district: 'Khargone',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5833, 22.1833],
        },
        is_master_craftsperson: true,
        awards: [],
        tags: [
          'maheshwari_saree',
          'handloom',
          'textile',
          'weaving',
          'craft',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Artisan.findOneAndUpdate(
      { _id: 'artisan_maheshwar_wood_stone_crafts' },
      {
        _id: 'artisan_maheshwar_wood_stone_crafts',
        name: 'Maheshwar Wood & Stone Craft Artisans',
        normalized_name: 'maheshwar wood stone craft artisans',
        specialization_type: 'CRAFT',
        craft_description:
          'Local craftspeople producing carved wooden objects, religious souvenirs, decorative items, and stone-based craft associated with the temple town.',
        district: 'Khargone',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5830, 22.1800],
        },
        is_master_craftsperson: false,
        awards: [],
        tags: [
          'wood_craft',
          'stone_craft',
          'religious_craft',
          'handicraft',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_maheshwari_weavers' },
      {
        _id: 'community_maheshwari_weavers',
        name: 'Maheshwari Weaving Community',
        normalized_name: 'maheshwari weaving community',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        description:
          'Generations of local weavers whose livelihoods and cultural identity are connected with the Maheshwari handloom tradition.',
        cultural_contribution:
          'Preserved the distinctive Maheshwari saree weaving tradition, including lightweight cotton-silk fabrics, traditional borders, motifs, and handloom techniques.',
        heritage_crafts_or_foods: [
          'Maheshwari Saree',
          'Handloom Weaving',
          'Cotton-Silk Textiles',
          'Traditional Borders',
        ],
        tags: [
          'community',
          'weavers',
          'handloom',
          'maheshwari_saree',
          'textile',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_maheshwar_narmada_boatmen' },
      {
        _id: 'community_maheshwar_narmada_boatmen',
        name: 'Maheshwar Narmada Boatmen',
        normalized_name: 'maheshwar narmada boatmen',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        description:
          'River-connected families and boatmen who maintain traditional knowledge of the Narmada riverfront and provide local boating experiences.',
        cultural_contribution:
          'Preserved local river knowledge, boat traditions, stories of the Narmada, and the cultural connection between the town and its sacred riverfront.',
        heritage_crafts_or_foods: [
          'Traditional Boatmanship',
          'Narmada River Lore',
          'Riverfront Traditions',
          'Pilgrimage Boat Routes',
        ],
        tags: [
          'boatmen',
          'narmada',
          'river_culture',
          'community',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Events & Stories...');

    await Event.findOneAndUpdate(
      { _id: 'event_ahilyabai_holkar_smriti_maheshwar' },
      {
        _id: 'event_ahilyabai_holkar_smriti_maheshwar',
        name: 'Ahilyabai Holkar Smriti Celebrations',
        normalized_name: 'ahilyabai holkar smriti celebrations maheshwar',
        event_type: 'CULTURAL_EVENT',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5838, 22.1768],
        },
        recurrence: 'Annual / Date varies',
        description:
          'Cultural and commemorative programmes celebrating the life, administration, philanthropy, and temple-building legacy of Maharani Ahilyabai Holkar.',
        cultural_significance:
          'Honours one of the most influential historical figures associated with Maheshwar and its transformation into a major cultural and religious centre.',
        tags: [
          'ahilyabai_holkar',
          'heritage',
          'culture',
          'holkar',
          'maheshwar',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_narmada_jayanti_maheshwar' },
      {
        _id: 'event_narmada_jayanti_maheshwar',
        name: 'Narmada Jayanti at Maheshwar',
        normalized_name: 'narmada jayanti at maheshwar',
        event_type: 'FESTIVAL',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5840, 22.1762],
        },
        recurrence: 'Annual',
        description:
          'Devotional celebrations along the Maheshwar riverfront featuring prayers, lamps, rituals, cultural programmes, and gatherings at the Narmada ghats.',
        cultural_significance:
          'Celebrates the sacred Narmada and its central role in the spiritual and cultural identity of Maheshwar.',
        tags: [
          'narmada_jayanti',
          'narmada',
          'festival',
          'ghat',
          'river_culture',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_maheshwar_shivratri' },
      {
        _id: 'event_maheshwar_shivratri',
        name: 'Mahashivratri at Maheshwar',
        normalized_name: 'mahashivratri at maheshwar',
        event_type: 'FESTIVAL',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.5841, 22.1778],
        },
        recurrence: 'Annual',
        description:
          'A major Shiva festival observed across Maheshwar’s historic temples and Narmada ghats with worship, devotional gatherings, night vigils, and ritual activities.',
        cultural_significance:
          'Reflects Maheshwar’s continuing identity as a sacred Shiva and Narmada riverfront town.',
        tags: [
          'mahashivratri',
          'shiva',
          'festival',
          'temple',
          'narmada',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_ahilyabai_maheshwar' },
      {
        _id: 'story_ahilyabai_maheshwar',
        title: 'Ahilyabai Holkar and the Making of Maheshwar',
        normalized_title: 'ahilyabai holkar and the making of maheshwar',
        story_type: 'LOCAL_HISTORY',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_ahilyabai_holkar_rajwada',
          name: 'Ahilyabai Holkar Rajwada',
        },
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        narrative:
          'Maharani Ahilyabai Holkar made Maheshwar her capital and helped transform the Narmada-side settlement into an important centre of administration, pilgrimage, temple building, and culture. Her legacy can still be seen in the fort, Rajwada, temples, ghats, and religious institutions of the town.',
        submitted_by: 'system',
        tags: [
          'ahilyabai',
          'holkar',
          'maheshwar',
          'history',
          'heritage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_maheshwari_saree_legacy' },
      {
        _id: 'story_maheshwari_saree_legacy',
        title: 'The Story of the Maheshwari Saree',
        normalized_title: 'the story of the maheshwari saree',
        story_type: 'CRAFT_HISTORY',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_rehwa_society',
          name: 'Rehwa Society',
        },
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        narrative:
          'Maheshwar’s handloom tradition is closely associated with the patronage of Ahilyabai Holkar. Over generations, local weavers developed the distinctive Maheshwari textile tradition, known for lightweight fabrics, cotton and silk combinations, elegant borders, stripes, checks, and traditional motifs inspired by the town and its temples.',
        submitted_by: 'system',
        tags: [
          'maheshwari_saree',
          'handloom',
          'weavers',
          'ahilyabai',
          'craft',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_maheshwar_narmada_ghats' },
      {
        _id: 'story_maheshwar_narmada_ghats',
        title: 'The Stone Ghats of Maheshwar',
        normalized_title: 'the stone ghats of maheshwar',
        story_type: 'CULTURAL_HISTORY',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_narmada_ghats_maheshwar',
          name: 'Maheshwar Narmada Ghats',
        },
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        narrative:
          'The Narmada ghats are among Maheshwar’s most recognizable cultural landscapes. Built and expanded during the Holkar period, the stepped riverfront brings together temples, shrines, memorials, boats, rituals, and everyday community life around the sacred Narmada.',
        submitted_by: 'system',
        tags: [
          'narmada',
          'ghats',
          'ahilyabai',
          'riverfront',
          'heritage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Trails...');

    await Trail.findOneAndUpdate(
      { _id: 'trail_maheshwar_heritage' },
      {
        _id: 'trail_maheshwar_heritage',
        name: 'Maheshwar Fort & Narmada Heritage Trail',
        normalized_name: 'maheshwar fort & narmada heritage trail',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        description:
          'A heritage walking trail through the historic fort, Ahilyabai Holkar’s Rajwada, riverside temples, cenotaphs, and the spectacular Narmada ghats.',
        theme: 'Ahilyabai Holkar, Fort Heritage & Narmada Riverfront',
        estimated_duration_mins: 180,
        distance_km: 3.5,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_maheshwar_fort',
            name: 'Maheshwar Fort',
            display_order: 1,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_ahilyabai_holkar_rajwada',
            name: 'Ahilyabai Holkar Rajwada',
            display_order: 2,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_ahilyeshwar_temple',
            name: 'Ahilyeshwar Temple',
            display_order: 3,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_kashi_vishwanath_temple_maheshwar',
            name: 'Kashi Vishwanath Temple',
            display_order: 4,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_maheshwar_cenotaphs',
            name: 'Maheshwar Holkar Cenotaphs',
            display_order: 5,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_narmada_ghats_maheshwar',
            name: 'Maheshwar Narmada Ghats',
            display_order: 6,
          },
        ],
        tags: [
          'trail',
          'heritage',
          'holkar',
          'ahilyabai',
          'narmada',
          'temples',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Trail.findOneAndUpdate(
      { _id: 'trail_maheshwar_handloom' },
      {
        _id: 'trail_maheshwar_handloom',
        name: 'Maheshwar Handloom & Craft Trail',
        normalized_name: 'maheshwar handloom & craft trail',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        description:
          'A craft-focused trail exploring Maheshwar’s handloom tradition, artisan workshops, textile markets, and the historical connection between weaving and Ahilyabai Holkar’s Maheshwar.',
        theme: 'Maheshwari Saree, Handloom & Living Craft',
        estimated_duration_mins: 150,
        distance_km: 3.0,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_rehwa_society',
            name: 'Rehwa Society',
            display_order: 1,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_maheshwari_handloom_market',
            name: 'Maheshwari Handloom Market',
            display_order: 2,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_maheshwar_fort',
            name: 'Maheshwar Fort',
            display_order: 3,
          },
        ],
        tags: [
          'trail',
          'handloom',
          'maheshwari_saree',
          'craft',
          'weaving',
          'artisan',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Trail.findOneAndUpdate(
      { _id: 'trail_maheshwar_food_narmada' },
      {
        _id: 'trail_maheshwar_food_narmada',
        name: 'Maheshwar Narmada & Local Food Trail',
        normalized_name: 'maheshwar narmada & local food trail',
        city_id: 'city_maheshwar_mp',
        state_id: 'state_mp',
        description:
          'An evening food and riverfront experience combining Maheshwar’s historic ghats, local bazaar, traditional snacks, sweets, and regional Malwa cuisine.',
        theme: 'Narmada Riverfront, Bazaar Food & Malwa Cuisine',
        estimated_duration_mins: 150,
        distance_km: 3.5,
        stops: [
          {
            entity_type: 'MARKET',
            entity_id: 'market_maheshwar_main_bazaar',
            name: 'Maheshwar Main Bazaar',
            display_order: 1,
          },
          {
            entity_type: 'FOOD_PLACE',
            entity_id: 'food_place_maheshwar_main_bazaar',
            name: 'Maheshwar Main Bazaar Food Stalls',
            display_order: 2,
          },
          {
            entity_type: 'FOOD_PLACE',
            entity_id: 'food_place_maheshwar_dal_bafla_house',
            name: 'Maheshwar Dal Bafla Houses',
            display_order: 3,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_maheshwar_ghat_market',
            name: 'Maheshwar Ghat Bazaar',
            display_order: 4,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_narmada_ghats_maheshwar',
            name: 'Maheshwar Narmada Ghats',
            display_order: 5,
          },
        ],
        tags: [
          'trail',
          'food_trail',
          'narmada',
          'street_food',
          'malwa_food',
          'bazaar',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Maheshwar Pilot Data Seeded Successfully!');
  } catch (error) {
    console.error('[Seed] Error seeding Maheshwar data:', error);
  } finally {
    await disconnectDB();
  }
};

seedMaheshwar();
