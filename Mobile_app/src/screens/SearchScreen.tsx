import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Header } from '../components/Header';
import { SideDrawer } from '../components/SideDrawer';
import { MONUMENTS } from '../data/mockData';
import { Monument } from '../types';
import { heritageService } from '../services/heritageService';

interface SearchScreenProps {
  onSelectMonument: (monumentId: string) => void;
  onNavigateToMoreApps?: () => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onSelectMonument,
  onNavigateToMoreApps,
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [results, setResults] = useState<Monument[]>(MONUMENTS.slice(0, 8));
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({
    'rajwada-palace': true,
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = ['Popular', 'Hidden', 'market', 'Ashram', 'Restaurant', 'Artisan'];

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await heritageService.searchPlaces(searchQuery, selectedCategory);
        setResults(data);
      } catch {
        // fallback already in heritageService
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, selectedCategory]);

  const filteredMonuments = results;

  const toggleFav = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    heritageService.toggleFavorite(id).catch(() => {});
  };

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
        {/* Search Bar Input */}
        <View style={styles.searchBarWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search places, cities, markets..."
            placeholderTextColor="#8D706C"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Category Chips Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, isActive && styles.activeChip]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {selectedCategory === 'Popular' ? 'Popular Places' : `${selectedCategory} Places`}
          </Text>
          <Text style={styles.resultsCount}>{filteredMonuments.length} place{filteredMonuments.length !== 1 ? 's' : ''}</Text>
        </View>

        {/* List of Result Cards */}
        <View style={styles.listContainer}>
          {filteredMonuments.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.resultCard}
              activeOpacity={0.9}
              onPress={() => onSelectMonument(item.id)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.cardThumb} />

              <View style={styles.cardBody}>
                <TouchableOpacity
                  style={styles.favIconBtn}
                  onPress={() => toggleFav(item.id)}
                >
                  <Text style={[styles.favIcon, favorites[item.id] && styles.favActive]}>
                    {favorites[item.id] ? '♥' : '♡'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.badgeWrap}>
                  <Text style={styles.badgeLabel}>{item.categoryTag}</Text>
                </View>

                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.name}
                </Text>

                <Text style={styles.locationText}>
                  📍 {item.city}, {item.state}
                </Text>

                <Text style={styles.itemDesc} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
    paddingTop: 12,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    marginHorizontal: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#4B5563',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  filterBtn: {
    padding: 6,
  },
  filterIcon: {
    fontSize: 16,
  },
  chipsRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F4F5F7',
  },
  activeChip: {
    backgroundColor: '#9E2016',
  },
  chipText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  resultsCount: {
    fontSize: 13,
    color: '#4B5563',
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 32,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    height: 136,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardThumb: {
    width: 124,
    height: '100%',
  },
  cardBody: {
    flex: 1,
    padding: 12,
    position: 'relative',
    justifyContent: 'space-between',
  },
  favIconBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  favIcon: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  favActive: {
    color: '#BA1A1A',
  },
  badgeWrap: {
    backgroundColor: '#F4F5F7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.6,
  },
  itemTitle: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    paddingRight: 20,
  },
  locationText: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 2,
  },
  itemDesc: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 15,
    marginTop: 4,
  },
});
