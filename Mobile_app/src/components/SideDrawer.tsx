import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { USER_PROFILE } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { heritageService } from '../services/heritageService';
import { UserProfile } from '../types';

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToMoreApps?: () => void;
  selectedState?: string;
  selectedCity?: string;
  onSelectState?: (state: string) => void;
  onSelectCity?: (city: string) => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  visible,
  onClose,
  onNavigateToMoreApps,
  selectedState = 'Madhya Pradesh',
  selectedCity = 'Indore',
  onSelectState,
  onSelectCity,
}) => {
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [isStatePickerOpen, setIsStatePickerOpen] = useState(false);
  const [isCityPickerOpen, setIsCityPickerOpen] = useState(false);
  const [profileStats, setProfileStats] = useState<{
    monumentsVisited: number;
    badgesCount: number;
    savedCount: number;
    level: string;
  }>({
    monumentsVisited: 0,
    badgesCount: 0,
    savedCount: 0,
    level: 'Heritage Explorer',
  });

  const [citiesList, setCitiesList] = useState<string[]>([
    'Indore', 'Ujjain', 'Bhopal', 'Jabalpur', 'Omkareshwar', 'Maheshwar', 'Dewas', 'Ratlam', 'Sehore'
  ]);

  useEffect(() => {
    if (visible) {
      let isMounted = true;
      async function loadStats() {
        try {
          const p = await heritageService.getUserPassport();
          if (isMounted) {
            setProfileStats({
              monumentsVisited: p.monumentsVisited || 0,
              badgesCount: p.badgesCount || 0,
              savedCount: p.savedCount || 0,
              level: p.level || 'Heritage Explorer',
            });
          }
        } catch {
          // fallback
        }
      }

      async function loadCities() {
        try {
          const dbCities = await heritageService.getCities();
          if (isMounted && dbCities && dbCities.length > 0) {
            setCitiesList(dbCities.map((c) => c.name));
          }
        } catch {
          // fallback
        }
      }

      loadStats();
      loadCities();
      return () => {
        isMounted = false;
      };
    }
  }, [visible]);

  const handleLogout = () => {
    onClose();
    logout();
  };

  const availableStates = ['Madhya Pradesh', 'Rajasthan', 'Uttar Pradesh', 'Karnataka'];
  const availableCities = citiesList;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.drawerContainer}>
          {/* Top Decorative Gradient Accent Bar */}
          <View style={styles.accentBar} />

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Brand Header & Close */}
            <View style={styles.topHeader}>
              <View style={styles.brandRow}>
                <View style={styles.brandLogo}>
                  <Text style={styles.brandLogoIcon}>🏛️</Text>
                </View>
                <Text style={styles.brandTitle}>Dharohar</Text>
              </View>

              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.profileTopRow}>
                <View style={styles.avatarWrap}>
                  <View style={[styles.avatarImage, { backgroundColor: '#9E2016', alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>
                      {(user?.full_name || 'U')[0].toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedBadgeText}>✓</Text>
                  </View>
                </View>

                <View style={styles.profileMeta}>
                  <Text style={styles.ministryTag}>🏛 Ministry of Tourism Verified</Text>
                  <Text style={styles.profileName}>Namaste, {user?.full_name || 'Explorer'}</Text>
                  <View style={styles.levelPill}>
                    <Text style={styles.levelText}>★ {profileStats.level}</Text>
                  </View>
                </View>
              </View>

              {/* Quick Stats Pill Grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={[styles.statValue, { color: '#1A1A1A' }]}>{profileStats.monumentsVisited}</Text>
                  <Text style={styles.statLabel}>MONUMENTS</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statValue, { color: '#1A1A1A' }]}>{profileStats.badgesCount}</Text>
                  <Text style={styles.statLabel}>BADGES</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statValue, { color: '#1A1A1A' }]}>{profileStats.savedCount}</Text>
                  <Text style={styles.statLabel}>SAVED</Text>
                </View>
              </View>
            </View>

            {/* Location Selection */}
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeaderTitle}>LOCATION SELECTION</Text>
                <Text style={styles.countryTag}>• India</Text>
              </View>

              {/* Select State */}
              <TouchableOpacity
                style={styles.selectCard}
                onPress={() => setIsStatePickerOpen(!isStatePickerOpen)}
              >
                <View style={styles.selectCardLeft}>
                  <View style={[styles.iconBox, { backgroundColor: '#FFDAD5' }]}>
                    <Text style={styles.iconBoxText}>🗺️</Text>
                  </View>
                  <View>
                    <Text style={styles.selectLabel}>SELECT STATE</Text>
                    <Text style={styles.selectValue}>{selectedState}</Text>
                  </View>
                </View>
                <Text style={styles.chevronIcon}>▼</Text>
              </TouchableOpacity>

              {isStatePickerOpen && (
                <View style={styles.dropdownMenu}>
                  {availableStates.map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={styles.dropdownItem}
                      onPress={() => {
                        onSelectState?.(st);
                        setIsStatePickerOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, selectedState === st && styles.activeDropdownText]}>
                        {st}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Select City */}
              <TouchableOpacity
                style={styles.selectCard}
                onPress={() => setIsCityPickerOpen(!isCityPickerOpen)}
              >
                <View style={styles.selectCardLeft}>
                  <View style={[styles.iconBox, { backgroundColor: '#FFDCC5' }]}>
                    <Text style={styles.iconBoxText}>🏙️</Text>
                  </View>
                  <View>
                    <Text style={styles.selectLabel}>SELECT CITY</Text>
                    <Text style={styles.selectValue}>{selectedCity}</Text>
                  </View>
                </View>
                <Text style={styles.chevronIcon}>▼</Text>
              </TouchableOpacity>

              {isCityPickerOpen && (
                <View style={styles.dropdownMenu}>
                  {availableCities.map((ct) => (
                    <TouchableOpacity
                      key={ct}
                      style={styles.dropdownItem}
                      onPress={() => {
                        onSelectCity?.(ct);
                        setIsCityPickerOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, selectedCity === ct && styles.activeDropdownText]}>
                        {ct}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Auto Detect Location Button */}
              <View style={styles.gpsBanner}>
                <View style={styles.gpsLeft}>
                  <View style={styles.gpsIconCircle}>
                    <Text style={styles.gpsIcon}>🎯</Text>
                  </View>
                  <View>
                    <Text style={styles.gpsTitle}>Auto-Detect Location</Text>
                    <Text style={styles.gpsSub}>Using GPS Coordinates</Text>
                  </View>
                </View>
                <View style={styles.activePill}>
                  <Text style={styles.activePillDot}>•</Text>
                  <Text style={styles.activePillText}>Active</Text>
                </View>
              </View>
            </View>

            {/* Preferences & Support */}
            <View style={styles.sectionWrap}>
              <Text style={styles.sectionHeaderTitle}>PREFERENCES & SUPPORT</Text>

              {/* Select Language */}
              <View style={styles.prefRowCard}>
                <View style={styles.selectCardLeft}>
                  <View style={styles.grayIconBox}>
                    <Text>文</Text>
                  </View>
                  <View>
                    <Text style={styles.prefTitle}>Select Language</Text>
                    <Text style={styles.prefSub}>Bhasha / भाषा</Text>
                  </View>
                </View>

                <View style={styles.langToggle}>
                  <TouchableOpacity
                    style={[styles.langBtn, language === 'EN' && styles.langBtnActive]}
                    onPress={() => setLanguage('EN')}
                  >
                    <Text style={[styles.langBtnText, language === 'EN' && styles.langBtnTextActive]}>EN</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.langBtn, language === 'HI' && styles.langBtnActive]}
                    onPress={() => setLanguage('HI')}
                  >
                    <Text style={[styles.langBtnText, language === 'HI' && styles.langBtnTextActive]}>हिन्दी</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Partner Apps Link */}
              <TouchableOpacity
                style={styles.prefRowCard}
                onPress={() => {
                  onClose();
                  onNavigateToMoreApps?.();
                }}
              >
                <View style={styles.selectCardLeft}>
                  <View style={styles.grayIconBox}>
                    <Text>📱</Text>
                  </View>
                  <View>
                    <Text style={styles.prefTitle}>Government Utilities</Text>
                    <Text style={styles.prefSub}>Companion Apps & Services</Text>
                  </View>
                </View>
                <Text style={styles.chevronIcon}>›</Text>
              </TouchableOpacity>

              {/* SOS Card */}
              <View style={styles.sosCard}>
                <View style={styles.sosLeft}>
                  <View style={styles.sosIconBox}>
                    <Text style={styles.sosIcon}>🚨</Text>
                  </View>
                  <View>
                    <View style={styles.helplineTag}>
                      <Text style={styles.helplineTagText}>24X7 HELPLINE</Text>
                    </View>
                    <Text style={styles.sosTitle}>Emergency SOS</Text>
                    <Text style={styles.sosSub}>Tourist Police: Dial 1363</Text>
                  </View>
                </View>
                <View style={styles.callBadge}>
                  <Text style={styles.callBadgeText}>📞 1363</Text>
                </View>
              </View>
            </View>

            {/* Editorial Quote */}
            <View style={styles.quoteCard}>
              <Text style={styles.quoteText}>
                "Time does not vanish here; it turns into sandstone, song, and stone."
              </Text>
              <Text style={styles.quoteAuthor}>— ARCHAEOLOGICAL SURVEY OF INDIA</Text>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.drawerFooter}>
              <Text style={styles.footerBrand}>INCREDIBLE INDIA • ASI PARTNER</Text>
              <Text style={styles.footerSub}>Ministry of Culture & Tourism Initiative</Text>
              <Text style={styles.footerVersion}>Version 2.4.0 (Heritage Build) • Privacy • Terms</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    flex: 1,
  },
  drawerContainer: {
    width: '85%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  accentBar: {
    height: 4,
    backgroundColor: '#9E2016',
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#9E2016',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoIcon: {
    fontSize: 14,
  },
  brandTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#9E2016',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#9E2016',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#005875',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  profileMeta: {
    flex: 1,
  },
  ministryTag: {
    fontSize: 10,
    color: '#005875',
    fontWeight: '600',
    marginBottom: 2,
  },
  profileName: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1B1B',
  },
  levelPill: {
    backgroundColor: '#FFDCC5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#944A00',
  },
  statsGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0EDED',
    marginTop: 14,
    paddingTop: 10,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 9,
    color: '#666666',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  sectionWrap: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666666',
    letterSpacing: 1,
  },
  countryTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666666',
  },
  selectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  selectCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxText: {
    fontSize: 18,
  },
  selectLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#666666',
    letterSpacing: 0.8,
  },
  selectValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 1,
  },
  chevronIcon: {
    fontSize: 14,
    color: '#666666',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#1A1A1A',
  },
  activeDropdownText: {
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  gpsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E5F3FB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C0E8FF',
  },
  gpsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gpsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#005875',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsIcon: {
    fontSize: 16,
  },
  gpsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1B1B',
  },
  gpsSub: {
    fontSize: 10,
    color: '#005875',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#005875',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activePillDot: {
    color: '#80D0F8',
    fontSize: 14,
  },
  activePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  prefRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  grayIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F4F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  prefSub: {
    fontSize: 10,
    color: '#666666',
  },
  langToggle: {
    flexDirection: 'row',
    backgroundColor: '#F4F5F7',
    borderRadius: 8,
    padding: 2,
  },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  langBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  langBtnText: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '600',
  },
  langBtnTextActive: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
  sosCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#9E2016',
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
  },
  sosLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sosIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosIcon: {
    fontSize: 18,
  },
  helplineTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  helplineTagText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sosTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 1,
  },
  sosSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
  },
  callBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  callBadgeText: {
    color: '#9E2016',
    fontSize: 12,
    fontWeight: '700',
  },
  quoteCard: {
    backgroundColor: '#F4F5F7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#666666',
  },
  quoteText: {
    fontFamily: 'serif',
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666666',
    lineHeight: 18,
  },
  quoteAuthor: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 6,
    letterSpacing: 0.8,
  },
  drawerFooter: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: 24,
  },
  footerBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 1,
  },
  footerSub: {
    fontSize: 9,
    color: '#666666',
    marginTop: 2,
  },
  footerVersion: {
    fontSize: 8,
    color: '#999999',
    marginTop: 6,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 10,
  },
  logoutIcon: {
    fontSize: 18,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
});
