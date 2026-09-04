import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Header } from '../components/Header';
import { SideDrawer } from '../components/SideDrawer';
import { Monument, MarketItem, CityItem } from '../types';
import { heritageService } from '../services/heritageService';

interface ExploreScreenProps {
  onSelectMonument: (monumentId: string) => void;
  onNavigateToSearch: () => void;
  onNavigateToMoreApps?: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onSelectMonument,
  onNavigateToSearch,
  onNavigateToMoreApps,
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [loading, setLoading] = useState(true);
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);

  const categories = ['All', 'Popular Places', 'Hidden Gems', 'Heritage', 'Temples', 'Nature', 'Markets'];

  useEffect(() => {
    let isMounted = true;
    async function loadExploreData() {
      try {
        setLoading(true);
        const [mons, mkts, cts] = await Promise.all([
          heritageService.getMonuments(),
          heritageService.getMarkets(),
          heritageService.getCities(),
        ]);
        if (isMounted) {
          if (mons && mons.length > 0) setMonuments(mons);
          if (mkts && mkts.length > 0) setMarkets(mkts);
          if (cts && cts.length > 0) {
            setCities(cts);
            // Auto-select city from GPS
            try {
              const { status } = await Location.requestForegroundPermissionsAsync();
              if (status === 'granted') {
                const position = await Location.getCurrentPositionAsync({
                  accuracy: Location.Accuracy.Balanced,
                });
                const [address] = await Location.reverseGeocodeAsync({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
                const rawCity = address?.city || address?.subregion || address?.district || '';
                const rawLower = rawCity.toLowerCase();
                const matched = cts.find(
                  (c) =>
                    rawLower.includes(c.name.toLowerCase()) ||
                    c.name.toLowerCase().includes(rawLower)
                );
                if (isMounted && matched) setSelectedCity(matched.name);
              }
            } catch {
              // GPS not available, keep 'All'
            }
          }
        }
      } catch (e) {
        // Fallback already handled inside heritageService
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadExploreData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter places based on selected city and category
  const filteredPlaces = monuments.filter((item) => {
    const matchesCity =
      selectedCity === 'All' ||
      item.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
      selectedCity.toLowerCase().includes(item.city.toLowerCase());

    if (!matchesCity) return false;

    if (activeCategory === 'All' || activeCategory === 'Popular Places') return true;
    if (activeCategory === 'Hidden Gems') {
      return (
        item.category.toLowerCase().includes('hidden') ||
        item.categoryTag.toLowerCase().includes('hidden') ||
        item.category.toLowerCase().includes('nature')
      );
    }
    if (activeCategory === 'Temples') {
      return (
        item.category.toLowerCase().includes('religio') ||
        item.category.toLowerCase().includes('temple') ||
        item.name.toLowerCase().includes('mandir') ||
        item.name.toLowerCase().includes('temple') ||
        item.name.toLowerCase().includes('jyotirlinga')
      );
    }
    if (activeCategory === 'Nature') {
      return (
        item.category.toLowerCase().includes('natur') ||
        item.categoryTag.toLowerCase().includes('natur') ||
        item.name.toLowerCase().includes('falls') ||
        item.name.toLowerCase().includes('rocks')
      );
    }
    if (activeCategory === 'Heritage') {
      return (
        item.category.toLowerCase().includes('heritage') ||
        item.category.toLowerCase().includes('palace') ||
        item.category.toLowerCase().includes('fort')
      );
    }
    return true;
  });

  const displayMarkets = markets.filter((m) => {
    return (
      selectedCity === 'All' ||
      m.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
      selectedCity.toLowerCase().includes(m.city.toLowerCase())
    );
  });

  const cityTabs = ['All', ...(cities.length > 0 ? cities.map((c) => c.name) : [
    'Indore', 'Ujjain', 'Bhopal', 'Jabalpur', 'Omkareshwar', 'Maheshwar', 'Dewas', 'Ratlam', 'Sehore'
  ])];

  return (
    <View style={styles.container}>
      <Header
        title="Indian Heritage"
        onMenuPress={() => setDrawerVisible(true)}
      />

      <SideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onNavigateToMoreApps={onNavigateToMoreApps}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.titleTextWrap}>
            <Text style={styles.exploreTitle}>Explore India</Text>
            <Text style={styles.exploreSub}>
              Discover {monuments.length > 0 ? `${monuments.length}+` : '60+'} places, culture, markets and hidden gems across India.
            </Text>
          </View>

          <TouchableOpacity style={styles.searchCircleBtn} onPress={onNavigateToSearch}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* City Filter Chips */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>CITIES & REGIONS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cityChipsRow}
          >
            {cityTabs.map((ct) => {
              const isActive = selectedCity === ct;
              return (
                <TouchableOpacity
                  key={ct}
                  style={[styles.cityChip, isActive && styles.activeCityChip]}
                  onPress={() => setSelectedCity(ct)}
                >
                  <Text style={[styles.cityChipText, isActive && styles.activeCityChipText]}>
                    {ct === 'All' ? '🌐 All Cities' : `📍 ${ct}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Category Chips Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, isActive && styles.activeChip]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Destination Banner */}
        <TouchableOpacity
          style={styles.featuredBanner}
          activeOpacity={0.9}
          onPress={() => onSelectMonument(monuments[0]?.id || 'rajwada-palace')}
        >
          <Image
            source={{
              uri: monuments[0]?.imageUrl || 'https://images.unsplash.com/photo-1599831104321-4f10115e5743?w=800',
            }}
            style={styles.featuredImage}
          />
          <View style={styles.featuredGradient} />

          <View style={styles.featuredContent}>
            <View style={styles.featuredTagPill}>
              <Text style={styles.featuredTagText}>FEATURED DESTINATION</Text>
            </View>
            <Text style={styles.featuredHeadline}>
              {selectedCity === 'All' ? 'Discover Madhya Pradesh' : `Explore ${selectedCity}`}
            </Text>
            <Text style={styles.featuredSub}>
              {selectedCity === 'All'
                ? 'The heart of India offers an unparalleled journey through time, featuring sacred river ghats, ancient Jyotirlingas, majestic forts, and rich living crafts.'
                : `Discover the monumental architecture, sacred traditions, and vibrant cultural markets of ${selectedCity}.`}
            </Text>
            <View style={styles.exploreLinkRow}>
              <Text style={styles.exploreLinkText}>Explore 60+ Monuments →</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9E2016" />
            <Text style={styles.loadingText}>Loading cultural sites from database...</Text>
          </View>
        )}

        {/* Popular / Filtered Places Horizontal Cards */}
        {activeCategory !== 'Markets' && (
          <View style={styles.popularSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedCity === 'All' ? 'Popular Cultural Sites' : `${selectedCity} Cultural Heritage`}
              </Text>
              <TouchableOpacity onPress={onNavigateToSearch}>
                <Text style={styles.seeAllText}>See all ({filteredPlaces.length}) ›</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularCardsRow}
            >
              {filteredPlaces.slice(0, 10).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.tallCard}
                  activeOpacity={0.9}
                  onPress={() => onSelectMonument(item.id)}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.tallCardImage} />
                  <View style={styles.tallCardGradient} />

                  <View style={styles.tallCardInfo}>
                    <Text style={styles.tallCardLocation}>📍 {item.city}</Text>
                    <Text style={styles.tallCardTitle} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.tallCardCategory} numberOfLines={1}>
                      {item.categoryTag || item.category}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Cultural Markets Section */}
        {(activeCategory === 'All' || activeCategory === 'Markets') && displayMarkets.length > 0 && (
          <View style={styles.popularSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedCity === 'All' ? 'Traditional Bazaars & Night Markets' : `${selectedCity} Markets`}
              </Text>
              <Text style={styles.countText}>{displayMarkets.length} Bazaars</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularCardsRow}
            >
              {displayMarkets.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={styles.tallCard}
                  activeOpacity={0.9}
                  onPress={() => onSelectMonument(m.id)}
                >
                  <Image source={{ uri: m.imageUrl }} style={styles.tallCardImage} />
                  <View style={styles.tallCardGradient} />

                  <View style={styles.tallCardInfo}>
                    <Text style={styles.tallCardLocation}>🛍️ {m.city}</Text>
                    <Text style={styles.tallCardTitle} numberOfLines={2}>
                      {m.name}
                    </Text>
                    <Text style={styles.tallCardCategory} numberOfLines={1}>
                      {m.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Destinations Grid / Vertical Cards */}
        <View style={styles.gridSection}>
          <Text style={styles.sectionTitle}>All Heritage Destinations</Text>
          <Text style={styles.gridSubtitle}>
            Showing {filteredPlaces.length} monuments across {selectedCity === 'All' ? 'all cities' : selectedCity}
          </Text>

          <View style={styles.gridContainer}>
            {filteredPlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                style={styles.gridCard}
                activeOpacity={0.88}
                onPress={() => onSelectMonument(place.id)}
              >
                <Image source={{ uri: place.imageUrl }} style={styles.gridCardImage} />
                <View style={styles.gridCardContent}>
                  <View style={styles.badgeRow}>
                    <Text style={styles.cityBadgeText}>📍 {place.city}</Text>
                    <Text style={styles.ratingText}>★ {place.rating || 4.8}</Text>
                  </View>
                  <Text style={styles.gridCardTitle} numberOfLines={1}>
                    {place.name}
                  </Text>
                  <Text style={styles.gridCardDesc} numberOfLines={2}>
                    {place.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  titleTextWrap: {
    flex: 1,
    paddingRight: 16,
  },
  exploreTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
    color: '#9E2016',
  },
  exploreSub: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 18,
  },
  searchCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 16,
  },
  filterSection: {
    paddingTop: 8,
  },
  filterLabel: {
    paddingHorizontal: 20,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#6B7280',
    marginBottom: 6,
  },
  cityChipsRow: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 8,
  },
  cityChip: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeCityChip: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  cityChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  activeCityChipText: {
    color: '#FFFFFF',
  },
  chipsRow: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    backgroundColor: '#F4F5F7',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeChip: {
    backgroundColor: '#9E2016',
    borderColor: '#9E2016',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  featuredBanner: {
    marginHorizontal: 20,
    height: 230,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
    marginTop: 8,
    marginBottom: 24,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  featuredTagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  featuredTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  featuredHeadline: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featuredSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 16,
    marginBottom: 8,
  },
  exploreLinkRow: {
    alignSelf: 'flex-start',
  },
  exploreLinkText: {
    color: '#FDE047',
    fontSize: 13,
    fontWeight: '700',
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
  },
  popularSection: {
    marginBottom: 28,
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
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  popularCardsRow: {
    paddingHorizontal: 20,
    gap: 14,
  },
  tallCard: {
    width: 200,
    height: 270,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#EAE7E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  tallCardImage: {
    width: '100%',
    height: '100%',
  },
  tallCardGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  tallCardInfo: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
  },
  tallCardLocation: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FDE047',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  tallCardTitle: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  tallCardCategory: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  gridSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  gridSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 16,
  },
  gridContainer: {
    gap: 14,
  },
  gridCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gridCardImage: {
    width: 110,
    height: 100,
    backgroundColor: '#F3F4F6',
  },
  gridCardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9E2016',
    textTransform: 'uppercase',
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  gridCardTitle: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  gridCardDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 3,
    lineHeight: 15,
  },
});
