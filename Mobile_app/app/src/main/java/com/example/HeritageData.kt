package com.example

data class MonumentModel(
  val id: String,
  val name: String,
  val subtitle: String,
  val city: String,
  val state: String,
  val category: String,
  val categoryTag: String,
  val description: String,
  val detailedStory: String,
  val imageUrl: String,
  val distanceKm: Double = 0.0,
  val rating: Double = 4.8,
  val isFavorite: Boolean = false,
  val highlights: List<HighlightModel> = emptyList(),
  val openingHours: String = "10:00 AM – 5:00 PM",
  val closedDays: String = "Closed on Mondays",
  val entryFeeIndian: String = "₹10 (Indians)",
  val entryFeeForeigner: String = "₹250 (Foreigners)",
  val bestTime: String = "October to March"
)

data class HighlightModel(
  val id: String,
  val title: String,
  val description: String,
  val iconName: String
)

data class MarketModel(
  val id: String,
  val name: String,
  val subtitle: String,
  val city: String,
  val state: String,
  val category: String,
  val description: String,
  val detailedStory: String,
  val imageUrl: String,
  val dishImages: List<String> = emptyList(),
  val signatures: List<CulinarySignature> = emptyList(),
  val marketHours: String = "9:00 PM to 2:00 AM",
  val setupTime: String = "Vendors start setting up around 8:30 PM",
  val peakCrowd: String = "11:00 PM to 1:00 AM",
  val gettingThere: String = "Located in central Indore near Rajwada Palace. Walk from parking area."
)

data class CulinarySignature(
  val id: String,
  val title: String,
  val description: String
)

data class BadgeModel(
  val id: String,
  val title: String,
  val monumentName: String,
  val location: String,
  val icon: String,
  val isVerified: Boolean = true
)

data class HeritageAppModel(
  val id: String,
  val name: String,
  val tag: String,
  val description: String,
  val rating: Double,
  val size: String,
  val author: String,
  val actionText: String
)

object HeritageDataSource {
  val monuments = listOf(
    MonumentModel(
      id = "rajwada-palace",
      name = "Rajwada Palace",
      subtitle = "The Royal Heart of Indore",
      city = "Indore",
      state = "Madhya Pradesh",
      category = "Heritage",
      categoryTag = "Maratha Heritage",
      description = "An iconic historic palace known for its grand architecture and seven-story structure.",
      detailedStory = "Rajwada, a historical palace in Indore city, was built by the Holkars of the Maratha Empire about two centuries ago. This seven-story structure, located near the Chhatris, stands today as a magnificent example of royal grandeur and architectural ingenuity. It remains a powerful symbol of the Maratha reign and a focal point of Indore's cultural heritage.",
      imageUrl = "https://images.unsplash.com/photo-1599831104321-4f10115e5743?w=800&auto=format&fit=crop&q=80",
      distanceKm = 0.8,
      rating = 4.8,
      isFavorite = true,
      highlights = listOf(
        HighlightModel("h1", "Ganesha Hall", "An expansive hall once used for royal state functions and religious ceremonies.", "account-balance"),
        HighlightModel("h2", "Inner Courtyard", "A beautifully manicured garden with a statue of Ahilyabai Holkar and fountains.", "park"),
        HighlightModel("h3", "Light & Sound Show", "An evening spectacle narrating the history of the Holkar dynasty and Indore.", "wb-twilight"),
        HighlightModel("h4", "Holkar Museum", "Exhibiting artifacts, weapons, and personal belongings of the royal family.", "museum")
      ),
      openingHours = "10:00 AM – 5:00 PM",
      closedDays = "Closed on Mondays",
      entryFeeIndian = "₹10 (Indians)",
      entryFeeForeigner = "₹250 (Foreigners)",
      bestTime = "October to March"
    ),
    MonumentModel(
      id = "taj-mahal",
      name = "Taj Mahal",
      subtitle = "A timeless symbol of eternal love",
      city = "Agra",
      state = "Uttar Pradesh",
      category = "UNESCO Site",
      categoryTag = "UNESCO Site",
      description = "A timeless symbol of eternal love and ivory-white marble wonder.",
      detailedStory = "Commissioned in 1631 by Mughal Emperor Shah Jahan to house the tomb of his favorite wife Mumtaz Mahal, the Taj Mahal is an internationally admired masterpiece of Mughal architecture that blends Indian, Persian, and Islamic artistic traditions.",
      imageUrl = "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
      distanceKm = 610.0,
      rating = 4.9,
      isFavorite = false,
      openingHours = "Sunrise to Sunset",
      closedDays = "Closed on Fridays",
      entryFeeIndian = "₹50 (Indians)",
      entryFeeForeigner = "₹1100 (Foreigners)",
      bestTime = "November to February"
    ),
    MonumentModel(
      id = "gulawat-lotus",
      name = "Gulawat Lotus Valley",
      subtitle = "Serene Nature & Lotus Blooms",
      city = "Indore",
      state = "Madhya Pradesh",
      category = "Nature",
      categoryTag = "Nature",
      description = "A peaceful natural destination known for seasonal lotus blooms.",
      detailedStory = "Nestled near Yashwant Sagar backwaters outside Indore, Gulawat Lotus Valley is Asia's largest lotus lake sanctuary. A bamboo bridge and gentle country boats guide visitors through dense blooming lotus beds surrounded by eucalyptus groves.",
      imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      distanceKm = 28.0,
      rating = 4.6,
      openingHours = "6:00 AM – 7:00 PM",
      closedDays = "Open Daily",
      entryFeeIndian = "Free Entry",
      entryFeeForeigner = "Free Entry",
      bestTime = "July to November"
    ),
    MonumentModel(
      id = "bhimbetka-caves",
      name = "Bhimbetka Caves",
      subtitle = "Prehistoric Rock Art Shelter",
      city = "Raisen",
      state = "Madhya Pradesh",
      category = "Ancient History",
      categoryTag = "Ancient History",
      description = "Ancient rock shelters showcasing historic prehistoric paintings.",
      detailedStory = "Bhimbetka comprises over 750 rock shelters spanning Paleolithic and Mesolithic eras. The mineral ochre and white pigment paintings reveal scenes of hunting, dancing, riding horses, and ceremonial life created by early humankind.",
      imageUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
      distanceKm = 195.0,
      rating = 4.8,
      openingHours = "7:00 AM – 6:00 PM",
      closedDays = "Open Daily",
      entryFeeIndian = "₹25 (Indians)",
      entryFeeForeigner = "₹500 (Foreigners)",
      bestTime = "October to March"
    ),
    MonumentModel(
      id = "lal-bagh-palace",
      name = "Lal Bagh Palace",
      subtitle = "European Elegance in Central India",
      city = "Indore",
      state = "Madhya Pradesh",
      category = "Palace",
      categoryTag = "Palace",
      description = "Opulent 19th-century palace set in sprawling European-style gardens.",
      detailedStory = "Constructed by Tukoji Rao Holkar II, Lal Bagh Palace mirrors the splendour of Buckingham Palace and Versailles, featuring Italian marble columns, Persian carpets, gilded ceiling frescoes, and replica gates of Buckingham Palace cast in England.",
      imageUrl = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
      distanceKm = 3.2,
      rating = 4.7,
      openingHours = "10:00 AM – 5:00 PM",
      closedDays = "Closed on Mondays",
      entryFeeIndian = "₹20 (Indians)",
      entryFeeForeigner = "₹250 (Foreigners)",
      bestTime = "October to March"
    ),
    MonumentModel(
      id = "central-museum-indore",
      name = "Central Museum",
      subtitle = "Parmar Sculptures & Historical Numismatics",
      city = "Indore",
      state = "Madhya Pradesh",
      category = "Museum",
      categoryTag = "Museum",
      description = "Rich repository of medieval artifacts, Parmar sculptures, and coins.",
      detailedStory = "Also known as Indore Museum, it houses one of the finest collections of Parmar era sculptures, pre-historic tools, stone inscriptions, weapons, and ivory carvings dating from ancient Malwa.",
      imageUrl = "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=80",
      distanceKm = 1.5,
      rating = 4.5,
      openingHours = "10:00 AM – 5:00 PM",
      closedDays = "Closed on Mondays",
      entryFeeIndian = "₹10 (Indians)",
      entryFeeForeigner = "₹100 (Foreigners)",
      bestTime = "All Year"
    )
  )

  val markets = listOf(
    MarketModel(
      id = "sarafa-bazaar",
      name = "Sarafa Bazaar",
      subtitle = "Where the quiet gleam of gold yields to the vibrant sizzle of midnight street food.",
      city = "Indore",
      state = "Madhya Pradesh",
      category = "Local Culture",
      description = "A vibrant night market famous for traditional food, local culture, and lively streets.",
      detailedStory = "By day, Sarafa Bazaar is a conventional, albeit historic, jewelry market. The narrow lanes are flanked by shops dealing in gold, silver, and precious stones, operating with a quiet, measured mercantile rhythm. It is a place of serious commerce and tradition.\n\nHowever, as the jewelers pull down their shutters around 8:00 PM, a remarkable transformation occurs. The street is rapidly claimed by hundreds of food vendors. Carts are rolled out, massive tawas (griddles) are fired up, and the quiet lane erupts into a cacophony of sizzling oil, clinking utensils, and the enthusiastic chatter of thousands of food lovers. It becomes an unparalleled nocturnal culinary festival that stretches deep into the early hours of the morning.",
      imageUrl = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      dishImages = listOf(
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80"
      ),
      signatures = listOf(
        CulinarySignature("c1", "Bhutte ka Kees", "A creamy, savory dish made from grated corn simmered in milk and spices, topped with fresh coriander and lemon. A true Indori invention."),
        CulinarySignature("c2", "Garadu", "Deep-fried chunks of yam tossed in a fiery, tangy secret spice mix (jeeravan). Crispy on the outside, soft on the inside."),
        CulinarySignature("c3", "Joshi's Dahi Bada", "Famous not just for the soft lentil dumplings in yogurt, but for the theatrical way the vendor flips the bowl before serving."),
        CulinarySignature("c4", "Jaleba", "The colossal, king-sized version of the traditional jalebi. Crispy, syrup-soaked, and meant for sharing.")
      )
    ),
    MarketModel(
      id = "chappan-dukan",
      name = "Chappan Dukan",
      subtitle = "Indore's legendary 56-shop gastronomic promenade.",
      city = "Indore",
      state = "Madhya Pradesh",
      category = "Culinary",
      description = "A famous food street offering a wide variety of snacks and traditional Indian delicacies.",
      detailedStory = "Chappan Dukan (meaning '56 Shops') is Indore's clean, pedestrianized culinary boulevard. From hot poha-jalebi in the morning to khopra patties, hot dogs, and shikanji in the afternoon, it is a bustling hub of lively street culinary pride.",
      imageUrl = "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
      signatures = listOf(
        CulinarySignature("cd1", "Vijay Chaap & Khopra Patties", "Crisp potato patties stuffed with spiced coconut filling, fried fresh and served with tangy chutneys."),
        CulinarySignature("cd2", "Indori Poha & Jalebi", "Steamed flattened rice seasoned with fennel, mustard seeds, and jeeravan, garnished with ratlami sev and pomegranate.")
      )
    )
  )

  val badges = listOf(
    BadgeModel("b1", "FORT GUARDIAN", "Amer Fort", "Jaipur, Rajasthan", "fort"),
    BadgeModel("b2", "TEMPLE TRAIL", "Virupaksha Temple", "Hampi, Karnataka", "temple"),
    BadgeModel("b3", "HERITAGE CURATOR", "National Museum", "New Delhi, Delhi", "museum")
  )

  val apps = listOf(
    HeritageAppModel("a1", "Incredible India Official", "Official", "Complete travel itineraries, festivals & state tourism boards", 4.8, "45 MB", "Govt of India", "Open"),
    HeritageAppModel("a2", "ASI E-Monument Pass", "Tickets", "Skip line ticket booking for 3,693 protected monuments", 4.6, "22 MB", "Archaeological Survey", "Install"),
    HeritageAppModel("a3", "Tribes India & Handloom", "Crafts", "Direct authentic handicraft marketplace from local weavers", 4.7, "18 MB", "TRIFED", "Install"),
    HeritageAppModel("a4", "Bhashini AI Translator", "Voice AI", "Real-time speech & text translation across 22 Indian languages", 4.9, "30 MB", "Digital India", "Open")
  )
}
