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
  verification_notes: 'Sourced and verified from Dewas Cultural Heritage Dossier',
  sources: ['Dewas Cultural Heritage Dossier (SIH 2026 / Bhraman Archive)'],
};

const SYSTEM_PUBLICATION = {
  publication_status: 'PUBLISHED',
  published_at: new Date('2026-08-02T00:00:00Z'),
  published_by: 'system',
};

const seedDewas = async () => {
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
          'Heart of India, known for Malwa heritage, historic kingdoms, temples, forts, forests, and diverse Central Indian traditions.',
        location: {
          type: 'Point',
          coordinates: [78.6569, 22.9734],
        },
      },
      { upsert: true, new: true }
    );

    await City.findOneAndUpdate(
      { _id: 'city_dewas_mp' },
      {
        _id: 'city_dewas_mp',
        name: 'Dewas',
        normalized_name: 'dewas',
        state_id: 'state_mp',
        country_code: 'IN',
        location: {
          type: 'Point',
          coordinates: [76.0508, 22.9676],
        },
        short_description:
          'A historic Malwa city crowned by the Chamunda and Tulja Bhawani shrines on Dewas Tekri.',
        description:
          'Dewas is a historic city in the Malwa region of Madhya Pradesh, known for the sacred Dewas Tekri, the Chamunda Mata and Tulja Bhawani temples, Maratha-era heritage, the Holkar and Pawar princely traditions, local bazaars, and its connection to Malwa culture.',
        cultural_summary:
          'Known for Dewas Tekri, Chamunda Mata Temple, Tulja Bhawani Temple, Pateshwar Mahadev, Pawar heritage, Malwa food traditions, local handicrafts, and devotional festivals.',
        highlights: [
          'Dewas Tekri',
          'Chamunda Mata Temple',
          'Tulja Bhawani Temple',
          'Pateshwar Mahadev',
          'Maa Chamunda Ropeway',
          'Dewas Old Bazaar',
        ],
        is_featured: true,
        tags: [
          'malwa_region',
          'temple_city',
          'dewas_tekri',
          'pawar_heritage',
          'spiritual_city',
        ],
        status: 'ACTIVE',
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Places...');

    const placesData = [
      {
        _id: 'place_dewas_tekri',
        name: 'Dewas Tekri',
        normalized_name: 'dewas tekri',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0503, 22.9662],
        },
        address: {
          line1: 'Dewas Tekri, Dewas',
          city_id: 'city_dewas_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Sacred hill overlooking Dewas and home to the revered shrines of Chamunda Mata and Tulja Bhawani.',
        historical_significance:
          'The hill has been a major center of Shakti worship in the region and is closely connected with the history of the Dewas princely states.',
        architectural_style:
          'Traditional Hill Temple Architecture',
        visiting_hours: '05:00 AM - 09:00 PM',
        entry_fee: 'Free',
        best_time_to_visit:
          'October to March; Navratri for major religious celebrations',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'tekri',
          'shakti',
          'temple',
          'pilgrimage',
          'dewas',
        ],
      },
      {
        _id: 'place_chamunda_mata_temple_dewas',
        name: 'Chamunda Mata Temple',
        normalized_name: 'chamunda mata temple dewas',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0499, 22.9657],
        },
        address: {
          line1: 'Dewas Tekri',
          city_id: 'city_dewas_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic shrine of Goddess Chamunda situated on Dewas Tekri and regarded as one of the city’s most important pilgrimage sites.',
        historical_significance:
          'The shrine is deeply associated with Dewas’s Shakti tradition and the religious history of the city.',
        architectural_style:
          'Traditional Hindu Temple Architecture',
        visiting_hours: '05:00 AM - 09:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'Navratri and October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'chamunda',
          'shakti',
          'temple',
          'navratri',
          'pilgrimage',
        ],
      },
      {
        _id: 'place_tulja_bhawani_temple_dewas',
        name: 'Tulja Bhawani Temple',
        normalized_name: 'tulja bhawani temple dewas',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0507, 22.9652],
        },
        address: {
          line1: 'Dewas Tekri',
          city_id: 'city_dewas_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Sacred shrine dedicated to Goddess Tulja Bhawani, situated alongside the Chamunda shrine on Dewas Tekri.',
        historical_significance:
          'The temple is associated with the Maratha and Pawar traditions that shaped the historical and religious identity of Dewas.',
        architectural_style:
          'Traditional Maratha-influenced Temple Architecture',
        visiting_hours: '05:00 AM - 09:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'Navratri and major Hindu festivals',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'tulja_bhawani',
          'shakti',
          'temple',
          'maratha',
          'pilgrimage',
        ],
      },
      {
        _id: 'place_pateshwar_mahadev',
        name: 'Pateshwar Mahadev Temple',
        normalized_name: 'pateshwar mahadev temple',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0439, 22.9762],
        },
        address: {
          line1: 'Pateshwar Road, Dewas',
          city_id: 'city_dewas_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Local Shiva temple and devotional site surrounded by the natural landscape of Dewas and the Malwa plateau.',
        historical_significance:
          'A longstanding local center of Shaivite worship and a popular religious destination for residents of Dewas.',
        architectural_style:
          'Traditional Hindu Temple Architecture',
        visiting_hours: '06:00 AM - 08:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'Early morning and Mahashivratri',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
        },
        tags: [
          'shiva',
          'mahadev',
          'temple',
          'local_pilgrimage',
        ],
      },
      {
        _id: 'place_dewas_pawar_palace',
        name: 'Dewas Pawar Heritage Palace',
        normalized_name: 'dewas pawar heritage palace',
        place_type: 'HERITAGE',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0541, 22.9679],
        },
        address: {
          line1: 'Old Dewas',
          city_id: 'city_dewas_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic palace heritage associated with the Pawar rulers and the former princely state of Dewas.',
        historical_significance:
          'Reflects the political history of the Dewas princely states and the influence of Maratha-era Pawar rulers in Malwa.',
        architectural_style:
          'Maratha and Indo-European Palace Architecture',
        visiting_hours: 'Access may vary',
        entry_fee: 'Subject to access',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LOCAL_SECRET',
        },
        tags: [
          'pawar',
          'palace',
          'maratha',
          'princely_state',
          'heritage',
        ],
      },
      {
        _id: 'place_meetha_talab_dewas',
        name: 'Meetha Talab',
        normalized_name: 'meetha talab dewas',
        place_type: 'NATURAL_SITE',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0592, 22.9568],
        },
        address: {
          line1: 'Dewas',
          city_id: 'city_dewas_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Local water body and recreational landscape associated with the urban heritage and everyday life of Dewas.',
        historical_significance:
          'Part of the historic water landscape that supported settlements across the Malwa region.',
        architectural_style: 'Historic Water Landscape',
        visiting_hours: 'Open throughout the day',
        entry_fee: 'Free',
        best_time_to_visit: 'Early morning and evening',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
        },
        tags: [
          'lake',
          'water_body',
          'nature',
          'local_life',
          'dewas',
        ],
      },
      {
        _id: 'place_bhagwan_birsa_munda_park_dewas',
        name: 'Dewas Regional Nature Park',
        normalized_name: 'dewas regional nature park',
        place_type: 'NATURAL_SITE',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0275, 22.9788],
        },
        address: {
          line1: 'Dewas',
          city_id: 'city_dewas_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Green landscape around the Dewas hills offering opportunities for local recreation, nature walks, and views of the Malwa plateau.',
        historical_significance:
          'Represents the natural landscape surrounding the historic city and its hilltop religious heritage.',
        architectural_style: 'Landscape Architecture',
        visiting_hours: '06:00 AM - 07:00 PM',
        entry_fee: 'Free / activity dependent',
        best_time_to_visit: 'Monsoon and winter months',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LOCAL_SECRET',
        },
        tags: [
          'nature',
          'hills',
          'walking',
          'malwa',
          'local',
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
        _id: 'market_dewas_old_bazaar',
        name: 'Dewas Old Bazaar',
        normalized_name: 'dewas old bazaar',
        market_type: 'TRADITIONAL_MARKET',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0526, 22.9685],
        },
        address: {
          line1: 'Old Bazaar, Dewas',
          city_id: 'city_dewas_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Traditional market near the historic city center offering clothing, puja items, household goods, sweets, snacks, and everyday merchandise.',
        operating_hours: '09:00 AM - 09:00 PM',
        best_known_for: [
          'Puja Items',
          'Namkeen',
          'Sweets',
          'Traditional Clothing',
          'Local Snacks',
        ],
        tags: [
          'old_bazaar',
          'traditional_market',
          'shopping',
          'temple_market',
        ],
      },
      {
        _id: 'market_dewas_tekri_bazaar',
        name: 'Dewas Tekri Bazaar',
        normalized_name: 'dewas tekri bazaar',
        market_type: 'TEMPLE_MARKET',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0501, 22.9654],
        },
        address: {
          line1: 'Dewas Tekri',
          city_id: 'city_dewas_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Pilgrimage-oriented market around Dewas Tekri selling religious offerings, flowers, devotional items, snacks, and souvenirs.',
        operating_hours: '05:00 AM - 09:00 PM',
        best_known_for: [
          'Flowers',
          'Puja Items',
          'Prasad',
          'Religious Souvenirs',
          'Local Snacks',
        ],
        tags: [
          'temple_market',
          'pilgrimage',
          'puja',
          'prasad',
          'dewas_tekri',
        ],
      },
      {
        _id: 'market_gomti_nagar_dewas',
        name: 'Gomti Nagar Market',
        normalized_name: 'gomti nagar market dewas',
        market_type: 'FOOD_MARKET',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0642, 22.9634],
        },
        address: {
          line1: 'Gomti Nagar, Dewas',
          city_id: 'city_dewas_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Modern neighborhood shopping and food area with local eateries, snack stalls, sweets, and everyday shopping.',
        operating_hours: '09:00 AM - 10:00 PM',
        best_known_for: [
          'Poha',
          'Kachori',
          'Samosa',
          'Jalebi',
          'Namkeen',
        ],
        tags: [
          'food_market',
          'street_food',
          'shopping',
          'local_food',
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
        _id: 'food_dewas_poha',
        name: 'Dewas Poha',
        normalized_name: 'dewas poha',
        food_category: 'STREET_FOOD',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        description:
          'Light flattened rice breakfast prepared with onions, spices, coriander, lemon, and sev, reflecting the popular Malwa breakfast tradition.',
        cultural_origin: 'Malwa Region',
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
          'poha',
          'malwa',
          'street_food',
        ],
      },
      {
        _id: 'food_dewas_dal_bafla',
        name: 'Malwa Dal Bafla',
        normalized_name: 'malwa dal bafla dewas',
        food_category: 'TRADITIONAL_FOOD',
        city_id: 'city_dewas_mp',
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
          'malwa',
          'traditional_food',
          'dal_bafla',
          'local_specialty',
        ],
      },
      {
        _id: 'food_dewas_kachori',
        name: 'Dewas Kachori',
        normalized_name: 'dewas kachori',
        food_category: 'SNACK',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        description:
          'Crisp deep-fried pastry filled with a savory spiced mixture and commonly served with chutneys as a popular Malwa snack.',
        cultural_origin: 'Malwa / Central India',
        key_ingredients: [
          'Refined Flour',
          'Moong Dal',
          'Cumin',
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
        _id: 'food_dewas_sev',
        name: 'Dewas Sev',
        normalized_name: 'dewas sev',
        food_category: 'SNACK',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        description:
          'Fine, crisp gram-flour noodles seasoned with spices and enjoyed as a snack or topping across Malwa cuisine.',
        cultural_origin: 'Malwa Region',
        key_ingredients: [
          'Gram Flour',
          'Black Pepper',
          'Turmeric',
          'Spices',
          'Oil',
        ],
        tags: [
          'sev',
          'namkeen',
          'snack',
          'malwa',
        ],
      },
      {
        _id: 'food_dewas_jalebi',
        name: 'Dewas Jalebi',
        normalized_name: 'dewas jalebi',
        food_category: 'SWEET',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        description:
          'Crisp fermented batter spirals soaked in sugar syrup and commonly paired with breakfast snacks such as poha.',
        cultural_origin: 'Malwa Region',
        key_ingredients: [
          'Refined Flour',
          'Sugar',
          'Ghee',
          'Cardamom',
        ],
        tags: [
          'jalebi',
          'sweet',
          'breakfast',
          'malwa',
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
        _id: 'food_place_dewas_tekri_vendors',
        name: 'Dewas Tekri Food Vendors',
        normalized_name: 'dewas tekri food vendors',
        food_place_type: 'STALL',
        associated_food_ids: [
          'food_dewas_poha',
          'food_dewas_kachori',
          'food_dewas_jalebi',
        ],
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0502, 22.9655],
        },
        address: {
          line1: 'Dewas Tekri',
          city_id: 'city_dewas_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Small local food stalls serving pilgrims and visitors around Dewas Tekri with breakfast, snacks, sweets, tea, and refreshments.',
        operating_hours: '06:00 AM - 09:00 PM',
        price_range: '₹30 - ₹150',
        is_heritage_vendor: true,
        est_year: 1980,
        tags: [
          'tekri',
          'street_food',
          'pilgrimage',
          'heritage_vendor',
        ],
      },
      {
        _id: 'food_place_dewas_malwa_eateries',
        name: 'Dewas Malwa Food Eateries',
        normalized_name: 'dewas malwa food eateries',
        food_place_type: 'RESTAURANT',
        associated_food_ids: [
          'food_dewas_dal_bafla',
          'food_dewas_poha',
          'food_dewas_kachori',
        ],
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0544, 22.9674],
        },
        address: {
          line1: 'Dewas City Center',
          city_id: 'city_dewas_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Local vegetarian eateries serving traditional Malwa meals, breakfast dishes, snacks, and seasonal specialties.',
        operating_hours: '08:00 AM - 10:00 PM',
        price_range: '₹100 - ₹350',
        is_heritage_vendor: false,
        est_year: 1990,
        tags: [
          'malwa_food',
          'vegetarian',
          'local_eatery',
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
      { _id: 'artisan_dewas_handloom_artisans' },
      {
        _id: 'artisan_dewas_handloom_artisans',
        name: 'Dewas Handloom Artisans',
        normalized_name: 'dewas handloom artisans',
        specialization_type: 'TEXTILE',
        craft_description:
          'Local textile artisans producing handloom fabrics, traditional garments, decorative textiles, and regionally inspired woven products.',
        district: 'Dewas',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0508, 22.9676],
        },
        is_master_craftsperson: false,
        awards: [],
        tags: [
          'handloom',
          'textile',
          'weaving',
          'malwa',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Artisan.findOneAndUpdate(
      { _id: 'artisan_dewas_wood_metal_crafts' },
      {
        _id: 'artisan_dewas_wood_metal_crafts',
        name: 'Dewas Wood and Metal Craft Artisans',
        normalized_name: 'dewas wood and metal craft artisans',
        specialization_type: 'WOOD_AND_METAL',
        craft_description:
          'Traditional craftspeople producing decorative, household, and religious objects using locally available wood and metalworking techniques.',
        district: 'Dewas',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0530, 22.9680],
        },
        is_master_craftsperson: false,
        awards: [],
        tags: [
          'woodcraft',
          'metalcraft',
          'handicraft',
          'religious_crafts',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_dewas_pawar_heritage' },
      {
        _id: 'community_dewas_pawar_heritage',
        name: 'Dewas Pawar Heritage Community',
        normalized_name: 'dewas pawar heritage community',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        description:
          'Local cultural custodians connected with the history, architecture, religious traditions, and social heritage of the Pawar princely states of Dewas.',
        cultural_contribution:
          'Preserved memories of the Dewas princely-state period, Maratha traditions, royal patronage, temple institutions, and local cultural practices.',
        heritage_crafts_or_foods: [
          'Maratha Heritage',
          'Temple Traditions',
          'Traditional Textiles',
          'Malwa Cuisine',
        ],
        tags: [
          'community',
          'pawar',
          'maratha',
          'heritage',
          'dewas',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_dewas_temple_tradition' },
      {
        _id: 'community_dewas_temple_tradition',
        name: 'Dewas Temple and Pilgrimage Community',
        normalized_name: 'dewas temple and pilgrimage community',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        description:
          'Priests, temple workers, devotional groups, vendors, and local families who maintain the religious traditions surrounding Dewas Tekri and its major shrines.',
        cultural_contribution:
          'Maintained devotional rituals, Navratri celebrations, pilgrimage customs, prasad traditions, and the living religious culture of Dewas Tekri.',
        heritage_crafts_or_foods: [
          'Temple Rituals',
          'Prasad Traditions',
          'Navratri Celebrations',
          'Religious Crafts',
        ],
        tags: [
          'community',
          'temple',
          'pilgrimage',
          'navratri',
          'shakti',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Events & Stories...');

    await Event.findOneAndUpdate(
      { _id: 'event_dewas_navratri' },
      {
        _id: 'event_dewas_navratri',
        name: 'Dewas Navratri Festival',
        normalized_name: 'dewas navratri festival',
        event_type: 'FESTIVAL',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0500, 22.9657],
        },
        recurrence: 'Annual',
        description:
          'Major devotional festival centered on the temples of Dewas Tekri, featuring special worship, processions, devotional music, fairs, and large gatherings of pilgrims.',
        cultural_significance:
          'Navratri is one of the defining cultural and religious periods in Dewas, bringing together temple traditions, local commerce, music, food, and community participation.',
        tags: [
          'navratri',
          'festival',
          'shakti',
          'dewas_tekri',
          'pilgrimage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_dewas_chamunda_mata_mela' },
      {
        _id: 'event_dewas_chamunda_mata_mela',
        name: 'Chamunda Mata Mela',
        normalized_name: 'chamunda mata mela dewas',
        event_type: 'FAIR',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0499, 22.9657],
        },
        recurrence: 'Annual / festival dates',
        description:
          'Religious fair around the Chamunda Mata shrine featuring devotional activities, temporary stalls, local food, religious merchandise, and pilgrim gatherings.',
        cultural_significance:
          'Connects Dewas’s temple traditions with local commerce, crafts, food culture, and community celebration.',
        tags: [
          'mela',
          'chamunda',
          'festival',
          'pilgrimage',
          'local_culture',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_dewas_mahashivratri' },
      {
        _id: 'event_dewas_mahashivratri',
        name: 'Dewas Mahashivratri',
        normalized_name: 'dewas mahashivratri',
        event_type: 'FESTIVAL',
        city_id: 'city_dewas_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [76.0439, 22.9762],
        },
        recurrence: 'Annual',
        description:
          'Annual celebration dedicated to Lord Shiva, with special temple rituals, devotional gatherings, night worship, and pilgrim activity.',
        cultural_significance:
          'Reflects the continuing Shaivite traditions of Dewas and the wider Malwa region.',
        tags: [
          'mahashivratri',
          'shiva',
          'festival',
          'temple',
          'pilgrimage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_dewas_tekri_shakti' },
      {
        _id: 'story_dewas_tekri_shakti',
        title: 'The Sacred Hill of Dewas',
        normalized_title: 'the sacred hill of dewas',
        story_type: 'LOCAL_HISTORY',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_dewas_tekri',
          name: 'Dewas Tekri',
        },
        city_id: 'city_dewas_mp',
        narrative:
          'Dewas Tekri rises above the city and has long been the spiritual heart of Dewas. The hill is home to the revered shrines of Chamunda Mata and Tulja Bhawani, drawing pilgrims throughout the year. During Navratri, the hill becomes the center of an especially vibrant religious gathering, linking devotion, local markets, food traditions, and community life.',
        submitted_by: 'system',
        tags: [
          'dewas_tekri',
          'chamunda',
          'tulja_bhawani',
          'shakti',
          'pilgrimage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_dewas_pawar_states' },
      {
        _id: 'story_dewas_pawar_states',
        title: 'Dewas: The Twin Pawar Princely States',
        normalized_title: 'dewas the twin pawar princely states',
        story_type: 'LOCAL_HISTORY',
        associated_entity: {
          entity_type: 'CITY',
          entity_id: 'city_dewas_mp',
          name: 'Dewas',
        },
        city_id: 'city_dewas_mp',
        narrative:
          'Dewas was historically composed of two distinct princely states, one ruled by the Tukoji Rao Pawar line and the other by the Jivaji Rao Pawar line. Both states belonged to the Maratha Pawar dynasty and contributed significantly to the cultural and administrative life of the region. Their shared history, joint administration for some purposes, and distinct royal traditions shaped the identity of modern Dewas.',
        submitted_by: 'system',
        tags: ['dewas', 'pawar', 'maratha', 'princely_state', 'history'],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_dewas_craft_textiles' },
      {
        _id: 'story_dewas_craft_textiles',
        title: 'Textile Heritage and Local Crafts of Dewas',
        normalized_title: 'textile heritage and local crafts of dewas',
        story_type: 'LOCAL_CRAFTS',
        associated_entity: {
          entity_type: 'CITY',
          entity_id: 'city_dewas_mp',
          name: 'Dewas',
        },
        city_id: 'city_dewas_mp',
        narrative:
          'Dewas and its surrounding areas have traditions of textile work, including handloom, dyeing, and embroidery. These crafts reflect the region’s cultural aesthetics, its economic history, and the skills passed down through generations. Today, some of these craft practices continue to shape local identity and support livelihoods.',
        submitted_by: 'system',
        tags: ['crafts', 'textiles', 'local_economy', 'dewas', 'handloom'],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_dewas_malwa_cuisine' },
      {
        _id: 'story_dewas_malwa_cuisine',
        title: 'Flavors of Malwa: The Cuisine of Dewas',
        normalized_title: 'flavors of malwa the cuisine of dewas',
        story_type: 'LOCAL_CUISINE',
        associated_entity: {
          entity_type: 'CITY',
          entity_id: 'city_dewas_mp',
          name: 'Dewas',
        },
        city_id: 'city_dewas_mp',
        narrative:
          'Dewas cuisine is part of the broader Malwa culinary tradition, characterized by wheat-based staples, savory snacks, dals, and festive preparations. Local specialties reflect the region’s agricultural products, historical influences, and devotional food practices. Dishes like dal bafla, poha, sev, and various sweets are integral to the local food identity.',
        submitted_by: 'system',
        tags: ['cuisine', 'malwa', 'food_culture', 'dewas', 'local_food'],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_dewas_navratri_devotion' },
      {
        _id: 'story_dewas_navratri_devotion',
        title: 'Navratri Devotion on Dewas Tekri',
        normalized_title: 'navratri devotion on dewas tekri',
        story_type: 'LOCAL_FESTIVAL',
        associated_entity: {
          entity_type: 'EVENT',
          entity_id: 'event_dewas_navratri',
          name: 'Dewas Navratri Festival',
        },
        city_id: 'city_dewas_mp',
        narrative:
          'During Navratri, Dewas Tekri becomes the focus of intense devotional activity. Pilgrims climb the hill to offer prayers at the shrines of Chamunda Mata and Tulja Bhawani. The festival brings together religious rituals, devotional singing, community gatherings, and temporary marketplaces, reflecting the deep spiritual connection between the people of Dewas and the goddess.',
        submitted_by: 'system',
        tags: [
          'navratri',
          'dewas_tekri',
          'devotion',
          'festival',
          'pilgrimage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_dewas_lake_conservation' },
      {
        _id: 'story_dewas_lake_conservation',
        title: 'Conservation Efforts and Local Water Traditions',
        normalized_title: 'conservation efforts and local water traditions',
        story_type: 'LOCAL_INITIATIVES',
        associated_entity: {
          entity_type: 'CITY',
          entity_id: 'city_dewas_mp',
          name: 'Dewas',
        },
        city_id: 'city_dewas_mp',
        narrative:
          'Like many historic cities, Dewas has local traditions related to water management and the use of lakes and reservoirs. In recent times, various community and government initiatives have focused on lake conservation, water quality improvement, and restoration of water bodies. These efforts highlight the evolving relationship between the city and its natural water resources.',
        submitted_by: 'system',
        tags: ['conservation', 'water', 'dewas', 'environment', 'community'],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Dewas Pilot Data Seeded Successfully!');
  } catch (error) {
    console.error('[Seed] Error seeding Dewas:', error);
  } finally {
    await disconnectDB();
  }
};

seedDewas();