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
import { Header } from '../components/Header';
import { MARKETS } from '../data/mockData';
import { MarketItem } from '../types';
import { heritageService } from '../services/heritageService';

interface MarketDetailScreenProps {
  marketId: string;
  onBackPress: () => void;
}

export const MarketDetailScreen: React.FC<MarketDetailScreenProps> = ({
  marketId,
  onBackPress,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const [market, setMarket] = useState<MarketItem | undefined>(
    MARKETS.find((m) => m.id === marketId) || MARKETS[0]
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    heritageService.getMarketById(marketId).then((m) => {
      if (isMounted && m) setMarket(m);
    }).catch(() => {}).finally(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => { isMounted = false; };
  }, [marketId]);

  if (!market) {
    return (
      <View style={styles.container}>
        <Header title="Indian Heritage" showBack onBackPress={onBackPress} />
        {isLoading
          ? <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#9E2016" />
          : <Text style={{ textAlign: 'center', marginTop: 60, color: '#6B7280' }}>Market not found.</Text>
        }
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Indian Heritage"
        showBack
        onBackPress={onBackPress}
        isFavorite={isFavorite}
        onFavoritePress={() => setIsFavorite(!isFavorite)}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: market.imageUrl }} style={styles.heroImage} />
          <View style={styles.heroGradient} />

          <View style={styles.heroContent}>
            <View style={styles.tagsRow}>
              <View style={styles.tagPill}>
                <Text style={styles.tagText}>{market.city.toUpperCase()}</Text>
              </View>
              <View style={styles.tagPill}>
                <Text style={styles.tagText}>{market.category.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.marketTitle}>{market.name}</Text>
            <Text style={styles.marketSubtitle}>{market.subtitle}</Text>
          </View>
        </View>

        <View style={styles.mainBody}>
          {/* Narrative: A Dual Identity */}
          <View style={styles.storySection}>
            <Text style={styles.sectionTitle}>A Dual Identity</Text>
            <Text
              style={styles.narrativeText}
              numberOfLines={isStoryExpanded ? undefined : 6}
            >
              {market.detailedStory}
            </Text>
            <TouchableOpacity
              style={styles.readMoreBtn}
              onPress={() => setIsStoryExpanded(!isStoryExpanded)}
            >
              <Text style={styles.readMoreText}>
                {isStoryExpanded ? 'Read Less ▲' : 'Read More ▼'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Culinary Signatures */}
          <View style={styles.culinarySection}>
            <View style={styles.culinaryTitleRow}>
              <Text style={styles.culinaryForkIcon}>🍴</Text>
              <Text style={styles.sectionTitle}>Culinary Signatures</Text>
            </View>

            <View style={styles.signaturesList}>
              {market.culinarySignatures.map((item) => (
                <View key={item.id} style={styles.signatureCard}>
                  <Text style={styles.signatureTitle}>{item.title}</Text>
                  <Text style={styles.signatureDesc}>{item.description}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Food Preparation Visual Grid */}
          {market.dishImages && market.dishImages.length > 0 && (
            <View style={styles.visualGridSection}>
              <View style={styles.bigPhotoWrap}>
                <Image source={{ uri: market.dishImages[0] }} style={styles.bigPhoto} />
              </View>
              <View style={styles.smallPhotosRow}>
                {market.dishImages.slice(1, 3).map((img, i) => (
                  <View key={i} style={styles.smallPhotoWrap}>
                    <Image source={{ uri: img }} style={styles.smallPhoto} />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Plan Your Visit Card */}
          <View style={styles.planCard}>
            <Text style={styles.planCardTitle}>Plan Your Visit</Text>

            <View style={styles.planRow}>
              <Text style={styles.planIcon}>🕒</Text>
              <View style={styles.planTextGroup}>
                <Text style={styles.planLabel}>MARKET HOURS</Text>
                <Text style={styles.planValue}>{market.visitingInfo.marketHours}</Text>
                <Text style={styles.planSub}>{market.visitingInfo.setupTime}</Text>
              </View>
            </View>

            <View style={styles.planRow}>
              <Text style={styles.planIcon}>👥</Text>
              <View style={styles.planTextGroup}>
                <Text style={styles.planLabel}>PEAK CROWD</Text>
                <Text style={styles.planValue}>{market.visitingInfo.peakCrowd}</Text>
              </View>
            </View>

            <View style={styles.planRow}>
              <Text style={styles.planIcon}>🚗</Text>
              <View style={styles.planTextGroup}>
                <Text style={styles.planLabel}>GETTING THERE</Text>
                <Text style={styles.planValue}>{market.visitingInfo.gettingThere}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.openMapsBtn}>
              <Text style={styles.openMapsBtnText}>🗺️ OPEN IN MAPS</Text>
            </TouchableOpacity>
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
  heroWrap: {
    width: '100%',
    height: 320,
    position: 'relative',
    backgroundColor: '#000',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tagPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.8,
  },
  marketTitle: {
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  marketSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  mainBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  storySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  narrativeText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  readMoreBtn: {
    marginTop: 8,
  },
  readMoreText: {
    color: '#9E2016',
    fontSize: 12,
    fontWeight: '700',
  },
  culinarySection: {
    marginBottom: 24,
  },
  culinaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  culinaryForkIcon: {
    fontSize: 20,
  },
  signaturesList: {
    gap: 12,
  },
  signatureCard: {
    backgroundColor: '#F4F5F7',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  signatureTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  signatureDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  visualGridSection: {
    marginBottom: 24,
    gap: 10,
  },
  bigPhotoWrap: {
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
  },
  bigPhoto: {
    width: '100%',
    height: '100%',
  },
  smallPhotosRow: {
    flexDirection: 'row',
    gap: 10,
  },
  smallPhotoWrap: {
    flex: 1,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  smallPhoto: {
    width: '100%',
    height: '100%',
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  planCardTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  planRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 14,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  planIcon: {
    fontSize: 18,
    marginTop: 2,
  },
  planTextGroup: {
    flex: 1,
  },
  planLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.8,
  },
  planValue: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
  planSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  openMapsBtn: {
    backgroundColor: '#9E2016',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  openMapsBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
