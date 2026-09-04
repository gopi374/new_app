import React, { useState, useEffect } from 'react';
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
import { USER_PROFILE, BADGES, MONUMENTS } from '../data/mockData';
import { DigitalPassport } from '../components/DigitalPassport';
import { UserProfile } from '../types';
import { heritageService } from '../services/heritageService';
import { useAuth } from '../context/AuthContext';

interface PassportScreenProps {
  onNavigateToMoreApps: () => void;
  visitedPlaceIds?: string[];
  onSelectPlace?: (placeId: string) => void;
}

export const PassportScreen: React.FC<PassportScreenProps> = ({
  onNavigateToMoreApps,
  visitedPlaceIds = [],
  onSelectPlace,
}) => {
  const { user } = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    ...USER_PROFILE,
    name: user?.full_name || USER_PROFILE.name,
    explorerId: user ? `IH-${(user.full_name || 'IND').toUpperCase().replace(/\s+/g, '').slice(0, 8)}-${(user.id || '2026').slice(-4)}` : USER_PROFILE.explorerId,
  });
  const [localVisitedIds, setLocalVisitedIds] = useState<string[]>(visitedPlaceIds);

  useEffect(() => {
    let isMounted = true;
    async function loadPassport() {
      try {
        const p = await heritageService.getUserPassport();
        if (isMounted) {
          setProfile(p);
          if (p.visitedPlaceIds && p.visitedPlaceIds.length > 0) {
            setLocalVisitedIds(p.visitedPlaceIds);
          }
        }
      } catch {
        // fallback intact
      }
    }
    loadPassport();
    return () => { isMounted = false; };
  }, []);

  const handleToggleVisit = async (placeId: string) => {
    const isNowVisited = await heritageService.toggleVisitedPlace(placeId);
    setLocalVisitedIds((prev) =>
      isNowVisited ? [...prev, placeId] : prev.filter((id) => id !== placeId)
    );
  };

  const totalVisited = localVisitedIds.length;

  return (
    <View style={styles.container}>
      <Header
        title="Heritage Passport"
        onMenuPress={() => setDrawerVisible(true)}
      />

      <SideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onNavigateToMoreApps={onNavigateToMoreApps}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Digital Passport Component with Collected Virtual Stamps */}
        <DigitalPassport
          visitedPlaceIds={localVisitedIds}
          onSelectPlace={onSelectPlace}
          onToggleVisit={handleToggleVisit}
          userProfile={profile}
        />

        {/* Heritage Badges Horizontal Carousel */}
        <View style={styles.badgesSection}>
          <View style={styles.badgesHeader}>
            <Text style={styles.sectionHeading}>Explorer Achievements</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesRow}
          >
            {BADGES.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                <View style={styles.badgeIconWrapper}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.badgeIcon}>
                      {badge.icon === 'fort'
                        ? '🏰'
                        : badge.icon === 'temple_hindu'
                        ? '🛕'
                        : '🏛️'}
                    </Text>
                  </View>
                  <View style={styles.checkPill}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                </View>

                <Text style={styles.badgeTitle}>{badge.title}</Text>
                <Text style={styles.monumentName}>{badge.monumentName}</Text>
                <Text style={styles.badgeLoc}>{badge.location}</Text>

                <View style={styles.verifiedBorder}>
                  <Text style={styles.verifiedText}>VERIFIED ENTRY</Text>
                </View>
              </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  passportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  govTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
    letterSpacing: 1,
  },
  passportSub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9E2016',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  avatarBorder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#9E2016',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  cardBody: {},
  userName: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  userRole: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  pinIcon: {
    fontSize: 14,
  },
  locationText: {
    fontSize: 12,
    color: '#4B5563',
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  explorerId: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  editProfileBtn: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editProfileText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 16,
    marginBottom: 24,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: '#9E2016',
  },
  statLabel: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 2,
  },
  badgesSection: {
    marginBottom: 24,
  },
  badgesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9E2016',
  },
  badgesRow: {
    gap: 14,
    paddingVertical: 4,
  },
  badgeCard: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeIconWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    borderColor: '#C0392B',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F5F7',
  },
  badgeIcon: {
    fontSize: 26,
  },
  checkPill: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#9E2016',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  monumentName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 2,
  },
  badgeLoc: {
    fontSize: 9,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 1,
  },
  verifiedBorder: {
    marginTop: 10,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    width: '100%',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#C0392B',
    letterSpacing: 1,
  },
});
