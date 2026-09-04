import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Header } from '../components/Header';

interface MoreAppsScreenProps {
  onBackPress: () => void;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onFavoritePress?: () => void;
}

interface ActionModalConfig {
  type: 'add_place' | 'complaint' | 'suggestion' | null;
  title: string;
  badge: string;
}

export const MoreAppsScreen: React.FC<MoreAppsScreenProps> = ({
  onBackPress,
  onMenuPress,
  onNotificationPress,
  onFavoritePress,
}) => {
  const [activeModal, setActiveModal] = useState<ActionModalConfig | null>(null);
  const [formText, setFormText] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [appActionState, setAppActionState] = useState<{ [key: string]: string }>({});

  const handleDial = (number: string, label: string) => {
    Alert.alert(
      `Call ${label}`,
      `Would you like to connect directly to ${label} at ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          style: 'destructive',
          onPress: () => {
            Linking.openURL(`tel:${number}`).catch(() => {
              Alert.alert('Calling Emergency', `Dialing ${number} (${label})...`);
            });
          },
        },
      ]
    );
  };

  const handleOpenApp = (id: string, name: string, actionLabel: string) => {
    setAppActionState((prev) => ({ ...prev, [id]: 'Opening...' }));
    setTimeout(() => {
      setAppActionState((prev) => ({ ...prev, [id]: 'Active' }));
      Alert.alert(
        name,
        `Connecting to official ${name} portal. In production this opens the verified partner application.`,
        [{ text: 'OK' }]
      );
    }, 600);
  };

  const handleOpenActionModal = (type: 'add_place' | 'complaint' | 'suggestion') => {
    setFormText('');
    setFormSubmitted(false);
    if (type === 'add_place') {
      setActiveModal({
        type: 'add_place',
        title: 'Add New Heritage Place',
        badge: 'Citizen Contribution',
      });
    } else if (type === 'complaint') {
      setActiveModal({
        type: 'complaint',
        title: 'Register ASI Redressal Complaint',
        badge: 'Civic Grievance',
      });
    } else {
      setActiveModal({
        type: 'suggestion',
        title: 'Submit Heritage Suggestion',
        badge: 'Monument Improvement',
      });
    }
  };

  const handleSubmitModal = () => {
    if (!formText.trim()) {
      Alert.alert('Required', 'Please enter your description or details.');
      return;
    }
    setFormSubmitted(true);
    setTimeout(() => {
      setActiveModal(null);
      Alert.alert('Submitted Successfully', 'Thank you for contributing to Indian Heritage preservation. Your ticket has been logged.');
    }, 800);
  };

  return (
    <View style={styles.container}>
      {/* Top Header matching mockup */}
      <Header
        title="Indian Heritage"
        subtitle="GOVERNMENT & CULTURAL UTILITIES"
        showBack
        onBackPress={onBackPress}
        onMenuPress={onMenuPress}
        onNotificationPress={onNotificationPress}
        onFavoritePress={onFavoritePress}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Page Title / Intro Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.bannerCircleDecoration} />
          <View style={styles.bannerContentRow}>
            <View style={styles.bannerTextCol}>
              <View style={styles.partnerBadge}>
                <Text style={styles.partnerBadgeIcon}>⊞</Text>
                <Text style={styles.partnerBadgeText}>PARTNER ECOSYSTEM</Text>
              </View>
              <Text style={styles.bannerTitle}>More Apps & Services</Text>
              <Text style={styles.bannerDesc}>
                Access citizen contribution tools, instant emergency SOS helplines, and verified companion apps to support your heritage visits.
              </Text>
            </View>
            <View style={styles.bannerIconBox}>
              <Text style={styles.bannerIconText}>🏛️</Text>
            </View>
          </View>
        </View>

        {/* Section: Citizen & Traveler Actions */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Citizen & Traveler Actions</Text>
              <Text style={styles.sectionSubtitle}>Participate in preserving & improving monument experiences</Text>
            </View>
            <View style={styles.contributeBadge}>
              <Text style={styles.contributeBadgeText}>Contribute</Text>
            </View>
          </View>

          <View style={styles.actionItemsList}>
            {/* Add New Place */}
            <TouchableOpacity
              style={styles.actionRowBtn}
              activeOpacity={0.7}
              onPress={() => handleOpenActionModal('add_place')}
            >
              <View style={styles.actionLeftWrap}>
                <View style={[styles.actionIconBox, { backgroundColor: '#FDF2F2' }]}>
                  <Text style={styles.actionIconEmoji}>📍</Text>
                </View>
                <View style={styles.actionTextWrap}>
                  <View style={styles.actionTitleRow}>
                    <Text style={styles.actionMainTitle}>Add New Place</Text>
                    <View style={[styles.inlinePill, { backgroundColor: '#FDF2F2' }]}>
                      <Text style={[styles.inlinePillText, { color: '#C0392B' }]}>Contribute</Text>
                    </View>
                  </View>
                  <Text style={styles.actionSubDesc}>Submit unlisted historical ruins, baolis or folk heritage sites</Text>
                </View>
              </View>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>

            {/* Register Complaint */}
            <TouchableOpacity
              style={styles.actionRowBtn}
              activeOpacity={0.7}
              onPress={() => handleOpenActionModal('complaint')}
            >
              <View style={styles.actionLeftWrap}>
                <View style={[styles.actionIconBox, { backgroundColor: '#FFFBEB' }]}>
                  <Text style={styles.actionIconEmoji}>⚠️</Text>
                </View>
                <View style={styles.actionTextWrap}>
                  <View style={styles.actionTitleRow}>
                    <Text style={styles.actionMainTitle}>Register Complaint</Text>
                    <View style={[styles.inlinePill, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={[styles.inlinePillText, { color: '#92400E' }]}>ASI & Civic Redressal</Text>
                    </View>
                  </View>
                  <Text style={styles.actionSubDesc}>Report damaged plaques, cleanliness, ticket extortion or ticketing snags</Text>
                </View>
              </View>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>

            {/* Submit Suggestion */}
            <TouchableOpacity
              style={styles.actionRowBtn}
              activeOpacity={0.7}
              onPress={() => handleOpenActionModal('suggestion')}
            >
              <View style={styles.actionLeftWrap}>
                <View style={[styles.actionIconBox, { backgroundColor: '#F0F9FF' }]}>
                  <Text style={styles.actionIconEmoji}>💡</Text>
                </View>
                <View style={styles.actionTextWrap}>
                  <View style={styles.actionTitleRow}>
                    <Text style={styles.actionMainTitle}>Submit Suggestion</Text>
                    <View style={[styles.inlinePill, { backgroundColor: '#E0F2FE' }]}>
                      <Text style={[styles.inlinePillText, { color: '#0369A1' }]}>Heritage Improvement</Text>
                    </View>
                  </View>
                  <Text style={styles.actionSubDesc}>Propose audio guide languages, signages or barrier-free ramps</Text>
                </View>
              </View>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Emergency & SOS Response (Red Card) */}
        <View style={styles.sosSectionCard}>
          <View style={styles.sosHeaderRow}>
            <View style={styles.sosHeaderLeft}>
              <Text style={styles.sosAlertIcon}>🚨</Text>
              <View>
                <Text style={styles.sosHeaderTitle}>Emergency & SOS Response</Text>
                <Text style={styles.sosHeaderSub}>Instant dispatch & multi-lingual crisis assistance</Text>
              </View>
            </View>
            <View style={styles.sos247Badge}>
              <Text style={styles.sos247Text}>24X7 EMERGENCY</Text>
            </View>
          </View>

          {/* Two Prominent SOS Buttons */}
          <View style={styles.sosTwoColGrid}>
            {/* Police SOS Card */}
            <TouchableOpacity
              style={styles.sosBigCard}
              activeOpacity={0.9}
              onPress={() => handleDial('112', 'Police & Rescue')}
            >
              <View style={styles.sosBigTopRow}>
                <View style={[styles.sosBigIconCircle, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={styles.sosIconText}>🛡️</Text>
                </View>
                <View style={styles.emergencyTagPill}>
                  <Text style={styles.emergencyTagText}>EMERGENCY</Text>
                </View>
              </View>
              <View style={styles.sosBigBottomWrap}>
                <Text style={styles.sosTypeLabel}>POLICE & RESCUE</Text>
                <View style={styles.sosNameAndCallRow}>
                  <Text style={styles.sosNameBig}>POLICE</Text>
                  <View style={styles.sosDialPillBtn}>
                    <Text style={styles.sosDialPillIcon}>📞</Text>
                    <Text style={styles.sosDialPillNumber}>112</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Ambulance SOS Card */}
            <TouchableOpacity
              style={styles.sosBigCard}
              activeOpacity={0.9}
              onPress={() => handleDial('108', 'Ambulance & EMT')}
            >
              <View style={styles.sosBigTopRow}>
                <View style={[styles.sosBigIconCircle, { backgroundColor: '#FFE4E6' }]}>
                  <Text style={styles.sosIconText}>🏥</Text>
                </View>
                <View style={styles.medicalTagPill}>
                  <Text style={styles.medicalTagText}>MEDICAL</Text>
                </View>
              </View>
              <View style={styles.sosBigBottomWrap}>
                <Text style={styles.sosTypeLabel}>AMBULANCE & EMT</Text>
                <View style={styles.sosNameAndCallRow}>
                  <Text style={styles.sosNameBig}>AMBULANCE</Text>
                  <View style={styles.sosDialPillBtn}>
                    <Text style={styles.sosDialPillIcon}>📞</Text>
                    <Text style={styles.sosDialPillNumber}>108</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Clickable Direct-Dial Helpline Grid (2x2) */}
          <View style={styles.helplineGrid}>
            <TouchableOpacity
              style={styles.helplineGridItem}
              activeOpacity={0.8}
              onPress={() => handleDial('1363', 'Tourist Helpline')}
            >
              <View style={styles.helplineItemLeft}>
                <Text style={styles.helplineItemIcon}>🎧</Text>
                <View>
                  <Text style={styles.helplineItemTitle}>Tourist Helpline</Text>
                  <Text style={styles.helplineItemSub}>Multi-lingual Info</Text>
                </View>
              </View>
              <View style={styles.helplineItemNumBadge}>
                <Text style={styles.helplineItemNumText}>1363</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.helplineGridItem}
              activeOpacity={0.8}
              onPress={() => handleDial('1091', 'Women Helpline')}
            >
              <View style={styles.helplineItemLeft}>
                <Text style={styles.helplineItemIcon}>🛡️</Text>
                <View>
                  <Text style={styles.helplineItemTitle}>Women Helpline</Text>
                  <Text style={styles.helplineItemSub}>Safety & Transit</Text>
                </View>
              </View>
              <View style={styles.helplineItemNumBadge}>
                <Text style={styles.helplineItemNumText}>1091</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.helplineGridItem}
              activeOpacity={0.8}
              onPress={() => handleDial('1078', 'Disaster NDRF')}
            >
              <View style={styles.helplineItemLeft}>
                <Text style={styles.helplineItemIcon}>🌊</Text>
                <View>
                  <Text style={styles.helplineItemTitle}>Disaster (NDRF)</Text>
                  <Text style={styles.helplineItemSub}>Hazard & Flood</Text>
                </View>
              </View>
              <View style={styles.helplineItemNumBadge}>
                <Text style={styles.helplineItemNumText}>1078</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.helplineGridItem}
              activeOpacity={0.8}
              onPress={() => handleDial('101', 'Fire & Rescue')}
            >
              <View style={styles.helplineItemLeft}>
                <Text style={styles.helplineItemIcon}>🚒</Text>
                <View>
                  <Text style={styles.helplineItemTitle}>Fire & Rescue</Text>
                  <Text style={styles.helplineItemSub}>Rapid Response</Text>
                </View>
              </View>
              <View style={styles.helplineItemNumBadge}>
                <Text style={styles.helplineItemNumText}>101</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Featured Heritage Apps */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Featured Heritage Apps</Text>
              <Text style={styles.sectionSubtitle}>Official & convenient companion apps during your monument visits</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
            </View>
          </View>

          <View style={styles.featuredAppsList}>
            {/* App Card 1: Incredible India */}
            <View style={styles.featuredAppCard}>
              <View style={styles.featuredAppLeft}>
                <View style={[styles.appIconContainer, { backgroundColor: '#FDF2F2' }]}>
                  <Text style={styles.appIconGlyph}>🧭</Text>
                </View>
                <View style={styles.appTextCol}>
                  <View style={styles.appTitleAndTag}>
                    <Text style={styles.appTitle}>Incredible India</Text>
                    <View style={[styles.inlineTag, { backgroundColor: '#FEE2E2' }]}>
                      <Text style={[styles.inlineTagText, { color: '#C0392B' }]}>Ministry of Tourism</Text>
                    </View>
                  </View>
                  <Text style={styles.appDesc}>Official travel itineraries, audio walks & verified destination guides</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.appActionPillBtn}
                activeOpacity={0.8}
                onPress={() => handleOpenApp('app1', 'Incredible India', 'Open')}
              >
                <Text style={styles.appActionPillText}>{appActionState['app1'] || 'Open ↗'}</Text>
              </TouchableOpacity>
            </View>

            {/* App Card 2: AudioCompass ASI Guide */}
            <View style={styles.featuredAppCard}>
              <View style={styles.featuredAppLeft}>
                <View style={[styles.appIconContainer, { backgroundColor: '#FFFBEB' }]}>
                  <Text style={styles.appIconGlyph}>🎧</Text>
                </View>
                <View style={styles.appTextCol}>
                  <View style={styles.appTitleAndTag}>
                    <Text style={styles.appTitle}>AudioCompass ASI Guide</Text>
                    <View style={[styles.inlineTag, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={[styles.inlineTagText, { color: '#92400E' }]}>12 Languages</Text>
                    </View>
                  </View>
                  <Text style={styles.appDesc}>Narrated stories, architectural secrets & offline playback at monuments</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.appActionPillBtn}
                activeOpacity={0.8}
                onPress={() => handleOpenApp('app2', 'AudioCompass ASI Guide', 'Play')}
              >
                <Text style={styles.appActionPillText}>{appActionState['app2'] || 'Play 🔊'}</Text>
              </TouchableOpacity>
            </View>

            {/* App Card 3: UTS & Heritage Metro */}
            <View style={styles.featuredAppCard}>
              <View style={styles.featuredAppLeft}>
                <View style={[styles.appIconContainer, { backgroundColor: '#F0F9FF' }]}>
                  <Text style={styles.appIconGlyph}>🚇</Text>
                </View>
                <View style={styles.appTextCol}>
                  <View style={styles.appTitleAndTag}>
                    <Text style={styles.appTitle}>UTS & Heritage Metro</Text>
                    <View style={[styles.inlineTag, { backgroundColor: '#E0F2FE' }]}>
                      <Text style={[styles.inlineTagText, { color: '#0369A1' }]}>Transit Ticketing</Text>
                    </View>
                  </View>
                  <Text style={styles.appDesc}>Skip ticket counters for monument suburban rail, metro feeder & e-buses</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.appActionPillBtn}
                activeOpacity={0.8}
                onPress={() => handleOpenApp('app3', 'UTS & Heritage Metro', 'Book')}
              >
                <Text style={styles.appActionPillText}>{appActionState['app3'] || 'Book 🚆'}</Text>
              </TouchableOpacity>
            </View>

            {/* App Card 4: 3D Monument AR & Culture */}
            <View style={styles.featuredAppCard}>
              <View style={styles.featuredAppLeft}>
                <View style={[styles.appIconContainer, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={styles.appIconGlyph}>🏛️</Text>
                </View>
                <View style={styles.appTextCol}>
                  <View style={styles.appTitleAndTag}>
                    <Text style={styles.appTitle}>3D Monument AR & Culture</Text>
                    <View style={[styles.inlineTag, { backgroundColor: '#D1FAE5' }]}>
                      <Text style={[styles.inlineTagText, { color: '#047857' }]}>Interactive AR</Text>
                    </View>
                  </View>
                  <Text style={styles.appDesc}>High-resolution 3D reconstructions, inaccessible chambers & relics</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.appActionPillBtn}
                activeOpacity={0.8}
                onPress={() => handleOpenApp('app4', '3D Monument AR', 'Explore')}
              >
                <Text style={styles.appActionPillText}>{appActionState['app4'] || 'Explore 🔄'}</Text>
              </TouchableOpacity>
            </View>

            {/* App Card 5: Tribes India Handicrafts */}
            <View style={styles.featuredAppCard}>
              <View style={styles.featuredAppLeft}>
                <View style={[styles.appIconContainer, { backgroundColor: '#FDF2F2' }]}>
                  <Text style={styles.appIconGlyph}>🛍️</Text>
                </View>
                <View style={styles.appTextCol}>
                  <View style={styles.appTitleAndTag}>
                    <Text style={styles.appTitle}>Tribes India Handicrafts</Text>
                    <View style={[styles.inlineTag, { backgroundColor: '#FFE4E6' }]}>
                      <Text style={[styles.inlineTagText, { color: '#BE123C' }]}>Authentic GI Tag</Text>
                    </View>
                  </View>
                  <Text style={styles.appDesc}>Fair-trade handcrafted souvenirs, GI-certified artifacts & textiles</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.appActionPillBtn}
                activeOpacity={0.8}
                onPress={() => handleOpenApp('app5', 'Tribes India Handicrafts', 'Visit')}
              >
                <Text style={styles.appActionPillText}>{appActionState['app5'] || 'Visit 🛍'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Interactive Modal for Citizen Action */}
      <Modal
        visible={activeModal !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalBadgeText}>{activeModal?.badge}</Text>
                <Text style={styles.modalTitleText}>{activeModal?.title}</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalInputLabel}>
              {activeModal?.type === 'add_place'
                ? 'Place Name, Region & Historic Significance:'
                : activeModal?.type === 'complaint'
                ? 'Monument Name & Grievance Description:'
                : 'Improvement Proposal for Monuments:'}
            </Text>

            <TextInput
              style={styles.modalTextInput}
              multiline
              numberOfLines={4}
              placeholder={
                activeModal?.type === 'add_place'
                  ? 'e.g. Ancient stepwell discovered in Dhar district with stone carvings...'
                  : activeModal?.type === 'complaint'
                  ? 'e.g. Broken QR ticket scanner or damaged pathway at southern gate...'
                  : 'e.g. Add regional language audio guides or wheelchair ramps...'
              }
              placeholderTextColor="#9CA3AF"
              value={formText}
              onChangeText={setFormText}
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleSubmitModal}
              >
                <Text style={styles.modalSubmitText}>
                  {formSubmitted ? 'Submitting...' : 'Submit to ASI'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF9F8',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 20,
  },

  // Intro Hero Banner
  heroBanner: {
    backgroundColor: '#9E2016',
    borderRadius: 20,
    padding: 18,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerCircleDecoration: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bannerContentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  bannerTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
    marginBottom: 8,
  },
  partnerBadgeIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  partnerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  bannerTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  bannerDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
  bannerIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bannerIconText: {
    fontSize: 24,
  },

  // Generic White Card Section
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEE7E4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  contributeBadge: {
    backgroundColor: '#FDF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  contributeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C0392B',
  },
  verifiedBadge: {
    backgroundColor: '#FDF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C0392B',
    letterSpacing: 0.6,
  },

  // Citizen Action Rows
  actionItemsList: {
    gap: 10,
  },
  actionRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEE7E4',
    backgroundColor: '#FFFFFF',
  },
  actionLeftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
    gap: 12,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionIconEmoji: {
    fontSize: 20,
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  actionMainTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  inlinePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  inlinePillText: {
    fontSize: 9,
    fontWeight: '700',
  },
  actionSubDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 15,
  },
  chevronIcon: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },

  // Emergency & SOS Red Section
  sosSectionCard: {
    backgroundColor: '#962D22',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sosHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sosHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sosAlertIcon: {
    fontSize: 22,
  },
  sosHeaderTitle: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  sosHeaderSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 1,
  },
  sos247Badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  sos247Text: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },

  // Two Big SOS Cards
  sosTwoColGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  sosBigCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    justifyContent: 'space-between',
  },
  sosBigTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sosBigIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosIconText: {
    fontSize: 20,
  },
  emergencyTagPill: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  emergencyTagText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  medicalTagPill: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  medicalTagText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  sosBigBottomWrap: {
    marginTop: 2,
  },
  sosTypeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.4,
  },
  sosNameAndCallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sosNameBig: {
    fontSize: 15,
    fontWeight: '900',
    color: '#C0392B',
    letterSpacing: -0.3,
  },
  sosDialPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C0392B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  sosDialPillIcon: {
    fontSize: 10,
  },
  sosDialPillNumber: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  // 2x2 Helpline Grid
  helplineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  helplineGridItem: {
    width: '48.5%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helplineItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    paddingRight: 4,
  },
  helplineItemIcon: {
    fontSize: 16,
  },
  helplineItemTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  helplineItemSub: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },
  helplineItemNumBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helplineItemNumText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C0392B',
  },

  // Featured Apps List
  featuredAppsList: {
    gap: 10,
  },
  featuredAppCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEE7E4',
    backgroundColor: '#FFFFFF',
  },
  featuredAppLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
    gap: 10,
  },
  appIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  appIconGlyph: {
    fontSize: 22,
  },
  appTextCol: {
    flex: 1,
  },
  appTitleAndTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  appTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  inlineTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  inlineTagText: {
    fontSize: 9,
    fontWeight: '700',
  },
  appDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 15,
  },
  appActionPillBtn: {
    backgroundColor: '#FDF2F2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appActionPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C0392B',
  },

  // Action Modal Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C0392B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  modalTitleText: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalCloseBtnText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  modalInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalTextInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#111827',
    textAlignVertical: 'top',
    height: 100,
    marginBottom: 16,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  modalSubmitBtn: {
    flex: 2,
    backgroundColor: '#9E2016',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSubmitText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
