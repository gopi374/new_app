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
  verification_notes: 'Sourced and verified from Ujjain Cultural Heritage Dossier',
  sources: ['Ujjain Cultural Heritage Dossier (SIH 2026 / Bhraman Archive)'],
};

const SYSTEM_PUBLICATION = {
  publication_status: 'PUBLISHED',
  published_at: new Date('2026-08-02T00:00:00Z'),
  published_by: 'system',
};

const seedUjjain = async () => {
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
        description:
          'Heart of India, home to ancient temples, sacred rivers, royal heritage, and the Malwa cultural region.',
        location: { type: 'Point', coordinates: [78.6569, 22.9734] },
      },
      { upsert: true, new: true }
    );

    await City.findOneAndUpdate(
      { _id: 'city_ujjain_mp' },
      {
        _id: 'city_ujjain_mp',
        name: 'Ujjain',
        normalized_name: 'ujjain',
        state_id: 'state_mp',
        country_code: 'IN',
        location: { type: 'Point', coordinates: [75.7885, 23.1765] },
        short_description:
          'One of India’s oldest sacred cities and a major center of Shaivite pilgrimage.',
        description:
          'Ujjain is an ancient city on the banks of the Shipra River, renowned for the Mahakaleshwar Jyotirlinga, Simhastha Kumbh Mela, Kal Bhairav Temple, Mahakal Lok, and its deep connections with Sanskrit learning, astronomy, and the legendary King Vikramaditya.',
        cultural_summary:
          'Known for Mahakaleshwar Jyotirlinga, Shipra River ghats, Simhastha Kumbh Mela, Kal Bhairav Temple, Harsiddhi Temple, Sandipani Ashram, and the literary legacy of Kalidasa and Vikramaditya.',
        highlights: [
          'Mahakaleshwar Jyotirlinga',
          'Mahakal Lok',
          'Kal Bhairav Temple',
          'Ram Ghat',
          'Harsiddhi Temple',
          'Vedh Shala',
        ],
        is_featured: true,
        tags: ['spiritual_city', 'jyotirlinga', 'malwa_region', 'ancient_city'],
        status: 'ACTIVE',
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Places...');

    const placesData = [
      {
        _id: 'place_mahakaleshwar_temple',
        name: 'Mahakaleshwar Jyotirlinga Temple',
        normalized_name: 'mahakaleshwar jyotirlinga temple',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7681, 23.1828],
        },
        address: {
          line1: 'Mahakaleshwar Temple, Ujjain',
          city_id: 'city_ujjain_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'One of the twelve Jyotirlingas of Lord Shiva and the spiritual heart of Ujjain, famous for its Bhasma Aarti and ancient Shaivite traditions.',
        historical_significance:
          'An ancient Shiva shrine whose present temple complex developed over several historical periods and received major patronage from rulers of Malwa.',
        architectural_style:
          'Maratha-era Temple Architecture with traditional Hindu elements',
        visiting_hours:
          '03:00 AM - 11:00 PM (Darshan timings vary)',
        entry_fee: 'General Darshan Free; Special Darshan/Aarti tickets vary',
        best_time_to_visit: 'October to March; Mahashivratri for major celebrations',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'jyotirlinga',
          'shiva',
          'temple',
          'pilgrimage',
          'bhasma_aarti',
        ],
      },
      {
        _id: 'place_mahakal_lok',
        name: 'Mahakal Lok',
        normalized_name: 'mahakal lok',
        place_type: 'HERITAGE',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7672, 23.1841],
        },
        address: {
          line1: 'Mahakal Temple Area',
          city_id: 'city_ujjain_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'A large heritage and pilgrimage corridor surrounding the Mahakaleshwar Temple featuring monumental gateways, murals, sculptures, and representations from Shaivite traditions.',
        historical_significance:
          'Developed as part of the modern redevelopment of the Mahakaleshwar pilgrimage precinct while drawing extensively on Ujjain’s ancient religious traditions.',
        architectural_style:
          'Contemporary Sacred Architecture inspired by Indian Temple Traditions',
        visiting_hours: 'Open throughout the day; evening illumination is popular',
        entry_fee: 'Free',
        best_time_to_visit: 'Evening and winter months',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'mahakal',
          'heritage_corridor',
          'sculptures',
          'pilgrimage',
        ],
      },
      {
        _id: 'place_kal_bhairav_temple',
        name: 'Kal Bhairav Temple',
        normalized_name: 'kal bhairav temple',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7998, 23.1832],
        },
        address: {
          line1: 'Bhairavgarh, Ujjain',
          city_id: 'city_ujjain_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Ancient temple dedicated to Kal Bhairav, a fierce manifestation of Lord Shiva and one of the most distinctive pilgrimage sites in Ujjain.',
        historical_significance:
          'The temple is associated with ancient Bhairava worship in Ujjain and has remained an important local pilgrimage center for centuries.',
        architectural_style: 'Traditional Hindu Temple Architecture',
        visiting_hours: '05:00 AM - 09:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'kal_bhairav',
          'shiva',
          'temple',
          'pilgrimage',
          'ujjain',
        ],
      },
      {
        _id: 'place_harsiddhi_temple',
        name: 'Harsiddhi Temple',
        normalized_name: 'harsiddhi temple',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7665, 23.1774],
        },
        address: {
          line1: 'Rudra Sagar, Ujjain',
          city_id: 'city_ujjain_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Ancient Shakti temple dedicated to Goddess Harsiddhi, recognized as one of the prominent sacred sites of Ujjain.',
        historical_significance:
          'The temple has longstanding associations with Shakti worship and is traditionally connected with the sacred geography of Ujjain.',
        architectural_style: 'Maratha-era Temple Architecture',
        visiting_hours: '06:00 AM - 09:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'Navratri and October to March',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'shakti',
          'temple',
          'harsiddhi',
          'navratri',
          'pilgrimage',
        ],
      },
      {
        _id: 'place_ram_ghat',
        name: 'Ram Ghat',
        normalized_name: 'ram ghat',
        place_type: 'HERITAGE',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7747, 23.1766],
        },
        address: {
          line1: 'Shipra River, Ram Ghat',
          city_id: 'city_ujjain_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic bathing ghat on the Shipra River and one of the most important gathering points during Ujjain’s religious festivals and Simhastha Kumbh Mela.',
        historical_significance:
          'One of the principal sacred ghats of Ujjain, deeply associated with ritual bathing, Shipra worship, and the city’s Kumbh traditions.',
        architectural_style: 'Traditional Riverfront Ghat Architecture',
        visiting_hours: 'Open throughout the day',
        entry_fee: 'Free',
        best_time_to_visit: 'Early morning and evening',
        discovery: {
          is_hidden_gem: false,
          discovery_level: 'MAINSTREAM',
        },
        tags: [
          'shipra',
          'ghat',
          'kumbh',
          'aarti',
          'pilgrimage',
        ],
      },
      {
        _id: 'place_vedh_shala',
        name: 'Vedh Shala (Jantar Mantar)',
        normalized_name: 'vedh shala jantar mantar',
        place_type: 'HERITAGE',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7772, 23.1821],
        },
        address: {
          line1: 'Jantar Mantar, Ujjain',
          city_id: 'city_ujjain_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Historic astronomical observatory established under Maharaja Jai Singh II, reflecting Ujjain’s long association with astronomy and timekeeping.',
        historical_significance:
          'Built in the 18th century as part of Jai Singh II’s network of observatories and continuing Ujjain’s ancient astronomical tradition.',
        architectural_style: 'Astronomical Instrument Architecture',
        visiting_hours: '10:00 AM - 05:00 PM',
        entry_fee: 'Nominal entry fee',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
          why_visit:
            'A unique scientific heritage site revealing Ujjain’s historic importance in Indian astronomy.',
        },
        tags: [
          'astronomy',
          'jai_singh',
          'observatory',
          'science_heritage',
        ],
      },
      {
        _id: 'place_sandipani_ashram',
        name: 'Sandipani Ashram',
        normalized_name: 'sandipani ashram',
        place_type: 'RELIGIOUS_SITE',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.8036, 23.1955],
        },
        address: {
          line1: 'Mangalnath Road, Ujjain',
          city_id: 'city_ujjain_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Traditional pilgrimage site associated with the ashram of Sage Sandipani, where Lord Krishna is believed to have studied with Balarama and Sudama.',
        historical_significance:
          'The site is connected with the Krishna-Sandipani educational tradition described in Hindu sacred literature.',
        architectural_style: 'Traditional Ashram Architecture',
        visiting_hours: '06:00 AM - 08:00 PM',
        entry_fee: 'Free',
        best_time_to_visit: 'October to March',
        discovery: {
          is_hidden_gem: true,
          discovery_level: 'LESSER_KNOWN',
        },
        tags: [
          'krishna',
          'sandipani',
          'ashram',
          'mythology',
          'education',
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
        _id: 'market_gopal_mandir_bazaar',
        name: 'Gopal Mandir Bazaar',
        normalized_name: 'gopal mandir bazaar',
        market_type: 'TRADITIONAL_MARKET',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7689, 23.1806],
        },
        address: {
          line1: 'Gopal Mandir Area, Ujjain',
          city_id: 'city_ujjain_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Traditional market area near the historic temple district offering puja articles, religious souvenirs, textiles, sweets, snacks, and everyday goods.',
        operating_hours: '09:00 AM - 09:00 PM',
        best_known_for: [
          'Puja Items',
          'Religious Souvenirs',
          'Malwa Snacks',
          'Textiles',
        ],
        tags: [
          'traditional_market',
          'temple_market',
          'puja',
          'shopping',
        ],
      },
      {
        _id: 'market_freeganj',
        name: 'Freeganj Market',
        normalized_name: 'freeganj market',
        market_type: 'FOOD_MARKET',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7849, 23.1689],
        },
        address: {
          line1: 'Freeganj, Ujjain',
          city_id: 'city_ujjain_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Busy commercial area with local eateries, snack shops, sweets, street food, clothing, and everyday shopping.',
        operating_hours: '09:00 AM - 10:00 PM',
        best_known_for: [
          'Poha',
          'Kachori',
          'Samosa',
          'Jalebi',
          'Namkeen',
        ],
        tags: [
          'market',
          'street_food',
          'shopping',
          'local_food',
        ],
      },
      {
        _id: 'market_tower_chowk',
        name: 'Tower Chowk Market',
        normalized_name: 'tower chowk market',
        market_type: 'TRADITIONAL_MARKET',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7755, 23.1799],
        },
        address: {
          line1: 'Tower Chowk, Ujjain',
          city_id: 'city_ujjain_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Central Ujjain shopping district known for bustling streets, traditional merchandise, snacks, sweets, and festival shopping.',
        operating_hours: '10:00 AM - 10:00 PM',
        best_known_for: [
          'Traditional Clothing',
          'Puja Items',
          'Sweets',
          'Namkeen',
        ],
        tags: [
          'shopping',
          'traditional_market',
          'city_center',
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
        _id: 'food_ujjaini_poha',
        name: 'Ujjaini Poha',
        normalized_name: 'ujjaini poha',
        food_category: 'STREET_FOOD',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        description:
          'Light and flavorful flattened rice preparation served as a popular breakfast across Ujjain and the Malwa region, commonly finished with sev, coriander, onion, and lemon.',
        cultural_origin: 'Malwa Region',
        key_ingredients: [
          'Poha',
          'Onion',
          'Sev',
          'Coriander',
          'Lemon',
          'Jeeravan Masala',
        ],
        tags: [
          'breakfast',
          'malwa_food',
          'street_food',
          'poha',
        ],
      },
      {
        _id: 'food_dal_bafla',
        name: 'Dal Bafla',
        normalized_name: 'dal bafla',
        food_category: 'TRADITIONAL_FOOD',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        description:
          'Traditional Malwa dish of baked or boiled wheat bafla served with dal, ghee, chutneys, and accompaniments.',
        cultural_origin: 'Malwa Region',
        key_ingredients: [
          'Wheat',
          'Toor Dal',
          'Ghee',
          'Spices',
          'Chutney',
        ],
        tags: [
          'malwa',
          'traditional_food',
          'dal_bafla',
          'local_specialty',
        ],
      },
      {
        _id: 'food_bhutte_ka_kees_ujjain',
        name: 'Bhutte Ka Kees',
        normalized_name: 'bhutte ka kees ujjain',
        food_category: 'STREET_FOOD',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        description:
          'Grated corn cooked with milk, spices, and ghee, representing the distinctive vegetarian street-food tradition of the Malwa region.',
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
          'malwa',
          'street_food',
          'corn',
          'vegetarian',
        ],
      },
      {
        _id: 'food_dahi_vada_ujjain',
        name: 'Ujjaini Dahi Vada',
        normalized_name: 'ujjaini dahi vada',
        food_category: 'STREET_FOOD',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        description:
          'Soft lentil dumplings soaked in seasoned yogurt and topped with chutneys, spices, and local sev.',
        cultural_origin: 'Ujjain / Malwa Region',
        key_ingredients: [
          'Urad Dal',
          'Yogurt',
          'Tamarind Chutney',
          'Green Chutney',
          'Spices',
          'Sev',
        ],
        tags: [
          'chaat',
          'street_food',
          'dahi_vada',
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
        _id: 'food_place_shree_ganga_restaurant',
        name: 'Shree Ganga Restaurant',
        normalized_name: 'shree ganga restaurant',
        food_place_type: 'RESTAURANT',
        associated_food_ids: [
          'food_ujjaini_poha',
          'food_dal_bafla',
          'food_dahi_vada_ujjain',
        ],
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7755, 23.1799],
        },
        address: {
          line1: 'Tower Chowk Area, Ujjain',
          city_id: 'city_ujjain_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Local-style vegetarian eatery suitable for sampling Malwa staples and everyday Ujjain food.',
        operating_hours: '08:00 AM - 10:00 PM',
        price_range: '₹100 - ₹300',
        is_heritage_vendor: false,
        est_year: 1990,
        tags: [
          'vegetarian',
          'malwa_food',
          'local_eatery',
        ],
      },
      {
        _id: 'food_place_temple_bazaar_snacks',
        name: 'Temple Bazaar Snack Vendors',
        normalized_name: 'temple bazaar snack vendors',
        food_place_type: 'STALL',
        associated_food_ids: [
          'food_ujjaini_poha',
          'food_dahi_vada_ujjain',
        ],
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7693, 23.1803],
        },
        address: {
          line1: 'Mahakaleshwar Temple Bazaar',
          city_id: 'city_ujjain_mp',
          state_id: 'state_mp',
          country_code: 'IN',
        },
        description:
          'Cluster of small local food stalls serving breakfast, snacks, sweets, and refreshments around the temple precinct.',
        operating_hours: '06:00 AM - 10:00 PM',
        price_range: '₹30 - ₹150',
        is_heritage_vendor: true,
        est_year: 1980,
        tags: [
          'temple_food',
          'street_food',
          'local_vendor',
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
      { _id: 'artisan_ujjain_batik_artisans' },
      {
        _id: 'artisan_ujjain_batik_artisans',
        name: 'Ujjain Batik Artisans',
        normalized_name: 'ujjain batik artisans',
        specialization_type: 'TEXTILE',
        craft_description:
          'Traditional Malwa textile artisans practicing batik and hand-decorated fabric techniques used for sarees, dress materials, and decorative textiles.',
        district: 'Ujjain',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7885, 23.1765],
        },
        is_master_craftsperson: false,
        awards: [],
        tags: [
          'batik',
          'textile',
          'handicraft',
          'malwa',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Artisan.findOneAndUpdate(
      { _id: 'artisan_ujjain_puja_crafts' },
      {
        _id: 'artisan_ujjain_puja_crafts',
        name: 'Ujjain Puja Craft Artisans',
        normalized_name: 'ujjain puja craft artisans',
        specialization_type: 'RELIGIOUS_CRAFT',
        craft_description:
          'Local craftspeople producing traditional puja articles, religious decorations, sacred souvenirs, and festival-related handicrafts for pilgrims.',
        district: 'Ujjain',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7690, 23.1800],
        },
        is_master_craftsperson: false,
        awards: [],
        tags: [
          'puja',
          'religious_crafts',
          'pilgrimage',
          'souvenirs',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Community.findOneAndUpdate(
      { _id: 'community_ujjain_pandit_priest_tradition' },
      {
        _id: 'community_ujjain_pandit_priest_tradition',
        name: 'Ujjain Temple Priest Community',
        normalized_name: 'ujjain temple priest community',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        description:
          'Traditional priestly communities responsible for maintaining ritual practices, temple ceremonies, pilgrimage traditions, and sacred knowledge across Ujjain.',
        cultural_contribution:
          'Preserved generations of Shaivite, Shakta, and other Hindu ritual traditions associated with Ujjain’s major temples and pilgrimage calendar.',
        heritage_crafts_or_foods: [
          'Temple Ritual Traditions',
          'Festival Ceremonies',
          'Prasad Traditions',
        ],
        tags: [
          'community',
          'priests',
          'temples',
          'ritual',
          'heritage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Events & Stories...');

    await Event.findOneAndUpdate(
      { _id: 'event_simhastha_kumbh_mela' },
      {
        _id: 'event_simhastha_kumbh_mela',
        name: 'Simhastha Kumbh Mela',
        normalized_name: 'simhastha kumbh mela',
        event_type: 'FESTIVAL',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7747, 23.1766],
        },
        recurrence: 'Approximately every 12 years',
        description:
          'One of the four major Kumbh Mela pilgrimages, centered on ritual bathing in the Shipra River and attended by millions of pilgrims, ascetics, and religious communities.',
        cultural_significance:
          'A major living pilgrimage tradition representing centuries of religious, cultural, and community exchange centered on the sacred Shipra River.',
        tags: [
          'simhastha',
          'kumbh',
          'festival',
          'shipra',
          'pilgrimage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_mahashivratri_ujjain' },
      {
        _id: 'event_mahashivratri_ujjain',
        name: 'Mahashivratri Ujjain',
        normalized_name: 'mahashivratri ujjain',
        event_type: 'FESTIVAL',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7681, 23.1828],
        },
        recurrence: 'Annual',
        description:
          'Major annual Shaivite festival centered on Mahakaleshwar Temple, featuring special worship, processions, devotional gatherings, and extended temple rituals.',
        cultural_significance:
          'One of the most important annual religious celebrations in Ujjain, bringing together local communities and pilgrims from across India.',
        tags: [
          'mahashivratri',
          'mahakal',
          'shiva',
          'festival',
          'pilgrimage',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Event.findOneAndUpdate(
      { _id: 'event_ujjain_kartik_mela' },
      {
        _id: 'event_ujjain_kartik_mela',
        name: 'Ujjain Kartik Mela',
        normalized_name: 'ujjain kartik mela',
        event_type: 'FAIR',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        location: {
          type: 'Point',
          coordinates: [75.7747, 23.1766],
        },
        recurrence: 'Annual',
        description:
          'Traditional fair associated with the Kartik religious season, featuring pilgrimage activities, local commerce, entertainment, food, and cultural gatherings.',
        cultural_significance:
          'A longstanding community fair that connects Ujjain’s religious calendar with local crafts, commerce, food, and public celebration.',
        tags: [
          'kartik_mela',
          'fair',
          'festival',
          'local_culture',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_ujjain_time_zero_meridian' },
      {
        _id: 'story_ujjain_time_zero_meridian',
        title: 'Ujjain and the Ancient Science of Time',
        normalized_title: 'ujjain and the ancient science of time',
        story_type: 'LOCAL_HISTORY',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_vedh_shala',
          name: 'Vedh Shala (Jantar Mantar)',
        },
        city_id: 'city_ujjain_mp',
        narrative:
          'For centuries, Ujjain held an important place in Indian astronomy and calendrical traditions. Its geographic location and astronomical observations contributed to its reputation as a reference point for calculating time and celestial movements. The later Vedh Shala built under Maharaja Jai Singh II continued this scientific legacy with large astronomical instruments.',
        submitted_by: 'system',
        tags: [
          'astronomy',
          'timekeeping',
          'ujjain',
          'science_history',
          'vedh_shala',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Story.findOneAndUpdate(
      { _id: 'story_ujjain_mahakal_bhasma_aarti' },
      {
        _id: 'story_ujjain_mahakal_bhasma_aarti',
        title: 'The Sacred Bhasma Aarti of Mahakaleshwar',
        normalized_title: 'the sacred bhasma aarti of mahakaleshwar',
        story_type: 'RELIGIOUS_TRADITION',
        associated_entity: {
          entity_type: 'PLACE',
          entity_id: 'place_mahakaleshwar_temple',
          name: 'Mahakaleshwar Jyotirlinga Temple',
        },
        city_id: 'city_ujjain_mp',
        narrative:
          'The pre-dawn Bhasma Aarti is one of the most distinctive rituals associated with Mahakaleshwar. Devotees gather before sunrise as the sacred Shiva linga is ceremonially worshipped according to the temple’s long-standing Shaivite traditions. The ritual is a defining part of Ujjain’s spiritual identity.',
        submitted_by: 'system',
        tags: [
          'mahakal',
          'bhasma_aarti',
          'shiva',
          'ritual',
          'ujjain',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Trails...');

    await Trail.findOneAndUpdate(
      { _id: 'trail_ujjain_spiritual_heritage' },
      {
        _id: 'trail_ujjain_spiritual_heritage',
        name: 'Ujjain Spiritual & Heritage Trail',
        normalized_name: 'ujjain spiritual & heritage trail',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        description:
          'A sacred heritage trail through Ujjain’s major temples, riverfront ghats, astronomical heritage, and ancient learning traditions.',
        theme: 'Sacred Temples, Shipra River & Ancient Knowledge',
        estimated_duration_mins: 240,
        distance_km: 8.5,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_mahakaleshwar_temple',
            name: 'Mahakaleshwar Jyotirlinga Temple',
            display_order: 1,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_mahakal_lok',
            name: 'Mahakal Lok',
            display_order: 2,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_harsiddhi_temple',
            name: 'Harsiddhi Temple',
            display_order: 3,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_ram_ghat',
            name: 'Ram Ghat',
            display_order: 4,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_vedh_shala',
            name: 'Vedh Shala (Jantar Mantar)',
            display_order: 5,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_sandipani_ashram',
            name: 'Sandipani Ashram',
            display_order: 6,
          },
        ],
        tags: [
          'trail',
          'heritage',
          'spiritual',
          'temples',
          'shipra',
          'astronomy',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    await Trail.findOneAndUpdate(
      { _id: 'trail_ujjain_temple_food' },
      {
        _id: 'trail_ujjain_temple_food',
        name: 'Ujjain Temple & Malwa Food Trail',
        normalized_name: 'ujjain temple & malwa food trail',
        city_id: 'city_ujjain_mp',
        state_id: 'state_mp',
        description:
          'A cultural food trail combining Ujjain’s major temple precincts with traditional Malwa breakfast, snacks, sweets, and local vegetarian cuisine.',
        theme: 'Temple Heritage & Malwa Vegetarian Food',
        estimated_duration_mins: 210,
        distance_km: 5.5,
        stops: [
          {
            entity_type: 'PLACE',
            entity_id: 'place_mahakaleshwar_temple',
            name: 'Mahakaleshwar Jyotirlinga Temple',
            display_order: 1,
          },
          {
            entity_type: 'PLACE',
            entity_id: 'place_harsiddhi_temple',
            name: 'Harsiddhi Temple',
            display_order: 2,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_gopal_mandir_bazaar',
            name: 'Gopal Mandir Bazaar',
            display_order: 3,
          },
          {
            entity_type: 'MARKET',
            entity_id: 'market_freeganj',
            name: 'Freeganj Market',
            display_order: 4,
          },
          {
            entity_type: 'FOOD_PLACE',
            entity_id: 'food_place_temple_bazaar_snacks',
            name: 'Temple Bazaar Snack Vendors',
            display_order: 5,
          },
        ],
        tags: [
          'trail',
          'food_trail',
          'temples',
          'malwa_food',
          'street_food',
        ],
        verification: SYSTEM_VERIFICATION,
        publication: SYSTEM_PUBLICATION,
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Ujjain Pilot Data Seeded Successfully!');
  } catch (error) {
    console.error('[Seed] Error seeding Ujjain data:', error);
  } finally {
    await disconnectDB();
  }
};

seedUjjain();
