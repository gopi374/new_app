import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { Header } from '../components/Header';
import { SideDrawer } from '../components/SideDrawer';
import { MONUMENTS, MARKETS, CITIES } from '../data/mockData';
import { Monument, MarketItem, CityItem } from '../types';
import { heritageService } from '../services/heritageService';
import { useAuth } from '../context/AuthContext';

interface HomeScreenProps {
  onSelectMonument: (monumentId: string) => void;
  onSelectMarket: (marketId: string) => void;
  onSeeAllPress: (category: string) => void;
  onNavigateToMoreApps?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectMonument,
  onSelectMarket,
  onSeeAllPress,
  onNavigateToMoreApps,
}) => {
  const { user } = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [weatherInfo, setWeatherInfo] = useState({ city: 'Indore', temp: '28°C', icon: '☀️' });
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [cities, setCities] = useState<CityItem[]>(CITIES);
  const [allMonuments, setAllMonuments] = useState<Monument[]>(MONUMENTS);
  const [allMarkets, setAllMarkets] = useState<MarketItem[]>(MARKETS);

  // Derived filtered lists
  const popularMonuments = (selectedCity === 'All'
    ? allMonuments
    : allMonuments.filter((m) => m.city.toLowerCase() === selectedCity.toLowerCase())
  ).slice(0, 4);

  const hiddenPlaces = (selectedCity === 'All'
    ? allMonuments
    : allMonuments.filter((m) => m.city.toLowerCase() === selectedCity.toLowerCase())
  ).filter((m) => m.category === 'Nature' || m.category === 'Ancient History' || m.category === 'Natural Site');

  const culturalMarkets = selectedCity === 'All'
    ? allMarkets
    : allMarkets.filter((m) => m.city.toLowerCase() === selectedCity.toLowerCase());

  useEffect(() => {
    let isMounted = true;

    async function loadLocationAndWeather() {
      try {
        let detectedCity = 'Indore';
        let userLat: number | undefined;
        let userLng: number | undefined;

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          userLat = position.coords.latitude;
          userLng = position.coords.longitude;

          const [address] = await Location.reverseGeocodeAsync({
            latitude: userLat,
            longitude: userLng,
          });

          if (address) {
            detectedCity = address.city || address.subregion || address.district || address.region || 'Current Location';
          }

          // Auto-select the city chip that best matches the GPS-detected city
          if (isMounted) {
            const rawLower = detectedCity.toLowerCase();
            const matchedCity = CITIES.find(
              (c) =>
                rawLower.includes(c.name.toLowerCase()) ||
                c.name.toLowerCase().includes(rawLower)
            );
            if (matchedCity) {
              setSelectedCity(matchedCity.name);
            }
          }
        }

        const w = await heritageService.getWeatherStatus(detectedCity, userLat, userLng);
        if (isMounted && w) {
          setWeatherInfo(w);
        }
      } catch (err) {
        try {
          const fallbackW = await heritageService.getWeatherStatus('Indore');
          if (isMounted && fallbackW) setWeatherInfo(fallbackW);
        } catch {
          // Fallback intact
        }
      }
    }

    async function loadBackendData() {
      try {
        const [mons, mkts, dbCities] = await Promise.all([
          heritageService.getMonuments(),
          heritageService.getMarkets(),
          heritageService.getCities(),
        ]);
        if (isMounted) {
          if (mons && mons.length > 0) setAllMonuments(mons);
          if (mkts && mkts.length > 0) setAllMarkets(mkts);
          if (dbCities && dbCities.length > 0) setCities(dbCities);
        }
      } catch (err) {
        // Fallback intact
      }
    }

    loadLocationAndWeather();
    loadBackendData();

    return () => {
      isMounted = false;
    };
  }, []);

  const chapters = ['01 Rajwada Palace', '02 Sarafa By Night', '03 Mandu Gates'];

  return (
    <View style={styles.container}>
      <Header
        title="Indian Heritage"
        onMenuPress={() => setDrawerVisible(true)}
        onNotificationPress={() => { }}
        onFavoritePress={() => { }}
      />

      <SideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onNavigateToMoreApps={onNavigateToMoreApps}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <View>
            <Text style={styles.welcomeBackText}>WELCOME BACK</Text>
            <Text style={styles.greetingName}>Namaste, {user?.full_name ? user.full_name.split(' ')[0] : 'Explorer'}</Text>
          </View>

          <View style={styles.weatherPill}>
            <Text style={styles.locationPillText}>📍 {weatherInfo.city}</Text>
            <Text style={styles.weatherBullet}>•</Text>
            <Text style={styles.weatherPillText}>{weatherInfo.icon} {weatherInfo.temp}</Text>
          </View>
        </View>

        {/* City Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cityChipsRow}
        >
          {[{ id: 'All', name: 'All Cities' }, ...cities].map((c) => {
            const cid = 'id' in c ? c.id : c;
            const isActive = selectedCity === (c.name === 'All Cities' ? 'All' : c.name);
            return (
              <TouchableOpacity
                key={typeof cid === 'string' ? cid : c.name}
                style={[styles.cityChip, isActive && styles.activeCityChip]}
                onPress={() => setSelectedCity(c.name === 'All Cities' ? 'All' : c.name)}
              >
                <Text style={[styles.cityChipText, isActive && styles.activeCityChipText]}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Documentary Reel Hero */}
        <View style={styles.reelContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1599831104321-4f10115e5743?w=800&auto=format&fit=crop&q=80',
            }}
            style={styles.reelImage}
          />
          <View style={styles.reelGradient} />

          {/* Top Reel Badges */}
          <View style={styles.reelTopBar}>
            <View style={styles.liveLoopPill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveLoopText}>DOCUMENTARY REEL • LIVE LOOP</Text>
            </View>

            <View style={styles.reelTopRight}>
              <TouchableOpacity
                style={styles.audioToggleBtn}
                onPress={() => setIsMuted(!isMuted)}
              >
                <Text style={styles.audioIcon}>{isMuted ? '🔇' : '🔊'}</Text>
              </TouchableOpacity>
              <View style={styles.hdrPill}>
                <Text style={styles.hdrText}>4K HDR</Text>
              </View>
            </View>
          </View>

          {/* Center Play Button Overlay */}
          <TouchableOpacity
            style={styles.centerPlayButton}
            onPress={() => onSelectMonument('rajwada-palace')}
          >
            <View style={styles.playInner}>
              <Text style={styles.playIconText}>▶</Text>
            </View>
          </TouchableOpacity>

          {/* Bottom Overlay Info */}
          <View style={styles.reelBottomBar}>
            <Text style={styles.reelCategory}>✨ INDORE • ARCHITECTURAL LEGACY</Text>
            <Text style={styles.reelTitle}>Rajwada Palace & The Royal Heart</Text>
            <Text style={styles.reelDescription} numberOfLines={1}>
              Cinematic visual chronicle of the 7-story Maratha fortress & living heritage
            </Text>

            {/* Chapter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chaptersRow}
            >
              {chapters.map((chap, idx) => (
                <TouchableOpacity
                  key={chap}
                  style={[
                    styles.chapterPill,
                    activeChapter === idx && styles.activeChapterPill,
                  ]}
                  onPress={() => setActiveChapter(idx)}
                >
                  <Text
                    style={[
                      styles.chapterPillText,
                      activeChapter === idx && styles.activeChapterPillText,
                    ]}
                  >
                    {chap}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Progress Indicator Bar */}
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* Section 1: Popular Monuments Carousel */}
        <View style={styles.carouselSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>popular Monumnets</Text>
            <TouchableOpacity onPress={() => onSeeAllPress('Popular')}>
              <Text style={styles.seeAllText}>See all ›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
          >
            {popularMonuments.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.monumentCard}
                activeOpacity={0.9}
                onPress={() => onSelectMonument(item.id)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                <View style={styles.cardGradient} />

                {/* Top Badge */}
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>{item.categoryTag}</Text>
                </View>

                {/* Bottom Info */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardLocation}>📍 {item.city}</Text>
                  <Text style={styles.cardDesc} numberOfLines={1}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section 2: Hidden Places Carousel */}
        <View style={styles.carouselSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hidden Places</Text>
            <TouchableOpacity onPress={() => onSeeAllPress('Hidden')}>
              <Text style={styles.seeAllText}>See all ›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
          >
            {hiddenPlaces.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.monumentCard}
                activeOpacity={0.9}
                onPress={() => onSelectMonument(item.id)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                <View style={styles.cardGradient} />

                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>{item.categoryTag}</Text>
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardLocation}>📍 {item.city}</Text>
                  <Text style={styles.cardDesc} numberOfLines={1}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section 3: Cultural & Markets Carousel */}
        <View style={[styles.carouselSection, { marginBottom: 32 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cultural & Markets</Text>
            <TouchableOpacity onPress={() => onSeeAllPress('Markets')}>
              <Text style={styles.seeAllText}>See all ›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
          >
            {culturalMarkets.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.monumentCard}
                activeOpacity={0.9}
                onPress={() => onSelectMarket(item.id)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                <View style={styles.cardGradient} />

                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>{item.category}</Text>
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardLocation}>📍 {item.city}</Text>
                  <Text style={styles.cardDesc} numberOfLines={1}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Quick Companion Apps Floating Chatbot Button */}
      <TouchableOpacity
        style={styles.floatingQuickFab}
        activeOpacity={0.85}
        onPress={onNavigateToMoreApps}
        accessibilityRole="button"
        accessibilityLabel="Quick Services"
      >
        <Text style={styles.floatingChatbotIcon}>💬</Text>
        <Text style={styles.floatingQuickLabel}>Quick</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  welcomeBackText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9E2016',
    letterSpacing: 1,
  },
  greetingName: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  weatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  locationPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
  },
  weatherBullet: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  weatherPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#944A00',
  },
  cityChipsRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 2,
    gap: 8,
  },
  cityChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F4F5F7',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeCityChip: {
    backgroundColor: '#9E2016',
    borderColor: '#9E2016',
  },
  cityChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  activeCityChipText: {
    color: '#FFFFFF',
  },
  reelContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginBottom: 24,
  },
  reelImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  reelGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  reelTopBar: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveLoopPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FC8F34',
  },
  liveLoopText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  reelTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioToggleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  audioIcon: {
    fontSize: 12,
  },
  hdrPill: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  hdrText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  centerPlayButton: {
    position: 'absolute',
    top: '38%',
    left: '42%',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  playInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconText: {
    fontSize: 16,
    color: '#9E2016',
    marginLeft: 2,
  },
  reelBottomBar: {
    position: 'absolute',
    bottom: 8,
    left: 16,
    right: 16,
  },
  reelCategory: {
    color: '#FC8F34',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  reelTitle: {
    fontFamily: 'serif',
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reelDescription: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 8,
  },
  chaptersRow: {
    gap: 8,
  },
  chapterPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  activeChapterPill: {
    backgroundColor: '#9E2016',
    borderColor: '#9E2016',
  },
  chapterPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  activeChapterPillText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressBarBg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressBarFill: {
    width: '65%',
    height: '100%',
    backgroundColor: '#FC8F34',
  },
  carouselSection: {
    marginBottom: 26,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9E2016',
  },
  cardsRow: {
    paddingHorizontal: 20,
    gap: 16,
  },
  monumentCard: {
    width: 210,
    height: 270,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#EAE7E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cardBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1C1B1B',
  },
  cardInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  cardTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardLocation: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  cardDesc: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  floatingQuickFab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#9E2016',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9E2016',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 99,
  },
  floatingChatbotIcon: {
    fontSize: 20,
    lineHeight: 22,
  },
  floatingQuickLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
    marginTop: 1,
  },
});
