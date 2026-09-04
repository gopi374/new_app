import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Indian Heritage',
  subtitle,
  showBack = false,
  onBackPress,
  onMenuPress,
  onNotificationPress,
  onFavoritePress,
  isFavorite = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack ? (
          <TouchableOpacity
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={onBackPress}
            style={styles.iconButton}
          >
            <Text style={styles.menuIconText}>←</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            accessibilityLabel="Open menu"
            accessibilityRole="button"
            onPress={onMenuPress}
            style={styles.iconButton}
          >
            <Text style={styles.menuIconText}>☰</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
        {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
      </View>

      <View style={styles.rightRow}>
        {!showBack && (
          <TouchableOpacity
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            onPress={onNotificationPress}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          accessibilityLabel="Favorites"
          accessibilityRole="button"
          onPress={onFavoritePress}
          style={styles.iconButton}
        >
          <Text style={[styles.iconText, isFavorite && styles.favoriteActive]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  leftRow: {
    width: 44,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#9E2016',
    letterSpacing: 0.3,
  },
  subtitleText: {
    fontSize: 10,
    color: '#666666',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 72,
    justifyContent: 'flex-end',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    color: '#9E2016',
  },
  menuIconText: {
    fontSize: 20,
    color: '#1A1A1A',
  },
  favoriteActive: {
    color: '#BA1A1A',
  },
});
