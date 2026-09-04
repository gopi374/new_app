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
import { MONUMENTS } from '../data/mockData';

interface MonumentDetailScreenProps {
  monumentId: string;
  onBackPress: () => void;
  isVisited?: boolean;
  onToggleVisited?: () => void;
  onNavigateToPassport?: () => void;
}

export const MonumentDetailScreen: React.FC<MonumentDetailScreenProps> = ({
  monumentId,
  onBackPress,
  isVisited = false,
  onToggleVisited,
  onNavigateToPassport,
}) => {
  const [isFavorite, setIsFavorite] = useState(true);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('Video');
  const [stampFeedback, setStampFeedback] = useState<string | null>(null);

  const monument = MONUMENTS.find((m) => m.id === monumentId) || MONUMENTS[0];

  const handleVisitedPress = () => {
    if (onToggleVisited) {
      onToggleVisited();
    }
    const nextState = !isVisited;
    if (nextState) {
      setStampFeedback(`🏛️ Passport Stamped! Official seal for ${monument.name} added to your Digital Passport.`);
    } else {
      setStampFeedback(`Stamp removed from your Digital Passport.`);
    }
    setTimeout(() => {
      setStampFeedback(null);
    }, 4000);
  };

  const quickTabs = ['Video', 'History', 'Weather', 'About', 'Website', 'Direction'];

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
          <Image source={{ uri: monument.imageUrl }} style={styles.heroImage} />
          <View style={styles.heroGradient} />
        </View>

        <View style={styles.mainBody}>
          {/* Tags */}
          <View style={styles.tagsRow}>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>{monument.category.toUpperCase()}</Text>
            </View>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>{monument.categoryTag.toUpperCase()}</Text>
            </View>
          </View>

          {/* Title & Location */}
          <Text style={styles.monumentTitle}>{monument.name}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locPin}>📍</Text>
            <Text style={styles.locText}>
              {monument.city}, {monument.state}
            </Text>
          </View>

          {/* User Visited / Digital Passport Stamping Bar */}
          <View
            style={[
              styles.visitedStampBanner,
              isVisited ? styles.visitedStampBannerActive : styles.visitedStampBannerInactive,
            ]}
          >
            <View style={styles.visitedBannerContent}>
              <View
                style={[
                  styles.visitedStampIconCircle,
                  isVisited ? styles.stampIconCircleActive : styles.stampIconCircleInactive,
                ]}
              >
                <Text style={styles.visitedStampSymbol}>
                  {isVisited ? '✓' : '🔏'}
                </Text>
              </View>
              <View style={styles.visitedBannerTextCol}>
                <Text
                  style={[
                    styles.visitedBannerHeading,
                    isVisited ? styles.textVisitedActive : styles.textVisitedInactive,
                  ]}
                >
                  {isVisited ? 'VISITED • PASSPORT STAMPED' : 'VISITED THIS PLACE?'}
                </Text>
                <Text style={styles.visitedBannerSubtitle}>
                  {isVisited
                    ? 'Virtual ASI stamp recorded on your profile'
                    : 'Tap to stamp your Digital Passport & earn badge'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.visitedActionBtn,
                isVisited ? styles.visitedActionBtnActive : styles.visitedActionBtnInactive,
              ]}
              onPress={handleVisitedPress}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.visitedActionBtnText,
                  isVisited && styles.visitedActionBtnTextActive,
                ]}
              >
                {isVisited ? 'Visited ✓' : 'Stamp Place'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Floating Toast Notification on Stamp Action */}
          {stampFeedback && (
            <View style={styles.stampToast}>
              <Text style={styles.stampToastText}>{stampFeedback}</Text>
            </View>
          )}

          {/* Quick Action Scrollable Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickTabsRow}
          >
            {quickTabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.quickTab, isActive && styles.activeQuickTab]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.quickTabText, isActive && styles.activeQuickTabText]}>
                    {tab === 'Video' ? '▶ ' : tab === 'History' ? '📜 ' : tab === 'Weather' ? '☀️ ' : tab === 'Direction' ? '🧭 ' : ''}
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* The Story Section */}
          <View style={styles.storySection}>
            <Text style={styles.sectionTitle}>The Story</Text>
            <Text
              style={styles.storyText}
              numberOfLines={isStoryExpanded ? undefined : 4}
            >
              {monument.detailedStory}
            </Text>
            <TouchableOpacity
              style={styles.discoverMoreBtn}
              onPress={() => setIsStoryExpanded(!isStoryExpanded)}
            >
              <Text style={styles.discoverMoreText}>
                {isStoryExpanded ? 'Show Less ▲' : 'Discover More ▼'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Key Highlights Grid */}
          {monument.highlights && monument.highlights.length > 0 && (
            <View style={styles.highlightsSection}>
              <Text style={styles.sectionTitle}>Key Highlights</Text>
              <View style={styles.highlightsGrid}>
                {monument.highlights.map((h) => (
                  <View key={h.id} style={styles.highlightCard}>
                    <Text style={styles.highlightIcon}>
                      {h.iconName === 'account-balance'
                        ? '🏛️'
                        : h.iconName === 'park'
                        ? '🌳'
                        : h.iconName === 'wb-twilight'
                        ? '🌆'
                        : '🏺'}
                    </Text>
                    <Text style={styles.highlightTitle}>{h.title}</Text>
                    <Text style={styles.highlightDesc}>{h.description}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Visiting Info Card */}
          <View style={styles.visitingCard}>
            <Text style={styles.visitingCardTitle}>Visiting Info</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🕒</Text>
              <View>
                <Text style={styles.infoLabel}>Opening Hours</Text>
                <Text style={styles.infoValue}>
                  {monument.visitingInfo.openingHours}
                </Text>
                <Text style={styles.infoSub}>
                  {monument.visitingInfo.closedDays}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>💳</Text>
              <View>
                <Text style={styles.infoLabel}>Entry Fee</Text>
                <Text style={styles.infoValue}>
                  {monument.visitingInfo.entryFeeIndian}
                </Text>
                <Text style={styles.infoSub}>
                  {monument.visitingInfo.entryFeeForeigner}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <View>
                <Text style={styles.infoLabel}>Best Time to Visit</Text>
                <Text style={styles.infoValue}>
                  {monument.visitingInfo.bestTimeToVisit}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.stampCardBtn,
                isVisited ? styles.stampCardBtnActive : styles.stampCardBtnInactive,
              ]}
              onPress={handleVisitedPress}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.stampCardBtnText,
                  isVisited ? styles.stampCardBtnTextActive : styles.stampCardBtnTextInactive,
                ]}
              >
                {isVisited
                  ? '✓ Visited • Inked In Digital Passport'
                  : '🔏 Visited This Place? Stamp Passport'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.directionsBigBtn}>
              <Text style={styles.directionsBigBtnText}>🧭 Get Directions</Text>
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
    height: 220,
    position: 'relative',
    backgroundColor: '#000',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mainBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tagPill: {
    backgroundColor: '#F4F5F7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.8,
  },
  monumentTitle: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  locPin: {
    fontSize: 14,
  },
  locText: {
    fontSize: 13,
    color: '#4B5563',
  },
  quickTabsRow: {
    gap: 8,
    paddingVertical: 4,
    marginBottom: 20,
  },
  quickTab: {
    backgroundColor: '#F4F5F7',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  activeQuickTab: {
    backgroundColor: '#9E2016',
    borderColor: '#9E2016',
  },
  quickTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  activeQuickTabText: {
    color: '#FFFFFF',
  },
  storySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 4,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  storyText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  discoverMoreBtn: {
    marginTop: 8,
  },
  discoverMoreText: {
    color: '#9E2016',
    fontSize: 12,
    fontWeight: '700',
  },
  highlightsSection: {
    marginBottom: 24,
  },
  highlightsGrid: {
    gap: 12,
    marginTop: 6,
  },
  highlightCard: {
    backgroundColor: '#F4F5F7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  highlightIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  highlightDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
  },
  visitingCard: {
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
  visitingCardTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoIcon: {
    fontSize: 18,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  infoValue: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 1,
  },
  infoSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  directionsBigBtn: {
    backgroundColor: '#9E2016',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  directionsBigBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  visitedStampBanner: {
    marginTop: 14,
    marginBottom: 16,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
  },
  visitedStampBannerActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#9E2016',
  },
  visitedStampBannerInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  visitedBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  visitedStampIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampIconCircleActive: {
    backgroundColor: '#9E2016',
  },
  stampIconCircleInactive: {
    backgroundColor: '#E2E8F0',
  },
  visitedStampSymbol: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  visitedBannerTextCol: {
    flex: 1,
  },
  visitedBannerHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textVisitedActive: {
    color: '#9E2016',
  },
  textVisitedInactive: {
    color: '#475569',
  },
  visitedBannerSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  visitedActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  visitedActionBtnActive: {
    backgroundColor: '#9E2016',
  },
  visitedActionBtnInactive: {
    backgroundColor: '#0F172A',
  },
  visitedActionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  visitedActionBtnTextActive: {
    color: '#FFFFFF',
  },
  stampToast: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  stampToastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  stampCardBtn: {
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1.5,
  },
  stampCardBtnActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#9E2016',
  },
  stampCardBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#9E2016',
  },
  stampCardBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  stampCardBtnTextActive: {
    color: '#9E2016',
  },
  stampCardBtnTextInactive: {
    color: '#9E2016',
  },
});
