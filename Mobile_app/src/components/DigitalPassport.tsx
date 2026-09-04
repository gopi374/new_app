import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import { MONUMENTS, USER_PROFILE } from '../data/mockData';
import { Monument, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';

interface DigitalPassportProps {
  visitedPlaceIds: string[];
  onSelectPlace?: (placeId: string) => void;
  onToggleVisit?: (placeId: string) => Promise<void>;
  userProfile?: UserProfile;
}

// Color palette for stamps inspired by authentic ink colors
const STAMP_COLORS = [
  { ink: '#9E2016', bg: '#FDF2F2', border: '#DC2626', name: 'Terracotta Red' },
  { ink: '#1E3A8A', bg: '#EFF6FF', border: '#2563EB', name: 'Imperial Navy' },
  { ink: '#065F46', bg: '#ECFDF5', border: '#059669', name: 'Forest Emerald' },
  { ink: '#92400E', bg: '#FFFBEB', border: '#D97706', name: 'Heritage Ochre' },
  { ink: '#581C87', bg: '#FAF5FF', border: '#7C3AED', name: 'Royal Amethyst' },
];

export const DigitalPassport: React.FC<DigitalPassportProps> = ({
  visitedPlaceIds,
  onSelectPlace,
  onToggleVisit,
  userProfile,
}) => {
  const { user } = useAuth();
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'visited' | 'unvisited'>('all');

  const displayName = userProfile?.name || user?.full_name || 'Explorer';
  const displayAvatar = userProfile?.avatarUrl || USER_PROFILE.avatarUrl;
  const displayPassportNo =
    userProfile?.explorerId ||
    (user
      ? `IH-${(user.full_name || 'IND').toUpperCase().replace(/\s+/g, '').slice(0, 8)}-${(user.id || '2026').slice(-4)}`
      : 'IH-IND-2026-9842');

  const visitedMonuments = MONUMENTS.filter((m) => visitedPlaceIds.includes(m.id));
  const unvisitedMonuments = MONUMENTS.filter((m) => !visitedPlaceIds.includes(m.id));
  const totalCount = MONUMENTS.length;
  const visitedCount = visitedMonuments.length;
  const progressPercent = Math.round((visitedCount / totalCount) * 100);

  const getRank = (count: number) => {
    if (count >= 6) return 'Grand Heritage Laureate 🏆';
    if (count >= 4) return 'Master Chronicler 📜';
    if (count >= 2) return 'Senior Explorer 🧭';
    if (count >= 1) return 'Heritage Pioneer 🏛️';
    return 'Aspiring Traveler 🎒';
  };

  const displayedList =
    activeFilter === 'visited'
      ? visitedMonuments
      : activeFilter === 'unvisited'
      ? unvisitedMonuments
      : MONUMENTS;

  return (
    <View style={styles.container}>
      {/* 1. Authentic Heritage Passport Book Card */}
      <View style={styles.passportBook}>
        {/* Gold Border Ornament */}
        <View style={styles.goldBorderInner}>
          {/* Passport Header */}
          <View style={styles.passportHeader}>
            <View style={styles.emblemWrapper}>
              <Text style={styles.emblemIcon}>🏛️</Text>
            </View>
            <View style={styles.headerTitles}>
              <Text style={styles.govRepublic}>REPUBLIC OF INDIA • BHARAT</Text>
              <Text style={styles.passportMainTitle}>DIGITAL HERITAGE PASSPORT</Text>
              <Text style={styles.archaeologicalGuild}>
                ARCHAEOLOGICAL SURVEY & EXPLORER GUILD
              </Text>
            </View>
          </View>

          {/* Golden Separator */}
          <View style={styles.goldDivider} />

          {/* User Passport Identity Block */}
          <View style={styles.holderBlock}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: displayAvatar }}
                style={styles.holderPhoto}
              />
              <View style={styles.photoVerifiedBadge}>
                <Text style={styles.photoVerifiedCheck}>✓</Text>
              </View>
            </View>

            <View style={styles.holderMeta}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>PASSPORT NO.</Text>
                <Text style={styles.metaValueHighlight}>{displayPassportNo}</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>BEARER / HOLDER</Text>
                <Text style={styles.metaValue}>{displayName.toUpperCase()}</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>NATIONALITY</Text>
                <Text style={styles.metaValue}>INDIAN (IND)</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>EXPLORER RANK</Text>
                <Text style={styles.rankValue}>{userProfile?.level || getRank(visitedCount)}</Text>
              </View>
            </View>
          </View>

          {/* Passport Progress Meter */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressLabel}>
                STAMP COLLECTION PROGRESS ({visitedCount}/{totalCount})
              </Text>
              <Text style={styles.progressPercentage}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.max(8, progressPercent)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressSubtext}>
              {visitedCount === 0
                ? 'Visit place profiles and tap "Visited" to collect your first stamp!'
                : `${visitedCount} heritage stamps permanently inked into your official passport.`}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Stamp Filters */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'all' && styles.filterChipTextActive,
            ]}
          >
            All Sites ({totalCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'visited' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('visited')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'visited' && styles.filterChipTextActive,
            ]}
          >
            Collected Stamps ({visitedCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'unvisited' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('unvisited')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'unvisited' && styles.filterChipTextActive,
            ]}
          >
            Unexplored ({unvisitedMonuments.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. Virtual Stamps Grid */}
      <View style={styles.stampsGrid}>
        {displayedList.map((monument, index) => {
          const isVisited = visitedPlaceIds.includes(monument.id);
          const colorTheme = STAMP_COLORS[index % STAMP_COLORS.length];
          // Slight rotational angle for realistic physical ink stamp impression
          const rotations = ['-2.5deg', '1.8deg', '-1.2deg', '2.2deg', '-3deg', '1.5deg'];
          const rotation = rotations[index % rotations.length];

          if (isVisited) {
            return (
              <TouchableOpacity
                key={monument.id}
                style={[
                  styles.stampCard,
                  {
                    borderColor: colorTheme.border,
                    backgroundColor: colorTheme.bg,
                    transform: [{ rotate: rotation }],
                  },
                ]}
                activeOpacity={0.85}
                onPress={() => setSelectedMonument(monument)}
              >
                {/* Vintage Ink Stamp Ring */}
                <View
                  style={[styles.stampInnerRing, { borderColor: colorTheme.ink }]}
                >
                  {/* Top Seal Arc Text */}
                  <Text style={[styles.stampArcTop, { color: colorTheme.ink }]}>
                    ★ ASI HERITAGE ENTRY ★
                  </Text>

                  {/* Stamp Center Icon / Silhouette */}
                  <View
                    style={[
                      styles.stampIconCircle,
                      { backgroundColor: colorTheme.ink },
                    ]}
                  >
                    <Text style={styles.stampCenterEmoji}>
                      {monument.category.toLowerCase().includes('temple')
                        ? '🛕'
                        : monument.category.toLowerCase().includes('fort')
                        ? '🏰'
                        : '🏛️'}
                    </Text>
                  </View>

                  {/* Monument Title */}
                  <Text
                    style={[styles.stampPlaceName, { color: colorTheme.ink }]}
                    numberOfLines={2}
                  >
                    {monument.name.toUpperCase()}
                  </Text>

                  {/* Location & Date */}
                  <Text style={[styles.stampLocation, { color: colorTheme.ink }]}>
                    {monument.city.toUpperCase()}, {monument.state.toUpperCase()}
                  </Text>

                  {/* Official Ink Date */}
                  <View
                    style={[
                      styles.stampDateBadge,
                      { borderColor: colorTheme.ink },
                    ]}
                  >
                    <Text style={[styles.stampDateText, { color: colorTheme.ink }]}>
                      VISITED • VERIFIED
                    </Text>
                  </View>
                </View>

                {/* Stamped Ribbon */}
                <View
                  style={[styles.stampedPill, { backgroundColor: colorTheme.ink }]}
                >
                  <Text style={styles.stampedPillText}>COLLECTED ✓</Text>
                </View>
              </TouchableOpacity>
            );
          } else {
            // Unvisited / Locked Stamp Slot
            return (
              <TouchableOpacity
                key={monument.id}
                style={styles.unvisitedSlot}
                activeOpacity={0.8}
                onPress={() => onSelectPlace && onSelectPlace(monument.id)}
              >
                <View style={styles.unvisitedDashedRing}>
                  <Text style={styles.unvisitedLockIcon}>🔒</Text>
                  <Text style={styles.unvisitedTitle} numberOfLines={2}>
                    {monument.name}
                  </Text>
                  <Text style={styles.unvisitedLocation}>
                    {monument.city}, {monument.state}
                  </Text>
                  <View style={styles.stampActionPill}>
                    <Text style={styles.stampActionPillText}>+ Stamp Place</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }
        })}
      </View>

      {/* 4. Interactive Stamp Detail Modal */}
      <Modal
        visible={!!selectedMonument}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMonument(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedMonument && (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeaderRow}>
                  <View style={styles.modalBadgeHeader}>
                    <Text style={styles.modalBadgeText}>OFFICIAL STAMP CERTIFICATE</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedMonument(null)}
                  >
                    <Text style={styles.modalCloseBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Monument Image Preview */}
                <Image
                  source={{ uri: selectedMonument.imageUrl }}
                  style={styles.modalMonumentImg}
                />

                {/* Large Stamp Showcase */}
                <View style={styles.modalStampShowcase}>
                  <View style={styles.modalStampCircle}>
                    <Text style={styles.modalStampEmoji}>🏛️</Text>
                    <Text style={styles.modalStampName}>
                      {selectedMonument.name.toUpperCase()}
                    </Text>
                    <Text style={styles.modalStampCity}>
                      {selectedMonument.city}, {selectedMonument.state}
                    </Text>
                    <Text style={styles.modalStampVerified}>
                      ✓ CERTIFIED HERITAGE EXPLORATION
                    </Text>
                  </View>
                </View>

                {/* Story Snippet */}
                <Text style={styles.modalStorySnippet} numberOfLines={3}>
                  {selectedMonument.description}
                </Text>

                {/* Meta details */}
                <View style={styles.modalMetaBox}>
                  <View style={styles.modalMetaItem}>
                    <Text style={styles.modalMetaLabel}>SERIAL CODE</Text>
                    <Text style={styles.modalMetaValue}>
                      IH-STAMP-{selectedMonument.id.substring(0, 5).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.modalMetaItem}>
                    <Text style={styles.modalMetaLabel}>CATEGORY</Text>
                    <Text style={styles.modalMetaValue}>
                      {selectedMonument.category}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActionsRow}>
                  <TouchableOpacity
                    style={styles.modalViewProfileBtn}
                    onPress={() => {
                      const placeId = selectedMonument.id;
                      setSelectedMonument(null);
                      if (onSelectPlace) {
                        onSelectPlace(placeId);
                      }
                    }}
                  >
                    <Text style={styles.modalViewProfileBtnText}>
                      Open Place Profile ↗
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  passportBook: {
    backgroundColor: '#1E293B', // Deep obsidian navy passport tone
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#D4AF37', // Gold foil border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20,
  },
  goldBorderInner: {
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderRadius: 14,
    padding: 14,
  },
  passportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emblemWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemIcon: {
    fontSize: 22,
  },
  headerTitles: {
    flex: 1,
  },
  govRepublic: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D4AF37',
    letterSpacing: 1.2,
  },
  passportMainTitle: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  archaeologicalGuild: {
    fontSize: 8,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginTop: 1,
  },
  goldDivider: {
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    marginVertical: 14,
  },
  holderBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    position: 'relative',
  },
  holderPhoto: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#D4AF37',
    backgroundColor: '#334155',
  },
  photoVerifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1E293B',
  },
  photoVerifiedCheck: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  holderMeta: {
    flex: 1,
    gap: 3,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  metaValueHighlight: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
    fontFamily: 'monospace',
  },
  rankValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  progressContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#CBD5E1',
    letterSpacing: 0.5,
  },
  progressPercentage: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D4AF37',
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 6,
    fontStyle: 'italic',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#9E2016',
    borderColor: '#9E2016',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stampsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  stampCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 2,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  stampInnerRing: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  stampArcTop: {
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  stampIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  stampCenterEmoji: {
    fontSize: 22,
  },
  stampPlaceName: {
    fontFamily: 'serif',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
  },
  stampLocation: {
    fontSize: 8.5,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.4,
  },
  stampDateBadge: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginTop: 6,
  },
  stampDateText: {
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  stampedPill: {
    position: 'absolute',
    top: -8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  stampedPillText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  unvisitedSlot: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  unvisitedDashedRing: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  unvisitedLockIcon: {
    fontSize: 24,
    opacity: 0.5,
    marginBottom: 6,
  },
  unvisitedTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  unvisitedLocation: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
  },
  stampActionPill: {
    marginTop: 10,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stampActionPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalBadgeHeader: {
    backgroundColor: '#FEF2F2',
    borderColor: '#9E2016',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalBadgeText: {
    color: '#9E2016',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  modalCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  modalMonumentImg: {
    width: '100%',
    height: 140,
    borderRadius: 14,
    marginBottom: 14,
  },
  modalStampShowcase: {
    alignItems: 'center',
    marginVertical: 6,
  },
  modalStampCircle: {
    borderWidth: 2,
    borderColor: '#9E2016',
    borderRadius: 16,
    borderStyle: 'dashed',
    padding: 12,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFF5F5',
  },
  modalStampEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  modalStampName: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '800',
    color: '#9E2016',
    textAlign: 'center',
  },
  modalStampCity: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A0E0B',
    marginTop: 2,
  },
  modalStampVerified: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  modalStorySnippet: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  modalMetaBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  modalMetaItem: {
    alignItems: 'center',
  },
  modalMetaLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#64748B',
  },
  modalMetaValue: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  modalActionsRow: {
    width: '100%',
  },
  modalViewProfileBtn: {
    backgroundColor: '#9E2016',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalViewProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
