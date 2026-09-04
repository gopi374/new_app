import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Header } from '../components/Header';
import { SideDrawer } from '../components/SideDrawer';

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

  const categories = ['All', 'Popular Places', 'Hidden Gems', 'Heritage', 'Markets', 'Culture'];

  const popularPlaces = [
    {
      id: 'rajwada-palace',
      name: 'Rajwada Palace',
      location: 'Indore, MP',
      imageUrl: 'https://images.unsplash.com/photo-1599831104321-4f10115e5743?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'taj-mahal',
      name: 'Taj Mahal Environs',
      location: 'Agra, UP',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'dashashwamedh-ghat',
      name: 'Dashashwamedh Ghat',
      location: 'Varanasi, UP',
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
    },
  ];

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
              Discover places, culture, markets and hidden gems across India.
            </Text>
          </View>

          <TouchableOpacity style={styles.searchCircleBtn} onPress={onNavigateToSearch}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
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
          onPress={() => onSelectMonument('rajwada-palace')}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1599831104321-4f10115e5743?w=800&auto=format&fit=crop&q=80',
            }}
            style={styles.featuredImage}
          />
          <View style={styles.featuredGradient} />

          <View style={styles.featuredContent}>
            <View style={styles.featuredTagPill}>
              <Text style={styles.featuredTagText}>FEATURED DESTINATION</Text>
            </View>
            <Text style={styles.featuredHeadline}>Discover Madhya Pradesh</Text>
            <Text style={styles.featuredSub}>
              The heart of India offers an unparalleled journey through time, featuring ancient temples, majestic forts, and rich cultural traditions.
            </Text>
            <View style={styles.exploreLinkRow}>
              <Text style={styles.exploreLinkText}>Explore →</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Popular Places Horizontal Cards */}
        <View style={styles.popularSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Places</Text>
            <TouchableOpacity onPress={onNavigateToSearch}>
              <Text style={styles.seeAllText}>See all ›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularCardsRow}
          >
            {popularPlaces.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.tallCard}
                activeOpacity={0.9}
                onPress={() => onSelectMonument(item.id)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.tallCardImage} />
                <View style={styles.tallCardGradient} />

                <View style={styles.tallCardInfo}>
                  <Text style={styles.tallCardLocation}>{item.location}</Text>
                  <Text style={styles.tallCardTitle}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    paddingBottom: 8,
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
  chipsRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
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
    height: 250,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
    marginBottom: 24,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
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
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  popularSection: {
    marginBottom: 32,
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
  popularCardsRow: {
    paddingHorizontal: 20,
    gap: 16,
  },
  tallCard: {
    width: 200,
    height: 280,
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
    backgroundColor: 'rgba(0,0,0,0.4)',
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
    color: 'rgba(255, 255, 255, 0.85)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  tallCardTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
});
